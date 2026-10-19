import React from "react";
import { SOCIALS } from "../data";

export const ResumeLink = ({ className = "", children = "Resume" }) => (
  <a
    href="/resume.pdf"
    download="Resume_Mathis_Lefranc.pdf"
    className={`transition-colors ${className}`}
  >
    {children}
  </a>
);

export const SocialIcons = ({ className = "" }) => (
  <div className={`flex items-center gap-1 ${className}`}>
    {SOCIALS.map(({ name, url, icon: Icon }) => (
      <a
        key={name}
        href={url}
        target={url.startsWith("mailto") ? undefined : "_blank"}
        rel="noopener noreferrer"
        aria-label={name}
        className="rounded-full p-2.5 text-sand/70 transition-colors hover:bg-sea-800 hover:text-sunset"
      >
        <Icon size={18} />
      </a>
    ))}
  </div>
);

export const SectionHeading = ({ index, title, aside }) => (
  <div className="reveal mb-14 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-sea-700 pb-4">
    <span className="font-mono text-xs text-sunset">{index}</span>
    <h2 className="font-serif text-4xl sm:text-5xl">{title}</h2>
    {aside && (
      <span className="font-hand text-2xl text-lagoon/80">{aside}</span>
    )}
  </div>
);
