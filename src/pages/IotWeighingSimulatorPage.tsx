import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Chip,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Tooltip,
  Avatar,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

type Reading = {
  timestamp: number;
  dosage: number;
  weightKg: number;
  temperatureC: number;
  humidityPct: number;
};

type LogEntry = {
  id: string;
  timestamp: number;
  dosage: number;
  message: string;
};

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString();
}

const MAX_POINTS = 60;

const IotWeighingSimulatorPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [threshold, setThreshold] = useState<number>(2.0);
  const [intervalMs, setIntervalMs] = useState<number>(2000);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const timerRef = useRef<number | null>(null);
  const [species, setSpecies] = useState<"cattle" | "pig" | "sheep">("cattle");
  const [animalId, setAnimalId] = useState<string>("COW-001");

  const latestReading = readings.length ? readings[readings.length - 1] : undefined;
  const isOverThreshold = latestReading ? latestReading.dosage > threshold : false;

  const getSpeciesWeightRange = useCallback((): { min: number; max: number } => {
    switch (species) {
      case "pig":
        return { min: 50, max: 300 };
      case "sheep":
        return { min: 30, max: 120 };
      default:
        return { min: 200, max: 800 };
    }
  }, [species]);

  const generateEnv = useCallback(() => {
    // Rough realistic barn ranges
    const temperatureC = Math.round((Math.random() * (35 - 18) + 18) * 10) / 10; // 18-35°C
    const humidityPct = Math.round(Math.random() * (90 - 40) + 40); // 40-90%
    return { temperatureC, humidityPct };
  }, []);

  const generateWeight = useCallback(() => {
    const { min, max } = getSpeciesWeightRange();
    const base = Math.random() * (max - min) + min;
    // Add small jitter to mimic scale noise
    const jitter = (Math.random() - 0.5) * (max - min) * 0.01;
    return Math.max(min, Math.min(max, base + jitter));
  }, [getSpeciesWeightRange]);

  const addReading = useCallback((dosage: number) => {
    const { temperatureC, humidityPct } = generateEnv();
    const weightKg = generateWeight();
    setReadings((prev) => {
      const next: Reading[] = [
        ...prev,
        { timestamp: Date.now(), dosage, weightKg, temperatureC, humidityPct },
      ];
      if (next.length > MAX_POINTS) {
        return next.slice(next.length - MAX_POINTS);
      }
      return next;
    });
  }, [generateEnv, generateWeight]);

  const addLog = useCallback((dosage: number) => {
    const entry: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: Date.now(),
      dosage,
      message: "AMU Alert: Dosage exceeded threshold",
    };
    setLogs((prev) => [entry, ...prev].slice(0, 100));
  }, []);

  const generateDosage = useCallback(() => {
    const value = Math.round((Math.random() * (3.0 - 0.5) + 0.5) * 100) / 100;
    return value;
  }, []);

  const start = useCallback(() => {
    if (timerRef.current) return;
    setIsRunning(true);
    // immediate tick so user sees data right away
    const immediate = generateDosage();
    addReading(immediate);
    if (immediate > threshold) {
      addLog(immediate);
    }
    timerRef.current = window.setInterval(() => {
      const dosage = generateDosage();
      addReading(dosage);
      if (dosage > threshold) {
        addLog(dosage);
      }
    }, Math.max(500, intervalMs));
  }, [addLog, addReading, generateDosage, intervalMs, threshold]);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  // If interval changes while running, restart timer for responsiveness
  useEffect(() => {
    if (!isRunning) return;
    stop();
    // small timeout to ensure clearInterval settles before starting again
    const t = window.setTimeout(() => start(), 0);
    return () => window.clearTimeout(t);
  }, [intervalMs, start, stop, isRunning]);

  const chartData = useMemo(
    () =>
      readings.map((r) => ({
        time: formatTime(r.timestamp),
        dosage: r.dosage,
        weight: Math.round(r.weightKg),
        temperature: r.temperatureC,
        humidity: r.humidityPct,
      })),
    [readings]
  );

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            IoT Weighing Simulator
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time simulation of a weighing device for dose limit exceedance alerts.
          </Typography>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card
            sx={{
              border: "1px solid",
              borderColor: isOverThreshold ? "error.light" : "divider",
              boxShadow: isOverThreshold ? "0 0 0 4px rgba(211,47,47,0.15)" : undefined,
              transition: "all 200ms ease",
            }}
          >
            <CardHeader
              title={
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="h6">Live Farm Readings</Typography>
                  {isOverThreshold ? (
                    <Chip color="error" label="ALERT: Above Threshold" />
                  ) : (
                    <Chip color="success" label="Normal" />
                  )}
                </Stack>
              }
              subheader={
                latestReading
                  ? `Latest dosage: ${latestReading.dosage.toFixed(2)} g • Weight: ${Math.round(
                      latestReading.weightKg
                    )} kg • Temp: ${latestReading.temperatureC.toFixed(1)}°C • Humidity: ${latestReading.humidityPct}%`
                  : "No data yet"
              }
            />
            <CardContent>
              <Box sx={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" domain={[0, 3.5]} tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 900]} tick={{ fontSize: 12 }} />
                    <RechartsTooltip />
                    <ReferenceLine y={threshold} yAxisId="left" stroke="#f44336" strokeDasharray="6 6" label={`Threshold ${threshold} g`} />
                    <Line yAxisId="left" type="monotone" dataKey="dosage" name="Dosage (g)" stroke="#10B981" dot={false} strokeWidth={2} isAnimationActive={false} />
                    <Line yAxisId="right" type="monotone" dataKey="weight" name="Weight (kg)" stroke="#3b82f6" dot={false} strokeWidth={2} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Controls" />
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ width: 40, height: 40, fontSize: 24 }}>
                    {species === "cattle" ? "🐄" : species === "pig" ? "🐖" : "🐑"}
                  </Avatar>
                  <FormControl fullWidth>
                    <InputLabel id="species-label">Species</InputLabel>
                    <Select
                      labelId="species-label"
                      label="Species"
                      value={species}
                      onChange={(e) => setSpecies(e.target.value as any)}
                    >
                      <MenuItem value="cattle">Cattle</MenuItem>
                      <MenuItem value="pig">Pig</MenuItem>
                      <MenuItem value="sheep">Sheep</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>

                <TextField
                  label="Animal ID"
                  value={animalId}
                  onChange={(e) => setAnimalId(e.target.value)}
                />

                <FormControlLabel
                  control={<Switch checked={isRunning} onChange={(e) => (e.target.checked ? start() : stop())} />}
                  label={isRunning ? "Simulation Running" : "Simulation Stopped"}
                />

                <TextField
                  label="Threshold (g)"
                  type="number"
                  value={threshold}
                  inputProps={{ step: 0.1, min: 0 }}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                />

                <TextField
                  label="Interval (ms)"
                  type="number"
                  value={intervalMs}
                  inputProps={{ step: 100, min: 200 }}
                  onChange={(e) => setIntervalMs(parseInt(e.target.value, 10))}
                />

                <Stack direction="row" spacing={1}>
                  <Button variant="contained" color="success" onClick={start} disabled={isRunning}>
                    Start
                  </Button>
                  <Button variant="outlined" color="inherit" onClick={stop} disabled={!isRunning}>
                    Stop
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setReadings([]);
                      setLogs([]);
                    }}
                  >
                    Reset
                  </Button>
                </Stack>

                <Tooltip
                  title="Dosage threshold is independent of weight. In practice, mg/kg dosing guidance can be applied based on species and weight."
                  placement="top-start"
                >
                  <Typography variant="caption" color="text.secondary" sx={{ cursor: "help" }}>
                    Tip: Toggle running and set a low threshold to see alerts. Weight/Env values simulate barn conditions.
                  </Typography>
                </Tooltip>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title="AMU Event Log" subheader="Records of dosage exceedances" />
            <CardContent>
              {logs.length === 0 ? (
                <Typography color="text.secondary">No alerts yet.</Typography>
              ) : (
                <Stack spacing={1}>
                  {logs.map((log) => (
                    <Box
                      key={log.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 1.5,
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                        backgroundColor: "rgba(244,67,54,0.04)",
                      }}
                    >
                      <Stack>
                        <Typography variant="body2" fontWeight={600} color="error.main">
                          {log.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(log.timestamp).toLocaleString()} • {species.toUpperCase()} • {animalId}
                        </Typography>
                      </Stack>
                      <Chip color="error" variant="outlined" label={`${log.dosage.toFixed(2)} g`} />
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            In real life, this will be linked with a digital scale + IoT device (load cells, RFID for animal ID, and environmental sensors).
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default IotWeighingSimulatorPage;


