import React, { useEffect, useState } from 'react';
import { Box, Button, MenuItem, TextField, Typography, Grid, Card, CardContent } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { amuService } from '../services/farmService';
import livestockService from '../services/livestockService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AMUInsightsPage: React.FC = () => {
  const [livestock, setLivestock] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [insights, setInsights] = useState('');
  const [chart, setChart] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    livestockService.getAll().then(setLivestock);
  }, []);

  const load = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const [ins, ch] = await Promise.all([
        amuService.generateInsights(Number(selected)),
        amuService.getChartData(Number(selected))
      ]);
      setInsights(ins.insights);
      setChart(ch);
    } catch (error) {
      console.error('Failed to load AMU insights:', error);
      setInsights(`Error generating insights: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>AMU Insights</Typography>
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
          {loading ? 'Generating...' : 'Generate Insights'}
        </Button>
      </Box>

      {chart && chart.chart_data && (
        <Grid container spacing={3}>
          {/* Drug Usage History Chart */}
          {chart.chart_data.labels && chart.chart_data.labels.length > 0 && (
            <Grid item xs={12}>
              <Card className="glass-card">
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Drug Usage History</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chart.chart_data.labels.map((date: string, index: number) => {
                      const dataPoint: any = { date };
                      chart.chart_data.datasets.forEach((dataset: any) => {
                        dataPoint[dataset.label] = dataset.data[index];
                      });
                      return dataPoint;
                    })}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {chart.chart_data.datasets.map((dataset: any, index: number) => (
                        <Bar
                          key={dataset.label}
                          dataKey={dataset.label}
                          fill={dataset.backgroundColor}
                          name={dataset.label}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Summary Stats */}
          {chart.summary && (
            <Grid item xs={12}>
              <Card className="glass-card">
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Summary Statistics</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255, 128, 66, 0.1)', borderRadius: 2 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF8042' }}>
                          {chart.summary.total_treatments || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Total Treatments</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(136, 132, 216, 0.1)', borderRadius: 2 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#8884d8' }}>
                          {chart.summary.unique_drugs || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Unique Drugs Used</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(0, 196, 159, 0.1)', borderRadius: 2 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#00C49F' }}>
                          {chart.summary.time_period || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Time Period</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255, 187, 40, 0.1)', borderRadius: 2 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFBB28' }}>
                          {chart.chart_data.datasets?.length || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Drug Types</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {/* AI Insights */}
      {insights && (
        <Card className="glass-card" sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>AI-Generated Insights</Typography>
            <Typography whiteSpace="pre-wrap" sx={{ lineHeight: 1.6 }}>
              {insights}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AMUInsightsPage;


