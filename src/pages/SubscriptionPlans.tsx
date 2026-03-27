import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, CardActions, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem, Chip, IconButton,
  Snackbar, Alert, List, ListItem, ListItemIcon, ListItemText,
  CircularProgress,
} from '@mui/material';
import { Edit, Delete, Add, CheckCircle } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SubscriptionPlan } from '../data/mockData';
import { getPlans, savePlan, deletePlan } from '../services/subscriptionService';
import ConfirmDialog from '../components/shared/ConfirmDialog';

const SubscriptionPlans: React.FC = () => {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<SubscriptionPlan | null>(null);
  const [form, setForm] = useState({ name: '', price: 0, duration: 'monthly' as SubscriptionPlan['duration'], features: '' });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { data: plans = [], isLoading, isError, error } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: getPlans,
  });

  const saveMutation = useMutation({
    mutationFn: savePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      setToast({ open: true, message: selected ? 'Plan updated' : 'Plan added', severity: 'success' });
      setFormOpen(false);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Failed to save plan';
      setToast({ open: true, message: msg, severity: 'error' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      setToast({ open: true, message: 'Plan deleted', severity: 'success' });
      setDeleteOpen(false);
      setSelected(null);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Failed to delete plan';
      setToast({ open: true, message: msg, severity: 'error' });
    },
  });

  const openAdd = () => { setSelected(null); setForm({ name: '', price: 0, duration: 'monthly', features: '' }); setFormOpen(true); };
  const openEdit = (p: SubscriptionPlan) => {
    setSelected(p);
    setForm({ name: p.name, price: p.price, duration: p.duration, features: p.features.join('\n') });
    setFormOpen(true);
  };

  const handleSave = () => {
    const featuresList = form.features.split('\n').filter(Boolean);
    saveMutation.mutate({
      ...selected,
      name: form.name,
      price: form.price,
      duration: form.duration,
      features: featuresList,
    });
  };

  const handleDelete = () => {
    if (selected) {
      deleteMutation.mutate(selected.id);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 400 }}>
        <CircularProgress sx={{ color: '#980755' }} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Failed to load subscription plans.
          <Typography variant="body2" sx={{ mt: 1 }}>
            Error: {(error as any)?.message || 'Unreachable backend'}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Please ensure your backend is running at {import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'} and CORS is enabled.
          </Typography>
        </Alert>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => queryClient.invalidateQueries({ queryKey: ['subscription-plans'] })}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ color: '#980755' }}>
          Subscription Plans
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={openAdd}>Add Plan</Button>
      </Box>

      <Grid container spacing={3}>
        {plans.map((plan) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={plan.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'visible' }}>
              {plan.name === 'Premium' && (
                <Chip label="Popular" size="small" sx={{ position: 'absolute', top: -10, right: 16, bgcolor: '#980755', color: '#fff' }} />
              )}
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={700}>{plan.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1, mb: 1 }}>
                  <Typography variant="h3" fontWeight={800} sx={{ color: '#980755' }}>
                    ${plan.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" ml={0.5}>/{plan.duration === 'monthly' ? 'mo' : 'yr'}</Typography>
                </Box>
                <List dense>
                  {plan.features.map((f, i) => (
                    <ListItem key={i} disableGutters sx={{ py: 0.25 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}><CheckCircle fontSize="small" sx={{ color: '#980755' }} /></ListItemIcon>
                      <ListItemText primary={f} primaryTypographyProps={{ variant: 'body2' }} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <IconButton size="small" onClick={() => openEdit(plan)} disabled={deleteMutation.isPending}><Edit fontSize="small" /></IconButton>
                <IconButton size="small" color="error" onClick={() => { setSelected(plan); setDeleteOpen(true); }} disabled={deleteMutation.isPending}>
                  {deleteMutation.isPending && selected?.id === plan.id ? <CircularProgress size={20} color="inherit" /> : <Delete fontSize="small" />}
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={formOpen} onClose={() => !saveMutation.isPending && setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selected ? 'Edit Plan' : 'Add Plan'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField label="Plan Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth disabled={saveMutation.isPending} />
          <TextField label="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })} fullWidth disabled={saveMutation.isPending} />
          <FormControl fullWidth disabled={saveMutation.isPending}><InputLabel>Duration</InputLabel>
            <Select value={form.duration} label="Duration" onChange={(e) => setForm({ ...form, duration: e.target.value as SubscriptionPlan['duration'] })}>
              <MenuItem value="monthly">Monthly</MenuItem><MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Features (one per line)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} multiline rows={4} fullWidth disabled={saveMutation.isPending} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)} disabled={saveMutation.isPending}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? <CircularProgress size={24} color="inherit" /> : (selected ? 'Save' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteOpen} title="Delete Plan" message={`Delete "${selected?.name}" plan?`}
        onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)} />
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={toast.severity} variant="filled">{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default SubscriptionPlans;
