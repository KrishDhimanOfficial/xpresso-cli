import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

export async function createServiceCommand(serviceName, targetDir = process.cwd()) {
    if (!serviceName) {
        console.error(chalk.red('Please provide a service name. Example: create-node-app create-service auth'));
        process.exit(1);
    }

    const currentDir = targetDir;
    const packageJsonPath = path.join(currentDir, 'package.json');

    // Default to no database if not found
    let dbType = 'none';

    if (fs.existsSync(packageJsonPath)) {
        try {
            const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            const deps = pkg.dependencies || {};
            if (deps.mongoose) {
                dbType = 'mongoose';
            } else if (deps.sequelize) {
                dbType = 'sequelize';
            }
        } catch (error) {
            console.warn(chalk.yellow('Could not parse package.json. Defaulting to standard model generation.'));
        }
    } else {
        console.warn(chalk.yellow('No package.json found in current directory. Generating service without database dependencies.'));
    }

    const serviceDir = path.join(currentDir, 'modules', serviceName);

    const spinner = ora(`Generating ${serviceName} service...`).start();

    try {
        // Create directory
        fs.mkdirSync(serviceDir, { recursive: true });

        // Generate Controller
        const controllerContent = `export default {
    // Add your controller methods here
    // exampleMethod: async (req, res, next) => { ... }
}
`;
        fs.writeFileSync(path.join(serviceDir, `${serviceName}.controller.js`), controllerContent);

        // Generate Routes
        const routesContent = `import express from 'express'
import ${serviceName}Controller from './${serviceName}.controller.js'

const router = express.Router({ caseSensitive: true })

// Add your routes here
// router.get('/', ${serviceName}Controller.exampleMethod)

export default router
`;
        fs.writeFileSync(path.join(serviceDir, `${serviceName}.routes.js`), routesContent);

        // Generate Model
        let modelContent = '';
        if (dbType === 'sequelize') {
            modelContent = `import { DataTypes } from 'sequelize'
import sequelize from '../../config/db.config.js'

const ${serviceName.charAt(0).toUpperCase() + serviceName.slice(1)} = sequelize.define('${serviceName}', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
})

export default ${serviceName.charAt(0).toUpperCase() + serviceName.slice(1)}
`;
        } else {
            // Default to mongoose structure
            modelContent = `import mongoose from "mongoose";

const ${serviceName}Schema = new mongoose.Schema({
    
})

export default mongoose.model('${serviceName}', ${serviceName}Schema);
`;
        }

        fs.writeFileSync(path.join(serviceDir, `${serviceName}.model.js`), modelContent);

        // Try to update app.js automatically
        const appJsPath = path.join(currentDir, 'app.js');
        if (fs.existsSync(appJsPath)) {
            let appJsContent = fs.readFileSync(appJsPath, 'utf8');

            const importStatement = `import ${serviceName}Routes from './modules/${serviceName}/${serviceName}.routes.js'`;
            const useStatement = `app.use('/api/${serviceName}', ${serviceName}Routes)`;

            // Inject import statement after the last import
            if (!appJsContent.includes(importStatement)) {
                const lastImportIndex = appJsContent.lastIndexOf('import ');
                if (lastImportIndex !== -1) {
                    const endOfLastImport = appJsContent.indexOf('\n', lastImportIndex);
                    appJsContent = appJsContent.slice(0, endOfLastImport + 1) + importStatement + '\n' + appJsContent.slice(endOfLastImport + 1);
                } else {
                    appJsContent = importStatement + '\n' + appJsContent;
                }
            }

            // Inject app.use statement before app.get('/', or before export default
            if (!appJsContent.includes(useStatement)) {
                const appGetIndex = appJsContent.indexOf("app.get('/'");
                if (appGetIndex !== -1) {
                    appJsContent = appJsContent.slice(0, appGetIndex) + useStatement + '\n\n' + appJsContent.slice(appGetIndex);
                } else {
                    const exportIndex = appJsContent.lastIndexOf('export default app');
                    if (exportIndex !== -1) {
                        appJsContent = appJsContent.slice(0, exportIndex) + useStatement + '\n\n' + appJsContent.slice(exportIndex);
                    } else {
                        appJsContent += '\n' + useStatement + '\n';
                    }
                }
            }

            fs.writeFileSync(appJsPath, appJsContent);
            spinner.succeed(`Successfully created ${chalk.green(serviceName)} service and updated app.js`);
        } else {
            spinner.succeed(`Successfully created ${chalk.green(serviceName)} service at ./modules/${serviceName}`);
            console.log(`\nDon't forget to register your routes in ${chalk.cyan('app.js')}!`);
            console.log(`  import ${serviceName}Routes from './modules/${serviceName}/${serviceName}.routes.js'`);
            console.log(`  app.use('/api/${serviceName}', ${serviceName}Routes)\n`);
        }

    } catch (err) {
        spinner.fail(`Failed to create ${serviceName} service.`);
        console.error(err);
        process.exit(1);
    }
}