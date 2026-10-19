import React, { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, FileDown } from "lucide-react";
import { EMAIL } from "../data";
import { useIslandTime } from "../hooks";
import { ResumeLink, SocialIcons } from "./Shared";
import { Surfer, Waves } from "./Waves";

const Ocean3D = lazy(() => import("./Ocean3D"));

const SKIES = {
  night: "linear-gradient(180deg, #030c13 0%, #071820 55%, #0A1F26 100%)",
  dawn: "linear-gradient(180deg, #14223a 0%, #3b4466 45%, #b8705a 85%, #d98a5f 100%)",
  day: "linear-gradient(180deg, #0b3446 0%, #125a6c 55%, #1f7d86 100%)",
  sunset:
    "linear-gradient(180deg, #161d38 0%, #5a2f4a 45%, #c0603a 85%, #e88a45 100%)",
  dusk: "linear-gradient(180deg, #081322 0%, #1c2846 55%, #6b3c4a 100%)",
};

const STAR_OPACITY = { night: 1, dusk: 0.6, dawn: 0.25, day: 0, sunset: 0 };

// Position along a sky arc for progress p in [0, 1], kept right of the text.
const arc = (p) => ({
  left: `${45 + p * 52}%`,
  top: `${40 - Math.sin(Math.PI * p) * 30}%`,
});

const Hero = () => {
  const { hours, label, phase, status } = useIslandTime();

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      <Sky hours={hours} phase={phase} />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-44 pt-28 sm:px-10">
        <div className="flex flex-col-reverse gap-14 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex animate-rise flex-wrap items-center gap-x-2.5 gap-y-0.5 rounded-2xl border border-sand/15 sm:rounded-full bg-sea/30 px-3.5 py-1.5 font-mono text-xs text-sand backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lagoon opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-lagoon" />
              </span>
              <span className="whitespace-nowrap">{label} in Gustavia</span>
              <span className="hidden text-sand/40 sm:inline">·</span>
              <span className="whitespace-nowrap text-sand/75">{status}</span>
            </p>
            <h1
              className="mt-7 animate-rise font-serif text-6xl leading-[0.95] tracking-tight sm:text-7xl md:text-8xl"
              style={{ animationDelay: "80ms" }}
            >
              Mathis
              <br />
              Lefranc<span className="text-sunset">.</span>
            </h1>
            <p
              className="mt-8 max-w-xl animate-rise text-lg font-light leading-relaxed text-sand/85 sm:text-xl"
              style={{ animationDelay: "160ms" }}
            >
              Freelance full-stack developer and surfer based in Saint-Barth,
              building fast, intuitive web apps — from{" "}
              <em className="font-serif text-2xl not-italic text-sand">
                clean data models
              </em>{" "}
              to{" "}
              <em className="font-serif text-2xl not-italic text-sand">
                payment flows that just work
              </em>
              .
            </p>
            <a
              href="#projects"
              className="group mt-6 block w-fit animate-rise text-sm leading-relaxed text-sand/85"
              style={{ animationDelay: "200ms" }}
            >
              Currently building{" "}
              <span className="text-sunset group-hover:underline">Rallia</span>{" "}
              <span className="text-sand/50">·</span> 1,000+ players, 880+ games
              played
              <ArrowUpRight
                size={14}
                className="ml-1 inline align-[-2px] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
            <div
              className="mt-8 flex animate-rise flex-wrap items-center gap-4"
              style={{ animationDelay: "240ms" }}
            >
              <ResumeLink className="inline-flex items-center gap-2 rounded-full bg-sand px-6 py-3 text-sm font-medium text-sea hover:bg-sunset">
                <FileDown size={16} />
                Download resume
              </ResumeLink>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-2 rounded-full border border-sand/20 bg-sea/20 px-6 py-3 text-sm text-sand backdrop-blur-sm transition-colors hover:border-sand"
              >
                Get in touch <ArrowUpRight size={16} />
              </a>
              <SocialIcons className="ml-1" />
            </div>
          </div>

          <Polaroid />
        </div>
      </div>

      {SHOW_3D_OCEAN ? <Ocean phase={phase} /> : <Waves front="#0A1F26" />}
    </section>
  );
};

const Sky = ({ hours, phase }) => {
  const stars = useMemo(() => {
    let seed = 971;
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    return Array.from({ length: 70 }, () => ({
      left: `${rand() * 100}%`,
      top: `${rand() * 70}%`,
      size: rand() < 0.15 ? 2 : 1,
      delay: `${rand() * 4}s`,
    }));
  }, []);

  const isDaytime = hours >= 6 && hours < 18.75;
  const sunProgress = (hours - 6) / 12.75;
  const moonProgress = ((hours - 19 + 24) % 24) / 11;
  const showMoon = !isDaytime && moonProgress <= 1;

  return (
    <div aria-hidden="true" className="absolute inset-0">
      {Object.entries(SKIES).map(([name, background]) => (
        <div
          key={name}
          className="absolute inset-0 transition-opacity duration-[2000ms]"
          style={{ background, opacity: name === phase ? 1 : 0 }}
        />
      ))}

      <div
        className="absolute inset-0 transition-opacity duration-[2000ms]"
        style={{ opacity: STAR_OPACITY[phase] }}
      >
        {stars.map((s, i) => (
          <span
            key={i}
            className="star absolute rounded-full bg-sand"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              animationDelay: s.delay,
            }}
          />
        ))}
      </div>

      {isDaytime && (
        <div
          className="absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-20 sm:w-20"
          style={{
            ...arc(sunProgress),
            background:
              "radial-gradient(circle, #FFF4D6 0%, #FFD58A 45%, #F2994A 100%)",
            boxShadow: "0 0 90px 36px rgba(242, 153, 74, 0.32)",
          }}
        />
      )}

      {showMoon && (
        <div
          className="absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            ...arc(moonProgress),
            boxShadow: "inset -13px 6px 0 0 #F1E7D6",
            filter: "drop-shadow(0 0 18px rgba(241, 231, 214, 0.35))",
          }}
        />
      )}
    </div>
  );
};

// The 3D wave is switched off for now; flip this to bring it back.
const SHOW_3D_OCEAN = false;

const supportsWebGL = () => {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2"));
  } catch {
    return false;
  }
};

const FlatWaves = () => (
  <>
    <Waves front="#0A1F26" />
    <Surfer />
  </>
);

// The 3D wave loads lazily; browsers without WebGL2 keep the flat waves.
const Ocean = ({ phase }) => {
  const [webgl, setWebgl] = useState(null);

  useEffect(() => setWebgl(supportsWebGL()), []);

  if (webgl === null) return null;
  if (!webgl) return <FlatWaves />;

  return (
    <Suspense fallback={null}>
      <Ocean3D phase={phase} />
    </Suspense>
  );
};

const Polaroid = () => (
  <figure
    className="relative w-44 shrink-0 animate-rise self-center sm:w-60 md:w-72"
    style={{ animationDelay: "120ms" }}
  >
    <div className="rotate-3 bg-[#F6F1E7] p-3 pb-14 shadow-2xl shadow-black/50 transition-transform duration-500 hover:rotate-0">
      <span className="absolute -top-4 left-1/2 z-10 h-8 w-24 -translate-x-1/2 -rotate-6 border border-white/20 bg-sand/40 backdrop-blur-[2px]" />
      <img
        src="/profile.jpg"
        alt="Mathis Lefranc"
        className="aspect-square w-full object-cover"
      />
      <figcaption className="absolute inset-x-0 bottom-3 text-center font-hand text-2xl text-sea">
        me, between sets
      </figcaption>
    </div>
  </figure>
);

export default Hero;
