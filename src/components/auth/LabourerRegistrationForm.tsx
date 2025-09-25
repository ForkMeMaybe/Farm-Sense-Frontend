import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  useTheme,
  Link,
} from '@mui/material';
import { ArrowBack, Info } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store/store';
import { registerLabourer, clearError } from '../../store/slices/authSlice';

interface LabourerRegistrationFormProps {
  onBack: () => void;
}

const LabourerRegistrationForm: React.FC<LabourerRegistrationFormProps> = ({ onBack }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    re_password: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.username || formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password || formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.re_password) {
      errors.re_password = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    dispatch(registerLabourer(formData));
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={onBack} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.secondary.main }}>
            {t('auth.labourer')} {t('auth.register')}
          </Typography>
          <Typography color="text.secondary">
            Create your farm labourer account
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 4, bgcolor: 'info.light', borderLeft: `4px solid ${theme.palette.info.main}` }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Info sx={{ color: 'info.main', mt: 0.5, mr: 2 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Next Steps
              </Typography>
              <Typography variant="body2">
                After registration, you can browse and request to join farms in your area. 
                Farm owners will be able to approve your requests and add you to their team.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Account Information
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('auth.email')}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              autoComplete="email"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('auth.username')}
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              error={!!validationErrors.username}
              helperText={validationErrors.username}
              autoComplete="username"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('auth.password')}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              error={!!validationErrors.password}
              helperText={validationErrors.password}
              autoComplete="new-password"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('auth.confirmPassword')}
              name="re_password"
              type="password"
              value={formData.re_password}
              onChange={handleChange}
              required
              error={!!validationErrors.re_password}
              helperText={validationErrors.re_password}
              autoComplete="new-password"
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="outlined"
              onClick={onBack}
              size="large"
              disabled={loading}
            >
              {t('common.cancel')}
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="contained"
              type="submit"
              size="large"
              disabled={loading}
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.main} 90%)`,
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  {t('common.loading')}
                </>
              ) : (
                t('auth.createAccount')
              )}
            </Button>
          </Grid>
        </Grid>

        <Box textAlign="center" sx={{ mt: 3 }}>
          <Typography color="text.secondary">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link
              component={RouterLink}
              to="/login"
              sx={{
                color: theme.palette.secondary.main,
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {t('auth.login')}
            </Link>
          </Typography>
        </Box>
      </form>
    </>
  );
};

export default LabourerRegistrationForm;