import React from 'react';
import { Box, Text } from '@ruahlabs/tui-core';

export interface TableProps {
  data: Record<string, string | number>[];
  columns: string[];
}

export const Table: React.FC<TableProps> = ({ data, columns }) => {
  return (
    <Box flexDirection="column" borderStyle="single" borderColor="gray">
      {/* Header */}
      <Box borderBottom={false}>
        {columns.map((col, idx) => (
          <Box key={`col-${idx}`} width={20} paddingX={1}>
            <Text bold color="cyan">{col}</Text>
          </Box>
        ))}
      </Box>
      <Box height={1} borderStyle="single" borderTop={false} borderLeft={false} borderRight={false} borderBottom={true} borderColor="gray" />
      {/* Body */}
      {data.map((row, rowIdx) => (
        <Box key={`row-${rowIdx}`}>
          {columns.map((col, colIdx) => (
            <Box key={`cell-${rowIdx}-${colIdx}`} width={20} paddingX={1}>
              <Text>{String(row[col] ?? '')}</Text>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};
