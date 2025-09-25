import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  useTheme,
} from '@mui/material';
import { Add, Pets, Edit, Visibility } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const LivestockPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { animals } = useSelector((state: RootState) => state.livestock);

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return theme.palette.success.main;
      case 'sick':
        return theme.palette.error.main;
      case 'recovering':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getSpeciesEmoji = (species: string) => {
    switch (species.toLowerCase()) {
      case 'cow':
        return '🐄';
      case 'buffalo':
        return '🐃';
      case 'goat':
        return '🐐';
      case 'sheep':
        return '🐑';
      case 'chicken':
        return '🐔';
      default:
        return '🐾';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {t('livestock.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your livestock records and track their health status
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            px: 3,
          }}
        >
          {t('livestock.addNew')}
        </Button>
      </Box>

      {animals.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 3,
                backgroundColor: theme.palette.grey[100],
              }}
            >
              <Pets sx={{ fontSize: 40, color: theme.palette.grey[400] }} />
            </Avatar>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t('livestock.noAnimals')}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {t('livestock.addFirstAnimal')}
            </Typography>
            <Button variant="contained" startIcon={<Add />}>
              {t('livestock.addAnimal')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {animals.map((animal) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={animal.id}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        backgroundColor: theme.palette.primary.light,
                        mr: 2,
                        fontSize: '1.5rem',
                      }}
                    >
                      {getSpeciesEmoji(animal.species)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {animal.tag_id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t(`species.${animal.species.toLowerCase()}`)} • {animal.gender === 'M' ? t('livestock.male') : t('livestock.female')}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {t('livestock.breed')}: {animal.breed}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {t('livestock.dateOfBirth')}: {new Date(animal.date_of_birth).toLocaleDateString()}
                    </Typography>
                    {animal.current_weight_kg && (
                      <Typography variant="body2" color="text.secondary">
                        {t('livestock.currentWeight')}: {animal.current_weight_kg} kg
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Chip
                      label={t(`livestock.${animal.health_status}`)}
                      size="small"
                      sx={{
                        backgroundColor: `${getHealthStatusColor(animal.health_status)}20`,
                        color: getHealthStatusColor(animal.health_status),
                        fontWeight: 600,
                      }}
                    />
                    <Box>
                      <IconButton size="small" color="primary">
                        <Visibility />
                      </IconButton>
                      <IconButton size="small" color="primary">
                        <Edit />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default LivestockPage;