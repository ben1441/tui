import React, { useState } from 'react';
import { Box, Text } from '@shreklabs/tui-core';
import { StatusBadge, ProgressBar, Card } from '@shreklabs/tui-components';
import { Layout } from '../Layout.js';
import { usePolling } from '@shreklabs/tui-utils';

export default function StatusPage() {
  const [progress, setProgress] = useState(0);

  usePolling(() => {
    setProgress(p => {
      if (p >= 100) return 0;
      return p + 4;
    });
  }, 300);

  return (
    <Layout>
      <Box flexDirection="column" width="100%">
        <Box flexDirection="row">
          <Card title="Database & Caching" flexGrow={1}>
            <Box flexDirection="column" paddingY={1}>
              <Box marginBottom={1}><StatusBadge status="success" label="PostgreSQL (Primary)" /></Box>
              <Box marginBottom={1}><StatusBadge status="success" label="PostgreSQL (Replica)" /></Box>
              <Box marginBottom={1}><StatusBadge status="error" label="Redis Cluster" /></Box>
              <Box><StatusBadge status="loading" label="Kafka Message Queue" /></Box>
            </Box>
          </Card>
          
          <Box marginLeft={2} flexGrow={1} flexDirection="column">
            <Card title="Background Jobs">
              <Box flexDirection="column" paddingY={1}>
                <Text bold color="cyan">Data Sync Progress</Text>
                <Text color="gray">Migrating 10.4M rows...</Text>
                <Box marginTop={1}>
                  <ProgressBar percent={progress} width={30} />
                </Box>
                <Box marginTop={1} marginLeft={1}>
                  <Text dimColor>{progress}% Complete</Text>
                </Box>
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
