import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import { EMAIL } from "./data";
import { useReveal } from "./hooks";
import Hero from "./components/Hero";
import { Waves } from "./components/Waves";
import Postcards from "./components/Postcards";
import Route from "./components/Route";
import Writing from "./components/Writing";
import { ResumeLink, SocialIcons } from "./components/Shared";

const App = () => {
  useReveal();

  return (
    <div className="grain min-h-screen">
      <Nav />
      <Hero />
      <main className="mx-auto max-w-5xl px-6 pt-16 sm:px-10">
        <Postcards />
        <Writing />
        <Route />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? "border-b border-sea-700/60 bg-sea/80 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6 sm:px-10">
        <a href="#top" className="font-serif text-2xl text-sand">
          ML<span className="text-sunset">.</span>
        </a>
        <div className="flex items-center gap-6 text-sm text-sand/70">
          <a href="#projects" className="hidden hover:text-sand sm:inline">
            Projects
          </a>
          <a href="#writing" className="hidden hover:text-sand sm:inline">
            Writing
          </a>
          <a href="#about" className="hidden hover:text-sand sm:inline">
            Route
          </a>
          <ResumeLink className="rounded-full border border-sand/20 px-4 py-1.5 text-sand hover:border-sunset hover:text-sunset" />
        </div>
      </nav>
    </header>
  );
};

const Contact = () => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef();

  const copyEmail = () => {
    navigator.clipboard?.writeText(EMAIL).then(() => {
      setCopied(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1800);
    });
  };

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return (
    <section id="contact" className="py-24">
      <div className="reveal">
        <p className="label">04 — Contact</p>
        <h2 className="mt-6 font-serif text-5xl leading-tight sm:text-7xl">
          Send a message
          <br />
          in a <span className="italic text-sunset">bottle</span>.
        </h2>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={`mailto:${EMAIL}`}
            className="link-underline text-xl text-sand sm:text-2xl"
          >
            {EMAIL}
          </a>
          <button
            onClick={copyEmail}
            className="rounded-full border border-sea-700 px-3 py-1 font-mono text-xs text-sand-muted transition-colors hover:border-sand hover:text-sand"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
        <p className="mt-6 font-hand text-2xl text-lagoon/80">
          (or just email — it's faster than a bottle)
        </p>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="relative mt-8">
    <div className="relative h-32">
      <Waves front="#0D262E" />
    </div>
    <div className="bg-sea-900">
      <div className="mx-auto flex max-w-5xl flex-col-reverse items-start justify-between gap-6 px-6 pb-10 pt-4 text-sm text-sand-faint sm:flex-row sm:items-center sm:px-10">
        <p>
          © {new Date().getFullYear()} Mathis Lefranc · Made in Saint-Barth,
          between surf sessions
        </p>
        <SocialIcons className="-ml-2.5" />
      </div>
    </div>
  </footer>
);

export default App;
