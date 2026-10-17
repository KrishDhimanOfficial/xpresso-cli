"use client";

import React, { useState } from "react";
import { CopyIcon, CheckIcon, TerminalIcon, ArrowRightIcon, SparklesIcon, GithubIcon } from "./Icons";

type PackageManager = "npm" | "pnpm" | "yarn" | "bun";
type InstallMode = "npx" | "global";

export default function Hero() {
  const [installMode, setInstallMode] = useState<InstallMode>("npx");
  const [packageManager, setPackageManager] = useState<PackageManager>("npm");
  const [copied, setCopied] = useState(false);

  const getCommand = () => {
    if (installMode === "npx") {
      switch (packageManager) {
        case "pnpm":
          return "pnpm dlx xpresso-cli my-app";
        case "yarn":
          return "yarn dlx xpresso-cli my-app";
        case "bun":
          return "bunx xpresso-cli my-app";
        case "npm":
        default:
          return "npx xpresso-cli my-app";
      }
    } else {
      switch (packageManager) {
        case "pnpm":
          return "pnpm add -g xpresso-cli";
        case "yarn":
          return "yarn global add xpresso-cli";
        case "bun":
          return "bun add -g xpresso-cli";
        case "npm":
        default:
          return "npm install -g xpresso-cli";
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCommand());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="quickstart" className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background ambient glow effects */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[480px] w-[540px] rounded-full bg-emerald-500/10 blur-[130px] -translate-y-16" />
        <div className="h-[360px] w-[420px] rounded-full bg-cyan-500/10 blur-[120px] translate-x-32" />
        <div className="h-[300px] w-[350px] rounded-full bg-indigo-500/10 blur-[140px] -translate-x-36" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Release / Status Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-medium text-emerald-300 shadow-inner backdrop-blur-md mb-8">
          <SparklesIcon className="h-3.5 w-3.5 text-emerald-400" />
          <span>v2.0.1 is live: Flat-MVC, Native ESM & Auto Service Generator</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
          Production-Ready Express Apps{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            in Seconds.
          </span>
        </h1>

        {/* Value Proposition */}
        <p className="mx-auto mt-6 max-w-2xl text-base text-zinc-400 sm:text-lg leading-relaxed">
          Skip the repetitive boilerplate fatigue. Scaffold a battle-tested Node.js + Express backend with 
          <span className="text-zinc-200 font-medium"> clean flat-MVC architecture</span>, 
          <span className="text-zinc-200 font-medium"> 4 package managers</span>, 
          <span className="text-zinc-200 font-medium"> multi-database support</span>, and an 
          <span className="text-zinc-200 font-medium"> automated inline service generator</span>.
        </p>

        {/* Command Box Container */}
        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950/80 p-2 sm:p-3 shadow-2xl backdrop-blur-xl ring-1 ring-white/5">
          {/* Controls Bar: Mode & Package Manager */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 px-2 pb-3 pt-1">
            {/* Mode: Instant Run vs Global */}
            <div className="flex items-center rounded-lg bg-zinc-900/90 p-1 text-xs">
              <button
                type="button"
                onClick={() => setInstallMode("npx")}
                className={`rounded-md px-3 py-1 font-medium transition-all cursor-pointer ${
                  installMode === "npx"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Instant Run (Recommended)
              </button>
              <button
                type="button"
                onClick={() => setInstallMode("global")}
                className={`rounded-md px-3 py-1 font-medium transition-all cursor-pointer ${
                  installMode === "global"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Global Install
              </button>
            </div>

            {/* Package Manager Switcher */}
            <div className="flex items-center gap-1">
              {(["npm", "pnpm", "yarn", "bun"] as PackageManager[]).map((pm) => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setPackageManager(pm)}
                  className={`rounded-md px-2.5 py-1 text-xs font-mono font-medium transition-all cursor-pointer ${
                    packageManager === pm
                      ? "bg-zinc-800 text-white border border-zinc-700 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          {/* Code Execution Snippet */}
          <div className="flex items-center justify-between px-3 py-3">
            <div className="flex items-center gap-3 overflow-x-auto text-left font-mono text-sm sm:text-base text-zinc-200">
              <span className="text-emerald-500 select-none font-bold">$</span>
              <span className="tracking-wide select-all text-emerald-100">{getCommand()}</span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer shrink-0 ml-3"
              aria-label="Copy command to clipboard"
            >
              {copied ? (
                <>
                  <CheckIcon className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <CopyIcon className="h-4 w-4 text-zinc-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href="#interactive-terminal"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 font-medium text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500 hover:shadow-emerald-500/40 transition-all cursor-pointer sm:w-auto"
          >
            <TerminalIcon className="h-4 w-4" />
            <span>Try Interactive Simulator</span>
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href="#features"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/90 px-6 font-medium text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer sm:w-auto"
          >
            <span>Explore Features</span>
          </a>
          <a
            href="https://github.com/KrishDhimanOfficial/xpresso-cli"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-800/80 bg-zinc-950/60 px-5 text-sm font-medium text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-all cursor-pointer sm:w-auto"
          >
            <GithubIcon className="h-4 w-4" />
            <span>View on GitHub</span>
          </a>
        </div>

        {/* Quick Highlights / Stats Grid */}
        <div className="mt-16 grid grid-cols-2 gap-4 border-t border-zinc-800/60 pt-10 sm:grid-cols-4 text-left">
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-4 backdrop-blur-sm">
            <div className="font-mono text-2xl font-bold text-emerald-400">4</div>
            <div className="text-xs font-medium text-zinc-400 mt-1">Package Managers</div>
            <div className="text-[11px] text-zinc-500">npm, yarn, pnpm & bun</div>
          </div>
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-4 backdrop-blur-sm">
            <div className="font-mono text-2xl font-bold text-cyan-400">3+</div>
            <div className="text-xs font-medium text-zinc-400 mt-1">Database Options</div>
            <div className="text-[11px] text-zinc-500">MongoDB, Postgres, MySQL, None</div>
          </div>
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-4 backdrop-blur-sm">
            <div className="font-mono text-2xl font-bold text-teal-400">100%</div>
            <div className="text-xs font-medium text-zinc-400 mt-1">Native ESM</div>
            <div className="text-[11px] text-zinc-500">type: &quot;module&quot;, zero Babel</div>
          </div>
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-4 backdrop-blur-sm">
            <div className="font-mono text-2xl font-bold text-amber-400">&lt; 2s</div>
            <div className="text-xs font-medium text-zinc-400 mt-1">Scaffold Speed</div>
            <div className="text-[11px] text-zinc-500">Instant directory bootstrap</div>
          </div>
        </div>
      </div>
    </section>
  );
}
