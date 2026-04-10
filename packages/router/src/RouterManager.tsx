import React, { useState, useMemo } from 'react';
import { RouterContext } from './context';
import { Box, Text } from '@shreklabs/tui-core';

export interface RouteDefinition {
  regex: RegExp;
  paramNames: string[];
  Component: React.ComponentType<any>;
}

export interface RouterManagerProps {
  initialPath?: string;
  routes: RouteDefinition[];
}

export const RouterManager: React.FC<RouterManagerProps> = ({ 
  initialPath = '/', 
  routes 
}) => {
  const [pathname, setPathname] = useState(initialPath);

  const contextValue = useMemo(() => {
    return {
      pathname,
      query: {},
      params: {}, // Will be populated when matching
      push: (path: string) => {
        setPathname(path);
      },
      replace: (path: string) => {
        setPathname(path);
      }
    };
  }, [pathname]);

  // Match current route
  let matchedParams: Record<string, string> = {};
  let MatchedComponent: React.ComponentType<any> | null = null;

  for (const route of routes) {
    const match = pathname.match(route.regex);
    if (match) {
      MatchedComponent = route.Component;
      matchedParams = route.paramNames.reduce((acc, name, index) => {
        acc[name] = match[index + 1];
        return acc;
      }, {} as Record<string, string>);
      break;
    }
  }

  // Update context with matched params
  contextValue.params = matchedParams;

  return (
    <RouterContext.Provider value={contextValue}>
      {MatchedComponent ? <MatchedComponent /> : (
        <Box>
          <Text color="red">404 - Not Found: {pathname}</Text>
        </Box>
      )}
    </RouterContext.Provider>
  );
};
