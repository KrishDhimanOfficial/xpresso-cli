import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { promptUser, copyTemplateFiles, installDependencies, showSuccessMessage } from '../utils/helpers.js';
import { configureDatabase } from '../utils/database.js';
import { createServiceCommand } from './createService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initCommand(projectDirectory) {
    // 1. Prompt User
    const { targetDir, packageManager, database } = await promptUser(projectDirectory);
    const targetPath = path.resolve(process.cwd(), targetDir);
    const templateDir = path.join(__dirname, '..', '..', 'template');

    console.log(`\nCreating a new Node.js app in ${chalk.green(targetPath)}\n`);

    // 2. Copy Template Files
    copyTemplateFiles(templateDir, targetPath);

    // 3. Configure Database
    configureDatabase(targetPath, database);

    // 4. Dynamically generate the 'auth' service so it uses the correct DB model
    await createServiceCommand('auth', targetPath);

    // 5. Install Dependencies
    installDependencies(targetPath, packageManager);

    // 6. Success Message
    showSuccessMessage(targetDir, targetPath, packageManager);
}
