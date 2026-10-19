import React from "react";

const WAVE_PATH =
  "M0 40 Q 180 0 360 40 T 720 40 T 1080 40 T 1440 40 V 100 H 0 Z";

const WAVE_LAYERS = [
  { color: "#1D4652", opacity: 0.55, height: 128, duration: "38s" },
  {
    color: "#10303A",
    opacity: 0.9,
    height: 100,
    duration: "26s",
    reverse: true,
  },
];

export const Surfer = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute bottom-9 left-[14%] z-[1] sm:left-[22%]"
  >
    <svg
      viewBox="0 0 60 50"
      className="surfer h-14 w-16 text-sand"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="33" cy="11" r="4" fill="currentColor" stroke="none" />
      <path d="M31 16 L27 27" />
      <path d="M30 19 L19 21 M30 19 L41 23" />
      <path d="M27 27 L33 32 L36 38 M27 27 L22 32 L19 38" />
      <path
        d="M4 40 Q 30 47 56 36 Q 31 43 4 40 Z"
        fill="#F2994A"
        stroke="#F2994A"
        strokeWidth="2"
      />
    </svg>
  </div>
);

export const Waves = ({ front }) => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-x-0 bottom-0"
  >
    {[
      ...WAVE_LAYERS,
      { color: front, opacity: 1, height: 72, duration: "18s" },
    ].map((layer, i) => (
      <div
        key={i}
        className="absolute inset-x-0 bottom-0 overflow-hidden"
        style={{ height: layer.height, opacity: layer.opacity }}
      >
        <div
          className="wave-track flex h-full w-[200%]"
          style={{
            animationDuration: layer.duration,
            animationDirection: layer.reverse ? "reverse" : "normal",
          }}
        >
          {[0, 1].map((copy) => (
            <svg
              key={copy}
              viewBox="0 0 1440 100"
              preserveAspectRatio="none"
              className="h-full w-1/2"
            >
              <path d={WAVE_PATH} fill={layer.color} />
            </svg>
          ))}
        </div>
      </div>
    ))}
  </div>
);
