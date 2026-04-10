#!/usr/bin/env node
import { startDev } from './dev';

import { buildApp } from './build.js';

const args = process.argv.slice(2);
const command = args[0];

if (command === 'dev') {
  startDev().catch(err => {
    console.error("Dev server crashed:", err);
    process.exit(1);
  });
} else if (command === 'build') {
  buildApp().catch(err => {
    console.error("Build failed:", err);
    process.exit(1);
  });
} else {
  console.log('Commands: dev, build');
}
