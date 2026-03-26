import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, CardActions, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem, Chip, IconButton,
  Snackbar, Alert, List, ListItem, ListItemIcon, ListItemText,
} from '@mui/material';
import { Edit, Delete, Add, CheckCircle } from '@mui/icons-material';
import { mockPlans, SubscriptionPlan } from '../data/mockData';
import ConfirmDialog from '../components/shared/ConfirmDialog';

const SubscriptionPlans: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(mockPlans);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<SubscriptionPlan | null>(null);
  const [form, setForm] = useState({ name: '', price: 0, duration: 'monthly' as SubscriptionPlan['duration'], features: '' });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const openAdd = () => { setSelected(null); setForm({ name: '', price: 0, duration: 'monthly', features: '' }); setFormOpen(true); };
  const openEdit = (p: SubscriptionPlan) => {
    setSelected(p);
    setForm({ name: p.name, price: p.price, duration: p.duration, features: p.features.join('\n') });
    setFormOpen(true);
  };

  const handleSave = () => {
    const featuresList = form.features.split('\n').filter(Boolean);
    if (selected) {
      setPlans(plans.map((p) => p.id === selected.id ? { ...p, name: form.name, price: form.price, duration: form.duration, features: featuresList } : p));
      setToast({ open: true, message: 'Plan updated', severity: 'success' });
    } else {
      setPlans([...plans, { id: Date.now().toString(), name: form.name, price: form.price, duration: form.duration, features: featuresList }]);
      setToast({ open: true, message: 'Plan added', severity: 'success' });
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (selected) {
      setPlans(plans.filter((p) => p.id !== selected.id));
      setToast({ open: true, message: 'Plan deleted', severity: 'success' });
    }
    setDeleteOpen(false); setSelected(null);
  };

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
                <IconButton size="small" onClick={() => openEdit(plan)}><Edit fontSize="small" /></IconButton>
                <IconButton size="small" color="error" onClick={() => { setSelected(plan); setDeleteOpen(true); }}><Delete fontSize="small" /></IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selected ? 'Edit Plan' : 'Add Plan'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField label="Plan Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth />
          <TextField label="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })} fullWidth />
          <FormControl fullWidth><InputLabel>Duration</InputLabel>
            <Select value={form.duration} label="Duration" onChange={(e) => setForm({ ...form, duration: e.target.value as SubscriptionPlan['duration'] })}>
              <MenuItem value="monthly">Monthly</MenuItem><MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Features (one per line)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} multiline rows={4} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">{selected ? 'Save' : 'Add'}</Button>
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
