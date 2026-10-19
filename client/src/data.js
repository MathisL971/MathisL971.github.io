import {
  CalendarCheck,
  ConciergeBell,
  Heart,
  ReceiptText,
  ChartLine,
  Github,
  Instagram,
  Linkedin,
  Mail,
  ShieldCheck,
  BookOpen,
  Map as MapIcon,
} from "lucide-react";

export const EMAIL = "lefrancmathis@gmail.com";

export const SOCIALS = [
  { name: "GitHub", url: "https://github.com/MathisL971", icon: Github },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/mathis-lefranc/",
    icon: Linkedin,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/mathisl.971/",
    icon: Instagram,
  },
  { name: "Email", url: `mailto:${EMAIL}`, icon: Mail },
];

export const PROJECTS = [
  {
    name: "Rallia",
    tagline: "Never play tennis or pickleball alone again.",
    description:
      "My own product: a matchmaking app that connects racquet-sports players for real games. Courts on a live map, verified skill levels (NTRP / DUPR), an open-games marketplace, player reliability scores, and leagues and tournaments that run themselves, payments included. Launched in Montréal this summer.",
    stats: [
      { value: "1,000+", label: "players" },
      { value: "880+", label: "games played" },
      { value: "46%", label: "still playing a month later" },
      { value: "$930+", label: "collected from league & tournament fees" },
    ],
    stack: [
      "Expo",
      "React Native",
      "TypeScript",
      "Supabase",
      "Next.js",
      "Stripe",
      "Turborepo",
    ],
    postmark: "MONTRÉAL",
    year: "2026",
    image: "/rallia.png",
    links: [
      {
        label: "App Store",
        href: "https://apps.apple.com/ca/app/rallia/id6760482014",
      },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.mathisl971.ralliaapp",
      },
      { label: "Visit site", href: "https://rallia.app" },
    ],
    featured: true,
    flagship: true,
  },
  {
    name: "Atlas SBH",
    tagline: "Saint-Barth, mapped and measured.",
    description:
      "An interactive atlas of Saint-Barthélemy built as a decision-support tool for local government: a fully offline vector map with 3D relief, cadastral parcels matched to every building, and trend dashboards on property sales by neighbourhood, housing stock, passengers, energy, water and population. Sourced data only, no opinions.",
    stat: "Whole island in a 1.3 MB tile file, zero network calls after load",
    stack: ["Next.js", "TypeScript", "MapLibre GL", "PMTiles", "Tailwind"],
    postmark: "SAINT-BARTH",
    year: "2026",
    icon: MapIcon,
    live: "https://atlas-sbh.vercel.app",
    featured: true,
  },
  {
    name: "Alfred",
    tagline: "The back office for luxury villa concierges.",
    description:
      "One platform to run high-end villa stays: guest profiles and preferences, a shared operations calendar, pre-arrival villa checklists, task boards, a service-provider directory, commission tracking and shareable guest itineraries, in English and French.",
    stat: "Freelance build for a concierge client",
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Supabase",
      "TanStack Query",
      "Tailwind",
    ],
    postmark: "SAINT-BARTH",
    year: "2025",
    icon: ConciergeBell,
    live: "https://alfred-web-olive.vercel.app/login",
    featured: true,
  },
  {
    name: "Alizé",
    tagline: "Paperwork, handled, for island entrepreneurs.",
    description:
      "Invoicing and admin in one place: quotes and French-format PDF invoices, client management, reusable templates, payment tracking, plus revenue declarations and local CPS contribution estimates. Free tier with a Pro plan through Stripe.",
    stat: "Made for Saint-Barth's micro-entrepreneurs",
    stack: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "Stripe",
      "React PDF",
      "Tailwind",
    ],
    postmark: "SAINT-BARTH",
    year: "2025",
    icon: ReceiptText,
    live: "https://alize.corweb.io/login",
    featured: true,
  },
  {
    name: "CréneauSport",
    tagline: "Booking Montréal's sports facilities, minus the pain.",
    description:
      "A modern, mobile-first replacement for the City of Montréal's clunky facility booking flow — advanced search, dark mode, fast everywhere.",
    stat: "25k+ views on Reddit in launch week",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    postmark: "MONTRÉAL",
    year: "2025",
    icon: CalendarCheck,
    live: "https://creneau-sport.vercel.app/",
    code: "https://github.com/MathisL971/next-creneau-sport",
    featured: true,
  },
  {
    name: "Made with Peace",
    tagline: "Design your own kissed jeans.",
    description:
      "A custom denim designer for the Made with Peace brand: pick a wash and size, then drag and rotate embroidered lip-kiss patches on the front and back. The finished design is emailed as an order spec sheet.",
    stack: ["Next.js", "TypeScript", "Resend", "Python"],
    postmark: "SAINT-BARTH",
    year: "2026",
    icon: Heart,
    live: "https://made-with-peace-jeans-tool.vercel.app",
  },
  {
    name: "InkLink",
    tagline: "Eventbrite for curious minds.",
    description:
      "Cross-platform app connecting lifelong learners to local social-science talks, panels and conferences.",
    stack: ["Expo", "TypeScript", "Node.js", "MongoDB", "AWS"],
    postmark: "MONTRÉAL",
    year: "2025",
    icon: BookOpen,
    code: "https://github.com/MathisL971/expo-inklink",
  },
  {
    name: "ReadCheck AI",
    tagline: "Grammarly, but for fact-checking.",
    description:
      "Chrome extension that flags and documents inaccurate claims in news articles. Built in 24 hours at Bagel Hacks 2025.",
    stack: ["Node.js", "Cohere", "SerpAPI", "Chrome"],
    postmark: "BAGEL HACKS",
    year: "2025",
    icon: ShieldCheck,
    code: "https://github.com/MathisL971/ReadCheck-AI",
  },
  {
    name: "Stock Dashboard",
    tagline: "Snappy market data, no clutter.",
    description:
      "A performant stock dashboard on top of Finnhub's market data API.",
    stack: ["React", "TypeScript", "Finnhub"],
    postmark: "MONTRÉAL",
    year: "2025",
    icon: ChartLine,
    code: "https://github.com/MathisL971/react-stock-dashboard",
  },
];

