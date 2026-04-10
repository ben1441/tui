import React, { useState } from 'react';
import { Box, Text } from '@shreklabs/tui-core';
import { useRouter } from '@shreklabs/tui-router';
import { useInput } from 'ink';

const tabs = [
  { label: 'Dashboard', path: '/' },
  { label: 'Logs', path: '/logs' },
  { label: 'Status', path: '/status' },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(tabs.findIndex(t => t.path === router.pathname) || 0);

  useInput((input, key) => {
    if (key.upArrow) {
      const nextIndex = (activeTab - 1 + tabs.length) % tabs.length;
      setActiveTab(nextIndex);
      router.push(tabs[nextIndex].path);
    }
    if (key.downArrow) {
      const nextIndex = (activeTab + 1) % tabs.length;
      setActiveTab(nextIndex);
      router.push(tabs[nextIndex].path);
    }
  });

  return (
    <Box flexDirection="column" padding={1} width="100%" minHeight={20}>
      {/* Header */}
      <Box 
        borderStyle="round" 
        borderColor="blue" 
        paddingX={2} 
        marginBottom={1} 
        justifyContent="space-between"
      >
        <Text bold color="blue">{"⚡ Vercel / TUI System Monitor"}</Text>
        <Text color="gray">{"v1.0.0-beta"}</Text>
      </Box>

      {/* Main Layout Area */}
      <Box flexDirection="row" flexGrow={1}>
        {/* Sidebar */}
        <Box 
          flexDirection="column" 
          width={25} 
          marginRight={2} 
          borderStyle="round" 
          borderColor="gray" 
          paddingX={1}
        >
          <Box borderBottom={false} marginBottom={1} paddingX={1}>
            <Text color="gray">Project Settings</Text>
          </Box>
          {tabs.map((tab, idx) => (
            <Box key={tab.path} paddingX={1}>
              <Text 
                color={router.pathname === tab.path ? 'blue' : 'gray'} 
                bold={router.pathname === tab.path}
              >
                {router.pathname === tab.path ? '▶ ' : '  '}
                {tab.label}
              </Text>
            </Box>
          ))}
          <Box paddingX={1} marginTop={1}>
            <Text color="dim">Use ⬆️  and ⬇️ </Text>
          </Box>
        </Box>

        {/* Page Content */}
        <Box flexGrow={1} flexDirection="column">
          {children}
        </Box>
      </Box>
    </Box>
  );
};
