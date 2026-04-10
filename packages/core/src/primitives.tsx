import React from 'react';
import { Text as InkText, Box as InkBox } from 'ink';

export const Text: React.FC<React.ComponentProps<typeof InkText>> = (props) => {
  return <InkText {...props} />;
};

export const Box: React.FC<React.ComponentProps<typeof InkBox>> = (props) => {
  return <InkBox {...props} />;
};

export const View: React.FC<React.ComponentProps<typeof InkBox>> = Box; // Alias
