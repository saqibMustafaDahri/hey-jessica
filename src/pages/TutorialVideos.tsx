import React, { useState } from 'react';
import {
  Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Chip, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, FormControl, InputLabel, Select,
  MenuItem, Snackbar, Alert,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { mockTutorialVideos, TutorialVideo } from '../data/mockData';
import ConfirmDialog from '../components/shared/ConfirmDialog';

const TutorialVideos: React.FC = () => {
  const [videos, setVideos] = useState<TutorialVideo[]>(mockTutorialVideos);
  const [tab, setTab] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<TutorialVideo | null>(null);
  const [form, setForm] = useState({ title: '', category: 'Free' as TutorialVideo['category'], url: '' });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const filtered = tab === 0 ? videos : videos.filter((v) => (tab === 1 ? v.category === 'Free' : v.category === 'Premium'));

  const openAdd = () => { setSelected(null); setForm({ title: '', category: 'Free', url: '' }); setFormOpen(true); };
  const openEdit = (v: TutorialVideo) => { setSelected(v); setForm({ title: v.title, category: v.category, url: v.url }); setFormOpen(true); };

  const handleSave = () => {
    if (selected) {
      setVideos(videos.map((v) => v.id === selected.id ? { ...v, ...form } : v));
      setToast({ open: true, message: 'Video updated', severity: 'success' });
    } else {
      const newVideo: TutorialVideo = { id: Date.now().toString(), ...form, uploadDate: new Date().toISOString().split('T')[0] };
      setVideos([...videos, newVideo]);
      setToast({ open: true, message: 'Video added', severity: 'success' });
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (selected) {
      setVideos(videos.filter((v) => v.id !== selected.id));
      setToast({ open: true, message: 'Video deleted', severity: 'success' });
    }
    setDeleteOpen(false); setSelected(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ color: '#980755' }}>
          Tutorial Videos
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={openAdd}>Add Video</Button>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, '& .Mui-selected': { color: '#980755' }, '& .MuiTabs-indicator': { bgcolor: '#980755' } }}>
        <Tab label="All" /><Tab label="Free" /><Tab label="Premium" />
      </Tabs>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>URL</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Uploaded</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((v) => (
              <TableRow key={v.id} hover>
                <TableCell>{v.title}</TableCell>
                <TableCell><Chip label={v.category} size="small" color={v.category === 'Premium' ? 'primary' : 'default'} /></TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.url}</TableCell>
                <TableCell>{v.uploadDate}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => openEdit(v)}><Edit fontSize="small" /></IconButton>
                  <IconButton size="small" color="error" onClick={() => { setSelected(v); setDeleteOpen(true); }}><Delete fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selected ? 'Edit Video' : 'Add Video'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} fullWidth />
          <FormControl fullWidth><InputLabel>Category</InputLabel>
            <Select value={form.category} label="Category" onChange={(e) => setForm({ ...form, category: e.target.value as TutorialVideo['category'] })}>
              <MenuItem value="Free">Free</MenuItem><MenuItem value="Premium">Premium</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Video URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">{selected ? 'Save' : 'Add'}</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteOpen} title="Delete Video" message={`Delete "${selected?.title}"?`}
        onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)} />
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={toast.severity} variant="filled">{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default TutorialVideos;
