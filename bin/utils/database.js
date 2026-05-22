import fs from 'fs';
import path from 'path';

export function configureDatabase(targetPath, database) {
    const packageJsonPath = path.join(targetPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) return;

    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    pkg.name = path.basename(targetPath);

    const dbConfigPath = path.join(targetPath, 'config', 'db.config.js');
    const targetConfigDir = path.dirname(dbConfigPath);
    if (!fs.existsSync(targetConfigDir)) {
        fs.mkdirSync(targetConfigDir, { recursive: true });
    }

    if (database === 'MongoDB (Mongoose)') {
        pkg.dependencies = pkg.dependencies || {};
        pkg.dependencies.mongoose = '^8.0.0';

        const mongooseContent = `import mongoose from "mongoose"

const options = {
    serverSelectionTimeoutMS: 10000,
    dbName: '',
}

const connectDB = async () => {
    try {
        await mongoose.connect('', options)
        console.log(\`✅ MongoDB connected!\`)
    } catch (error) {
        console.error(\`❌ MongoDB connection error: \${error.message}\`)
        process.exit(1)
    }
}

export default connectDB`;
        fs.writeFileSync(dbConfigPath, mongooseContent);

    } else if (database === 'PostgreSQL (Sequelize)') {
        pkg.dependencies = pkg.dependencies || {};
        pkg.dependencies.sequelize = '^6.35.0';
        pkg.dependencies.pg = '^8.11.3';
        pkg.dependencies['pg-hstore'] = '^2.3.4';

        const sequelizeContent = `import { Sequelize } from "sequelize"

export const sequelize = new Sequelize(
    '',          // DB name
    '',         // User
    '',      // Password
    {
        host: '',
        dialect: 'postgres',
        logging: false,
        port: ''
    }
) 

// Test connection
// (async () => {
//     try {
//         await sequelize.authenticate();
//         console.log("PostgreSQL connected with Sequelize");
//     } catch (err) {
//         console.error("Error:", err.message);
//     }
// })()

export default sequelize
`;
        fs.writeFileSync(dbConfigPath, sequelizeContent);

    } else {
        fs.writeFileSync(dbConfigPath, '// No database configured\n');
    }

    // Save updated package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
}
