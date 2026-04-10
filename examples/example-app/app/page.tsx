import React, { useState } from 'react';
import { Box, Text } from '@ruahlabs/tui-core';
import { Table, Stat, Card } from '@ruahlabs/tui-components';
import { usePolling } from '@ruahlabs/tui-utils';
import { Layout } from './Layout.js';

const mockData = [
  { id: 1, user: 'alice@dev', role: 'admin', status: 'active' },
  { id: 2, user: 'bob@dev', role: 'user', status: 'banned' },
  { id: 3, user: 'charlie@dev', role: 'editor', status: 'active' },
  { id: 4, user: 'diana@dev', role: 'user', status: 'active' },
];

export default function DashboardPage() {
  const [cpuData, setCpuData] = useState([20, 30, 25, 40, 50, 45, 60, 55, 70, 65, 80, 85, 90]);
  const [memData, setMemData] = useState([40, 42, 45, 45, 48, 50, 49, 52, 51, 55, 60, 62, 60]);
  
  usePolling(() => {
    setCpuData(prev => [...prev.slice(1), Math.max(10, Math.min(100, prev[prev.length - 1] + (Math.random() * 20 - 10)))]);
    setMemData(prev => [...prev.slice(1), Math.max(20, Math.min(100, prev[prev.length - 1] + (Math.random() * 10 - 5)))]);
  }, 1000);

  const currentCpu = Math.round(cpuData[cpuData.length - 1]);
  const currentMem = Math.round(memData[memData.length - 1]);

  return (
    <Layout>
      <Box flexDirection="column" width="100%">
        <Card title="System Performance">
          <Box flexDirection="row">
            <Stat 
              label="CPU Usage" 
              value={`${currentCpu}%`} 
              trend={currentCpu - Math.round(cpuData[cpuData.length - 2])}
              trendMode="lower-is-better"
              data={cpuData}
            />
            <Stat 
              label="Memory" 
              value={`${currentMem}%`} 
              trend={currentMem - Math.round(memData[memData.length - 2])}
              trendMode="lower-is-better"
              data={memData}
            />
            <Stat 
              label="Active Connections" 
              value="1,204" 
              trend={12}
              trendMode="higher-is-better"
              data={[1000, 1050, 1100, 1150, 1204, 1180, 1204]}
            />
          </Box>
        </Card>

        <Box marginTop={1}>
          <Card title="Traffic Overview">
            <Table data={mockData} columns={['id', 'user', 'role', 'status']} />
          </Card>
        </Box>
      </Box>
    </Layout>
  );
}
