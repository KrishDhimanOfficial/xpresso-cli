import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TerminalDemo from "@/components/TerminalDemo";
import Features from "@/components/Features";
import ServiceGeneratorDemo from "@/components/ServiceGeneratorDemo";
import ProjectStructureExplorer from "@/components/ProjectStructureExplorer";
import CliReference from "@/components/CliReference";
import Footer from "@/components/Footer";
import { GithubIcon, SparklesIcon } from "@/components/Icons";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#07090e] text-zinc-100">
      {/* Top Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section with Quick Install */}
        <Hero />

        {/* 2. Interactive Terminal Playground */}
        <TerminalDemo />

        {/* 3. Core Features Grid */}
        <Features />

        {/* 4. Live Service Generator Demo */}
        <ServiceGeneratorDemo />

        {/* 5. Project Architecture & File Tree Explorer */}
        <ProjectStructureExplorer />

        {/* 6. CLI Command Reference */}
        <CliReference />

        {/* 7. Bottom Call-To-Action Banner */}
        <section className="relative overflow-hidden py-20 border-t border-zinc-900 bg-gradient-to-b from-zinc-950 to-[#07090e]">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[280px] w-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-300 mb-6">
              <SparklesIcon className="h-3.5 w-3.5 text-emerald-400" />
              <span>Get Started in Seconds</span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Ready to Build Your Next Express API?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-zinc-400 text-sm sm:text-base leading-relaxed">
              No manual directory setups, no repetitive route wiring, and no boilerplate fatigue. Run one command and start writing your business logic immediately.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-900/90 px-4 py-2.5 font-mono text-sm text-emerald-400 shadow-inner">
                <span className="text-zinc-500 mr-2 select-none">$</span>
                <span className="select-all">npx xpresso-cli my-app</span>
              </div>

              <a
                href="https://github.com/KrishDhimanOfficial/xpresso-cli"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2.5 font-medium text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500 transition-all cursor-pointer text-sm"
              >
                <GithubIcon className="h-4 w-4" />
                <span>Star on GitHub</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
