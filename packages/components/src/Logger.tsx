import React from 'react';
import { Box, Text } from '@ruahlabs/tui-core';

export const Logger: React.FC<{ logs: string[], height?: number }> = ({ logs, height = 10 }) => {
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="blue" height={height} padding={1}>
      <Text bold color="blue">System Logs</Text>
      <Box flexDirection="column" flexGrow={1} overflowY="hidden">
        {logs.slice(-height + 2).map((log, idx) => (
          <Text key={idx} color="gray">{log}</Text>
        ))}
      </Box>
    </Box>
  );
};
