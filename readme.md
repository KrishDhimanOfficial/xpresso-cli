# 🚀 xpresso-cli

[![npm version](https://img.shields.io/npm/v/xpresso-cli.svg)](https://www.npmjs.com/package/xpresso-cli)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A powerful, blazing-fast CLI tool to instantly scaffold production-ready **Node.js + Express** applications. Choose your package manager, pick your database, and get a clean flat MVC structure — all in seconds.

---

## ✨ Features

- **⚡ Instant Scaffold** — Full production-ready Express flat-MVC structure in one command.
- **🗄️ Multi-Database Support** — MongoDB (Mongoose), MySQL (Sequelize), PostgreSQL (Sequelize), or None.
- **📦 4 Package Managers** — Choose from `npm`, `yarn`, `pnpm`, or `bun`.
- **🛠️ Inline Service Generator** — `xpresso-cli create <name>` scaffolds a complete service and auto-wires it into `routes/index.routes.js`.
- **🔍 Auto DB Detection** — The `create` command reads your `package.json` dependencies to detect Mongoose or Sequelize and generate the right model template automatically.
- **🔒 Production Middleware** — CORS, gzip compression, cookie-parser, Morgan logging, and a global error handler — pre-configured.
- **🔐 Auth Service** — A complete `auth` service (controller, routes, model) is generated automatically on every scaffold.
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
- Generate an `auth` service tailored to your chosen database
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

## 🏗️ Service Generator

Once inside your project, use the `create` command to scaffold new services instantly:

```bash
xpresso-cli create <serviceName>
```

**Example:**

```bash
xpresso-cli create product
xpresso-cli create order
xpresso-cli create user
```

### What gets created

For `xpresso-cli create product`, the CLI creates:

```
controllers/
└── product.controller.js   # Controller with model import

routes/
└── product.routes.js       # Express router

models/
└── product.model.js        # DB model (Mongoose or Sequelize — auto-detected from package.json)
```

And **automatically updates `routes/index.routes.js`** with:

```js
import productRoutes from './product.routes.js'
router.use('/api/product', productRoutes)
```

No manual wiring needed.

> 💡 **Auto DB Detection** — `xpresso-cli create` inspects your `package.json` dependencies to detect whether you're using `mongoose` or `sequelize` and generates the correct model template automatically.

> ⚠️ **No `index.routes.js`?** — If the file is missing, the CLI prints the import and `router.use()` lines for you to add manually.

---

## 📂 Project Structure

```text
my-app/
├── bin/
│   └── www                      # Server startup script
├── config/
│   └── db.config.js             # Database connection (auto-configured)
├── controllers/
│   ├── auth.controller.js       # Auto-generated on scaffold
│   └── <name>.controller.js     # Generated via `xpresso-cli create <name>`
├── middleware/                  # Custom middleware
├── models/
│   ├── auth.model.js            # Auto-generated on scaffold
│   └── <name>.model.js          # Generated via `xpresso-cli create <name>`
├── routes/
│   ├── index.routes.js          # Central router (auto-updated with new routes)
│   ├── auth.routes.js           # Auto-generated on scaffold
│   └── <name>.routes.js         # Generated via `xpresso-cli create <name>`
├── public/                      # Static assets (served at /public)
├── uploads/                     # Uploaded files (served at /uploads)
├── utils/
│   ├── helper.utils.js          # Global error handler & helpers
│   └── removeFile.utils.js      # File cleanup utility
├── app.js                       # Express app entry point
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

### `xpresso-cli create <serviceName>`

Scaffold a new service inside an existing project.

```bash
xpresso-cli create user
xpresso-cli create product
xpresso-cli create order
```

Creates `controllers/<name>.controller.js`, `routes/<name>.routes.js`, and `models/<name>.model.js` — and auto-wires them into `routes/index.routes.js`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Check the [issues page](https://github.com/KrishDhimanOfficial/xpresso-cli/issues).

---

## 📄 License

Licensed under the [ISC License](LICENSE).

**Created with ❤️ by [Krish Dhiman](https://github.com/KrishDhimanOfficial)**