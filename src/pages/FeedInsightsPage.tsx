import React, { useEffect, useState } from 'react';
import { Box, Button, MenuItem, TextField, Typography, Grid, Card, CardContent } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import apiClient from '../services/api';
import livestockService from '../services/livestockService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const FeedInsightsPage: React.FC = () => {
  const [livestock, setLivestock] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { livestockService.getAll().then(setLivestock); }, []);

  const load = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await apiClient.get('/api/feed-insights/chart-data/', { livestock_id: Number(selected) });
      setData(res.data);
    } catch (error) {
      console.error('Failed to load feed insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Feed Insights</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField 
          select 
          label="Select Livestock" 
          value={selected} 
          onChange={(e) => setSelected(e.target.value)} 
          sx={{ minWidth: 260 }}
        >
          {livestock.map(a => <MenuItem key={a.id} value={a.id}>{a.tag_id} - {a.species}</MenuItem>)}
        </TextField>
        <Button variant="contained" onClick={load} disabled={!selected || loading}>
          {loading ? 'Loading...' : 'Load Insights'}
        </Button>
      </Box>

      {data && (
        <Grid container spacing={3}>
          {/* Monthly Spend Trend */}
          {data.monthly_spend && data.monthly_spend.length > 0 && (
            <Grid item xs={12} lg={8}>
              <Card className="glass-card">
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Monthly Feed Spend Trend</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.monthly_spend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={formatCurrency} />
                      <Tooltip formatter={(value: number) => [formatCurrency(value), 'Spend']} />
                      <Legend />
                      <Line type="monotone" dataKey="total_spend" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Feed Type Breakdown */}
          {data.feed_breakdown && data.feed_breakdown.length > 0 && (
            <Grid item xs={12} lg={4}>
              <Card className="glass-card">
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Feed Type Breakdown</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.feed_breakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="total_spend"
                      >
                        {data.feed_breakdown.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [formatCurrency(value), 'Spend']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Summary Stats */}
          <Grid item xs={12}>
            <Card className="glass-card">
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Summary Statistics</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(136, 132, 216, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#8884d8' }}>
                        {data.total_spend ? formatCurrency(data.total_spend) : '$0.00'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Total Spend</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(0, 196, 159, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#00C49F' }}>
                        {data.total_quantity ? `${data.total_quantity.toFixed(1)} kg` : '0 kg'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Total Quantity</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255, 187, 40, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFBB28' }}>
                        {data.avg_cost_per_kg ? formatCurrency(data.avg_cost_per_kg) : '$0.00'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Avg Cost/kg</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255, 128, 66, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF8042' }}>
                        {data.record_count || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Total Records</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default FeedInsightsPage;


