import React from 'react';
import { Box, Text } from '@ruahlabs/tui-core';

export const ProgressBar: React.FC<{ percent: number, width?: number }> = ({ percent, width = 40 }) => {
  const p = Math.max(0, Math.min(100, percent));
  const filledChars = Math.round((p / 100) * width);
  const emptyChars = width - filledChars;

  return (
    <Box>
      <Text color="cyan">{'█'.repeat(filledChars)}</Text>
      <Text color="gray">{'░'.repeat(emptyChars)}</Text>
      <Box marginLeft={1}>
        <Text color="cyan">{p.toFixed(0)}%</Text>
      </Box>
    </Box>
  );
};
