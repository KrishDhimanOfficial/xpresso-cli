# 🚀 xpresso-cli

[![npm version](https://img.shields.io/npm/v/xpresso-cli.svg)](https://www.npmjs.com/package/xpresso-cli)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A powerful, blazing-fast CLI tool to instantly scaffold production-ready **Node.js + Express** applications. Choose your package manager, pick your database, and get a clean modular structure — all in seconds.

---

## ✨ Features

- **⚡ Instant Scaffold** — Full production-ready Express MVC structure in one command.
- **🗄️ Multi-Database Support** — MongoDB (Mongoose), MySQL (Sequelize), PostgreSQL (Sequelize), or None.
- **📦 4 Package Managers** — Choose from `npm`, `yarn`, `pnpm`, or `bun`.
- **🛠️ Module Generator** — `generate mod <name>` scaffolds a complete module and auto-wires it into `app.js`.
- **🔒 Production Middleware** — CORS, gzip compression, cookie-parser, Morgan logging, and a global error handler — pre-configured.
- **🔐 Auth Module** — A complete `auth` module (controller, routes, model) is generated automatically on every scaffold.
- **📦 Native ESM** — `type: "module"` from day one. No Babel, no transpilation.
- **✅ Smart Install Check** — If your chosen package manager isn't installed, the CLI warns you gracefully and skips install instead of crashing.

---

## 📖 Quick Start

### Option A — Use without installing (recommended)

```bash
npx xpresso-cli my-app
```

### Option B — Install globally

```bash
npm install -g xpresso-cli
```

Then run anywhere:

```bash
xpresso-cli my-app
```

> 💡 Running the command without a folder name will interactively prompt you for one.

---

## ⚙️ Interactive Setup

The CLI will ask you two questions during scaffold:

### 1. Package Manager

```
? Which package manager would you like to use?
  ❯ npm
    yarn
    pnpm
    bun
```

### 2. Database

```
? Which database would you like to use?
  ❯ MongoDB (Mongoose)
    PostgreSQL (Sequelize)
    MySQL (Sequelize)
    None
```

Once confirmed, the CLI will automatically:
- Copy the Express template into your project folder
- Configure the database connection file
- Generate an `auth` module tailored to your chosen database
- Install all dependencies using your chosen package manager

> ⚠️ **Note:** If you selected `bun` or another package manager that isn't installed on your machine, the CLI will warn you with the install URL and skip the install step — the scaffold still completes successfully. Just run `<pm> install` manually afterward.

---

## 🚀 Running Your App

```bash
cd my-app
npm run dev     # or: yarn dev / pnpm dev / bun run dev
```

Your server starts on the configured port. Visit `http://localhost:<port>` to see the **live welcome page**.

---

## 🏗️ Module Generator

Once inside your project, use the `generate` binary to scaffold new modules instantly:

```bash
generate mod <moduleName>
```

**Example:**

```bash
generate mod product
generate mod order
generate mod user
```

### What gets created

For `generate mod product`, the CLI creates:

```
modules/
└── product/
    ├── product.controller.js   # Controller with model import
    ├── product.routes.js       # Express router
    └── product.model.js        # DB model (Mongoose or Sequelize schema)
```

And **automatically updates `app.js`** with:

```js
import productRoutes from './modules/product/product.routes.js'
app.use('/api/product', productRoutes)
```

No manual wiring needed.

---

## 📂 Project Structure

```text
my-app/
├── bin/
│   └── www                      # Server startup script
├── config/
│   └── db.config.js             # Database connection (auto-configured)
├── middleware/                  # Custom middleware
├── modules/
│   ├── auth/                    # Auto-generated on scaffold
│   │   ├── auth.controller.js
│   │   ├── auth.routes.js
│   │   └── auth.model.js
│   └── <your-module>/           # Generated via `generate mod <name>`
│       ├── <name>.controller.js
│       ├── <name>.routes.js
│       └── <name>.model.js
├── public/                      # Static assets (served at /public)
├── uploads/                     # Uploaded files (served at /uploads)
├── utils/
│   ├── helper.utils.js          # Global error handler & helpers
│   └── removeFile.utils.js      # File cleanup utility
├── app.js                       # Express app (auto-updated with new routes)
└── package.json
```

---

## 🧰 CLI Reference

### `xpresso-cli [project-directory]`

Scaffold a new Express application.

```bash
xpresso-cli my-app
# or interactively:
xpresso-cli
```

### `generate mod <moduleName>`

Scaffold a new module inside an existing project.

```bash
generate mod user
generate mod product
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Check the [issues page](https://github.com/KrishDhimanOfficial/xpresso-cli/issues).

---

## 📄 License

Licensed under the [ISC License](LICENSE).

**Created with ❤️ by [Krish Dhiman](https://github.com/KrishDhimanOfficial)**