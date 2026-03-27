import React, { useState, useCallback } from 'react';
import {
  Box, Typography, Card, CardMedia, CardContent, CardActions,
  IconButton, Grid, Button, Paper, Snackbar, Alert, CircularProgress,
} from '@mui/material';
import { Delete, CloudUpload, VideoFile } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVideos, getUploadUrl, uploadToS3, saveVideoMetadata, deleteVideo, Video } from '../services/videoService';
import ConfirmDialog from '../components/shared/ConfirmDialog';

const DeepfakeVideos: React.FC = () => {
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Video | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['videos', 'Deepfake'],
    queryFn: () => getVideos(),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      setToast({ open: true, message: 'Video deleted', severity: 'success' });
      setDeleteOpen(false);
      setSelected(null);
    },
  });

  const processUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const { uploadUrl, videoUrl } = await getUploadUrl(file.name, file.type);

      await uploadToS3(uploadUrl, file);

      await saveVideoMetadata({
        title: file.name.replace(/\.[^/.]+$/, ''),
        url: videoUrl,
        thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200',
      });

      queryClient.invalidateQueries({ queryKey: ['videos'] });
      setToast({ open: true, message: 'Video uploaded and saved successfully', severity: 'success' });
    } catch (error) {
      console.error('Upload failed:', error);
      setToast({ open: true, message: 'Upload failed. Please try again.', severity: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) processUpload(files[0]);
  }, []);

  const handleDelete = () => {
    if (selected) deleteMutation.mutate(selected.id);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: '#980755' }}>Deepfake Videos</Typography>

      <Paper variant="outlined"
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        sx={{
          p: 4, mb: 3, textAlign: 'center', cursor: isUploading ? 'not-allowed' : 'pointer',
          border: '2px dashed', borderColor: dragOver ? '#980755' : 'divider',
          bgcolor: dragOver ? 'rgba(152,7,85,0.04)' : 'transparent',
          opacity: isUploading ? 0.6 : 1,
          transition: '0.2s',
        }}
        onClick={() => !isUploading && document.getElementById('video-upload')?.click()}>
        {isUploading ? (
          <Box sx={{ py: 1 }}>
            <CircularProgress size={40} sx={{ color: '#980755', mb: 1 }} />
            <Typography variant="body1" fontWeight={500}>Uploading to Cloud...</Typography>
          </Box>
        ) : (
          <>
            <CloudUpload sx={{ fontSize: 48, color: '#980755', mb: 1 }} />
            <Typography variant="body1" fontWeight={500}>Drag & drop video files here</Typography>
            <Typography variant="body2" color="text.secondary">or click to browse</Typography>
          </>
        )}
        <input id="video-upload" type="file" accept="video/*" hidden disabled={isUploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) processUpload(file);
          }} />
      </Paper>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={3}>
          {videos.length === 0 && <Grid size={12}><Typography align="center" color="text.secondary">No videos found</Typography></Grid>}
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
                  <IconButton size="small" color="error" onClick={() => { setSelected(video); setDeleteOpen(true); }} disabled={deleteMutation.isPending}>
                    <Delete fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

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
