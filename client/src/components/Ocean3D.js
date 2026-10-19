import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

THREE.ColorManagement.enabled = false;

// World units: the wave crest runs along x near z = 0 and faces +z (the
// camera). The surfer stays near x = 0 while the water streams toward -x.
const SPEED = 2.2;
const TRAIL = 24;

const PALETTES = {
  night: {
    skyTop: "#030c13",
    skyHorizon: "#0e2a33",
    deep: "#020a0f",
    water: "#0a2e38",
    scatter: "#1f6a6c",
    foam: "#b9c7c6",
    sun: "#b8c8dc",
    sunDir: [-0.3, 0.6, -0.5],
    sunPower: 0.35,
    backlit: 0.3,
  },
  dawn: {
    skyTop: "#14223a",
    skyHorizon: "#e09a72",
    deep: "#071c26",
    water: "#12515c",
    scatter: "#4cc6b0",
    foam: "#f7eadf",
    sun: "#ffc08a",
    sunDir: [-0.7, 0.3, -0.8],
    sunPower: 0.9,
    backlit: 0.9,
  },
  day: {
    skyTop: "#0b3446",
    skyHorizon: "#2a8f98",
    deep: "#04232b",
    water: "#0e5d66",
    scatter: "#3fd0b8",
    foam: "#f3f6f2",
    sun: "#fff3dc",
    sunDir: [0.3, 0.85, -0.4],
    sunPower: 1.1,
    backlit: 0.55,
  },
  sunset: {
    skyTop: "#161d38",
    skyHorizon: "#f0965a",
    deep: "#061a22",
    water: "#0f4f58",
    scatter: "#59d0b0",
    foam: "#fde8d6",
    sun: "#ffb070",
    sunDir: [0.6, 0.22, -1.0],
    sunPower: 1.0,
    backlit: 1.0,
  },
  dusk: {
    skyTop: "#081322",
    skyHorizon: "#7a4656",
    deep: "#050f17",
    water: "#0d3a45",
    scatter: "#2f8f88",
    foam: "#ddd5d6",
    sun: "#d9917e",
    sunDir: [0.6, 0.15, -1.0],
    sunPower: 0.6,
    backlit: 0.6,
  },
};

// --- Wave shape, mirrored exactly in the vertex shader ---------------------
//
// The wave is a sheet parameterised by x (along the wave) and s (across it,
// from the swell behind to the flats in front). Each cross-section blends a
// rolling hump with a full barrel: the back rises, the lip arcs over and
// pitches down to a rounded tip, then the surface comes back around inside
// the tube (ceiling, back wall, floor) before running out onto the flats.

const DEG = Math.PI / 180;
const TUBE = {
  cz: 0.55,
  cy: 1.65,
  ro: 1.3,
  ri: 1.12,
  ta: 150 * DEG,
  tt: -12 * DEG,
  tf: 270 * DEG,
};

const smoothstep = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

const mix = (a, b, t) => a + (b - a) * t;

const hermite = (p0, t0, p1, t1, u) => {
  const u2 = u * u;
  const u3 = u2 * u;
  const h00 = 2 * u3 - 3 * u2 + 1;
  const h10 = u3 - 2 * u2 + u;
  const h01 = -2 * u3 + 3 * u2;
  const h11 = u3 - u2;
  return [
    h00 * p0[0] + h10 * t0[0] + h01 * p1[0] + h11 * t1[0],
    h00 * p0[1] + h10 * t0[1] + h01 * p1[1] + h11 * t1[1],
  ];
};

const tubeProfile = (s) => {
  const { cz, cy, ro, ri, ta, tt, tf } = TUBE;
  const arc = (r, th) => [cz + r * Math.cos(th), cy + r * Math.sin(th)];
  if (s < 0.12) return [mix(-30, -8, s / 0.12), 0];
  if (s < 0.3) {
    return hermite(
      [-8, 0],
      [6, 0],
      arc(ro, ta),
      [Math.sin(ta) * 4, -Math.cos(ta) * 4],
      (s - 0.12) / 0.18,
    );
  }
  if (s < 0.48) return arc(ro, mix(ta, tt, (s - 0.3) / 0.18));
  if (s < 0.5) {
    const rm = (ro + ri) / 2;
    const rc = (ro - ri) / 2;
    const ph = mix(tt, tt - Math.PI, (s - 0.48) / 0.02);
    return [
      cz + rm * Math.cos(tt) + rc * Math.cos(ph),
      cy + rm * Math.sin(tt) + rc * Math.sin(ph),
    ];
  }
  if (s < 0.78) return arc(ri, mix(tt, tf, (s - 0.5) / 0.28));
  if (s < 0.92)
    return hermite(
      arc(ri, tf),
      [2.4, -0.3],
      [3.2, 0],
      [2, 0],
      (s - 0.78) / 0.14,
    );
  return [mix(3.2, 12, (s - 0.92) / 0.08), 0];
};

const humpProfile = (s) => {
  let z;
  if (s < 0.12) z = mix(-30, -8, s / 0.12);
  else if (s < 0.3) z = mix(-8, -1, (s - 0.12) / 0.18);
  else if (s < 0.48) z = mix(-1, 0.3, (s - 0.3) / 0.18);
  else if (s < 0.5) z = mix(0.3, 0.4, (s - 0.48) / 0.02);
  else if (s < 0.78) z = mix(0.4, 2, (s - 0.5) / 0.28);
  else if (s < 0.92) z = mix(2, 3.2, (s - 0.78) / 0.14);
  else z = mix(3.2, 12, (s - 0.92) / 0.08);
  const w = z > 0 ? 1.5 : 4.0;
  return [z, 2.6 * Math.exp(-(z / w) * (z / w))];
};

// Along the wave: a rolling shoulder, the barrel opening up around the
// surfer, then the section that has already closed into whitewater.
const sectionAt = (x) => {
  const barrel = (1 - smoothstep(1.5, 3.4, x)) * smoothstep(-3.2, -1.0, x);
  const collapse = 1 - smoothstep(-4, -1.5, x);
  const variation =
    (1 + 0.06 * Math.sin(x * 0.45 + 0.6) + 0.04 * Math.sin(x * 1.1 + 2.0)) *
    (1 - 0.3 * smoothstep(5, 20, x)) *
    (1 - 0.45 * (1 - smoothstep(-16, -5, x)));
  return { barrel, collapse, scale: variation * (1 - 0.5 * collapse) };
};

