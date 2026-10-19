import React from "react";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS } from "../data";
import { SectionHeading } from "./Shared";

const TILTS = [
  "-0.8deg",
  "0.5deg",
  "-0.4deg",
  "-1.2deg",
  "1deg",
  "0.8deg",
  "-1deg",
];

const Postcards = () => {
  const featured = PROJECTS.filter((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-24">
      <SectionHeading
        index="01"
        title="Selected projects"
        aside="— postcards from past builds"
      />
      <div className="space-y-10">
        {featured.map((project, i) => (
          <Postcard
            key={project.name}
            project={project}
            tilt={TILTS[i]}
            featured
          />
        ))}
      </div>
      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        {rest.map((project, i) => (
          <Postcard
            key={project.name}
            project={project}
            tilt={TILTS[(i + featured.length) % TILTS.length]}
          />
        ))}
      </div>
      <a
        href="https://github.com/MathisL971?tab=repositories"
        target="_blank"
        rel="noopener noreferrer"
        className="reveal mt-12 inline-flex items-center gap-1.5 text-sm text-sand-muted hover:text-sunset"
      >
        More on GitHub <ArrowUpRight size={14} />
      </a>
    </section>
  );
};

const Postcard = ({ project, tilt, featured = false }) => {
  const Icon = project.icon;

  return (
    <div className="reveal">
      <article
        className="postcard relative bg-[#F4ECDD] text-sea shadow-[0_24px_50px_-20px_rgba(0,0,0,0.75)] transition-transform duration-500 hover:[transform:rotate(0deg)_translateY(-6px)]"
        style={{ "--tilt": tilt }}
      >
        <div
          className={`grid gap-8 p-6 sm:p-8 ${
            featured ? "sm:grid-cols-[1fr_15rem]" : "sm:grid-cols-[1fr_9.5rem]"
          }`}
        >
          <div className="flex flex-col">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-sea/55">
              {project.flagship && (
                <span className="mr-2 rounded-sm bg-sunset px-1.5 py-0.5 text-sea">
                  Flagship
                </span>
              )}
              Greetings from
            </p>
            <h3
              className={`mt-1 font-serif leading-none ${
                featured ? "text-5xl sm:text-6xl" : "text-4xl"
              }`}
            >
              {project.name}
            </h3>
            <p
              className={`mt-2 font-hand leading-tight text-[#B5531C] ${
                featured ? "text-2xl" : "text-xl"
              }`}
            >
              {project.tagline}
            </p>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-sea/75">
              {project.description}
            </p>
            {project.stats && (
              <dl className="mt-6 grid max-w-2xl grid-cols-2 gap-x-4 gap-y-5 border-y border-dashed border-sea/20 py-4 sm:grid-cols-4">
                {project.stats.map(({ value, label }) => (
                  <div key={label}>
                    <dt className="sr-only">{label}</dt>
                    <dd className="font-serif text-4xl leading-none text-sea sm:text-5xl">
                      {value}
                    </dd>
                    <dd className="mt-1.5 text-xs leading-snug text-sea/65">
                      {label}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {project.stat && (
              <p className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-sea px-3.5 py-1.5 text-xs text-sand">
                <span className="text-sunset">★</span>
                {project.stat}
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
              {project.links?.map((link) => (
                <CardLink key={link.href} href={link.href}>
                  {link.label}
                </CardLink>
              ))}
              {project.live && (
                <CardLink href={project.live}>Visit site</CardLink>
              )}
              {project.code && <CardLink href={project.code}>Source</CardLink>}
            </div>
          </div>

          <div className="relative flex flex-col sm:border-l sm:border-dashed sm:border-sea/20 sm:pl-6">
            <div
              className={`relative ml-auto flex rotate-2 flex-col items-center justify-center gap-1 border-[3px] border-dotted border-[#F4ECDD] text-sea shadow-[0_0_0_1px_rgba(10,31,38,0.12)] ${
                project.image
                  ? "h-24 w-20 bg-white"
                  : featured
                    ? "h-20 w-16 bg-sunset"
                    : "h-20 w-16 bg-lagoon"
              }`}
            >
              {project.image ? (
                <img
                  src={project.image}
                  alt=""
                  className="w-16 object-contain"
                />
              ) : (
                <Icon size={22} strokeWidth={1.75} />
              )}
              <span className="font-mono text-[9px] tracking-wider">
                {project.year}
              </span>
            </div>
            <Postmark
              label={project.postmark}
              year={project.year}
              className={featured ? "right-12 top-4" : "right-8 top-6"}
            />

            <ul className="mt-auto space-y-3 pt-8">
              <li className="border-b border-sea/20 pb-1 font-hand text-xl">
                To: you
              </li>
              {chunk(project.stack, featured ? 2 : 1).map((line) => (
                <li
                  key={line.join()}
                  className="truncate border-b border-sea/20 pb-1 font-mono text-[11px] text-sea/70"
                >
                  {line.join(" · ")}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </div>
  );
};

const chunk = (items, size) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, i) =>
    items.slice(i * size, i * size + size),
  );

const CardLink = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 underline decoration-sea/25 underline-offset-4 transition-colors hover:text-[#B5531C] hover:decoration-[#B5531C]"
  >
    {children} <ArrowUpRight size={14} />
  </a>
);

const Postmark = ({ label, year, className = "" }) => {
  const id = `postmark-${label.replace(/\W/g, "")}-${year}`;

  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={`pointer-events-none absolute h-24 w-24 -rotate-12 text-sea/40 ${className}`}
      overflow="visible"
    >
      <defs>
        <path id={id} d="M50,50 m-35,0 a35,35 0 1,1 70,0 a35,35 0 1,1 -70,0" />
      </defs>
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="50"
        cy="50"
        r="27"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <text
        fontSize="9"
        fontFamily="JetBrains Mono, monospace"
        fill="currentColor"
      >
        <textPath href={`#${id}`} textLength="218" lengthAdjust="spacing">
          {`★ ${label} ★ ${label} `}
        </textPath>
      </text>
      <text
        x="50"
        y="55"
        textAnchor="middle"
        fontSize="14"
        fontFamily="JetBrains Mono, monospace"
        fill="currentColor"
      >
        {year}
      </text>
      <path
        d="M-30 40 q 8 -6 16 0 t 16 0 M-30 50 q 8 -6 16 0 t 16 0 M-30 60 q 8 -6 16 0 t 16 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
};

export default Postcards;
