# @apexkrrish/create-node-app

A powerful and fast CLI tool to scaffold production-ready Node.js applications with built-in database configurations and modular service generation.

## Features

- Scaffolds a complete Express.js server structure.
- Automatic database setup (MongoDB/Mongoose or PostgreSQL/Sequelize).
- Integrated auto-generator for new service modules (Controllers, Models, Routes).
- Pre-configured `app.js` with best practices (CORS, compression, error handlers).

## Installation & Usage

You don't need to install this globally (though you can if you want). The easiest way to use it is with `npx`.

### 1. Create a New Application

To create a brand new Node.js app, simply run:

```bash
npx @apexkrrish/create-node-app my-app
```
*(If you leave out the `my-app` name, the CLI will ask you for it!)*

The CLI will prompt you to choose:
- Your preferred package manager (`npm`, `yarn`, `pnpm`).
- Your preferred database (`MongoDB`, `PostgreSQL`, or `None`).

It will then automatically scaffold your project, configure the database connection, generate an initial `auth` service tailored to your selected database, and install dependencies!

### 2. Run Your Application

```bash
cd my-app
npm run dev
```

---

## Code Generator: Create Services

Once your application is created, this tool comes with an amazing built-in code generator that saves you from writing boilerplate.

To generate a new service module (for example, a `user` service), navigate into your project folder and run:

```bash
npx create-service user
```

*(If you installed the CLI globally via `npm install -g @apexkrrish/create-node-app`, you can just type `create-service user`)*

### What it does:
1. It creates `services/user/controller/user.controller.js`
2. It creates `services/user/routes/user.routes.js`
3. It detects the database you chose during setup (Mongoose or Sequelize) and generates the correct `services/user/model/user.model.js` structure automatically!
4. **It automatically updates your `app.js` file** to import and register your new routes!

---

## Folder Structure Generated

```
my-app/
├── bin/
│   └── www
├── config/
│   └── db.config.js       # Database connection
├── public/
├── services/
│   ├── auth/              # Automatically generated on init
│   │   ├── controller/
│   │   ├── model/
│   │   └── routes/
│   └── <your-service>/    # Generated via 'create-service'
├── utils/
│   └── helper.utils.js
├── app.js                 # Express configuration (auto-updated)
└── package.json
```

## License

ISC License.
