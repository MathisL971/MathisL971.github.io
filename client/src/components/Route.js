import React, { useEffect, useRef, useState } from "react";
import { Sailboat } from "lucide-react";
import { COMMUNITY, ROUTE, TOOLBOX } from "../data";
import { SectionHeading } from "./Shared";

const Route = () => (
  <section id="about" className="py-24">
    <SectionHeading index="03" title="The route" aside="— how I got here" />
    <div className="grid gap-16 md:grid-cols-[1.3fr_1fr]">
      <Voyage />
      <div className="reveal space-y-10">
        <SideBlock title="Toolbox">
          <dl className="space-y-3">
            {TOOLBOX.map(({ label, items }) => (
              <div key={label} className="grid grid-cols-[5.5rem_1fr] gap-4">
                <dt className="text-sm text-sand">{label}</dt>
                <dd className="text-sm text-sand-muted">{items}</dd>
              </div>
            ))}
          </dl>
        </SideBlock>
        <SideBlock title="Community">
          {COMMUNITY.map((c) => (
            <div key={c.title}>
              <p className="text-sand">{c.title}</p>
              <p className="text-sm text-sand-muted">{c.detail}</p>
            </div>
          ))}
        </SideBlock>
        <SideBlock title="Languages">
          <p className="text-sm text-sand-muted">
            French & English (fluent) · Portuguese (advanced) · Spanish
            (intermediate)
          </p>
        </SideBlock>
        <SideBlock title="Off the keyboard">
          <p className="text-sm text-sand-muted">
            Surfing, tennis, samba, chess, stand-up comedy, podcasts and
            non-fiction.
          </p>
        </SideBlock>
      </div>
    </div>
  </section>
);

const Voyage = () => {
  const listRef = useRef(null);
  const routeRef = useRef(null);
  const trailRef = useRef(null);
  const boatRef = useRef(null);
  const [reached, setReached] = useState(0);

  useEffect(() => {
    let frame;
    const update = () => {
      const list = listRef.current;
      if (!list) return;
      const stops = list.querySelectorAll("[data-stop]");
      // The voyage ends at the centre of the last stop's dot.
      const end = stops[stops.length - 1].offsetTop + 12;
      const top = list.getBoundingClientRect().top;
      const distance = Math.min(
        end,
        Math.max(0, window.innerHeight * 0.55 - top),
      );
      routeRef.current.style.height = `${end}px`;
      trailRef.current.style.height = `${distance}px`;
      boatRef.current.style.transform = `translate(-50%, calc(${distance}px - 50%))`;

      let count = 0;
      stops.forEach((stop) => {
        if (stop.offsetTop + 12 <= distance + 1) count += 1;
      });
      setReached(count);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={listRef} className="relative pl-12">
      <span
        ref={routeRef}
        aria-hidden="true"
        className="absolute left-[11px] top-0 border-l-2 border-dashed border-sea-700"
      />
      <span
        ref={trailRef}
        aria-hidden="true"
        className="absolute left-[11px] top-0 w-0.5 bg-gradient-to-b from-lagoon to-sunset"
        style={{ height: 0 }}
      />
      <span
        ref={boatRef}
        aria-hidden="true"
        className="absolute left-3 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-sea-700 bg-sea text-sunset"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <Sailboat size={16} />
      </span>

      <ol className="space-y-12">
        {ROUTE.map((stop, i) => (
          <li key={stop.title} data-stop className="relative">
            <span
              aria-hidden="true"
              className={`absolute -left-[42px] top-1.5 h-3 w-3 rounded-full border-2 transition-colors duration-500 ${
                i < reached
                  ? "border-sunset bg-sunset"
                  : "border-sea-700 bg-sea"
              }`}
            />
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sand-faint">
              {stop.when} <span className="text-sea-700">/</span>{" "}
              <span className="text-lagoon/80">{stop.coords}</span>
            </p>
            <h3 className="mt-2 font-serif text-3xl">
              {stop.title}
              <span className="font-sans text-base text-sand-muted">
                {" "}
                — {stop.place}
              </span>
            </h3>
            <p className="mt-2 max-w-md leading-relaxed text-sand-muted">
              {stop.text}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
};

const SideBlock = ({ title, children }) => (
  <div>
    <p className="label mb-4">{title}</p>
    <div className="space-y-4">{children}</div>
  </div>
);

export default Route;
