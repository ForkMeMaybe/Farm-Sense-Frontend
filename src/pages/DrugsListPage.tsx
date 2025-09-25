import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Typography, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { drugService, Drug } from '../services/farmService';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const DrugsListPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [q, setQ] = useState('');

  const load = async () => {
    const data = await drugService.getAll();
    setDrugs(data);
  };

  useEffect(() => { load(); }, []);

  const filtered = drugs.filter(d => d.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>{t('nav.amu')} Drugs</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/drugs/new')}>Add Drug</Button>
      </Stack>
      <TextField placeholder="Search by name" value={q} onChange={(e) => setQ(e.target.value)} sx={{ mb: 2 }} />
      <Stack spacing={2}>
        {filtered.map((d) => (
          <Card key={d.id} className="glass-card">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{d.name}</Typography>
              <Typography color="text.secondary">{d.active_ingredient || '-'} • {d.unit || '-'}</Typography>
              {d.notes && <Typography sx={{ mt: 1 }}>{d.notes}</Typography>}
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <Typography color="text.secondary">No drugs</Typography>}
      </Stack>
    </Box>
  );
};

export default DrugsListPage;


