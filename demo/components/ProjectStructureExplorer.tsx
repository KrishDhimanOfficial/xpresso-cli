"use client";

import React, { useState } from "react";
import { FolderIcon, FileCodeIcon, CopyIcon, CheckIcon, ChevronRightIcon, ChevronDownIcon, LayersIcon } from "./Icons";

interface FileNode {
  name: string;
  path: string;
  isFolder?: boolean;
  children?: FileNode[];
  tag?: string;
  summary?: string;
  code?: string;
}

const fileSystem: FileNode[] = [
  {
    name: "config",
    path: "config",
    isFolder: true,
    children: [
      {
        name: "config.js",
        path: "config/config.js",
        tag: "Environment Validator",
        summary: "Loads .env.development or .env.production dynamically with strict fail-fast validation for mandatory keys.",
        code: `import dotenv from 'dotenv'
dotenv.config({ path: \`.env.\${process.env.NODE_ENV || 'development'}\`, quiet: true })

const env = (key, def = null) => {
  const val = process.env[key]
  if (!val && !def) throw new Error(\`Missing environment variable: \${key}\`)
  return val ?? def
}

export default {
  port: Number(env('PORT', 8200)),
  token_secret: env('TOKEN_SECRET'),
  NODE_ENV: env('NODE_ENV', 'development'),
}`,
      },
      {
        name: "db.config.js",
        path: "config/db.config.js",
        tag: "Database Adapter",
        summary: "Database connection initialization for Mongoose (MongoDB) or Sequelize (PostgreSQL / MySQL) with lifecycle event listeners.",
        code: `import mongoose from 'mongoose'
import config from './config.js'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO_URI)
    console.log(\`✅ MongoDB Connected: \${conn.connection.host}\`)
  } catch (error) {
    console.error(\`❌ Database Connection Error: \${error.message}\`)
    process.exit(1)
  }
}`,
      },
    ],
  },
  {
    name: "controllers",
    path: "controllers",
    isFolder: true,
    children: [
      {
        name: "auth.controller.js",
        path: "controllers/auth.controller.js",
        tag: "Auto-Scaffolded Controller",
        summary: "Handles user signup, login, password comparison, and AES-256 token issuance wrapped in asyncHandler.",
        code: `import Auth from '../models/auth.model.js'
import { asyncHandler, ApiError, encryptToken } from '../utils/helper.utils.js'

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) throw ApiError('Email and password are required', 400)

  const user = await Auth.findOne({ email })
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError('Invalid email or password', 401)
  }

  // Issue AES-256 encrypted token with 24h TTL
  const token = encryptToken({ id: user._id, role: user.role }, 86400)
  return res.status(200).json({ success: true, token, user: { id: user._id, email } })
}, 'login')`,
      },
    ],
  },
  {
    name: "models",
    path: "models",
    isFolder: true,
    children: [
      {
        name: "auth.model.js",
        path: "models/auth.model.js",
        tag: "Schema Definition",
        summary: "Database schema configured specifically for the selected DB (Mongoose Schema or Sequelize Model).",
        code: `import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const AuthSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, default: 'user' }
}, { timestamps: true })

AuthSchema.pre('save', async function() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
})

export default mongoose.model('Auth', AuthSchema)`,
      },
    ],
  },
  {
    name: "routes",
    path: "routes",
    isFolder: true,
    children: [
      {
        name: "index.routes.js",
        path: "routes/index.routes.js",
        tag: "Central Aggregator",
        summary: "Application route registry. Automatically injected with new routes when using xpresso-cli create.",
        code: `import express from 'express'
import authRoutes from './auth.routes.js'

const router = express.Router({ caseSensitive: true })

router.use('/api/auth', authRoutes)

export default router`,
      },
    ],
  },
  {
    name: "utils",
    path: "utils",
    isFolder: true,
    children: [
      {
        name: "helper.utils.js",
        path: "utils/helper.utils.js",
        tag: "Production Security & Error Handlers",
        summary: "Includes AES-256-GCM token encryption, asyncHandler with file cleanup, date-stamped file logger, and global error middleware.",
        code: `import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

export const ApiError = (message, statusCode = 500) => {
  const error = new Error(message)
  error.statusCode = statusCode
  error.success = false
  return error
}

export const asyncHandler = (fn, name = 'Controller') => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(err => {
      console.error(\`🔥 Error in \${name}: \${err.message}\`)
      next(err)
    })
  }
}

export const encryptToken = (data, ttlSec = 86400) => {
  const iv = crypto.randomBytes(16)
  const key = crypto.createHash('sha256').update(process.env.TOKEN_SECRET || 'fallback').digest()
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const payload = JSON.stringify({ data, expiresAt: Date.now() + ttlSec * 1000 })
  const encrypted = Buffer.concat([cipher.update(payload, 'utf8'), cipher.final()])
  return [iv.toString('hex'), cipher.getAuthTag().toString('hex'), encrypted.toString('hex')].join(':')
}`,
      },
    ],
  },
  {
    name: "app.js",
    path: "app.js",
    tag: "Express Entry Point",
    summary: "Production-ready Express pipeline: CORS, Morgan, Gzip compression, Cookie Parser, static route serving, and global error handler.",
    code: `import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import compression from 'compression'
import cors from 'cors'
import { globalErrorHandler } from './utils/helper.utils.js'
import indexRoutes from './routes/index.routes.js'

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))
app.use(compression({ level: 4, threshold: 0 }))
app.use(cookieParser())

// Main router
app.use('/', indexRoutes)

// Centralized error handler
app.use(globalErrorHandler)

export default app`,
  },
  {
    name: ".env.development",
    path: ".env.development",
    tag: "Environment Variables",
    summary: "Pre-configured environment variables for local development with port, database URI, and token secret.",
    code: `PORT=8200
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/my_express_app
TOKEN_SECRET=super_secret_dev_key_xpresso_2026`,
  },
];

