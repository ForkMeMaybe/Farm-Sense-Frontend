import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Avatar,
  Paper,
} from '@mui/material';
import {
  Agriculture,
  Psychology,
  SignalWifiOff,
  Language,
  TrendingUp,
  Security,
  Pets,
  LocalHospital,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: <Agriculture fontSize="large" />,
      title: t('landing.smartMonitoring'),
      description: t('landing.smartMonitoringDesc'),
    },
    {
      icon: <Psychology fontSize="large" />,
      title: t('landing.aiInsights'),
      description: t('landing.aiInsightsDesc'),
    },
    {
      icon: <SignalWifiOff fontSize="large" />,
      title: t('landing.offlineReady'),
      description: t('landing.offlineReadyDesc'),
    },
    {
      icon: <Language fontSize="large" />,
      title: t('landing.multiLanguage'),
      description: t('landing.multiLanguageDesc'),
    },
  ];

  const testimonials = [
    {
      name: 'राज किसान',
      location: 'पंजाब',
      avatar: '👨‍🌾',
      text: 'फार्मसेंस ने मेरे पशुधन प्रबंधन को बहुत आसान बना दिया है। अब मैं दवाओं का सही उपयोग कर पाता हूँ।',
    },
    {
      name: 'सुनीता देवी',
      location: 'हरियाणा',
      avatar: '👩‍🌾',
      text: 'यह ऐप मेरे डेयरी फार्म के लिए बहुत उपयोगी है। स्वास्थ्य रिकॉर्ड रखना अब बहुत सरल है।',
    },
    {
      name: 'Mohan Reddy',
      location: 'Telangana',
      avatar: '👨‍🌾',
      text: 'FarmSense has revolutionized how I manage my cattle. The AI insights help me make better decisions.',
    },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(https://images.pexels.com/photos/533988/pexels-photo-533988.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 700,
                  mb: 3,
                  lineHeight: 1.2,
                }}
              >
                {t('landing.heroTitle')}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  lineHeight: 1.6,
                }}
              >
                {t('landing.heroSubtitle')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    bgcolor: 'white',
                    color: theme.palette.primary.main,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'grey.100',
                    },
                  }}
                >
                  {t('landing.getStarted')}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  {t('auth.login')}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
              <Box
                component="img"
                src="https://images.pexels.com/photos/164455/pexels-photo-164455.jpeg"
                alt="Indian Farmer with Cattle"
                sx={{
                  width: '100%',
                  maxWidth: 500,
                  height: 'auto',
                  borderRadius: 4,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h2"
          textAlign="center"
          sx={{ mb: 2, fontWeight: 700, color: 'text.primary' }}
        >
          {t('landing.features')}
        </Typography>
        <Typography
          variant="h6"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Empowering farmers with modern technology and traditional wisdom
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(76, 175, 80, 0.15)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Statistics Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} textAlign="center">
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                10,000+
              </Typography>
              <Typography variant="h6">
                Active Farmers
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                50,000+
              </Typography>
              <Typography variant="h6">
                Livestock Monitored
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                8+
              </Typography>
              <Typography variant="h6">
                Indian Languages
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                99.5%
              </Typography>
              <Typography variant="h6">
                Compliance Rate
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h2"
          textAlign="center"
          sx={{ mb: 6, fontWeight: 700, color: 'text.primary' }}
        >
          {t('landing.testimonials')}
        </Typography>
        
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 3,
                  border: `2px solid ${theme.palette.primary.light}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      mr: 2,
                      bgcolor: 'transparent',
                      fontSize: '2rem',
                    }}
                  >
                    {testimonial.avatar}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {testimonial.name}
                    </Typography>
                    <Typography color="text.secondary">
                      {testimonial.location}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="body1"
                  sx={{ 
                    fontStyle: 'italic',
                    lineHeight: 1.6,
                    color: 'text.secondary',
                  }}
                >
                  "{testimonial.text}"
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'secondary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{ mb: 3, fontWeight: 700 }}
          >
            {t('landing.joinCommunity')}
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 4, opacity: 0.9 }}
          >
            Join thousands of farmers already using FarmSense to manage their livestock more effectively
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              bgcolor: 'white',
              color: theme.palette.secondary.main,
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
          >
            {t('landing.getStarted')}
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Typography textAlign="center" variant="body2">
            © 2024 FarmSense. {t('landing.trustedBy')}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;