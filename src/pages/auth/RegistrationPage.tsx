import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  useTheme,
} from '@mui/material';
import { Agriculture, Work } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import FarmOwnerRegistrationForm from '../../components/auth/FarmOwnerRegistrationForm';
import LabourerRegistrationForm from '../../components/auth/LabourerRegistrationForm';

const RegistrationPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [step, setStep] = useState<'selection' | 'registration'>('selection');
  const [userType, setUserType] = useState<'farm-owner' | 'labourer' | null>(null);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleTypeSelection = (type: 'farm-owner' | 'labourer') => {
    setUserType(type);
    setStep('registration');
  };

  const handleBack = () => {
    setStep('selection');
    setUserType(null);
  };

  const userTypeCards = [
    {
      type: 'farm-owner' as const,
      title: t('auth.farmOwner'),
      description: 'Register as a farm owner to manage your livestock and operations',
      icon: <Agriculture sx={{ fontSize: 60 }} />,
      color: theme.palette.primary.main,
    },
    {
      type: 'labourer' as const,
      title: t('auth.labourer'),
      description: 'Register as a farm labourer to work with existing farms',
      icon: <Work sx={{ fontSize: 60 }} />,
      color: theme.palette.secondary.main,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        py: 4,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1,
        }}
      />
      
      <Container maxWidth={step === 'selection' ? 'md' : 'sm'} sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          {step === 'selection' ? (
            <>
              <Box textAlign="center" sx={{ mb: 4 }}>
                <Typography
                  variant="h3"
                  sx={{ 
                    fontWeight: 700, 
                    color: theme.palette.primary.main,
                    mb: 1,
                  }}
                >
                  🌾 FarmSense
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  {t('auth.joinFarmSense')}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {t('auth.empoweringFarmers')}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t('auth.selectUserType')}
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {userTypeCards.map((card) => (
                  <Grid item xs={12} sm={6} key={card.type}>
                    <Card
                      sx={{
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: `0 12px 24px ${card.color}30`,
                        },
                      }}
                    >
                      <CardActionArea
                        onClick={() => handleTypeSelection(card.type)}
                        sx={{ p: 3, height: '100%' }}
                      >
                        <CardContent sx={{ textAlign: 'center', height: '100%' }}>
                          <Box
                            sx={{
                              color: card.color,
                              mb: 3,
                            }}
                          >
                            {card.icon}
                          </Box>
                          <Typography
                            variant="h5"
                            sx={{ fontWeight: 600, mb: 2 }}
                          >
                            {card.title}
                          </Typography>
                          <Typography color="text.secondary">
                            {card.description}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            <>
              {userType === 'farm-owner' && (
                <FarmOwnerRegistrationForm onBack={handleBack} />
              )}
              {userType === 'labourer' && (
                <LabourerRegistrationForm onBack={handleBack} />
              )}
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default RegistrationPage;