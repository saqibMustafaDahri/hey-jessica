import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, Box, Typography, useTheme, useMediaQuery, Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Videocam as VideocamIcon,
  School as SchoolIcon,
  CardMembership as CardIcon,
  Quiz as QuizIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 260;

const navItems = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { label: 'Users', path: '/users', icon: <PeopleIcon /> },
  { label: 'Deepfake Videos', path: '/deepfake-videos', icon: <VideocamIcon /> },
  { label: 'Tutorial Videos', path: '/tutorial-videos', icon: <SchoolIcon /> },
  { label: 'Subscription Plans', path: '/subscription-plans', icon: <CardIcon /> },
  { label: 'Onboarding Questions', path: '/onboarding-questions', icon: <QuizIcon /> },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, rgba(89, 4, 50, 0) 0%, #470328 100%)', bgcolor: '#590432' }}>
      <Toolbar sx={{ px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: '10px',
            bgcolor: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 16,
          }}>
            H
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight={700} lineHeight={1.2} color="#fff">Her Financial</Typography>
            <Typography variant="caption" lineHeight={1} sx={{ color: 'rgba(255,255,255,0.7)' }}>Journey CMS</Typography>
          </Box>
        </Box>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />
      <List sx={{ px: 1.5, py: 1, flex: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              onClick={() => { navigate(item.path); if (isMobile) onClose(); }}
              sx={{
                borderRadius: '8px', mb: 0.5,
                bgcolor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: '#fff',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: isActive ? 600 : 400, color: '#fff' }} />
            </ListItemButton>
          );
        })}
      </List>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />
      <List sx={{ px: 1.5, py: 1 }}>
        <ListItemButton
          onClick={() => { navigate('/login'); }}
          sx={{
            borderRadius: '8px',
            color: '#fff',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
          }}
        >
          <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 14, fontWeight: 400, color: '#fff' }} />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
      {isMobile ? (
        <Drawer variant="temporary" open={mobileOpen} onClose={onClose}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, background: '#590432', border: 'none' } }}>
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer variant="permanent" sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', background: '#590432', border: 'none' } }} open>
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
};

export { DRAWER_WIDTH };
export default Sidebar;
