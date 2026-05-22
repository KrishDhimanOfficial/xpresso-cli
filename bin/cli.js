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
    .command('create-service <serviceName>')
    .alias('create')
    .description('Scaffold a new service (model, controller, routes)')
    .action(createServiceCommand);

program.parse(process.argv);