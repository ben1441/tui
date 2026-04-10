import React from 'react';
import { Box, Text } from '@tui/core';

export type StatusType = 'success' | 'error' | 'loading' | 'info';

export const StatusBadge: React.FC<{ status: StatusType, label?: string }> = ({ status, label }) => {
  const config = {
    success: { color: 'green', text: ' OK ', bg: 'bgGreen' },
    error: { color: 'red', text: ' ERR ', bg: 'bgRed' },
    loading: { color: 'yellow', text: ' WAIT ', bg: 'bgYellow' },
    info: { color: 'blue', text: ' INFO ', bg: 'bgBlue' },
  } as const;

  const current = config[status];

  return (
    <Box>
      <Text color="black" backgroundColor={current.color} bold>
        {current.text}
      </Text>
      {label && (
        <Box marginLeft={1}>
          <Text color={current.color}>{label}</Text>
        </Box>
      )}
    </Box>
  );
};
