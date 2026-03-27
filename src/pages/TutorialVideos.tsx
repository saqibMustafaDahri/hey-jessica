import React, { useState } from 'react';
import {
  Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Chip, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, FormControl, InputLabel, Select,
  MenuItem, Snackbar, Alert,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVideos, saveVideoMetadata, deleteVideo, Video } from '../services/videoService';

const TutorialVideos: React.FC = () => {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Video | null>(null);
  const [form, setForm] = useState({ title: '', category: 'Free' as Video['category'], url: '' });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const category = tab === 0 ? undefined : (tab === 1 ? 'Free' : 'Premium');

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['videos', category],
    queryFn: () => getVideos(category),
  });

  const saveMutation = useMutation({
    mutationFn: saveVideoMetadata,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      setToast({ open: true, message: selected ? 'Video updated' : 'Video added', severity: 'success' });
      setFormOpen(false);
    },
    onError: () => setToast({ open: true, message: 'Failed to save video', severity: 'error' }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      setToast({ open: true, message: 'Video deleted', severity: 'success' });
      setDeleteOpen(false);
      setSelected(null);
    },
    onError: () => setToast({ open: true, message: 'Failed to delete video', severity: 'error' }),
  });

  const openAdd = () => { setSelected(null); setForm({ title: '', category: 'Free', url: '' }); setFormOpen(true); };
  const openEdit = (v: Video) => { setSelected(v); setForm({ title: v.title, category: v.category, url: v.url }); setFormOpen(true); };

  const handleSave = () => {
    saveMutation.mutate({
      id: selected?.id,
      ...form,
    });
  };

  const handleDelete = () => {
    if (selected) deleteMutation.mutate(selected.id);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ color: '#980755' }}>
          Tutorial Videos
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={openAdd} disabled={saveMutation.isPending}>Add Video</Button>
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
            {isLoading ? (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}>Loading videos...</TableCell></TableRow>
            ) : videos.length === 0 ? (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}>No videos found.</TableCell></TableRow>
            ) : videos.map((v) => (
              <TableRow key={v.id} hover>
                <TableCell>{v.title}</TableCell>
                <TableCell><Chip label={v.category} size="small" color={v.category === 'Premium' ? 'primary' : 'default'} /></TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.url}</TableCell>
                <TableCell>{v.uploadDate}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => openEdit(v)} disabled={deleteMutation.isPending}><Edit fontSize="small" /></IconButton>
                  <IconButton size="small" color="error" onClick={() => { setSelected(v); setDeleteOpen(true); }} disabled={deleteMutation.isPending}><Delete fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selected ? 'Edit Video' : 'Add Video'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} fullWidth disabled={saveMutation.isPending} />
          <FormControl fullWidth><InputLabel>Category</InputLabel>
            <Select value={form.category} label="Category" onChange={(e) => setForm({ ...form, category: e.target.value as Video['category'] })} disabled={saveMutation.isPending}>
              <MenuItem value="Free">Free</MenuItem><MenuItem value="Premium">Premium</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Video URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} fullWidth disabled={saveMutation.isPending} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)} disabled={saveMutation.isPending}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Saving...' : (selected ? 'Save' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteOpen} title="Delete Video" message={`Delete "${selected?.title}"?`}
        onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)} />
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={toast.severity} variant="filled">{toast.message}</Alert>
      </Snackbar>
    </Box >
  );
};

export default TutorialVideos;
