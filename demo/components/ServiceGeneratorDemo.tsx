"use client";

import React, { useState } from "react";
import { CpuIcon, FileCodeIcon, CopyIcon, CheckIcon, SparklesIcon, CheckCircleIcon } from "./Icons";

export default function ServiceGeneratorDemo() {
  const [serviceName, setServiceName] = useState("product");
  const [activeTab, setActiveTab] = useState<"controller" | "routes" | "model" | "indexRoutes">("indexRoutes");
  const [copiedCmd, setCopiedCmd] = useState(false);

  const cleanName = serviceName.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "") || "service";
  const capitalized = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(`xpresso-cli create ${cleanName}`);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const codeSnippets = {
    indexRoutes: `// routes/index.routes.js
import express from 'express'
import authRoutes from './auth.routes.js'
// ⚡ Auto-injected by xpresso-cli create ${cleanName}:
import ${cleanName}Routes from './${cleanName}.routes.js'

const router = express.Router({ caseSensitive: true })

router.use('/api/auth', authRoutes)
// ⚡ Auto-wired route:
router.use('/api/${cleanName}', ${cleanName}Routes)

export default router`,

    controller: `// controllers/${cleanName}.controller.js
import ${capitalized} from '../models/${cleanName}.model.js'
import { asyncHandler, ApiError } from '../utils/helper.utils.js'

// GET /api/${cleanName}
export const getAll${capitalized}s = asyncHandler(async (req, res) => {
  const data = await ${capitalized}.find().limit(50)
  return res.status(200).json({ success: true, count: data.length, data })
}, 'getAll${capitalized}s')

// POST /api/${cleanName}
export const create${capitalized} = asyncHandler(async (req, res) => {
  const item = await ${capitalized}.create(req.body)
  return res.status(201).json({ success: true, message: '${capitalized} created', data: item })
}, 'create${capitalized}')`,

    routes: `// routes/${cleanName}.routes.js
import express from 'express'
import { getAll${capitalized}s, create${capitalized} } from '../controllers/${cleanName}.controller.js'

const router = express.Router()

router.route('/')
  .get(getAll${capitalized}s)
  .post(create${capitalized})

export default router`,

    model: `// models/${cleanName}.model.js (Auto-detected Mongoose / Sequelize)
import mongoose from 'mongoose'

const ${capitalized}Schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    metadata: { type: Map, of: String }
  },
  { timestamps: true }
)

export default mongoose.model('${capitalized}', ${capitalized}Schema)`,
  };

  return (
    <section id="service-generator" className="relative py-24 border-t border-zinc-900 bg-zinc-950/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/30 px-3 py-1 text-xs font-medium text-cyan-300 mb-3">
            <CpuIcon className="h-3.5 w-3.5 text-cyan-400" />
            <span>Inline Service Generator</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Never Write Route Wiring Glue Code Again
          </h2>
          <p className="mt-3 text-zinc-400 text-sm sm:text-base">
            Type <code className="text-cyan-300 font-mono">xpresso-cli create &lt;name&gt;</code> inside any project directory to scaffold a full service and automatically inject it into your application router.
          </p>
        </div>

        {/* Interactive Service Generator Playground */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Input and Generated Files overview */}
          <div className="lg:col-span-5 space-y-6">
            {/* Input Card */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Type an Entity Name
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-3 flex items-center text-xs font-mono text-zinc-500">
                    create
                  </span>
                  <input
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder="product"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-2.5 pl-16 pr-3 font-mono text-sm text-emerald-400 placeholder-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>
              </div>

              {/* Command preview with copy */}
              <div className="mt-4 flex items-center justify-between rounded-lg border border-zinc-800/80 bg-zinc-950 p-2.5 font-mono text-xs text-zinc-300">
                <span className="text-zinc-400">
                  $ <span className="text-cyan-300">xpresso-cli create {cleanName}</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyCmd}
                  className="flex items-center gap-1 rounded bg-zinc-800 px-2 py-1 text-[11px] text-zinc-300 hover:bg-zinc-700 transition-all cursor-pointer"
                  title="Copy command"
                >
                  {copiedCmd ? <CheckIcon className="h-3 w-3 text-emerald-400" /> : <CopyIcon className="h-3 w-3" />}
                  <span>{copiedCmd ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
                <SparklesIcon className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>
                  Quick suggestions:{" "}
                  {["order", "user", "payment", "invoice"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setServiceName(s)}
                      className="text-cyan-400 hover:underline mx-1 cursor-pointer font-mono"
                    >
                      {s}
                    </button>
                  ))}
                </span>
              </div>
            </div>

            {/* Generated Files List */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl">
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">
                Scaffolded Service Files
              </h4>
              <div className="space-y-2.5">
                <div
                  onClick={() => setActiveTab("controller")}
                  className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all ${
                    activeTab === "controller"
                      ? "border-cyan-500/40 bg-cyan-950/20 text-white"
                      : "border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5 font-mono text-xs">
                    <FileCodeIcon className="h-4 w-4 text-cyan-400" />
                    <span>controllers/{cleanName}.controller.js</span>
                  </div>
                  <span className="text-[10px] rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-400 font-mono">
                    CRUD methods
                  </span>
                </div>

                <div
                  onClick={() => setActiveTab("routes")}
                  className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all ${
                    activeTab === "routes"
                      ? "border-cyan-500/40 bg-cyan-950/20 text-white"
                      : "border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5 font-mono text-xs">
                    <FileCodeIcon className="h-4 w-4 text-cyan-400" />
                    <span>routes/{cleanName}.routes.js</span>
                  </div>
                  <span className="text-[10px] rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-400 font-mono">
                    Endpoints
                  </span>
                </div>

                <div
                  onClick={() => setActiveTab("model")}
                  className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all ${
                    activeTab === "model"
                      ? "border-cyan-500/40 bg-cyan-950/20 text-white"
                      : "border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5 font-mono text-xs">
                    <FileCodeIcon className="h-4 w-4 text-cyan-400" />
                    <span>models/{cleanName}.model.js</span>
                  </div>
                  <span className="text-[10px] rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-400 font-mono">
                    Schema
                  </span>
                </div>

                <div
                  onClick={() => setActiveTab("indexRoutes")}
                  className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all ${
                    activeTab === "indexRoutes"
                      ? "border-emerald-500/40 bg-emerald-950/20 text-white"
                      : "border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5 font-mono text-xs">
                    <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
                    <span>routes/index.routes.js</span>
                  </div>
                  <span className="text-[10px] rounded bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 text-emerald-400 font-mono font-medium">
                    ⚡ Auto-Wired
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Code Preview */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-zinc-800 bg-[#0c0e14] shadow-2xl overflow-hidden">
              {/* Tab selector bar */}
              <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/90 px-4 py-2.5">
                <div className="flex items-center gap-2 font-mono text-xs overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab("indexRoutes")}
                    className={`rounded-md px-2.5 py-1 transition-all cursor-pointer ${
                      activeTab === "indexRoutes"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    index.routes.js (Patched)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("controller")}
                    className={`rounded-md px-2.5 py-1 transition-all cursor-pointer ${
                      activeTab === "controller"
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {cleanName}.controller.js
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("routes")}
                    className={`rounded-md px-2.5 py-1 transition-all cursor-pointer ${
                      activeTab === "routes"
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {cleanName}.routes.js
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("model")}
                    className={`rounded-md px-2.5 py-1 transition-all cursor-pointer ${
                      activeTab === "model"
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {cleanName}.model.js
                  </button>
                </div>
              </div>

              {/* Code display */}
              <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm text-zinc-300 bg-[#090b10] overflow-x-auto min-h-[380px]">
                <pre className="leading-relaxed">
                  <code>{codeSnippets[activeTab]}</code>
                </pre>
              </div>

              {/* Explanatory badge footer */}
              <div className="border-t border-zinc-800/80 bg-zinc-950/80 px-4 py-3 flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <SparklesIcon className="h-3.5 w-3.5 text-cyan-400" />
                  Auto DB detection detects Mongoose or Sequelize automatically
                </span>
                <span className="font-mono text-zinc-500">Zero manual import needed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
