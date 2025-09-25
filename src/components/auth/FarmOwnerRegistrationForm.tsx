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
  useTheme,
  Link,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store/store';
import { registerFarmOwner, clearError } from '../../store/slices/authSlice';

interface FarmOwnerRegistrationFormProps {
  onBack: () => void;
}

const FarmOwnerRegistrationForm: React.FC<FarmOwnerRegistrationFormProps> = ({ onBack }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    re_password: '',
    farm_name: '',
    farm_location: '',
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

    if (!formData.farm_name || formData.farm_name.length < 2) {
      errors.farm_name = 'Farm name must be at least 2 characters';
    }

    if (!formData.farm_location || formData.farm_location.length < 2) {
      errors.farm_location = 'Farm location must be at least 2 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    dispatch(registerFarmOwner(formData));
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={onBack} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            {t('auth.farmOwner')} {t('auth.register')}
          </Typography>
          <Typography color="text.secondary">
            Create your farm management account
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Account Information
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
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

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Farm Information
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('auth.farmName')}
              name="farm_name"
              value={formData.farm_name}
              onChange={handleChange}
              required
              error={!!validationErrors.farm_name}
              helperText={validationErrors.farm_name}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('auth.farmLocation')}
              name="farm_location"
              value={formData.farm_location}
              onChange={handleChange}
              required
              error={!!validationErrors.farm_location}
              helperText={validationErrors.farm_location}
              placeholder="Enter farm address or location"
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
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
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
                color: theme.palette.primary.main,
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

export default FarmOwnerRegistrationForm;