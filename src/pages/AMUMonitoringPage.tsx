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
import { Add, Medication } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const AMUMonitoringPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {t('amu.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor antimicrobial usage and ensure compliance
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.info.main} 30%, ${theme.palette.primary.main} 90%)`,
            px: 3,
          }}
        >
          Add Treatment
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
              backgroundColor: theme.palette.info.light,
            }}
          >
            <Medication sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('amu.activeTreatments')}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Track antimicrobial treatments and withdrawal periods
          </Typography>
          <Button variant="contained" startIcon={<Add />} color="info">
            Start Treatment
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AMUMonitoringPage;