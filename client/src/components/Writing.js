import React from "react";
import { ArrowUpRight } from "lucide-react";
import { BLOG } from "../data";
import { SectionHeading } from "./Shared";

const Writing = () => (
  <section id="writing" className="py-24">
    <SectionHeading index="02" title="Writing" aside="— where the opinions go" />
    <div className="reveal grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-end">
      <div>
        <h3 className="font-serif text-5xl leading-none sm:text-6xl">
          {BLOG.name}
        </h3>
        <p className="mt-6 max-w-md leading-relaxed text-sand-muted">
          {BLOG.description}
        </p>
        <a
          href={BLOG.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-sand/20 px-5 py-2 text-sand transition-colors hover:border-sunset hover:text-sunset"
        >
          Read the blog <ArrowUpRight size={16} />
        </a>
      </div>
      <div>
        <p className="label mb-4">Topics</p>
        <ul className="flex flex-wrap gap-2">
          {BLOG.topics.map((topic) => (
            <li
              key={topic}
              className="rounded-full border border-sea-700 px-3.5 py-1.5 text-sm text-sand-muted"
            >
              {topic}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default Writing;
