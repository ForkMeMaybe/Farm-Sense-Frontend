import React, { useState } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { drugService } from '../services/farmService';

const DrugFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', active_ingredient: '', unit: '', notes: '' });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {
      setError(null);
      await drugService.create(form as any);
      navigate('/drugs');
    } catch (e: any) {
      setError(e.message || 'Failed to create drug');
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Add Drug</Typography>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      <Stack spacing={2} maxWidth={480}>
        <TextField name="name" label="Name" value={form.name} onChange={handleChange} required />
        <TextField name="active_ingredient" label="Active Ingredient" value={form.active_ingredient} onChange={handleChange} />
        <TextField name="unit" label="Unit" value={form.unit} onChange={handleChange} />
        <TextField name="notes" label="Notes" value={form.notes} onChange={handleChange} multiline rows={3} />
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={() => navigate(-1)}>Cancel</Button>
          <Button variant="contained" onClick={submit}>Save</Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default DrugFormPage;