const ripple = (xm, z) =>
  0.05 * Math.sin(xm * 1.3 + z * 0.7) +
  0.035 * Math.sin(xm * 2.7 - z * 1.9 + 1.3) +
  0.025 * Math.sin(xm * 4.1 + z * 3.3);

// The foam ball where the lip lands.
const foamBall = (x, z) =>
  0.6 *
  Math.exp(-(((x + 2.2) / 1.4) ** 2)) *
  Math.exp(-(((z - 1.0) / 1.0) ** 2));

const surfacePoint = (x, s, t, out = new THREE.Vector3()) => {
  const { barrel, scale } = sectionAt(x);
  const tube = tubeProfile(s);
  const hump = humpProfile(s);
  const z = mix(hump[0], tube[0], barrel) * scale;
  let y = mix(hump[1], tube[1], barrel) * scale;
  y += ripple(x + t * SPEED, z) * (1 - 0.7 * smoothstep(0.1, 1.0, y / 2.8));
  y += foamBall(x, z);
  return out.set(x, y, z);
};

const oceanVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying float vF;
  varying float vFoam;
  varying float vS;
  varying float vB;
  varying float vXm;

  const float DEG = 0.017453293;
  const float PI = 3.14159265;
  const vec2 C = vec2(${TUBE.cz}, ${TUBE.cy});
  const float RO = ${TUBE.ro};
  const float RI = ${TUBE.ri};

  vec2 hermite(vec2 p0, vec2 t0, vec2 p1, vec2 t1, float u) {
    float u2 = u * u;
    float u3 = u2 * u;
    return (2.0 * u3 - 3.0 * u2 + 1.0) * p0 + (u3 - 2.0 * u2 + u) * t0
         + (-2.0 * u3 + 3.0 * u2) * p1 + (u3 - u2) * t1;
  }

  vec2 arc(float r, float th) {
    return C + r * vec2(cos(th), sin(th));
  }

  vec2 tubeProfile(float s) {
    float ta = ${TUBE.ta};
    float tt = ${TUBE.tt};
    float tf = ${TUBE.tf};
    if (s < 0.12) return vec2(mix(-30.0, -8.0, s / 0.12), 0.0);
    if (s < 0.3) {
      return hermite(vec2(-8.0, 0.0), vec2(6.0, 0.0), arc(RO, ta),
                     vec2(sin(ta), -cos(ta)) * 4.0, (s - 0.12) / 0.18);
    }
    if (s < 0.48) return arc(RO, mix(ta, tt, (s - 0.3) / 0.18));
    if (s < 0.5) {
      float rm = (RO + RI) * 0.5;
      float rc = (RO - RI) * 0.5;
      float ph = mix(tt, tt - PI, (s - 0.48) / 0.02);
      return C + rm * vec2(cos(tt), sin(tt)) + rc * vec2(cos(ph), sin(ph));
    }
    if (s < 0.78) return arc(RI, mix(tt, tf, (s - 0.5) / 0.28));
    if (s < 0.92) {
      return hermite(arc(RI, tf), vec2(2.4, -0.3), vec2(3.2, 0.0), vec2(2.0, 0.0), (s - 0.78) / 0.14);
    }
    return vec2(mix(3.2, 12.0, (s - 0.92) / 0.08), 0.0);
  }

  vec2 humpProfile(float s) {
    float z;
    if (s < 0.12) z = mix(-30.0, -8.0, s / 0.12);
    else if (s < 0.3) z = mix(-8.0, -1.0, (s - 0.12) / 0.18);
    else if (s < 0.48) z = mix(-1.0, 0.3, (s - 0.3) / 0.18);
    else if (s < 0.5) z = mix(0.3, 0.4, (s - 0.48) / 0.02);
    else if (s < 0.78) z = mix(0.4, 2.0, (s - 0.5) / 0.28);
    else if (s < 0.92) z = mix(2.0, 3.2, (s - 0.78) / 0.14);
    else z = mix(3.2, 12.0, (s - 0.92) / 0.08);
    float w = z > 0.0 ? 1.5 : 4.0;
    return vec2(z, 2.6 * exp(-(z / w) * (z / w)));
  }

  vec3 wavePoint(float x, float s, out float barrel, out float collapse, out float scale) {
    barrel = (1.0 - smoothstep(1.5, 3.4, x)) * smoothstep(-3.2, -1.0, x);
    collapse = 1.0 - smoothstep(-4.0, -1.5, x);
    float variation = (1.0 + 0.06 * sin(x * 0.45 + 0.6) + 0.04 * sin(x * 1.1 + 2.0))
                    * (1.0 - 0.3 * smoothstep(5.0, 20.0, x))
                    * (1.0 - 0.45 * (1.0 - smoothstep(-16.0, -5.0, x)));
    scale = variation * (1.0 - 0.5 * collapse);

    vec2 p = mix(humpProfile(s), tubeProfile(s), barrel) * scale;
    float z = p.x;
    float y = p.y;
    float xm = x + uTime * uSpeed;

    float r = 0.05 * sin(xm * 1.3 + z * 0.7)
            + 0.035 * sin(xm * 2.7 - z * 1.9 + 1.3)
            + 0.025 * sin(xm * 4.1 + z * 3.3);
    y += r * (1.0 - 0.7 * smoothstep(0.1, 1.0, y / 2.8));

    // Lines of swell rolling in behind the wave.
    y += 0.1 * sin(z * 0.9 + uTime * 1.2)
       * (1.0 - smoothstep(-6.0, -2.0, z)) * smoothstep(-28.0, -18.0, z);
    // Churn in the whitewater.
    float hump = smoothstep(0.0, 0.6, y) * smoothstep(0.2, 0.3, s) * (1.0 - smoothstep(0.85, 0.92, s));
    y += collapse * hump * (0.16 * (sin(xm * 1.7 + z * 1.3) + 0.6 * sin(xm * 2.9 - z * 2.1))
                          + 0.12 * sin(xm * 0.8 + z * 0.6 + uTime * 0.9));
    // The foam ball where the lip lands.
    float bx = (x + 2.2) / 1.4;
    float bz = (z - 1.0) / 1.0;
    y += 0.6 * exp(-bx * bx) * exp(-bz * bz);

    return vec3(x, y, z);
  }

  void main() {
    float x = position.x;
    float s = position.y;
    float barrel, collapse, scale, b2, c2, s2;
    vec3 p = wavePoint(x, s, barrel, collapse, scale);
    vec3 px = wavePoint(x + 0.03, s, b2, c2, s2);
    vec3 ps = wavePoint(x, s + 0.0015, b2, c2, s2);

    vWorld = p;
    vNormal = normalize(cross(ps - p, px - p));
    vF = clamp(p.y / (2.8 * scale), 0.0, 1.2);
    vFoam = collapse;
    vS = s;
    vB = barrel;
    vXm = x + uTime * uSpeed;
    gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
  }
