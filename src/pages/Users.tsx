import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, MenuItem, Select, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, TablePagination, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, InputAdornment, Snackbar, Alert,
  CircularProgress,
} from '@mui/material';
import { Edit, Delete, Search } from '@mui/icons-material';
import { User } from '../data/mockData';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import api from '../lib/axios';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' as User['role'], status: '' as User['status'] });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      setToast({ open: true, message: 'Failed to fetch users', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || (u.email && u.email.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleEdit = (user: User) => {
    setSelected(user);
    setEditForm({ name: user.name, email: user.email, role: user.role, status: user.status });
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (selected) {
      try {
        const response = await api.put(`/admin/users/${selected.id}`, editForm);
        setUsers(users.map((u) => u.id === selected.id ? response.data : u));
        setToast({ open: true, message: 'User updated successfully', severity: 'success' });
        setEditOpen(false);
      } catch (error) {
        setToast({ open: true, message: 'Failed to update user', severity: 'error' });
      }
    }
  };

  const handleDelete = async () => {
    if (selected) {
      try {
        await api.delete(`/admin/users/${selected.id}`);
        setUsers(users.filter((u) => u.id !== selected.id));
        setToast({ open: true, message: 'User deleted successfully', severity: 'success' });
        setDeleteOpen(false);
        setSelected(null);
      } catch (error) {
        setToast({ open: true, message: 'Failed to delete user', severity: 'error' });
      }
    }
  };

  const statusColor = (s: string) => {
    if (s === 'Active') return 'success';
    if (s === 'Inactive') return 'default';
    return 'error';
  };

  if (loading && users.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: '#980755' }}>User Management</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField size="small" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 250 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
            <MenuItem value="Suspended">Suspended</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={fetchUsers} sx={{ height: 40 }}>Refresh</Button>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              {/*<TableCell sx={{ fontWeight: 600 }}>Created</TableCell>*/}
              <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell><Chip label={user.role} size="small" variant="outlined" /></TableCell>
                <TableCell><Chip label={user.status} size="small" color={statusColor(user.status)} /></TableCell>
                {/* <TableCell>{user.createdDate}</TableCell> */}
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleEdit(user)}><Edit fontSize="small" /></IconButton>
                  <IconButton size="small" color="error" onClick={() => { setSelected(user); setDeleteOpen(true); }}><Delete fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">No users found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination component="div" count={filtered.length} page={page} onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} />
      </TableContainer>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField label="Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} fullWidth />
          <TextField label="Email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} fullWidth />
          <FormControl fullWidth><InputLabel>Role</InputLabel>
            <Select value={editForm.role} label="Role" onChange={(e) => setEditForm({ ...editForm, role: e.target.value as User['role'] })}>
              <MenuItem value="Admin">Admin</MenuItem><MenuItem value="User">User</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth><InputLabel>Status</InputLabel>
            <Select value={editForm.status} label="Status" onChange={(e) => setEditForm({ ...editForm, status: e.target.value as User['status'] })}>
              <MenuItem value="Active">Active</MenuItem><MenuItem value="Inactive">Inactive</MenuItem><MenuItem value="Suspended">Suspended</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteOpen} title="Delete User"
        message={`Are you sure you want to delete "${selected?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)} />

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={toast.severity} variant="filled">{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Users;
