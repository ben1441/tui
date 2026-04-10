import React from 'react';
import { Box, Text } from 'ink';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
  flexGrow?: number;
  flexShrink?: number;
}

export function Card({ title, children, width, height, flexGrow, flexShrink }: CardProps) {
  return (
    <Box 
      flexDirection="column" 
      borderStyle="round" 
      borderColor="green" 
      paddingX={2} 
      paddingY={1} 
      width={width}
      height={height}
      flexGrow={flexGrow}
      flexShrink={flexShrink}
    >
      {title && (
        <Box borderBottom={false} marginBottom={1}>
          <Text bold color="cyan">{title}</Text>
        </Box>
      )}
      <Box flexDirection="column" flexGrow={1}>
        {children}
      </Box>
    </Box>
  );
}