`;

const oceanFragment = /* glsl */ `
  uniform vec3 uSkyTop;
  uniform vec3 uSkyHorizon;
  uniform vec3 uDeep;
  uniform vec3 uWater;
  uniform vec3 uScatter;
  uniform vec3 uFoam;
  uniform vec3 uSun;
  uniform vec3 uSunDir;
  uniform float uSunPower;
  uniform float uBacklit;
  uniform float uTime;
  uniform vec4 uTrail[${TRAIL}];
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying float vF;
  varying float vFoam;
  varying float vS;
  varying float vB;
  varying float vXm;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  // Small ripples riding on the wave, streaming with the water.
  float ripples(vec2 p) {
    return noise(p * 3.0) * 0.6 + noise(p * 7.0 + vec2(uTime * 0.3, 0.0)) * 0.4;
  }

  void main() {
    vec3 V = normalize(cameraPosition - vWorld);
    vec3 N = normalize(vNormal);
    if (dot(N, V) < 0.0) N = -N;

    vec2 rp = vec2(vXm, (vWorld.z + vWorld.y) * 1.3);
    float e = 0.04;
    float r0 = ripples(rp);
    vec2 grad = vec2(ripples(rp + vec2(e, 0.0)) - r0, ripples(rp + vec2(0.0, e)) - r0) / e;
    float bump = mix(0.03, 0.015, smoothstep(0.3, 0.9, vF));
    bump *= 1.0 - 0.6 * vB * smoothstep(0.5, 0.55, vS) * (1.0 - smoothstep(0.75, 0.8, vS));
    N = normalize(N + vec3(-grad.x, 0.0, -grad.y) * bump);

    vec3 L = normalize(uSunDir);
    float ndl = max(dot(N, L), 0.0);

    // Body of the water: darker in the troughs, glassy green up the face.
    vec3 body = mix(uDeep, uWater, smoothstep(0.0, 0.85, vF));
    body *= 0.55 + 0.45 * ndl * uSunPower + 0.15;
    body += mix(uSkyHorizon, uSkyTop, 0.5) * 0.12;

    // Inside the tube it's darker, lit mostly through the lip.
    float inside = vB * smoothstep(0.5, 0.54, vS) * (1.0 - smoothstep(0.74, 0.8, vS));
    body *= mix(1.0, 0.5, inside);

    // Light passing through the thin lip and upper face.
    float lipBand = (vS - 0.47) / 0.07;
    float thin = vB * exp(-lipBand * lipBand) * 0.75 + smoothstep(0.7, 1.0, vF) * 0.3;
    float through = pow(max(dot(V, -L) * 0.5 + 0.5, 0.0), 2.0);
    body += uScatter * min(thin, 0.8) * (0.3 + 0.7 * through) * uBacklit * 0.6 * (1.0 - vFoam);

    // Sky reflection, stronger at grazing angles.
    vec3 R = reflect(-V, N);
    vec3 sky = mix(uSkyHorizon, uSkyTop, smoothstep(-0.05, 0.6, R.y));
    float fresnel = 0.02 + 0.98 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
    vec3 col = mix(body, sky, clamp(fresnel, 0.0, 0.85));

    // Sun glare and glitter.
    float s = max(dot(R, L), 0.0);
    col += uSun * pow(s, 60.0) * 0.18 * uSunPower * smoothstep(0.15, 0.5, vF);

    // Whitewater: billowing foam texture over the broken section.
    float n = fbm(vec2(vXm * 0.9, vWorld.z * 1.1 + uTime * 0.15));
    float n2 = fbm(vec2(vXm * 2.6, vWorld.z * 2.4 - uTime * 0.4));
    float white = 0.85 * vFoam * smoothstep(0.05, 0.28, vF + (n - 0.5) * 0.25);
    white *= smoothstep(0.25, 0.55, n * 0.7 + n2 * 0.5);
    // The lip's leading edge feathering as it pitches, and the crest of
    // the shoulder just starting to spill.
    float tip = (vS - 0.49) / 0.018;
    float crest = exp(-tip * tip) * smoothstep(0.1, 0.5, vB) * smoothstep(0.3, 0.6, n2) * 0.8;
    float top = (vS - 0.38) / 0.03;
    crest = max(crest, exp(-top * top) * (1.0 - vB) * smoothstep(0.55, 0.75, n2) * 0.5);

    // The surfer's wake.
    float wake = 0.0;
    for (int i = 0; i < ${TRAIL}; i++) {
      vec4 tp = uTrail[i];
      vec3 dv = vWorld - tp.xyz;
      float radius = 0.09 + tp.w * 0.32;
      wake += exp(-dot(dv, dv) / (radius * radius)) * (1.0 - tp.w);
    }
    wake = clamp(wake, 0.0, 1.0) * smoothstep(0.35, 0.7, n2 * 0.7 + n * 0.5);

    float foam = clamp(max(max(white, crest), wake * 0.6), 0.0, 1.0);
    vec3 foamCol = uFoam * (0.62 + 0.38 * ndl * uSunPower + 0.12) * mix(0.82, 1.0, n2);
    col = mix(col, foamCol, foam);

    // Fade into the CSS sky so there's no hard horizon line.
    float dist = length(cameraPosition - vWorld);
    col = mix(col, uSkyHorizon, smoothstep(14.0, 38.0, dist) * 0.8);
    float alpha = 1.0 - smoothstep(26.0, 40.0, dist);
    // Let the broken section trail off into the distance.
    alpha *= smoothstep(-13.0, -5.0, vWorld.x);
    gl_FragColor = vec4(clamp(col, 0.0, 1.0), alpha);
  }
`;

const sprayVertex = /* glsl */ `
  attribute float aAlpha;
  attribute float aSize;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (650.0 / -mv.z);
    vAlpha = aAlpha;
    gl_Position = projectionMatrix * mv;
  }
`;

const sprayFragment = /* glsl */ `
  uniform vec3 uFoam;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d2 = dot(c, c);
    if (d2 > 0.25) discard;
    gl_FragColor = vec4(uFoam, 0.7 * vAlpha * exp(-d2 * 14.0));
  }
