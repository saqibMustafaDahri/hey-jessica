import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

import { People as PeopleIcon, Videocam as VideocamIcon, School as SchoolIcon, CardMembership as CardIcon, Quiz as QuizIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import api from '../lib/axios';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [videoCount, setVideoCount] = useState(0); 
  const [planCount, setPlanCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, videosRes, plansRes, onboardingRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/videos'),
          api.get('/subscriptions/plans'),
          api.get('/admin/onboarding/content'),
        ]);
  
        setUserCount(Array.isArray(usersRes.data) ? usersRes.data.length : 0);
        setVideoCount(Array.isArray(videosRes.data) ? videosRes.data.length : 0);
        setPlanCount(Array.isArray(plansRes.data) ? plansRes.data.length : 0);
  
        const goals = onboardingRes.data?.goals;
        setQuestionCount(Array.isArray(goals) ? goals.length : 0);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      }
    };
  
    fetchData();
  }, []);
  const stats = [
    { label: 'Total Users', value: userCount, icon: <PeopleIcon />, path: '/users' },
    { label: 'Deepfake Videos', value: videoCount, icon: <VideocamIcon />, path: '/deepfake-videos' },
    { label: 'Tutorial Videos', value: videoCount, icon: <SchoolIcon />, path: '/tutorial-videos' },
    { label: 'Subscription Plans', value: planCount, icon: <CardIcon />, path: '/subscription-plans' },
    { label: 'Onboarding Questions', value: questionCount, icon: <QuizIcon />, path: '/onboarding-questions' },
    { label: 'Active Subscribers', value: '-', icon: <TrendingUpIcon />, path: '/subscription-plans' },
  ];

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