import React, { useState, useCallback } from 'react';
import {
  Box, Typography, Card, CardMedia, CardContent, CardActions,
  IconButton, Grid, Button, Paper, Snackbar, Alert,
} from '@mui/material';
import { Delete, CloudUpload, VideoFile } from '@mui/icons-material';
import { mockDeepfakeVideos, DeepfakeVideo } from '../data/mockData';
import ConfirmDialog from '../components/shared/ConfirmDialog';

const DeepfakeVideos: React.FC = () => {
  const [videos, setVideos] = useState<DeepfakeVideo[]>(mockDeepfakeVideos);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<DeepfakeVideo | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const newVideo: DeepfakeVideo = {
        id: Date.now().toString(),
        title: files[0].name.replace(/\.[^/.]+$/, ''),
        thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200',
        url: URL.createObjectURL(files[0]),
        uploadDate: new Date().toISOString().split('T')[0],
      };
      setVideos((prev) => [newVideo, ...prev]);
      setToast({ open: true, message: 'Video uploaded successfully', severity: 'success' });
    }
  }, []);

  const handleDelete = () => {
    if (selected) {
      setVideos(videos.filter((v) => v.id !== selected.id));
      setToast({ open: true, message: 'Video deleted', severity: 'success' });
    }
    setDeleteOpen(false);
    setSelected(null);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: '#980755' }}>Deepfake Videos</Typography>

      <Paper variant="outlined"
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        sx={{
          p: 4, mb: 3, textAlign: 'center', cursor: 'pointer',
          border: '2px dashed', borderColor: dragOver ? '#980755' : 'divider',
          bgcolor: dragOver ? 'rgba(152,7,85,0.04)' : 'transparent',
          transition: '0.2s',
        }}
        onClick={() => document.getElementById('video-upload')?.click()}>
        <CloudUpload sx={{ fontSize: 48, color: '#980755', mb: 1 }} />
        <Typography variant="body1" fontWeight={500}>Drag & drop video files here</Typography>
        <Typography variant="body2" color="text.secondary">or click to browse</Typography>
        <input id="video-upload" type="file" accept="video/*" hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const newVideo: DeepfakeVideo = {
                id: Date.now().toString(), title: file.name.replace(/\.[^/.]+$/, ''),
                thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200',
                url: URL.createObjectURL(file), uploadDate: new Date().toISOString().split('T')[0],
              };
              setVideos((prev) => [newVideo, ...prev]);
              setToast({ open: true, message: 'Video uploaded successfully', severity: 'success' });
            }
          }} />
      </Paper>

      <Grid container spacing={3}>
        {videos.map((video) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={video.id}>
            <Card>
              <CardMedia component="img" height="160" image={video.thumbnail} alt={video.title} sx={{ objectFit: 'cover' }} />
              <CardContent sx={{ pb: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <VideoFile fontSize="small" color="action" />
                  <Typography variant="subtitle2" fontWeight={600} noWrap>{video.title}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">Uploaded: {video.uploadDate}</Typography>
              </CardContent>
              <CardActions>
                <IconButton size="small" color="error" onClick={() => { setSelected(video); setDeleteOpen(true); }}>
                  <Delete fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <ConfirmDialog open={deleteOpen} title="Delete Video"
        message={`Delete "${selected?.title}"? This cannot be undone.`}
        onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)} />
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={toast.severity} variant="filled">{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default DeepfakeVideos;
