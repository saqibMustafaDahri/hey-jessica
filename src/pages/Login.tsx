import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography, InputAdornment, IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F9FAFB', p: 2 }}>
      <Card sx={{ maxWidth: 420, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{
              width: 56, height: 56, borderRadius: '16px', mx: 'auto', mb: 2,
              bgcolor: '#980755',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: 24,
            }}>H</Box>
            <Typography variant="h5" fontWeight={700} sx={{ color: '#980755' }}>Her Financial Journey</Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>Admin Dashboard Login</Typography>
          </Box>
          <form onSubmit={handleLogin}>
            <TextField fullWidth label="Email" type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} sx={{ mb: 2 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }} />
            <TextField fullWidth label="Password" type={showPassword ? 'text' : 'password'}
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} sx={{ mb: 3 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
                endAdornment: <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton>
                </InputAdornment>,
              }} />
            <Button fullWidth type="submit" variant="contained" size="large" sx={{ py: 1.5 }}>Sign In</Button>
          </form>
          <Typography variant="body2" textAlign="center" mt={2} color="text.secondary">
            Don't have an account?{' '}
            <Typography component={Link} to="/signup" variant="body2" sx={{ color: '#980755', fontWeight: 600, textDecoration: 'none' }}>
              Sign Up
            </Typography>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
