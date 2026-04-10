import { useContext } from 'react';
import { RouterContext, RouterContextValue } from './context';

export function useRouter(): RouterContextValue {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterManager');
  }
  return context;
}
