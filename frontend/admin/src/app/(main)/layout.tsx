'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Box, CssBaseline, AppBar, Toolbar, IconButton, Typography, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './components/leftbar/Sidebar';
import LogoImage from '@/assets/Logo.jpg';

const DRAWER_WIDTH = 280;

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* --- Mobile App Bar --- */}
      {/* โชว์เฉพาะจอเล็ก (md='none' คือซ่อนเมื่อจอใหญ่กว่า tablet) */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          display: { md: 'none' }, // ซ่อนบน Desktop
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
                  <Image
                    src={LogoImage}
                    alt="Preselect Logo"
                    height={30}
                    // style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                    priority
                  />
        </Toolbar>
      </AppBar>

      <Sidebar 
        drawerWidth={DRAWER_WIDTH}
        mobileOpen={mobileOpen}
        onClose={handleDrawerToggle}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
          mt: { xs: 7, md: 0 } 
        }}
      >
        {children}
      </Box>
    </Box>
  );
}