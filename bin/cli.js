#!/usr/bin/env node

import { program } from 'commander';
import { initCommand } from './commands/init.js';
import { createServiceCommand } from './commands/createService.js';

// ==========================================
// CLI Application
// ==========================================

program
    .name('create-node-app')
    .description('Scaffold a new Node.js application');

program
    .command('init [project-directory]', { isDefault: true })
    .description('Initialize a new Node.js project (Default command)')
    .action(initCommand);

program
    .command('generate mod <moduleName>')
    .alias('gen')
    .description('Scaffold a new module (model, controller, routes)')
    .action((moduleName) => createServiceCommand(moduleName));

program.parse(process.argv);