import React, { useEffect, useState } from 'react';
import { Box, Button, MenuItem, TextField, Typography, Grid, Card, CardContent } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import apiClient from '../services/api';
import livestockService from '../services/livestockService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const YieldInsightsPage: React.FC = () => {
  const [livestock, setLivestock] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { livestockService.getAll().then(setLivestock); }, []);

  const load = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await apiClient.get('/api/yield-insights/chart-data/', { livestock_id: Number(selected) });
      setData(res.data);
    } catch (error) {
      console.error('Failed to load yield insights:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Yield Insights</Typography>
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
          {/* Monthly Yield Trend */}
          {data.monthly_yield && data.monthly_yield.length > 0 && (
            <Grid item xs={12} lg={8}>
              <Card className="glass-card">
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Monthly Yield Trend</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.monthly_yield}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="total_yield" stroke="#00C49F" strokeWidth={2} name="Total Yield" />
                      <Line type="monotone" dataKey="avg_yield" stroke="#FFBB28" strokeWidth={2} name="Average Yield" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Yield Type Breakdown */}
          {data.yield_breakdown && data.yield_breakdown.length > 0 && (
            <Grid item xs={12} lg={4}>
              <Card className="glass-card">
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Yield Type Breakdown</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.yield_breakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#00C49F"
                        dataKey="total_yield"
                      >
                        {data.yield_breakdown.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Yield by Type Bar Chart */}
          {data.yield_breakdown && data.yield_breakdown.length > 0 && (
            <Grid item xs={12}>
              <Card className="glass-card">
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Yield by Type</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.yield_breakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="yield_type" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="total_yield" fill="#00C49F" name="Total Yield" />
                      <Bar dataKey="avg_yield" fill="#FFBB28" name="Average Yield" />
                    </BarChart>
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
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(0, 196, 159, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#00C49F' }}>
                        {data.total_yield ? data.total_yield.toFixed(1) : '0'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Total Yield</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255, 187, 40, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFBB28' }}>
                        {data.avg_yield ? data.avg_yield.toFixed(1) : '0'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Average Yield</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(136, 132, 216, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#8884d8' }}>
                        {data.max_yield ? data.max_yield.toFixed(1) : '0'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Max Yield</Typography>
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

export default YieldInsightsPage;


