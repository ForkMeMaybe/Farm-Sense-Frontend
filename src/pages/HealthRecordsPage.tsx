import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
  Avatar,
} from '@mui/material';
import { Add, LocalHospital } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const HealthRecordsPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {t('health.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track health events, treatments, and medical history
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.error.main} 30%, ${theme.palette.warning.main} 90%)`,
            px: 3,
          }}
        >
          {t('health.addRecord')}
        </Button>
      </Box>

      <Card sx={{ textAlign: 'center', py: 8 }}>
        <CardContent>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 3,
              backgroundColor: theme.palette.error.light,
            }}
          >
            <LocalHospital sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('health.healthHistory')}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Start recording health events for your livestock
          </Typography>
          <Button variant="contained" startIcon={<Add />} color="error">
            {t('health.addRecord')}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HealthRecordsPage;