import React from 'react';
import {
  AppBar, Toolbar, IconButton, Typography, Avatar, Box, Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useThemeMode } from '../../context/ThemeContext';
import { DRAWER_WIDTH } from './Sidebar';

interface NavbarProps {
  onMenuToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <AppBar position="fixed" elevation={0}
      sx={{ width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, ml: { md: `${DRAWER_WIDTH}px` } }}>
      <Toolbar>
        <IconButton edge="start" onClick={onMenuToggle} sx={{ mr: 2, display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap sx={{
          flexGrow: 1, fontWeight: 700, color: '#980755',
        }}>
          Admin Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
            <IconButton onClick={toggleTheme}>
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
          <IconButton><NotificationsIcon /></IconButton>
          <Avatar sx={{ width: 34, height: 34, bgcolor: '#980755', fontSize: 14 }}>A</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
