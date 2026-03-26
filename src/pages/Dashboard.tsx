import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  People as PeopleIcon, Videocam as VideocamIcon,
  School as SchoolIcon, CardMembership as CardIcon,
  Quiz as QuizIcon, TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const stats = [
  { label: 'Total Users', value: '8', icon: <PeopleIcon />, change: '+12%', path: '/users' },
  { label: 'Deepfake Videos', value: '3', icon: <VideocamIcon />, change: '+5%', path: '/deepfake-videos' },
  { label: 'Tutorial Videos', value: '5', icon: <SchoolIcon />, change: '+8%', path: '/tutorial-videos' },
  { label: 'Subscription Plans', value: '3', icon: <CardIcon />, change: '0%', path: '/subscription-plans' },
  { label: 'Onboarding Questions', value: '4', icon: <QuizIcon />, change: '+2%', path: '/onboarding-questions' },
  { label: 'Active Subscribers', value: '156', icon: <TrendingUpIcon />, change: '+24%', path: '/subscription-plans' },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: '#980755' }}>
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Welcome back! Here's an overview of your CMS.
      </Typography>
      <Grid container spacing={3}>
        {stats.map((s) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={s.label}>
            <Card
              onClick={() => navigate(s.path)}
              sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)', transition: '0.2s', boxShadow: 4 } }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                    <Typography variant="h4" fontWeight={700} mt={0.5}>{s.value}</Typography>
                    <Typography variant="caption" color="success.main">{s.change} this month</Typography>
                  </Box>
                  <Box sx={{
                    p: 1.2, borderRadius: '12px',
                    bgcolor: 'rgba(152,7,85,0.1)',
                    color: '#980755',
                  }}>
                    {s.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
