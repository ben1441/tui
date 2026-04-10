import React from 'react';
import { Text, Box } from 'ink';

interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
}

const SPARK_CHARS = [' ', '▂', '▃', '▄', '▅', '▆', '▇', '█'];

export function Sparkline({ data, color = 'cyan', width }: SparklineProps) {
  const normData = width ? data.slice(-width) : data;
  if (!normData.length) return <Text> </Text>;
  
  const min = Math.min(...normData);
  const max = Math.max(...normData);
  const range = max - min || 1;

  const sparklineStr = normData
    .map(val => {
      const p = (val - min) / range;
      const index = Math.min(SPARK_CHARS.length - 1, Math.floor(p * SPARK_CHARS.length));
      return SPARK_CHARS[index];
    })
    .join('');

  return <Text color={color}>{sparklineStr}</Text>;
}
