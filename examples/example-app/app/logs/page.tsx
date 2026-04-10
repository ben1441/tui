import React, { useState } from 'react';
import { Box } from '@ruahlabs/tui-core';
import { Logger, Card } from '@ruahlabs/tui-components';
import { Layout } from '../Layout.js';
import { usePolling } from '@ruahlabs/tui-utils';

export default function LogsPage() {
  const [logs, setLogs] = useState<string[]>([
    '\x1B[36m[Info]\x1B[0m Server initialized on port 3000',
    '\x1B[33m[Warn]\x1B[0m Redis connection slow (143ms)'
  ]);

  usePolling(() => {
    setLogs(prev => {
      const isError = Math.random() > 0.8;
      const severity = isError ? '\x1B[31m[Error]\x1B[0m' : '\x1B[36m[Info]\x1B[0m';
      const messages = ['Incoming request /api/v1/users', 'Database query executed', 'Cache hit for user:123', 'Unhandled exception in background worker'];
      const msg = messages[Math.floor(Math.random() * messages.length)];
      
      const newLogs = [...prev, `${severity} ${msg} at ${new Date().toLocaleTimeString()}`];
      return newLogs.slice(-20); // Keep last 20
    });
  }, 800);

  return (
    <Layout>
      <Box flexDirection="column" width="100%">
        <Card title="Live Server Logs" height={16}>
          <Logger logs={logs} height={14} />
        </Card>
      </Box>
    </Layout>
  );
}
