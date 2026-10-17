"use client";

import React, { useState } from "react";
import { CopyIcon, CheckIcon, CodeIcon } from "./Icons";

interface CliCommand {
  command: string;
  syntax: string;
  description: string;
  arguments: { name: string; description: string; required: boolean }[];
  examples: string[];
}

const commands: CliCommand[] = [
  {
    command: "xpresso-cli [project-directory]",
    syntax: "xpresso-cli [directory]",
    description: "Scaffolds a new Express application with flat-MVC structure, selected database adapter, and auth boilerplate.",
    arguments: [
      {
        name: "project-directory",
        description: "Folder name where the project will be created. If omitted, the CLI interactively prompts for one.",
        required: false,
      },
    ],
    examples: ["npx xpresso-cli my-api", "xpresso-cli express-backend", "xpresso-cli"],
  },
  {
    command: "xpresso-cli create <serviceName>",
    syntax: "xpresso-cli create <name>",
    description: "Creates controllers/<name>.controller.js, routes/<name>.routes.js, and models/<name>.model.js, and auto-wires routes/index.routes.js.",
    arguments: [
      {
        name: "serviceName",
        description: "The name of the entity or domain service to scaffold (e.g. user, product, order, payment).",
        required: true,
      },
    ],
    examples: ["xpresso-cli create user", "xpresso-cli create product", "xpresso-cli create order"],
  },
];

export default function CliReference() {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <section id="commands" className="relative py-24 border-t border-zinc-900 bg-zinc-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/30 px-3 py-1 text-xs font-medium text-emerald-300 mb-3">
            <CodeIcon className="h-3.5 w-3.5 text-emerald-400" />
            <span>CLI Command Reference</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Simple, Expressive Commands
          </h2>
          <p className="mt-3 text-zinc-400 text-sm sm:text-base">
            No endless flags or configuration files to memorize. Two intuitive commands handle scaffolding and scaling.
          </p>
        </div>

        {/* Command Cards */}
        <div className="mt-12 space-y-6 max-w-4xl mx-auto">
          {commands.map((cmd, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-xl transition-all"
            >
              {/* Header with syntax and copy */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-emerald-400 font-mono text-xs">
                    $
                  </div>
                  <span className="font-mono text-sm sm:text-base font-bold text-white">
                    {cmd.syntax}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(cmd.examples[0])}
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-800/80 px-3 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all cursor-pointer"
                >
                  {copiedCmd === cmd.examples[0] ? (
                    <>
                      <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied Example</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon className="h-3.5 w-3.5" />
                      <span>Copy Command</span>
                    </>
                  )}
                </button>
              </div>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {cmd.description}
              </p>

              {/* Arguments Table */}
              <div className="mt-4 border-t border-zinc-800/60 pt-4">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                  Arguments
                </span>
                <div className="space-y-2">
                  {cmd.arguments.map((arg, aIdx) => (
                    <div
                      key={aIdx}
                      className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs font-mono rounded-lg bg-zinc-950/60 p-2.5 border border-zinc-800/60"
                    >
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-cyan-400 font-semibold">{arg.name}</span>
                        <span
                          className={`rounded px-1.5 py-0.2 text-[10px] ${
                            arg.required
                              ? "bg-rose-950/60 text-rose-400 border border-rose-900/60"
                              : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {arg.required ? "required" : "optional"}
                        </span>
                      </div>
                      <span className="text-zinc-400 font-sans">{arg.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Examples */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="text-zinc-500">Examples:</span>
                {cmd.examples.map((ex, eIdx) => (
                  <button
                    key={eIdx}
                    type="button"
                    onClick={() => handleCopy(ex)}
                    className="rounded bg-zinc-800/70 px-2 py-1 text-emerald-300 hover:bg-zinc-700/80 transition-all cursor-pointer"
                    title="Click to copy"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Smart Install Graceful Fallback Notice */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/15 p-4 text-xs text-amber-200/90 leading-relaxed flex items-start gap-3">
            <span className="text-amber-400 font-bold shrink-0 text-sm">💡</span>
            <div>
              <span className="font-semibold text-amber-300">Smart Missing Package Manager Guard: </span>
              If you pick a package manager (e.g. <code className="font-mono text-amber-300">bun</code> or <code className="font-mono text-amber-300">pnpm</code>) that isn&apos;t installed on the machine, <code className="font-mono text-amber-300">xpresso-cli</code> gracefully warns you with install instructions and skips the install step instead of crashing.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
