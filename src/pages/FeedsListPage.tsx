import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import apiClient from '../services/api';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const FeedsListPage: React.FC = () => {
  const [feeds, setFeeds] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const load = async () => {
    const res = await apiClient.get('/api/feeds/');
    setFeeds(res.data);
  };
  useEffect(() => { load(); }, []);

  const filtered = feeds.filter((f) => f.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Feeds</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/feeds/new')}>Add Feed</Button>
      </Stack>
      <TextField placeholder="Search by name" value={q} onChange={(e) => setQ(e.target.value)} sx={{ mb: 2 }} />
      <Stack spacing={2}>
        {filtered.map((f) => (
          <Card key={f.id} className="glass-card">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{f.name}</Typography>
              <Typography color="text.secondary">Cost/kg: {f.cost_per_kg ?? '-'}</Typography>
              {f.notes && <Typography sx={{ mt: 1 }}>{f.notes}</Typography>}
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <Typography color="text.secondary">No feeds</Typography>}
      </Stack>
    </Box>
  );
};

export default FeedsListPage;


