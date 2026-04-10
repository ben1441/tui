import React from 'react';
import { render as inkRender, Instance as InkInstance } from 'ink';

interface RenderOptions {
  stdout?: NodeJS.WriteStream;
  stdin?: NodeJS.ReadStream;
}

export interface AppInstance {
  waitUntilExit: () => Promise<any>;
  unmount: () => void;
  clear: () => void;
  rerender: (node: React.ReactElement) => void;
}

export function renderApp(rootNode: React.ReactElement, options: RenderOptions = {}): AppInstance {
  const inkApp = inkRender(rootNode, {
    stdout: options.stdout || process.stdout,
    stdin: options.stdin || process.stdin,
    exitOnCtrlC: true,
  });

  return {
    waitUntilExit: () => inkApp.waitUntilExit(),
    unmount: () => inkApp.unmount(),
    clear: () => inkApp.clear(),
    rerender: (node: React.ReactElement) => inkApp.rerender(node),
  };
}
