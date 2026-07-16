#!/usr/bin/env node

import { program } from 'commander';
import { createServiceCommand } from './commands/createService.js';

program
    .name('generate')
    .description('Xpresso code generator');

program
    .command('mod <moduleName>')
    .description('Scaffold a new module (model, controller, routes)')
    .action((moduleName) => createServiceCommand(moduleName));

program.parse(process.argv);
