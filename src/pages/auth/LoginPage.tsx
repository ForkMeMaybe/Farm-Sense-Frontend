import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { loginUser, clearError } from "../../store/slices/authSlice";

const LoginPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  React.useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "url(https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.15,
        }}
      />

      {/* Floating glass elements */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "200px",
          height: "200px",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "50%",
          opacity: 0.6,
          animation: "pulse 3s infinite",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "15%",
          right: "15%",
          width: "150px",
          height: "150px",
          background: "rgba(16, 185, 129, 0.2)",
          backdropFilter: "blur(10px)",
          borderRadius: "50%",
          opacity: 0.7,
          animation: "pulse 4s infinite",
        }}
      />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={0}
          className="glass-card fade-in"
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box textAlign="center" sx={{ mb: 4 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
                letterSpacing: "-0.02em",
              }}
            >
              🌾 FarmSense
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: "text.primary",
              }}
            >
              {t("auth.welcomeBack")}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontSize: "1.1rem",
              }}
            >
              {t("auth.empoweringFarmers")}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t("auth.email")}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
              autoComplete="email"
            />

            <TextField
              fullWidth
              label={t("auth.password")}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
              autoComplete="current-password"
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                mb: 3,
                fontSize: "1.1rem",
                fontWeight: 600,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  {t("common.loading")}
                </>
              ) : (
                t("auth.login")
              )}
            </Button>

            <Box textAlign="center">
              <Typography color="text.secondary">
                {t("auth.dontHaveAccount")}{" "}
                <Link
                  component={RouterLink}
                  to="/register"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {t("auth.register")}
                </Link>
              </Typography>
            </Box>
          </form>

          {/* --- ADDED TEST CREDENTIALS BOX --- */}
          <Box
            sx={{
              mt: 4,
              p: 2.5,
              background: "rgba(230, 245, 240, 0.7)", // Light green tint glass
              border: "1px solid rgba(16, 185, 129, 0.2)",
              borderRadius: 2,
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: 700,
                mb: 1.5,
                color: "text.primary",
                textAlign: "center",
              }}
            >
              Test User Credentials
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", px: 1 }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 600 }}
              >
                Email:
              </Typography>
              <Typography
                variant="body2"
                color="text.primary"
                sx={{ fontFamily: "monospace" }}
              >
                owner@greenpastures.com
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                px: 1,
                mt: 0.5,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 600 }}
              >
                Pass:
              </Typography>
              <Typography
                variant="body2"
                color="text.primary"
                sx={{ fontFamily: "monospace" }}
              >
                testpass123
              </Typography>
            </Box>
          </Box>
          {/* --- END OF ADDED BOX --- */}
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
