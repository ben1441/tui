import React from 'react';
import { Text, Box } from 'ink';
import { Sparkline } from './Sparkline';

interface StatProps {
  label: string;
  value: string;
  trend?: number;
  trendMode?: 'higher-is-better' | 'lower-is-better';
  data?: number[];
}

export function Stat({ label, value, trend, trendMode = 'higher-is-better', data }: StatProps) {
  const isPositive = trend && trend > 0;
  const isNeutral = !trend;
  
  let trendColor = 'gray';
  if (!isNeutral) {
    if (trendMode === 'higher-is-better') {
      trendColor = isPositive ? 'green' : 'red';
    } else {
      trendColor = isPositive ? 'red' : 'green';
    }
  }

  const indicator = isPositive ? '▲' : (isNeutral ? '−' : '▼');

  return (
    <Box marginX={1} flexDirection="column" borderStyle="round" borderColor="gray" paddingX={2} paddingY={1} width={28}>
      <Text color="gray">{label}</Text>
      <Box justifyContent="space-between" alignItems="center">
        <Text bold>{value}</Text>
        {trend !== undefined && (
          <Text color={trendColor}>
            {indicator} {Math.abs(trend)}%
          </Text>
        )}
      </Box>
      {data && (
        <Box marginTop={1}>
          <Sparkline data={data} width={22} color={trendColor} />
        </Box>
      )}
    </Box>
  );
}
