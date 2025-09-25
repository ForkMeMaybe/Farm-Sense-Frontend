import React, { useState } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

const FeedFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', cost_per_kg: '', notes: '' });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {
      setError(null);
      await apiClient.post('/api/feeds/', {
        name: form.name,
        cost_per_kg: form.cost_per_kg ? Number(form.cost_per_kg) : null,
        notes: form.notes || ''
      });
      navigate('/feeds');
    } catch (e: any) {
      setError(e.message || 'Failed to create feed');
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Add Feed</Typography>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      <Stack spacing={2} maxWidth={480}>
        <TextField name="name" label="Name" value={form.name} onChange={handleChange} required />
        <TextField name="cost_per_kg" type="number" label="Cost per kg (optional)" value={form.cost_per_kg} onChange={handleChange} />
        <TextField name="notes" label="Notes" value={form.notes} onChange={handleChange} multiline rows={3} />
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={() => navigate(-1)}>Cancel</Button>
          <Button variant="contained" onClick={submit}>Save</Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default FeedFormPage;


