import path from 'path';
import fs from 'fs';
import * as esbuild from 'esbuild';
import chokidar from 'chokidar';
import React from 'react';
import { renderApp, AppInstance } from '@shreklabs/tui-core';

function generateRoutes(appDir: string, outDir: string, distDir: string) {
  const routes: any[] = [];
  const imports: string[] = [];
  
  function scan(dir: string, base: string = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        scan(path.join(dir, entry.name), base + "/" + entry.name);
      } else if (entry.isFile() && entry.name.match(/^page\.tsx?$/)) {
        let routePath = base === '' ? '/' : base.replace(/\[([^\]]+)\]/g, ':$1'); // Next.js to Regex converter logic simplified
        let rPath = routePath;
        
        let relativePath = path.relative(appDir, path.join(dir, entry.name));
        let distFile = path.join(distDir, relativePath.replace(/\.tsx?$/, '.js'));
        let rFile = distFile.replace(/\\/g, "/");

        const cleanPath = (rPath || "").replace(/\//g, "\\/");
        const paramNames: string[] = [];
        const pattern = (rPath || "").replace(/\//g, "\\/").replace(/\[([^\]]+)\]/g, (match, paramName) => {
          paramNames.push(paramName);
          return "([^\\/]+)";
        });
        
        const componentName = `Component_${routes.length}`;
        imports.push(`import * as ${componentName} from "file://${rFile}?t=${Date.now()}";`);

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

  if (fs.existsSync(appDir)) {
    scan(appDir);
  }

  const generatedContent = "import React from 'react';\n" +
    "import { RouterManager } from '@shreklabs/tui-router';\n" +
    imports.join("\n") + "\n" +
    "const routes = [\n" +
    routes.join(",\n") +
    "\n];\n" +
    "export default function App() {\n" +
    "  return React.createElement(RouterManager, { routes });\n" +
    "};\n";

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'routes.js'), generatedContent);
}

export async function startDev() {
  const cwd = process.cwd();
  const appDir = path.join(cwd, 'app');
  const tuiDir = path.join(cwd, '.tui');
  const distDir = path.join(tuiDir, 'dist');
  
  console.log('Starting TUI Dev Server...');

  let appInstance: AppInstance | null = null;
  
  async function reloadApp() {
    generateRoutes(appDir, tuiDir, distDir);
    
    try {
      const generatedRoutes = (await import("file://" + path.join(tuiDir, 'routes.js') + "?t=" + Date.now())).default;
      const rootElement = React.createElement(generatedRoutes);
      
      if (!appInstance) {
        appInstance = renderApp(rootElement);
      } else {
        appInstance.rerender(rootElement);
      }
    } catch (e) {
      console.error("Render Error:", e);
    }
  }

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
  if (fs.existsSync(appDir)) { scanEntries(appDir); }

  // Initial compilation via esbuild context
  const ctx = await esbuild.context({
    entryPoints,
    outbase: path.join(cwd, 'app'), // Maintain the nested directory structure based on "app"
    outdir: distDir,
    bundle: false,
    format: 'esm',
    jsx: 'automatic',  // Important for Next.js-like React 17+ transform without React import
    platform: 'node',
  });

  await ctx.rebuild();
  await ctx.watch();

  let reloadTimeout: any = null;
  chokidar.watch(path.join(cwd, 'app', '**', '*')).on('all', () => {
    if (reloadTimeout) clearTimeout(reloadTimeout);
    reloadTimeout = setTimeout(() => {
      reloadApp().catch(console.error);
    }, 150);
  });
  
  // Explicit initial render just in case watch's 'add' events fire before we bind or we want immediate render
  await reloadApp();
}
