'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Business as CompanyIcon,
  Forklift as ForkliftIcon
} from '@mui/icons-material';
import LogoImage from '@/assets/Logo.jpg';
import { logout } from '@/services/authen.service';
import { useRouter } from 'next/navigation'; // Import เพิ่ม
import { useSnackbar } from '@/contexts/SnackbarContext';

interface SidebarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Company', icon: <CompanyIcon />, path: '/company' },
  { text: 'Forklift Management', icon: <ForkliftIcon />, path: '/forklift-management' },
  { text: 'Admin Management', icon: <PeopleIcon />, path: '/admin-management' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

export default function Sidebar({ drawerWidth, mobileOpen, onClose }: SidebarProps) {
  const router = useRouter(); // เรียกใช้
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout(); // Call server action to delete cookie
    showSnackbar('Logout Successful! See you again.', 'success');
    router.push('/login');
  };

  const drawerContent = (
    <div>
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          height: 80
        }}
      >
        <Image
          src={LogoImage}
          alt="Preselect Logo"
          width={180}
          height={60}
          style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          priority
        />
      </Box>

      <Divider sx={{ mb: 2 }} />

      <List>
        {MENU_ITEMS.map((item) => {
          const active = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));

          return (
            <ListItem key={item.text} disablePadding sx={{ px: 2, mb: 1 }}>
              <Link href={item.path} passHref style={{ textDecoration: 'none', width: '100%' }}>
                <ListItemButton
                  selected={active}
                  onClick={onClose} // เพิ่ม: กดแล้วให้ปิด Drawer (สำหรับ Mobile)
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      bgcolor: `${theme.palette.primary.main}15`,
                      color: 'primary.main',
                      '&:hover': { bgcolor: `${theme.palette.primary.main}25` },
                      '& .MuiListItemIcon-root': { color: 'primary.main' },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{ fontWeight: active ? 600 : 400 }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2, mt: 'auto' }}>
        <ListItemButton
          onClick={handleLogout} // ใส่ onClick ตรงนี้
          sx={{
            borderRadius: 2,
            color: 'error.main',
            '&:hover': { bgcolor: 'error.lighter' }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {/* 1. Mobile Drawer (Temporary) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }} // เพื่อประสิทธิภาพใน Mobile
        sx={{
          display: { xs: 'block', md: 'none' }, // โชว์เฉพาะ Mobile
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* 2. Desktop Drawer (Permanent) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' }, // ซ่อนใน Mobile
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}