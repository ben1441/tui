import { createContext } from 'react';

export interface RouterState {
  pathname: string;
  query: Record<string, string>;
  params: Record<string, string>;
}

export interface RouterActions {
  push: (path: string) => void;
  replace: (path: string) => void;
}

export type RouterContextValue = RouterState & RouterActions;

export const RouterContext = createContext<RouterContextValue | null>(null);