export default function ProjectStructureExplorer() {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    config: true,
    controllers: true,
    routes: true,
    utils: true,
  });

  const [selectedFile, setSelectedFile] = useState<FileNode>(
    fileSystem.find((f) => f.name === "app.js")!
  );

  const [copied, setCopied] = useState(false);

  const toggleFolder = (folderName: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };

  const handleCopyCode = () => {
    if (selectedFile.code) {
      navigator.clipboard.writeText(selectedFile.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="architecture" className="relative py-24 border-t border-zinc-900 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-950/30 px-3 py-1 text-xs font-medium text-teal-300 mb-3">
            <LayersIcon className="h-3.5 w-3.5 text-teal-400" />
            <span>Architecture Deep Dive</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Clean Flat-MVC Architecture
          </h2>
          <p className="mt-3 text-zinc-400 text-sm sm:text-base">
            Click any file below to inspect the actual generated code and understand why xpresso-cli makes backend development faster.
          </p>
        </div>

        {/* Tree + Inspector Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* File Tree Explorer (Left Column) */}
          <div className="lg:col-span-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-3 px-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Project Explorer
              </span>
              <span className="text-[11px] font-mono text-zinc-500">flat-mvc</span>
            </div>

            <div className="space-y-1 font-mono text-xs">
              {fileSystem.map((node) => {
                if (node.isFolder) {
                  const isOpen = !!openFolders[node.name];
                  return (
                    <div key={node.path} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => toggleFolder(node.name)}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-zinc-300 hover:bg-zinc-800/70 hover:text-white transition-all cursor-pointer text-left"
                      >
                        {isOpen ? (
                          <ChevronDownIcon className="h-3.5 w-3.5 text-zinc-500" />
                        ) : (
                          <ChevronRightIcon className="h-3.5 w-3.5 text-zinc-500" />
                        )}
                        <FolderIcon className="h-4 w-4 text-emerald-400" />
                        <span className="font-semibold text-zinc-200">{node.name}/</span>
                      </button>

                      {isOpen && node.children && (
                        <div className="ml-5 pl-2 border-l border-zinc-800/80 space-y-1">
                          {node.children.map((child) => {
                            const isSelected = selectedFile.path === child.path;
                            return (
                              <button
                                key={child.path}
                                type="button"
                                onClick={() => setSelectedFile(child)}
                                className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 transition-all cursor-pointer text-left ${
                                  isSelected
                                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                    : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <FileCodeIcon className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                                  <span className="truncate">{child.name}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                // Root-level file
                const isSelected = selectedFile.path === node.path;
                return (
                  <button
                    key={node.path}
                    type="button"
                    onClick={() => setSelectedFile(node)}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 transition-all cursor-pointer text-left ${
                      isSelected
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCodeIcon className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{node.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code & Architectural Inspector (Right Column) */}
          <div className="lg:col-span-8 rounded-2xl border border-zinc-800 bg-[#0c0e14] shadow-2xl overflow-hidden">
            {/* Inspector Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 bg-zinc-900/90 px-4 py-3">
              <div className="flex items-center gap-2">
                <FileCodeIcon className="h-4 w-4 text-emerald-400" />
                <span className="font-mono text-xs font-semibold text-white">
                  {selectedFile.path}
                </span>
                {selectedFile.tag && (
                  <span className="rounded-full border border-teal-500/30 bg-teal-950/40 px-2 py-0.5 text-[11px] font-medium text-teal-300">
                    {selectedFile.tag}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-700/70 bg-zinc-800/90 px-3 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="h-3.5 w-3.5" />
                    <span>Copy File</span>
                  </>
                )}
              </button>
            </div>

            {/* Architecture Explanation Banner */}
            {selectedFile.summary && (
              <div className="border-b border-zinc-800/80 bg-zinc-900/40 px-4 py-2.5 text-xs text-zinc-300 leading-relaxed flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">ℹ️</span>
                <span>{selectedFile.summary}</span>
              </div>
            )}

            {/* Code Body */}
            <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm text-zinc-300 bg-[#090b10] overflow-x-auto min-h-[380px]">
              <pre className="leading-relaxed">
                <code>{selectedFile.code || "// Select a file from the explorer tree"}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
