"use client";

import React from "react";
import { ZapIcon, DatabaseIcon, CpuIcon, LayersIcon, ShieldCheckIcon, SparklesIcon, CodeIcon } from "./Icons";

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  badge: string;
  description: string;
  details: string[];
  gradient: string;
}

const features: FeatureItem[] = [
  {
    icon: <ZapIcon className="h-5 w-5 text-amber-400" />,
    title: "Instant Scaffold",
    badge: "Native ESM",
    description:
      "Generates a clean flat-MVC structure in under 2 seconds. Full ES modules (`type: 'module'`) with zero Babel, zero transpilation, and instant Node.js runtime boot.",
    details: ["type: 'module' from day one", "Clean flat-MVC layout", "Zero compilation delay"],
    gradient: "from-amber-500/10 via-transparent to-transparent hover:border-amber-500/30",
  },
  {
    icon: <DatabaseIcon className="h-5 w-5 text-emerald-400" />,
    title: "Multi-Database Support",
    badge: "MongoDB / SQL",
    description:
      "First-class adapters for MongoDB (via Mongoose), PostgreSQL (via Sequelize), and MySQL (via Sequelize) — or choose None for a ultra-lightweight REST API.",
    details: ["Auto-configured connection files", "Graceful disconnect handling", "Pre-built user/auth schemas"],
    gradient: "from-emerald-500/10 via-transparent to-transparent hover:border-emerald-500/30",
  },
  {
    icon: <CpuIcon className="h-5 w-5 text-cyan-400" />,
    title: "Inline Service Generator",
    badge: "xpresso-cli create",
    description:
      "Scaffold complete features on the fly. `xpresso-cli create <name>` generates a controller, route, and model, then automatically patches `routes/index.routes.js`.",
    details: ["Controller with model bindings", "Express router template", "Zero manual route wiring"],
    gradient: "from-cyan-500/10 via-transparent to-transparent hover:border-cyan-500/30",
  },
  {
    icon: <CodeIcon className="h-5 w-5 text-teal-400" />,
    title: "Auto DB Detection",
    badge: "Smart Generator",
    description:
      "When running the `create` command, the CLI inspects your existing `package.json` dependencies to determine whether to emit Mongoose or Sequelize models.",
    details: ["Reads package dependencies", "Outputs matched model syntax", "Falls back to custom templates"],
    gradient: "from-teal-500/10 via-transparent to-transparent hover:border-teal-500/30",
  },
  {
    icon: <ShieldCheckIcon className="h-5 w-5 text-indigo-400" />,
    title: "Production Middleware",
    badge: "Hardened Core",
    description:
      "Pre-configured with CORS, Gzip compression, Morgan HTTP logging, cookie-parser, and AES-256-GCM token encryption for tamper-proof tokens.",
    details: ["Gzip level 4 compression", "AES-256-GCM crypto helpers", "Centralized error logging to file"],
    gradient: "from-indigo-500/10 via-transparent to-transparent hover:border-indigo-500/30",
  },
  {
    icon: <LayersIcon className="h-5 w-5 text-rose-400" />,
    title: "Environment Aware",
    badge: "Strict Schema",
    description:
      "Dynamically switches between `.env.development` and `.env.production` based on `NODE_ENV`, with strict fail-fast validation when required keys are missing.",
    details: ["Dual .env file support", "Startup validation guard", "Type-safe config exports"],
    gradient: "from-rose-500/10 via-transparent to-transparent hover:border-rose-500/30",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 border-t border-zinc-900 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/30 px-3 py-1 text-xs font-medium text-emerald-300 mb-3">
            <SparklesIcon className="h-3.5 w-3.5 text-emerald-400" />
            <span>Built for Modern Backend Engineers</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Engineered for Speed, Built for Production
          </h2>
          <p className="mt-3 text-zinc-400 text-sm sm:text-base">
            Everything you need to launch a production Express service without the usual glue code and configuration headaches.
          </p>
        </div>

        {/* 6 Feature Cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, idx) => (
            <div
              key={idx}
              className={`group relative rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5 bg-gradient-to-b ${item.gradient}`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/90 shadow-inner group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-0.5 text-[11px] font-mono font-medium text-zinc-400">
                  {item.badge}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors">
                {item.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {item.description}
              </p>

              {/* Bullets */}
              <ul className="mt-5 space-y-1.5 border-t border-zinc-800/60 pt-4 text-xs font-mono text-zinc-400">
                {item.details.map((detail, dIdx) => (
                  <li key={dIdx} className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-emerald-400" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