export const BLOG = {
  name: "Réflexions",
  url: "https://atlas-sbh-blog.vercel.app",
  description:
    "My writing lives here: thoughts and proposals on life and local policy in Saint-Barth.",
  topics: [
    "Housing",
    "Health",
    "Education",
    "Environment",
    "Mobility",
    "Energy & water",
    "Economy & tourism",
    "Cost of living",
    "Local governance",
  ],
};

const SAINT_BARTH = "17.90° N · 62.85° W";
const MONTREAL = "45.50° N · 73.57° W";

export const ROUTE = [
  {
    place: "Saint-Barth",
    coords: SAINT_BARTH,
    when: "The early years",
    title: "Raised on the island",
    text: "Grew up between the waves and a screen: surfing whenever the swell showed up, and six years deep in video games before putting the controller down.",
  },
  {
    place: "Montréal",
    coords: MONTREAL,
    when: "2020 — 2023",
    title: "McGill University",
    text: "BCom in Finance & IT Management with a CS minor (3.77 / 4.00). Set out to become a finance bro, fell for code instead.",
  },
  {
    place: "Montréal",
    coords: MONTREAL,
    when: "2023 — 2025",
    title: "Concordia & freelancing",
    text: "Graduate Diploma in Computer Science (3.87 / 4.30) while freelancing on production software for clients.",
  },
  {
    place: "Saint-Barth",
    coords: SAINT_BARTH,
    when: "Now",
    title: "Back home",
    text: "Freelancing full-time — mostly web, mostly TypeScript, always with an eye on the details — from the island, with a board never far from the desk.",
  },
];

export const TOOLBOX = [
  {
    label: "Frontend",
    items: "React, Next.js, React Native, Expo, Redux, Tailwind, shadcn",
  },
  {
    label: "Backend",
    items: "Node.js, Symfony, Flask, REST, GraphQL, WebSockets",
  },
  { label: "Data", items: "PostgreSQL, MySQL, MongoDB, Supabase, Firebase" },
  {
    label: "Infra",
    items: "AWS, Docker, Nginx, Cloudflare, Vercel, GitHub Actions, Stripe",
  },
];

export const COMMUNITY = [
  {
    title: "VP, Student Mentorship — GDSC Concordia",
    detail: "Led 4 directors; recruited 15 mentors for 50 student developers.",
  },
  {
    title: "Director of Sponsorships — BOLT McGill",
    detail: "Raised $3,000 and recruited 8 industry speakers.",
  },
];
