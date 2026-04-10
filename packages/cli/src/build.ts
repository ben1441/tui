import path from 'path';
import fs from 'fs';
import * as esbuild from 'esbuild';

export async function buildApp() {
  const cwd = process.cwd();
  const appDir = path.join(cwd, 'app');
  const tuiDir = path.join(cwd, '.tui');
  const distDir = path.join(tuiDir, 'dist');
  
  console.log('Building TUI Application...');

  const entryPoints: string[] = [];
  function scanEntries(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
         scanEntries(path.join(dir, entry.name));
      } else if (entry.isFile() && entry.name.match(/\.tsx?$/)) {
         entryPoints.push(path.join(dir, entry.name));
      }
    }
  }

  if (fs.existsSync(appDir)) { 
    scanEntries(appDir); 
  } else {
    console.error('Error: "app" directory not found.');
    process.exit(1);
  }

  // Clear previous build output
  fs.rmSync(tuiDir, { recursive: true, force: true });
  fs.mkdirSync(distDir, { recursive: true });

  // Compile with Esbuild
  await esbuild.build({
    entryPoints,
    outbase: path.join(cwd, 'app'),
    outdir: distDir,
    bundle: false,
    format: 'esm',
    jsx: 'automatic',
    platform: 'node',
  });

  // Generate Routes
  const routes: any[] = [];
  const imports: string[] = [];
  
  function scan(dir: string, base: string = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        scan(path.join(dir, entry.name), base + "/" + entry.name);
      } else if (entry.isFile() && entry.name.match(/^page\.tsx?$/)) {
        let routePath = base === '' ? '/' : base.replace(/\[([^\]]+)\]/g, ':$1');
        let rPath = routePath;
        
        let relativePath = path.relative(appDir, path.join(dir, entry.name));
        let distFile = path.join(distDir, relativePath.replace(/\.tsx?$/, '.js'));
        let rFile = distFile.replace(/\\/g, "/");

        const paramNames: string[] = [];
        const pattern = (rPath || "").replace(/\//g, "\\/").replace(/\[([^\]]+)\]/g, (match, paramName) => {
          paramNames.push(paramName);
          return "([^\\/]+)";
        });
        
        const componentName = `Component_${routes.length}`;
        imports.push(`import * as ${componentName} from "file://${rFile}";`);

        routes.push(
          "{" +
          "  regex: /^" + pattern + "$/," +
          "  paramNames: " + JSON.stringify(paramNames) + "," +
          "  Component: (" + componentName + ".default || " + componentName + ")" +
          "}"
        );
      }
    }
  }

  scan(appDir);

  const generatedRoutes = "import React from 'react';\n" +
    "import { RouterManager } from '@tui/router';\n" +
    imports.join("\n") + "\n" +
    "const routes = [\n" +
    routes.join(",\n") +
    "\n];\n" +
    "export default function App() {\n" +
    "  return React.createElement(RouterManager, { routes });\n" +
    "};\n";

  fs.writeFileSync(path.join(tuiDir, 'routes.js'), generatedRoutes);

  // Generate entrypoint for the compiled application
  const runnerContent = `#!/usr/bin/env node
import React from 'react';
import { renderApp } from '@tui/core';
import App from './routes.js';

async function main() {
  const instance = renderApp(React.createElement(App));
  await instance.waitUntilExit();
}

main().catch(console.error);
`;

  const runFilePath = path.join(tuiDir, 'index.js');
  fs.writeFileSync(runFilePath, runnerContent);
  fs.chmodSync(runFilePath, 0o755);

  console.log('Build complete! You can run it with: node .tui/index.js');
}
