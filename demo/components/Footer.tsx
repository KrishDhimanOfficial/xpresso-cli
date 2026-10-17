"use client";

import React from "react";
import { GithubIcon, NpmIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 py-12 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Brand & Tagline */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-2">
              <span className="text-xl">🚀</span>
              <span className="font-mono text-base font-bold text-white tracking-tight">
                xpresso-cli
              </span>
              <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[11px] font-mono text-zinc-400">
                v2.0.1
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Brewed for developers who value their time. Zero boilerplate fatigue.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
            <a
              href="https://github.com/KrishDhimanOfficial/xpresso-cli"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            >
              <GithubIcon className="h-4 w-4" />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.npmjs.com/package/xpresso-cli"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <NpmIcon className="h-3.5 w-3.5" />
              <span>npm</span>
            </a>
            <a
              href="https://github.com/KrishDhimanOfficial/xpresso-cli/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors cursor-pointer"
            >
              Issues
            </a>
            <a
              href="https://opensource.org/licenses/ISC"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors cursor-pointer"
            >
              ISC License
            </a>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 border-t border-zinc-900/80 pt-6 text-center text-xs text-zinc-500">
          <p>
            Created with ❤️ by{" "}
            <a
              href="https://github.com/KrishDhimanOfficial"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-emerald-400 font-medium transition-colors cursor-pointer"
            >
              Krish Dhiman
            </a>
            . Licensed under the ISC License.
          </p>
        </div>
      </div>
    </footer>
  );
}
