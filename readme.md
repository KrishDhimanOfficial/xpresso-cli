# 🚀 create-express-app

[![npm version](https://img.shields.io/npm/v/create-express-app.svg)](https://www.npmjs.com/package/create-express-app)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A powerful, incredibly fast CLI tool to instantly scaffold production-ready Node.js Express applications. It comes packed with built-in database configurations and an intuitive modular service generator, saving you hours of boilerplate setup.

---

## ✨ Features

- **⚡ Instant Setup:** Scaffolds a complete, production-ready Express.js MVC/Modular server structure in seconds.
- **🗄️ Database Ready:** Automatic, hassle-free database setup for **MongoDB (Mongoose)** or **PostgreSQL (Sequelize)**.
- **🛠️ Service Generator:** Built-in CLI command to automatically generate new service modules (Controllers, Models, Routes) instantly.
- **🔒 Best Practices Built-in:** Pre-configured `app.js` with CORS, compression, and global error handlers.
- **📦 Package Manager Choice:** Support for `npm`, `yarn`, and `pnpm`.

---

## 📖 Step-by-Step Guide

### Step 1: Scaffold a New Application

You don't need to install anything globally. You can create a new application instantly using `npx`.

```bash
npx create-express-app my-app
```
*(If you run the command without a folder name, the CLI will interactively ask you for it!)*

### Step 2: Configure Your Project

The interactive CLI will prompt you to make a few quick decisions to tailor your app:

1. **Package Manager:** Choose between `npm`, `yarn`, or `pnpm`.
2. **Database:** Select your preferred database:
   - `MongoDB` (uses Mongoose)
   - `PostgreSQL` (uses Sequelize)
   - `None` (if you want to set it up yourself later)

Once selected, the CLI will automatically:
- Generate the folder structure.
- Configure your database connection file.
- Generate an initial `auth` service tailored to your database choice.
- Install all necessary dependencies automatically!

### Step 3: Run Your Application

Navigate into your newly created project and start the development server:

```bash
cd my-app
npm start
```
*(If you selected yarn or pnpm, use `yarn start` or `pnpm start` respectively).*

You now have a fully functional Node.js server running! 🎉

---

## 🏗️ Generating New Services (The Magic)

Once your application is created, `create-express-app` provides an amazing built-in code generator that saves you from writing repetitive boilerplate for new features.

To generate a new service (e.g., for `user` management), navigate into your project folder and run:

```bash
npx create-service user
```
*(If you installed the CLI globally, you can simply type `create-service user`)*

### What happens behind the scenes?
When you run `create-service user`, the CLI automatically:
1. Creates a Controller (`services/user/controller/user.controller.js`).
2. Creates Routes (`services/user/routes/user.routes.js`).
3. Creates a Model (`services/user/model/user.model.js`) specifically tailored to the database you selected during initial setup!
4. **Auto-wires everything:** It automatically updates your main `app.js` file to import and register your new `user` routes. You don't have to touch a thing!

---

## 📂 Folder Structure

Here is the clean, modular structure generated for your app:

```text
my-app/
├── bin/
│   └── www                    # Server startup script
├── config/
│   └── db.config.js           # Database connection setup
├── public/                    # Static files
├── services/
│   ├── auth/                  # Automatically generated on init
│   │   ├── controller/
│   │   ├── model/
│   │   └── routes/
│   └── <your-service>/        # Automatically generated via 'create-service'
├── utils/
│   └── helper.utils.js        # Helper functions and utilities
├── app.js                     # Express app configuration (auto-updated with new routes)
└── package.json               # Project dependencies and scripts
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are always welcome! Feel free to check the [issues page](https://github.com/KrishDhimanOfficial/create_node_app/issues).

---

## 📄 License

This project is [ISC](https://opensource.org/licenses/ISC) licensed. 

**Created with ❤️ by [Krish Dhiman](https://github.com/KrishDhimanOfficial)**