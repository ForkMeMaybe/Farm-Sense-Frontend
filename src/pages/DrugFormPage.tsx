import React, { useState } from 'react';
import { Box, Button, Stack, TextField, Typography, IconButton, Tooltip } from '@mui/material';
import { Mic as MicIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { drugService } from '../services/farmService';
import GenericVoiceInput from '../components/common/GenericVoiceInput';

const DrugFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', active_ingredient: '', unit: '', notes: '' });
  const [error, setError] = useState<string | null>(null);
  const [voiceDialogOpen, setVoiceDialogOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVoiceData = (data: Record<string, any>) => {
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        setForm(prev => ({ ...prev, [key]: value }));
      }
    });
    setVoiceDialogOpen(false);
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Add Drug</Typography>
        <Tooltip title="Use voice input to fill the form">
          <IconButton
            onClick={() => setVoiceDialogOpen(true)}
            color="primary"
            sx={{ 
              bgcolor: 'primary.light',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.main',
              }
            }}
          >
            <MicIcon />
          </IconButton>
        </Tooltip>
      </Box>
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

      <GenericVoiceInput
        isOpen={voiceDialogOpen}
        onClose={() => setVoiceDialogOpen(false)}
        onVoiceData={handleVoiceData}
        formType="drug"
        title="Drug Form Voice Input"
        description="Speak naturally about the drug name, active ingredient, dosage, and manufacturer details"
      />
    </Box>
  );
};

export default DrugFormPage;


