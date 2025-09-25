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
      const res = await apiClient.get(`/api/feed-insights/chart-data/?livestock_id=${Number(selected)}`);
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
          {data.spend_chart && data.spend_chart.labels && data.spend_chart.labels.length > 0 && (
            <Grid item xs={12} lg={8}>
              <Card className="glass-card">
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Monthly Feed Spend Trend</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.spend_chart.labels.map((label: string, index: number) => ({
                      month: label,
                      total_spend: data.spend_chart.datasets[0].data[index]
                    }))}>
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
          {data.breakdown_chart && data.breakdown_chart.labels && data.breakdown_chart.labels.length > 0 && (
            <Grid item xs={12} lg={4}>
              <Card className="glass-card">
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Feed Type Breakdown</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.breakdown_chart.labels.map((label: string, index: number) => {
                      const entry: any = { month: label };
                      data.breakdown_chart.datasets.forEach((dataset: any) => {
                        entry[dataset.label] = dataset.data[index];
                      });
                      return entry;
                    })}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={formatCurrency} />
                      <Tooltip formatter={(value: number) => [formatCurrency(value), 'Spend']} />
                      <Legend />
                      {data.breakdown_chart.datasets.map((dataset: any, index: number) => (
                        <Bar 
                          key={dataset.label}
                          dataKey={dataset.label} 
                          stackId="feed"
                          fill={dataset.backgroundColor}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Summary Stats */}
          {data.summary && (
            <Grid item xs={12}>
              <Card className="glass-card">
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Summary Statistics</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(136, 132, 216, 0.1)', borderRadius: 2 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#8884d8' }}>
                          ₦{data.summary.total_spend ? data.summary.total_spend.toFixed(2) : '0.00'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Total Spend</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(0, 196, 159, 0.1)', borderRadius: 2 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#00C49F' }}>
                          ₦{data.summary.avg_monthly_spend ? data.summary.avg_monthly_spend.toFixed(2) : '0.00'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Avg Monthly Spend</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255, 187, 40, 0.1)', borderRadius: 2 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFBB28' }}>
                          {data.summary.time_period || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Time Period</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255, 128, 66, 0.1)', borderRadius: 2 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF8042' }}>
                          {data.spend_chart ? data.spend_chart.labels.length : 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Months Tracked</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default FeedInsightsPage;


