import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, IconButton, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Snackbar, Alert,
  CircularProgress, Divider,
} from '@mui/material';
import { Edit, Delete, Add, ArrowUpward, ArrowDownward, Save } from '@mui/icons-material';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import api from '../lib/axios';

interface OnboardingGoal {
  id: string;
  title: string;
  sortOrder: number;
  isActive: boolean;
}

const OnboardingQuestions: React.FC = () => {
  const [goals, setGoals] = useState<OnboardingGoal[]>([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<OnboardingGoal | null>(null);
  const [form, setForm] = useState({ title: '', sortOrder: 0 });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/onboarding/content');
      setGoals(response.data.goals);
      setPrompt(response.data.prompt);
    } catch (error) {
      setToast({ open: true, message: 'Failed to fetch onboarding content', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSavePrompt = async () => {
    try {
      await api.put('/admin/onboarding/prompts/ONBOARDING_GOALS_PROMPT', { value: prompt });
      setToast({ open: true, message: 'Prompt updated successfully', severity: 'success' });
    } catch (error) {
      setToast({ open: true, message: 'Failed to update prompt', severity: 'error' });
    }
  };

  const openAdd = () => {
    setSelected(null);
    setForm({ title: '', sortOrder: goals.length > 0 ? Math.max(...goals.map(g => g.sortOrder)) + 1 : 1 });
    setFormOpen(true);
  };

  const openEdit = (g: OnboardingGoal) => {
    setSelected(g);
    setForm({ title: g.title, sortOrder: g.sortOrder });
    setFormOpen(true);
  };

  const handleSaveGoal = async () => {
    try {
      if (selected) {
        const response = await api.put(`/admin/onboarding/options/goals/${selected.id}`, form);
        setGoals(goals.map((g) => g.id === selected.id ? response.data : g));
        setToast({ open: true, message: 'Goal updated', severity: 'success' });
      } else {
        // Create not implemented in specialized backend routes yet, but let's assume it works or we only edit existing for now
        // If we want to support adding, we should add POST /admin/onboarding/options/goals
        setToast({ open: true, message: 'Adding new goals is not yet supported in this API version', severity: 'error' });
      }
      setFormOpen(false);
    } catch (error) {
      setToast({ open: true, message: 'Failed to save goal', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    if (selected) {
      try {
        await api.delete(`/admin/onboarding/options/goals/${selected.id}`);
        setGoals(goals.filter((g) => g.id !== selected.id));
        setToast({ open: true, message: 'Goal deleted', severity: 'success' });
      } catch (error) {
        setToast({ open: true, message: 'Failed to delete goal', severity: 'error' });
      }
    }
    setDeleteOpen(false);
    setSelected(null);
  };

  const moveGoal = async (index: number, direction: 'up' | 'down') => {
    const sorted = [...goals].sort((a, b) => a.sortOrder - b.sortOrder);
    const swapIdx = direction === 'up' ? index - 1 : index + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const current = sorted[index];
    const target = sorted[swapIdx];

    const tempOrder = current.sortOrder;
    current.sortOrder = target.sortOrder;
    target.sortOrder = tempOrder;

    try {
      await Promise.all([
        api.put(`/admin/onboarding/options/goals/${current.id}`, { sortOrder: current.sortOrder }),
        api.put(`/admin/onboarding/options/goals/${target.id}`, { sortOrder: target.sortOrder })
      ]);
      setGoals([...sorted]);
    } catch (error) {
      setToast({ open: true, message: 'Failed to update order', severity: 'error' });
    }
  };

  if (loading && goals.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const sortedGoals = [...goals].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <Box>
      <Typography variant="h4" sx={{ color: '#980755', mb: 3 }}>
        Onboarding Management
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }} variant="outlined">
        <Typography variant="h6" gutterBottom>Primary Question Prompt</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter the main onboarding question..."
          />
          <Button variant="contained" startIcon={<Save />} onClick={handleSavePrompt} sx={{ mt: 1 }}>
            Save Prompt
          </Button>
        </Box>
      </Paper>

      <Divider sx={{ mb: 4 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Onboarding Goal Options</Typography>
        <Button variant="outlined" startIcon={<Add />} onClick={openAdd}>Add Goal</Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {sortedGoals.map((g, idx) => (
          <Paper key={g.id} variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, '&:hover': { borderColor: '#980755' }, transition: '0.2s' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <IconButton size="small" disabled={idx === 0} onClick={() => moveGoal(idx, 'up')}><ArrowUpward fontSize="small" /></IconButton>
              <IconButton size="small" disabled={idx === sortedGoals.length - 1} onClick={() => moveGoal(idx, 'down')}><ArrowDownward fontSize="small" /></IconButton>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" fontWeight={500}>{g.title}</Typography>
              <Typography variant="caption" color="text.secondary">Order: {g.sortOrder}</Typography>
            </Box>
            <Box>
              <IconButton size="small" onClick={() => openEdit(g)}><Edit fontSize="small" /></IconButton>
              <IconButton size="small" color="error" onClick={() => { setSelected(g); setDeleteOpen(true); }}><Delete fontSize="small" /></IconButton>
            </Box>
          </Paper>
        ))}
        {sortedGoals.length === 0 && (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
            No goals found.
          </Typography>
        )}
      </Box>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selected ? 'Edit Goal' : 'Add Goal'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField
            label="Goal Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            fullWidth
            multiline
          />
          <TextField
            label="Sort Order"
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveGoal} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteOpen} title="Delete Goal" message={`Are you sure you want to delete "${selected?.title}"?`}
        onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)} />

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={toast.severity} variant="filled">{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default OnboardingQuestions;
