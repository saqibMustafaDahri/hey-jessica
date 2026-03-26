import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import Sidebar, { DRAWER_WIDTH } from './Sidebar';
import Navbar from './Navbar';

const AdminLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar onMenuToggle={() => setMobileOpen(!mobileOpen)} />
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{
        flexGrow: 1, p: { xs: 2, sm: 3 },
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        bgcolor: 'background.default',
      }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
