import { useEffect, useState } from "react";

export const ISLAND_TZ = "America/St_Barthelemy";

const readIslandTime = () => {
  // ?time=18.5 lets you preview any time of day.
  const override = parseFloat(
    new URLSearchParams(window.location.search).get("time"),
  );
  if (!Number.isNaN(override)) {
    const hours = ((override % 24) + 24) % 24;
    return { hours, label: formatHours(hours) };
  }

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: ISLAND_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type) => Number(parts.find((p) => p.type === type).value);
  const hours = (get("hour") % 24) + get("minute") / 60;
  return { hours, label: formatHours(hours) };
};

const formatHours = (hours) => {
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export const getPhase = (h) => {
  if (h >= 5.5 && h < 7) return "dawn";
  if (h >= 7 && h < 17) return "day";
  if (h >= 17 && h < 19) return "sunset";
  if (h >= 19 && h < 20) return "dusk";
  return "night";
};

export const getStatus = (h) => {
  if (h < 6 || h >= 23) return "asleep — I'll reply in the morning";
  if (h < 8) return "dawn patrol before standup";
  if (h < 12) return "deep in code";
  if (h < 14) return "lunch by the water";
  if (h < 17) return "shipping features";
  if (h < 19) return "sunset surf session";
  return "late-night commits";
};

export const useIslandTime = () => {
  const [time, setTime] = useState(readIslandTime);

  useEffect(() => {
    const id = setInterval(() => setTime(readIslandTime()), 20000);
    return () => clearInterval(id);
  }, []);

  return {
    ...time,
    phase: getPhase(time.hours),
    status: getStatus(time.hours),
  };
};

export const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};
