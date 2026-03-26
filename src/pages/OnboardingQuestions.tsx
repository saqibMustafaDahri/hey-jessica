import React, { useState } from 'react';
import {
  Box, Typography, Paper, IconButton, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, FormControl, InputLabel,
  Select, MenuItem, Chip, Snackbar, Alert,
} from '@mui/material';
import { Edit, Delete, Add, DragIndicator, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { mockQuestions, OnboardingQuestion } from '../data/mockData';
import ConfirmDialog from '../components/shared/ConfirmDialog';

const OnboardingQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<OnboardingQuestion[]>(mockQuestions);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<OnboardingQuestion | null>(null);
  const [form, setForm] = useState({ questionText: '', type: 'MCQ' as OnboardingQuestion['type'], options: '' });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const openAdd = () => { setSelected(null); setForm({ questionText: '', type: 'MCQ', options: '' }); setFormOpen(true); };
  const openEdit = (q: OnboardingQuestion) => {
    setSelected(q);
    setForm({ questionText: q.questionText, type: q.type, options: q.options.join('\n') });
    setFormOpen(true);
  };

  const handleSave = () => {
    const opts = form.options.split('\n').filter(Boolean);
    if (selected) {
      setQuestions(questions.map((q) => q.id === selected.id ? { ...q, questionText: form.questionText, type: form.type, options: opts } : q));
      setToast({ open: true, message: 'Question updated', severity: 'success' });
    } else {
      const maxOrder = questions.reduce((max, q) => Math.max(max, q.order), 0);
      setQuestions([...questions, { id: Date.now().toString(), questionText: form.questionText, type: form.type, options: opts, order: maxOrder + 1 }]);
      setToast({ open: true, message: 'Question added', severity: 'success' });
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (selected) {
      setQuestions(questions.filter((q) => q.id !== selected.id));
      setToast({ open: true, message: 'Question deleted', severity: 'success' });
    }
    setDeleteOpen(false); setSelected(null);
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const sorted = [...questions].sort((a, b) => a.order - b.order);
    const swapIdx = direction === 'up' ? index - 1 : index + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const temp = sorted[index].order;
    sorted[index] = { ...sorted[index], order: sorted[swapIdx].order };
    sorted[swapIdx] = { ...sorted[swapIdx], order: temp };
    setQuestions(sorted);
  };

  const sorted = [...questions].sort((a, b) => a.order - b.order);
  const typeColor = (t: string) => t === 'MCQ' ? 'primary' : t === 'Text' ? 'secondary' : 'default';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ color: '#980755' }}>
          Onboarding Questions
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={openAdd}>Add Question</Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {sorted.map((q, idx) => (
          <Paper key={q.id} variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, '&:hover': { borderColor: '#980755' }, transition: '0.2s' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <IconButton size="small" disabled={idx === 0} onClick={() => moveQuestion(idx, 'up')}><ArrowUpward fontSize="small" /></IconButton>
              <IconButton size="small" disabled={idx === sorted.length - 1} onClick={() => moveQuestion(idx, 'down')}><ArrowDownward fontSize="small" /></IconButton>
            </Box>
            <DragIndicator color="action" />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="subtitle2" fontWeight={600}>Q{q.order}.</Typography>
                <Typography variant="body1">{q.questionText}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={q.type} size="small" color={typeColor(q.type)} />
                {q.options.length > 0 && <Typography variant="caption" color="text.secondary">{q.options.length} options</Typography>}
              </Box>
            </Box>
            <Box>
              <IconButton size="small" onClick={() => openEdit(q)}><Edit fontSize="small" /></IconButton>
              <IconButton size="small" color="error" onClick={() => { setSelected(q); setDeleteOpen(true); }}><Delete fontSize="small" /></IconButton>
            </Box>
          </Paper>
        ))}
      </Box>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selected ? 'Edit Question' : 'Add Question'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField label="Question Text" value={form.questionText} onChange={(e) => setForm({ ...form, questionText: e.target.value })} fullWidth />
          <FormControl fullWidth><InputLabel>Type</InputLabel>
            <Select value={form.type} label="Type" onChange={(e) => setForm({ ...form, type: e.target.value as OnboardingQuestion['type'] })}>
              <MenuItem value="MCQ">Multiple Choice</MenuItem><MenuItem value="Text">Text</MenuItem><MenuItem value="Boolean">Yes/No</MenuItem>
            </Select>
          </FormControl>
          {(form.type === 'MCQ' || form.type === 'Boolean') && (
            <TextField label="Options (one per line)" value={form.options} onChange={(e) => setForm({ ...form, options: e.target.value })} multiline rows={4} fullWidth />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">{selected ? 'Save' : 'Add'}</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteOpen} title="Delete Question" message={`Delete this question?`}
        onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)} />
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={toast.severity} variant="filled">{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default OnboardingQuestions;
