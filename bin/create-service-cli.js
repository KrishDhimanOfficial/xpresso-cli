#!/usr/bin/env node

import { program } from 'commander';
import { createServiceCommand } from './commands/createService.js';

program
    .name('create-service')
    .description('Scaffold a new service (model, controller, routes)')
    .argument('<serviceName>', 'Name of the service to create')
    .action(createServiceCommand);

program.parse(process.argv);
