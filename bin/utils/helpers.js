import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { execSync } from 'child_process';
import ora from 'ora';
import inquirer from 'inquirer';

export async function promptUser(projectDirectory) {
    let targetDir = projectDirectory;

    if (!targetDir) {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'projectDirectory',
                message: 'What is your project named?',
                default: 'my-app'
            }
        ]);
        targetDir = answers.projectDirectory;
    }

    const { packageManager, database } = await inquirer.prompt([
        {
            type: 'list',
            name: 'packageManager',
            message: 'Which package manager would you like to use?',
            choices: ['npm', 'yarn', 'pnpm'],
            default: 'npm'
        },
        {
            type: 'list',
            name: 'database',
            message: 'Which database would you like to use?',
            choices: ['MongoDB (Mongoose)', 'PostgreSQL (Sequelize)', 'None'],
            default: 'MongoDB (Mongoose)'
        }
    ]);

    return { targetDir, packageManager, database };
}

export function copyTemplateFiles(templateDir, targetPath) {
    const spinner = ora('Copying template files...').start();

    if (fs.existsSync(targetPath)) {
        spinner.fail(`Directory ${path.basename(targetPath)} already exists.`);
        process.exit(1);
    }

    fs.mkdirSync(targetPath, { recursive: true });

    const copyRecursiveSync = (src, dest) => {
        const exists = fs.existsSync(src);
        const stats = exists && fs.statSync(src);
        if (exists && stats.isDirectory()) {
            if (!fs.existsSync(dest)) fs.mkdirSync(dest);
            fs.readdirSync(src).forEach((child) => {
                if (child === 'node_modules') return;
                copyRecursiveSync(path.join(src, child), path.join(dest, child));
            });
        } else {
            fs.copyFileSync(src, dest);
        }
    };

    try {
        copyRecursiveSync(templateDir, targetPath);
        spinner.succeed('Template copied successfully.');
    } catch (err) {
        spinner.fail('Failed to copy template.');
        console.error(err);
        process.exit(1);
    }
}

export function installDependencies(targetPath, packageManager) {
    const installSpinner = ora(`Installing dependencies using ${packageManager}...`).start();
    try {
        execSync(`${packageManager} install`, { cwd: targetPath, stdio: 'pipe' });
        installSpinner.succeed('Dependencies installed successfully.');
    } catch (err) {
        installSpinner.fail('Failed to install dependencies.');
        console.error(err);
    }
}

export function showSuccessMessage(targetDir, targetPath, packageManager) {
    console.log(`\n${chalk.green('Success!')} Created ${path.basename(targetPath)} at ${targetPath}`);
    console.log('\nInside that directory, you can run several commands:\n');
    console.log(`  ${chalk.cyan(`${packageManager} run dev`)}`);
    console.log('    Starts the development server with nodemon.\n');
    console.log('We suggest that you begin by typing:\n');
    console.log(`  ${chalk.cyan('cd')} ${targetDir}`);
    console.log(`  ${chalk.cyan(`${packageManager} run dev`)}\n`);
}