`;

const buildOceanGeometry = () => {
  const nx = 380;
  const nu = 420;
  const positions = new Float32Array((nx + 1) * (nu + 1) * 3);
  let i = 0;
  for (let iu = 0; iu <= nu; iu++) {
    for (let ix = 0; ix <= nx; ix++) {
      positions[i++] = -34 + (68 * ix) / nx;
      positions[i++] = iu / nu;
      positions[i++] = 0;
    }
  }
  const indices = new Uint32Array(nx * nu * 6);
  let j = 0;
  for (let iu = 0; iu < nu; iu++) {
    for (let ix = 0; ix < nx; ix++) {
      const a = iu * (nx + 1) + ix;
      const b = a + 1;
      const c = a + nx + 1;
      const e = c + 1;
      indices.set([a, c, b, b, c, e], j);
      j += 6;
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  return geometry;
};

// A shortboard: pointed nose, rounded tail, a little rocker, and an orange
// stringer stripe painted with vertex colours.
const buildBoard = () => {
  const geometry = new THREE.SphereGeometry(1, 48, 16);
  const pos = geometry.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const cream = new THREE.Color("#f4efe6");
  const stripe = new THREE.Color("#F2994A");
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const taper = x > 0 ? 1 - 0.78 * x * x : 1 - 0.35 * x * x;
    const rocker = x * x * (x > 0 ? 0.05 : 0.02);
    pos.setXYZ(i, x * 0.53, y * 0.028 + rocker, z * 0.15 * taper);
    const c = Math.abs(z) < 0.14 && y > 0 ? stripe : cream;
    colors.set([c.r, c.g, c.b], i * 3);
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.35 }),
  );
};

// A jointed surfer. Local frame: board along +x, up +y, chest facing +z.
const buildSurfer = () => {
  const group = new THREE.Group();
  const suit = new THREE.MeshStandardMaterial({
    color: "#1b2026",
    roughness: 0.55,
  });
  const skin = new THREE.MeshStandardMaterial({
    color: "#b07a58",
    roughness: 0.7,
  });
  const hair = new THREE.MeshStandardMaterial({
    color: "#5a3a22",
    roughness: 0.8,
  });

  group.add(buildBoard());
  const figure = new THREE.Group();
  group.add(figure);

  const bone = (radius, length, material) => {
    const mesh = new THREE.Mesh(
      new THREE.CapsuleGeometry(radius, length, 6, 12),
      material,
    );
    figure.add(mesh);
    return mesh;
  };
  const ball = (radius, material) => {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 18, 14),
      material,
    );
    figure.add(mesh);
    return mesh;
  };

  const parts = {
    shinB: bone(0.038, 0.31, suit),
    thighB: bone(0.05, 0.31, suit),
    shinF: bone(0.038, 0.31, suit),
    thighF: bone(0.05, 0.31, suit),
    pelvis: ball(0.095, suit),
    torso: bone(0.088, 0.26, suit),
    upperF: bone(0.032, 0.22, suit),
    foreF: bone(0.027, 0.22, skin),
    upperB: bone(0.032, 0.22, suit),
    foreB: bone(0.027, 0.22, skin),
    handF: ball(0.03, skin),
    handB: ball(0.03, skin),
    neck: bone(0.035, 0.05, skin),
    head: ball(0.075, skin),
    hairCap: ball(0.079, hair),
    hairLong: bone(0.045, 0.16, hair),
    footB: bone(0.032, 0.11, skin),
    footF: bone(0.032, 0.11, skin),
  };

  return { group, figure, parts, rider: null };
};

const UP = new THREE.Vector3(0, 1, 0);
const V = (x, y, z) => new THREE.Vector3(x, y, z);

const placeBone = (mesh, a, b) => {
  const dir = new THREE.Vector3().subVectors(b, a);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(UP, dir.normalize());
};

// Two-bone IK: returns the middle joint, bending toward `bend`.
const solveJoint = (root, end, l1, l2, bend) => {
  const dir = new THREE.Vector3().subVectors(end, root);
  const len = Math.min(dir.length(), l1 + l2 - 1e-3);
  dir.normalize();
  const a = (l1 * l1 - l2 * l2 + len * len) / (2 * len);
  const h = Math.sqrt(Math.max(l1 * l1 - a * a, 0));
  const perp = bend.clone().addScaledVector(dir, -bend.dot(dir)).normalize();
  return root.clone().addScaledVector(dir, a).addScaledVector(perp, h);
};

// Crouch c: 0 = tall through the top turn, 1 = compressed in the bottom turn.
const poseSurfer = ({ parts }, c, swing) => {
  const footB = V(-0.24, 0.04, 0);
  const footF = V(0.21, 0.04, 0.01);
  const hip = V(-0.02 + 0.03 * c, 0.58 - 0.15 * c, 0.03 + 0.04 * c);
  const hipB = hip.clone().add(V(-0.07, 0, 0));
  const hipF = hip.clone().add(V(0.07, 0, 0));

  const kneeB = solveJoint(footB, hipB, 0.33, 0.35, V(-0.25, 0, 1));
  const kneeF = solveJoint(footF, hipF, 0.33, 0.35, V(0.25, 0, 1));
  placeBone(parts.shinB, footB, kneeB);
  placeBone(parts.thighB, kneeB, hipB);
  placeBone(parts.shinF, footF, kneeF);
  placeBone(parts.thighF, kneeF, hipF);
  placeBone(
    parts.footB,
    footB.clone().add(V(0, 0, -0.05)),
    footB.clone().add(V(0.02, 0, 0.07)),
  );
  placeBone(
    parts.footF,
    footF.clone().add(V(0, 0, -0.05)),
    footF.clone().add(V(0.02, 0, 0.07)),
  );

  parts.pelvis.position.copy(hip).add(V(0, 0.02, 0));
  const chest = hip
    .clone()
    .add(V(0.08 + 0.06 * c, 0.36 - 0.06 * c, 0.06 + 0.08 * c));
  placeBone(parts.torso, hip.clone().add(V(0, 0.06, 0)), chest);

  const neckBase = chest.clone().add(V(0.01, 0.06, 0.01));
  const headPos = neckBase.clone().add(V(0.02, 0.1, 0.03));
  placeBone(parts.neck, chest, neckBase);
  parts.head.position.copy(headPos);
  parts.hairCap.position.copy(headPos).add(V(-0.01, 0.012, -0.022));
  placeBone(
    parts.hairLong,
    headPos.clone().add(V(0, 0, -0.05)),
    headPos.clone().add(V(-0.01, -0.17, -0.08)),
  );

  const shoulderF = chest.clone().add(V(0.15, 0.01, -0.01));
  const shoulderB = chest.clone().add(V(-0.15, 0.01, -0.01));
  const handF = shoulderF.clone().add(V(0.36, -0.22 + 0.08 * swing, 0.12));
  const handB = shoulderB
    .clone()
    .add(V(-0.3, -0.32 + 0.06 * c, 0.06 - 0.06 * swing));
  const elbowF = solveJoint(shoulderF, handF, 0.25, 0.25, V(0, -1, -0.4));
  const elbowB = solveJoint(shoulderB, handB, 0.25, 0.25, V(0, -1, 0.3));
  placeBone(parts.upperF, shoulderF, elbowF);
  placeBone(parts.foreF, elbowF, handF);
  placeBone(parts.upperB, shoulderB, elbowB);
  placeBone(parts.foreB, elbowB, handB);
  parts.handF.position.copy(handF);
  parts.handB.position.copy(handB);
};

// --- Rigged rider ------------------------------------------------------------
// A Mixamo-rigged character, posed procedurally every frame: the skeleton is
// reset to its rest pose, the hips are placed, then each bone is aimed at
// IK-solved joint targets.

const RIDER_SCALE = 0.62;
const RIDER_COLORS = {
  skin: new THREE.Color("#b98463"),
  rash: new THREE.Color("#1c2329"),
  shorts: new THREE.Color("#c8652f"),
};

// Paint clothes by whichever bone drives each vertex the most.
const paintRider = (mesh) => {
  const { skinIndex, skinWeight } = mesh.geometry.attributes;
  const bones = mesh.skeleton.bones;
  const colors = new Float32Array(skinIndex.count * 3);
  for (let i = 0; i < skinIndex.count; i++) {
    let best = 0;
    for (let k = 1; k < 4; k++) {
      if (skinWeight.getComponent(i, k) > skinWeight.getComponent(i, best))
        best = k;
    }
    const name = bones[skinIndex.getComponent(i, best)].name;
    let c = RIDER_COLORS.rash;
    if (
      /Head|Neck|Eye|Hand|Thumb|Index|Middle|Ring|Pinky|Foot|Toe|Leg$/.test(
        name,
      )
    ) {
      c = /UpLeg$/.test(name) ? RIDER_COLORS.shorts : RIDER_COLORS.skin;
    } else if (/Hips$/.test(name)) {
      c = RIDER_COLORS.shorts;
    }
    colors.set([c.r, c.g, c.b], i * 3);
  }
  mesh.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  mesh.material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.6,
  });
};

const loadRider = (url) =>
  new Promise((resolve, reject) => {
    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      url,
      (gltf) => {
        const root = gltf.scene;
        root.scale.setScalar(RIDER_SCALE);
        const bones = {};
        root.traverse((o) => {
          if (o.isSkinnedMesh) {
            paintRider(o);
            o.frustumCulled = false;
          }
          if (o.isBone) {
            const key = o.name.replace(/^mixamorig:?/, "");
            bones[key] = o;
            o.userData.restQ = o.quaternion.clone();
            o.userData.restP = o.position.clone();
          }
        });

        // Long brown hair. Placed in model space, then re-expressed in the
        // head bone's frame so it follows the head.
        const hairMat = new THREE.MeshStandardMaterial({
          color: "#4a2f1c",
          roughness: 0.85,
        });
        root.updateMatrixWorld(true);
        const head = bones.Head;
        const headScale = head.getWorldScale(new THREE.Vector3()).x;
        const align = head
          .getWorldQuaternion(new THREE.Quaternion())
          .invert()
          .multiply(root.getWorldQuaternion(new THREE.Quaternion()));
        const attach = (mesh, x, y, z) => {
          mesh.position.copy(
            head.worldToLocal(root.localToWorld(new THREE.Vector3(x, y, z))),
          );
          mesh.quaternion.copy(align);
          mesh.scale.multiplyScalar(RIDER_SCALE / headScale);
          head.add(mesh);
        };
        const cap = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 20, 14),
          hairMat,
        );
        cap.scale.set(1.0, 0.92, 1.1);
        attach(cap, 0, 1.69, -0.012);
        const flow = new THREE.Mesh(
          new THREE.CapsuleGeometry(0.075, 0.14, 6, 12),
          hairMat,
        );
        flow.scale.set(1.1, 1, 0.7);
        attach(flow, 0, 1.56, -0.075);

        resolve({ root, bones });
      },
      undefined,
      reject,
    );
  });

const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();
const tmpQ = new THREE.Quaternion();
const tmpBoneQ = new THREE.Quaternion();
const tmpParentQ = new THREE.Quaternion();

// Rotate `bone` so that `child` lies along `dir` (world space).
const aimBone = (bone, child, dir) => {
  bone.getWorldPosition(tmpA);
  child.getWorldPosition(tmpB);
  const current = tmpB.sub(tmpA).normalize();
  tmpQ.setFromUnitVectors(current, dir.clone().normalize());
  bone.getWorldQuaternion(tmpBoneQ);
  bone.parent.getWorldQuaternion(tmpParentQ);
  bone.quaternion.copy(tmpParentQ.invert().multiply(tmpQ.multiply(tmpBoneQ)));
  bone.updateMatrixWorld(true);
};

// Rotate `bone` about a world axis by `angle`.
const twistBone = (bone, axis, angle) => {
  tmpQ.setFromAxisAngle(axis.clone().normalize(), angle);
  bone.getWorldQuaternion(tmpBoneQ);
  bone.parent.getWorldQuaternion(tmpParentQ);
  bone.quaternion.copy(tmpParentQ.invert().multiply(tmpQ.multiply(tmpBoneQ)));
  bone.updateMatrixWorld(true);
};

const boneLength = (a, b) =>
  a
    .getWorldPosition(new THREE.Vector3())
    .distanceTo(b.getWorldPosition(new THREE.Vector3()));

// Two-bone chain (upper -> lower -> end) reaching for `target` (world).
const reach = (upper, lower, end, target, bend) => {
  const root = upper.getWorldPosition(new THREE.Vector3());
  const joint = solveJoint(
    root,
    target,
    boneLength(upper, lower),
    boneLength(lower, end),
    bend,
  );
  aimBone(upper, lower, joint.clone().sub(root));
  aimBone(lower, end, target.clone().sub(joint));
};

const groupQ = new THREE.Quaternion();

// Crouch c: 0 = tall through the top turn, 1 = compressed in the bottom turn.
const poseRider = ({ bones: b }, group, c, swing) => {
  Object.values(b).forEach((bone) => {
    bone.quaternion.copy(bone.userData.restQ);
    bone.position.copy(bone.userData.restP);
  });
  group.updateMatrixWorld(true);
  group.getWorldQuaternion(groupQ);
  const P = (x, y, z) => group.localToWorld(new THREE.Vector3(x, y, z));
  const D = (x, y, z) =>
    new THREE.Vector3(x, y, z).applyQuaternion(groupQ).normalize();
  const local = (bone) =>
    group.worldToLocal(bone.getWorldPosition(new THREE.Vector3()));

  const leg = (0.443 + 0.445) * RIDER_SCALE;
  const ankle = 0.03 + 0.084 * RIDER_SCALE;
  const footFront = P(0.23, ankle, 0.0);
  const footBack = P(-0.25, ankle, -0.02);

  // Hips sit back and drop as the rider compresses.
  const hips = P(
    -0.01 + 0.03 * c,
    ankle + leg * (0.9 - 0.25 * c),
    -0.03 - 0.04 * c,
  );
  b.Hips.position.copy(b.Hips.parent.worldToLocal(hips));
  b.Hips.updateMatrixWorld(true);
  aimBone(b.Hips, b.Spine, D(0.05 + 0.03 * c, 1, 0.08 + 0.15 * c));

  // Chest leans toward the face and down the line.
  const lean = D(0.12 + 0.1 * c, 1, 0.22 + 0.4 * c);
  aimBone(b.Spine, b.Spine1, lean);
  aimBone(b.Spine1, b.Spine2, lean);
  aimBone(b.Spine2, b.Neck, lean);
  // Open the shoulders toward the direction of travel.
  twistBone(b.Spine1, lean, 0.22 + 0.1 * c);
  twistBone(b.Spine2, lean, 0.22 + 0.1 * c);
  aimBone(b.Neck, b.Head, D(0.2, 1, 0.12));
  // Eyes down the line.
  twistBone(b.Neck, D(0, 1, 0), 0.45);

  reach(b.LeftUpLeg, b.LeftLeg, b.LeftFoot, footFront, D(-0.15, 0, 1));
  reach(b.RightUpLeg, b.RightLeg, b.RightFoot, footBack, D(0.45, 0, 1));
  aimBone(b.LeftFoot, b.LeftToeBase, D(0.25, -0.15, 1));
  aimBone(b.RightFoot, b.RightToeBase, D(0.35, -0.15, 1));

  // Front arm reaches down the line, back arm trails for balance.
  const shoulderF = local(b.LeftArm);
  const shoulderB = local(b.RightArm);
  reach(
    b.LeftArm,
    b.LeftForeArm,
    b.LeftHand,
    P(
      shoulderF.x + 0.31,
      shoulderF.y - 0.12 + 0.05 * swing,
      shoulderF.z + 0.03,
    ),
    D(0, -1, -0.4),
  );
  reach(
    b.RightArm,
    b.RightForeArm,
    b.RightHand,
    P(
      shoulderB.x - 0.08,
      shoulderB.y - 0.29 + 0.04 * c,
      shoulderB.z + 0.12 - 0.04 * swing,
    ),
    D(-0.3, -0.4, -1),
  );
};

const createOcean = (canvas, container) => {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
  const cameraBase = { pos: new THREE.Vector3(), look: new THREE.Vector3() };

  const trail = Array.from(
    { length: TRAIL },
    () => new THREE.Vector4(0, -50, 0, 1),
  );
  const uniforms = {
    uTime: { value: 0 },
    uSpeed: { value: SPEED },
    uSkyTop: { value: new THREE.Color() },
    uSkyHorizon: { value: new THREE.Color() },
    uDeep: { value: new THREE.Color() },
    uWater: { value: new THREE.Color() },
    uScatter: { value: new THREE.Color() },
    uFoam: { value: new THREE.Color() },
    uSun: { value: new THREE.Color() },
    uSunDir: { value: new THREE.Vector3() },
    uSunPower: { value: 1 },
    uBacklit: { value: 0 },
    uTrail: { value: trail },
  };

  const ocean = new THREE.Mesh(
    buildOceanGeometry(),
    new THREE.ShaderMaterial({
      uniforms,
      vertexShader: oceanVertex,
      fragmentShader: oceanFragment,
      transparent: true,
      side: THREE.DoubleSide,
    }),
  );
  ocean.frustumCulled = false;
  scene.add(ocean);

  const surfer = buildSurfer();
  surfer.group.scale.setScalar(1.15);
  const riderReady = loadRider(`${process.env.PUBLIC_URL}/models/surfer.glb`)
    .then((rider) => {
      surfer.rider = rider;
      surfer.figure.visible = false;
      surfer.group.add(rider.root);
    })
    .catch(() => {});
  scene.add(surfer.group);

  const sun = new THREE.DirectionalLight(0xffffff, 2.2);
  const hemi = new THREE.HemisphereLight(0xffffff, 0x0a2a33, 1.4);
  scene.add(sun, hemi);

  // Spray: blown back off the crest, exploding where the lip lands, misting
  // over the whitewater, and fanning off the board in turns.
  const SPRAY = 1600;
  const sprayPos = new Float32Array(SPRAY * 3);
  const sprayVel = new Float32Array(SPRAY * 3);
  const sprayLife = new Float32Array(SPRAY);
  const sprayMax = new Float32Array(SPRAY);
  const sprayPeak = new Float32Array(SPRAY);
  const sprayAlpha = new Float32Array(SPRAY);
  const spraySize = new Float32Array(SPRAY);
  const sprayDrag = new Float32Array(SPRAY);
  const sprayGeometry = new THREE.BufferGeometry();
  sprayGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(sprayPos, 3),
  );
  sprayGeometry.setAttribute(
    "aAlpha",
    new THREE.BufferAttribute(sprayAlpha, 1),
  );
  sprayGeometry.setAttribute("aSize", new THREE.BufferAttribute(spraySize, 1));
  const spray = new THREE.Points(
    sprayGeometry,
    new THREE.ShaderMaterial({
      uniforms: { uFoam: uniforms.uFoam },
      vertexShader: sprayVertex,
      fragmentShader: sprayFragment,
      transparent: true,
      depthWrite: false,
    }),
  );
  spray.frustumCulled = false;
  scene.add(spray);
  let nextParticle = 0;

  const emit = (pos, vel, life, size, peak, drag = 0) => {
    const i = nextParticle;
    nextParticle = (nextParticle + 1) % SPRAY;
    sprayPos.set([pos.x, pos.y, pos.z], i * 3);
    sprayVel.set([vel.x, vel.y, vel.z], i * 3);
    sprayLife[i] = life;
    sprayMax[i] = life;
    spraySize[i] = size;
    sprayPeak[i] = peak;
    sprayDrag[i] = drag;
  };

  // Palette transitions ease toward the target phase.
  const colorKeys = [
    "skyTop",
    "skyHorizon",
    "deep",
    "water",
    "scatter",
    "foam",
    "sun",
  ];
  const current = {};
  const target = {};
  colorKeys.forEach((k) => {
    current[k] = new THREE.Color();
    target[k] = new THREE.Color();
  });
  const currentDir = new THREE.Vector3();
  const targetDir = new THREE.Vector3();
  let currentScalars = { sunPower: 1, backlit: 0 };
  let targetScalars = { sunPower: 1, backlit: 0 };

  const setPhase = (phase, immediate = false) => {
    const p = PALETTES[phase] || PALETTES.day;
    colorKeys.forEach((k) => target[k].set(p[k]));
    targetDir.set(...p.sunDir).normalize();
    targetScalars = { sunPower: p.sunPower, backlit: p.backlit };
    if (immediate) {
      colorKeys.forEach((k) => current[k].copy(target[k]));
      currentDir.copy(targetDir);
      currentScalars = { ...targetScalars };
    }
  };

  const white = new THREE.Color("#ffffff");
  const applyPalette = (dt) => {
    const k = 1 - Math.exp(-dt * 1.5);
    colorKeys.forEach((key) => current[key].lerp(target[key], k));
    currentDir.lerp(targetDir, k).normalize();
    currentScalars.sunPower +=
      (targetScalars.sunPower - currentScalars.sunPower) * k;
    currentScalars.backlit +=
      (targetScalars.backlit - currentScalars.backlit) * k;

    uniforms.uSkyTop.value.copy(current.skyTop);
    uniforms.uSkyHorizon.value.copy(current.skyHorizon);
    uniforms.uDeep.value.copy(current.deep);
    uniforms.uWater.value.copy(current.water);
    uniforms.uScatter.value.copy(current.scatter);
    uniforms.uFoam.value.copy(current.foam);
    uniforms.uSun.value.copy(current.sun);
    uniforms.uSunDir.value.copy(currentDir);
    uniforms.uSunPower.value = currentScalars.sunPower;
    uniforms.uBacklit.value = currentScalars.backlit;

    sun.color.copy(current.sun);
    sun.intensity = 2.4 * currentScalars.sunPower;
    sun.position.copy(currentDir).multiplyScalar(10);
    hemi.color.copy(current.skyHorizon).lerp(white, 0.35);
    hemi.groundColor.copy(current.water);
    hemi.intensity = 0.8 + 0.8 * currentScalars.sunPower;
  };

  // Riding the barrel: holding a line on the tube floor at the mouth,
  // drifting deeper in and back out.
  const p = new THREE.Vector3();
  const px = new THREE.Vector3();
  const ps = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const side = new THREE.Vector3();
  const basis = new THREE.Matrix4();
  const local = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  const tmpVel = new THREE.Vector3();
  const OMEGA = (Math.PI * 2) / 4.8;

  const placeSurfer = (t) => {
    const phase = OMEGA * t;
    const sPos = 0.765 + 0.03 * Math.sin(phase);
    const sDot = 0.03 * OMEGA * Math.cos(phase);
    const x = 2.0 + 0.5 * Math.sin(phase * 0.5);
    const ex = 0.02;
    const es = 0.002;
    surfacePoint(x, sPos, t, p);
    surfacePoint(x + ex, sPos, t, px)
      .sub(p)
      .divideScalar(ex);
    surfacePoint(x, sPos + es, t, ps)
      .sub(p)
      .divideScalar(es);
    normal.crossVectors(ps, px).normalize();
    // Out of the water, toward the hollow of the tube.
    if (normal.y + normal.z < 0) normal.negate();
    tangent.copy(px).multiplyScalar(SPEED).addScaledVector(ps, sDot);
    tangent.addScaledVector(normal, -tangent.dot(normal)).normalize();
    side.crossVectors(tangent, normal);
    basis.makeBasis(tangent, normal, side);
    const g = surfer.group;
    g.quaternion.setFromRotationMatrix(basis);
    g.rotateX(-sDot * 4);
    g.position.copy(p).addScaledVector(normal, 0.02);
    g.updateMatrixWorld();

    // Low and compact in the tube.
    const crouch = 0.75 + 0.2 * Math.sin(phase);
    if (surfer.rider) poseRider(surfer.rider, g, crouch, Math.cos(phase));
    else poseSurfer(surfer, crouch, Math.cos(phase));
    return { s: sPos, sDot };
  };

  let trailClock = 0;
  const updateTrail = (dt) => {
    trail.forEach((tp) => {
      tp.x -= SPEED * dt;
      tp.w = Math.min(1, tp.w + dt / 1.4);
    });
    trailClock += dt;
    if (trailClock > 0.05) {
      trailClock = 0;
      const last = trail.pop();
      local.set(-0.45, 0, 0);
      surfer.group.localToWorld(local);
      last.set(local.x, local.y, local.z, 0);
      trail.unshift(last);
    }
  };

  const updateSpray = (t, dt, carve) => {
    const scale = Math.min(dt * 60, 3);

    // Offshore wind blowing spray back off the crest.
    for (let n = 0; n < 3 * scale; n++) {
      const x = -1 + Math.random() * 16;
      surfacePoint(x, 0.34 + Math.random() * 0.05, t, tmp);
      tmpVel.set(
        -0.4 + Math.random() * 0.6,
        0.7 + Math.random() * 1.0,
        -1.4 - Math.random() * 1.4,
      );
      emit(
        tmp,
        tmpVel,
        0.9 + Math.random() * 0.7,
        0.04 + Math.random() * 0.06,
        0.35,
        0.6,
      );
    }
    // Droplets curtaining off the lip as it pitches.
    for (let n = 0; n < 2 * scale; n++) {
      const x = -1.5 + Math.random() * 5;
      surfacePoint(x, 0.47 + Math.random() * 0.03, t, tmp);
      tmpVel.set(
        (Math.random() - 0.5) * 0.4,
        -0.4 + Math.random() * 0.6,
        0.4 + Math.random() * 0.8,
      );
      emit(
        tmp,
        tmpVel,
        0.5 + Math.random() * 0.4,
        0.025 + Math.random() * 0.035,
        0.6,
      );
    }
    // The lip landing in the flats behind the surfer.
    for (let n = 0; n < 2 * scale; n++) {
      const x = -4 + Math.random() * 2.6;
      surfacePoint(x, 0.8 + Math.random() * 0.1, t, tmp);
      tmpVel.set(
        (Math.random() - 0.5) * 1.2,
        1.4 + Math.random() * 2.6,
        0.6 + Math.random() * 1.8,
      );
      emit(
        tmp,
        tmpVel,
        0.6 + Math.random() * 0.7,
        0.05 + Math.random() * 0.09,
        0.8,
      );
    }
    // Mist hanging over the whitewater.
    for (let n = 0; n < 0.6 * scale; n++) {
      const x = -9 + Math.random() * 11;
      surfacePoint(x, 0.3 + Math.random() * 0.5, t, tmp);
      tmp.y += 0.3 + Math.random() * 0.6;
      tmpVel.set(0, 0.25 + Math.random() * 0.3, -0.2 + Math.random() * 0.4);
      emit(
        tmp,
        tmpVel,
        1.6 + Math.random() * 1.2,
        0.5 + Math.random() * 0.7,
        0.12,
        1.5,
      );
    }
    // A hiss of spray off the rail as the surfer climbs the wall.
    const count = (carve.sDot < 0 ? 2 : 0.5) * scale;
    for (let n = 0; n < count; n++) {
      local.set(-0.5, 0.02, (Math.random() - 0.5) * 0.2);
      surfer.group.localToWorld(local);
      tmpVel
        .copy(tangent)
        .multiplyScalar(-1.0)
        .addScaledVector(normal, 1.0 + Math.random() * 1.6)
        .add(
          tmp.set(
            (Math.random() - 0.5) * 1.0,
            Math.random() * 0.6,
            (Math.random() - 0.5) * 1.0,
          ),
        );
      emit(
        local,
        tmpVel,
        0.4 + Math.random() * 0.4,
        0.03 + Math.random() * 0.04,
        0.8,
      );
    }

    for (let i = 0; i < SPRAY; i++) {
      if (sprayLife[i] <= 0) {
        sprayAlpha[i] = 0;
        continue;
      }
      sprayLife[i] -= dt;
      const drag = Math.exp(-sprayDrag[i] * dt);
      sprayVel[i * 3] *= drag;
      sprayVel[i * 3 + 2] *= drag;
      sprayVel[i * 3 + 1] -= (sprayDrag[i] > 1 ? 0.2 : 5.0) * dt;
      sprayPos[i * 3] += (sprayVel[i * 3] - SPEED) * dt;
      sprayPos[i * 3 + 1] += sprayVel[i * 3 + 1] * dt;
      sprayPos[i * 3 + 2] += sprayVel[i * 3 + 2] * dt;
      const life = sprayLife[i] / sprayMax[i];
      // Quick fade in, long fade out.
      sprayAlpha[i] =
        Math.max(0, Math.min(1, (1 - life) * 6) * life) * sprayPeak[i];
    }
    sprayGeometry.attributes.position.needsUpdate = true;
    sprayGeometry.attributes.aAlpha.needsUpdate = true;
    sprayGeometry.attributes.aSize.needsUpdate = true;
  };

  const frame = (t, dt) => {
    uniforms.uTime.value = t;
    applyPalette(dt);
    const carve = placeSurfer(t);
    updateTrail(dt);
    updateSpray(t, dt, carve);
    // A gentle handheld sway.
    camera.position
      .copy(cameraBase.pos)
      .add(tmp.set(Math.sin(t * 0.37) * 0.08, Math.sin(t * 0.53) * 0.05, 0));
    camera.lookAt(cameraBase.look);
    renderer.render(scene, camera);
  };

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    const aspect = w / h;
    camera.aspect = aspect;
    // From the channel, down the line, looking into the mouth of the barrel.
    if (aspect > 1.6) {
      camera.fov = 26;
      cameraBase.pos.set(8.5, 1.0, 13);
      cameraBase.look.set(-0.2, 1.65, 0.3);
    } else {
      camera.fov = 40;
      cameraBase.pos.set(5.0, 1.1, 9.5);
      cameraBase.look.set(0.0, 1.6, 0.3);
    }
    camera.position.copy(cameraBase.pos);
    camera.lookAt(cameraBase.look);
    camera.updateProjectionMatrix();
  };

  return { renderer, frame, resize, setPhase, scene, riderReady };
};

const Ocean3D = ({ phase }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const api = createOcean(canvasRef.current, container);
    sceneRef.current = api;
    api.setPhase(phase, true);
    api.resize();

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let t = 1.6;

    const loop = () => {
      const now = performance.now();
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      t += dt;
      api.frame(t, dt);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (raf || reduceMotion || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    // Warm up so spray and wake are already in the air on the first frame,
    // and give the rider a moment to load before fading in.
    let cancelled = false;
    const reveal = () => {
      if (cancelled) return;
      for (let i = 0; i < 90; i++) {
        t += 1 / 60;
        api.frame(t, 1 / 60);
      }
      setReady(true);
      start();
    };
    Promise.race([
      api.riderReady,
      new Promise((resolve) => setTimeout(resolve, 3000)),
    ]).then(reveal);

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      visible ? start() : stop();
    });
    observer.observe(container);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    const resizeObserver = new ResizeObserver(() => {
      api.resize();
      if (!raf) api.frame(t, 0);
    });
    resizeObserver.observe(container);

    return () => {
      cancelled = true;
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      api.scene.traverse((obj) => {
        obj.geometry?.dispose();
        obj.material?.dispose();
      });
      api.renderer.dispose();
    };
    // Phase changes are pushed through setPhase below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    sceneRef.current?.setPhase(phase);
  }, [phase]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-[clamp(220px,34vh,330px)] transition-opacity duration-1000 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-sea to-transparent" />
    </div>
  );
};

export default Ocean3D;
