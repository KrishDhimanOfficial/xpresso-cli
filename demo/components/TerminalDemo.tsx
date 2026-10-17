"use client";

import React, { useState, useRef } from "react";
import { TerminalIcon, PlayIcon, RotateCcwIcon } from "./Icons";

type PM = "npm" | "yarn" | "pnpm" | "bun";
type DB = "MongoDB (Mongoose)" | "PostgreSQL (Sequelize)" | "MySQL (Sequelize)" | "None";

interface LogEntry {
  type: "command" | "prompt" | "spinner" | "success" | "info" | "banner";
  text: string;
}

export default function TerminalDemo() {
  const [projectName, setProjectName] = useState("my-express-api");
  const [selectedPM, setSelectedPM] = useState<PM>("pnpm");
  const [selectedDB, setSelectedDB] = useState<DB>("MongoDB (Mongoose)");
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    { type: "info", text: "Welcome to xpresso-cli interactive simulator. Select options and press 'Run Scaffold'." },
    { type: "command", text: "$ npx xpresso-cli my-express-api" },
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const resetTerminal = () => {
    setIsRunning(false);
    setLogs([
      { type: "info", text: "Welcome to xpresso-cli interactive simulator. Select options and press 'Run Scaffold'." },
      { type: "command", text: `$ npx xpresso-cli ${projectName}` },
    ]);
  };

  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogs([]);

    const initialLogs: LogEntry[] = [
      { type: "command", text: `$ npx xpresso-cli ${projectName}` },
      { type: "prompt", text: `? Which package manager would you like to use? › ${selectedPM}` },
      { type: "prompt", text: `? Which database would you like to use? › ${selectedDB}` },
    ];

    setLogs(initialLogs);

    // Timed progressive logs to simulate actual CLI ora spinners and file creation
    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        { type: "spinner", text: "⠋ Copying Express flat-MVC structure..." },
      ]);
    }, 400);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev.filter((l) => !l.text.startsWith("⠋")),
        { type: "success", text: "✔ Template copied into ./" + projectName },
        { type: "spinner", text: `⠋ Configuring ${selectedDB} connection in config/db.config.js...` },
      ]);
    }, 1100);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev.filter((l) => !l.text.startsWith("⠋")),
        { type: "success", text: `✔ Database adapter configured (${selectedDB.split(" ")[0]})` },
        { type: "spinner", text: "⠋ Generating auth service (controller, routes, model)..." },
      ]);
    }, 1800);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev.filter((l) => !l.text.startsWith("⠋")),
        { type: "success", text: "✔ Auto-generated auth service and wired routes" },
        { type: "spinner", text: `⠋ Installing dependencies using ${selectedPM}...` },
      ]);
    }, 2500);

    setTimeout(() => {
      const pmRun = selectedPM === "npm" ? "npm run dev" : `${selectedPM} dev`;
      setLogs((prev) => [
        ...prev.filter((l) => !l.text.startsWith("⠋")),
        { type: "success", text: `✔ Dependencies installed via ${selectedPM} in 1.2s` },
        {
          type: "banner",
          text: `🎉 Project ${projectName} is ready!

👉 cd ${projectName}
👉 ${pmRun}

🚀 Server starts at: http://localhost:8200
📄 Flat MVC architecture configured with native ESM`,
        },
      ]);
      setIsRunning(false);
    }, 3400);
  };

  const applyPreset = (pm: PM, db: DB, name: string) => {
    setSelectedPM(pm);
    setSelectedDB(db);
    setProjectName(name);
  };

  return (
    <section id="interactive-terminal" className="relative py-20 border-t border-zinc-900 bg-zinc-950/50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-950/30 px-3 py-1 text-xs font-medium text-teal-300 mb-3">
            <TerminalIcon className="h-3.5 w-3.5 text-teal-400" />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Experience xpresso-cli in Your Browser
          </h2>
          <p className="mt-3 text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Test drive how the CLI prompts you, configures your database adapter, and bootstraps the project in real-time.
          </p>
        </div>

        {/* Preset quick buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-zinc-500 font-mono">Quick Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset("bun", "MongoDB (Mongoose)", "fast-mongo-api")}
            className="rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-300 transition-all cursor-pointer"
          >
            🔥 Bun + MongoDB
          </button>
          <button
            type="button"
            onClick={() => applyPreset("pnpm", "PostgreSQL (Sequelize)", "pg-microservice")}
            className="rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-zinc-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-all cursor-pointer"
          >
            ⚡ PNPM + PostgreSQL
          </button>
          <button
            type="button"
            onClick={() => applyPreset("npm", "None", "lightweight-api")}
            className="rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-zinc-300 hover:border-teal-500/50 hover:text-teal-300 transition-all cursor-pointer"
          >
            📦 NPM + Standalone (No DB)
          </button>
        </div>

        {/* Controls Bar Above Terminal */}
        <div className="mt-8 rounded-t-2xl border border-b-0 border-zinc-800 bg-zinc-900/70 p-4 backdrop-blur-xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Project Name */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Project Directory Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value.trim() || "my-app")}
                disabled={isRunning}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 font-mono text-xs text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                placeholder="my-express-api"
              />
            </div>

            {/* Package Manager */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Package Manager
              </label>
              <select
                value={selectedPM}
                onChange={(e) => setSelectedPM(e.target.value as PM)}
                disabled={isRunning}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 font-mono text-xs text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
              >
                <option value="npm">npm</option>
                <option value="pnpm">pnpm</option>
                <option value="yarn">yarn</option>
                <option value="bun">bun</option>
              </select>
            </div>

            {/* Database Selection */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Database & ORM
              </label>
              <select
                value={selectedDB}
                onChange={(e) => setSelectedDB(e.target.value as DB)}
                disabled={isRunning}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 font-mono text-xs text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
              >
                <option value="MongoDB (Mongoose)">MongoDB (Mongoose)</option>
                <option value="PostgreSQL (Sequelize)">PostgreSQL (Sequelize)</option>
                <option value="MySQL (Sequelize)">MySQL (Sequelize)</option>
                <option value="None">None (Standalone REST)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Terminal Window */}
        <div className="rounded-b-2xl border border-zinc-800 bg-[#0c0e14] shadow-2xl overflow-hidden">
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/90 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80 border border-rose-600/50 inline-block" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80 border border-amber-600/50 inline-block" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80 border border-emerald-600/50 inline-block" />
              <span className="ml-2 font-mono text-xs text-zinc-400">
                bash ~ {projectName}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetTerminal}
                disabled={isRunning}
                className="flex items-center gap-1 rounded-md border border-zinc-700/60 bg-zinc-800/80 px-2 py-1 text-[11px] font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                title="Reset simulation"
              >
                <RotateCcwIcon className="h-3 w-3" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={runSimulation}
                disabled={isRunning}
                className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1 text-[11px] font-medium text-white hover:bg-emerald-500 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <PlayIcon className="h-3 w-3" />
                <span>{isRunning ? "Simulating..." : "Run Scaffold"}</span>
              </button>
            </div>
          </div>

          {/* Terminal Screen Output */}
          <div className="p-5 font-mono text-xs sm:text-sm text-zinc-300 min-h-[290px] max-h-[380px] overflow-y-auto space-y-2 bg-[#090b10]">
            {logs.map((log, index) => {
              if (log.type === "command") {
                return (
                  <div key={index} className="flex items-center gap-2 text-emerald-400 font-semibold pt-1">
                    <span>{log.text}</span>
                  </div>
                );
              }
              if (log.type === "prompt") {
                return (
                  <div key={index} className="text-cyan-300 flex items-center gap-1">
                    <span>{log.text}</span>
                  </div>
                );
              }
              if (log.type === "spinner") {
                return (
                  <div key={index} className="flex items-center gap-2 text-amber-300 animate-pulse">
                    <span>{log.text}</span>
                  </div>
                );
              }
              if (log.type === "success") {
                return (
                  <div key={index} className="flex items-center gap-2 text-emerald-300">
                    <span>{log.text}</span>
                  </div>
                );
              }
              if (log.type === "banner") {
                return (
                  <div
                    key={index}
                    className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 text-zinc-200 whitespace-pre-line leading-relaxed shadow-inner"
                  >
                    {log.text}
                  </div>
                );
              }
              return (
                <div key={index} className="text-zinc-500">
                  {log.text}
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
