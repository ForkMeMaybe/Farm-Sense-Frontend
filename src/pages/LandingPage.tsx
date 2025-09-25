import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  Avatar,
  Chip,
  Stack,
  AppBar,
  Toolbar,
  useScrollTrigger,
} from "@mui/material";
import {
  Agriculture,
  Psychology,
  Language,
  Pets,
  ArrowForward,
  CheckCircle,
  Stars,
  Login,
  PersonAdd,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/common/GlassCard";
import projectLogo from "../assets/project_icon_no_background.png";

const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const features = [
    {
      icon: <Agriculture fontSize="large" />,
      title: t("landing.features.farm.title"),
      description: t("landing.features.farm.description"),
    },
    {
      icon: <Pets fontSize="large" />,
      title: t("landing.features.livestock.title"),
      description: t("landing.features.livestock.description"),
    },
    {
      icon: <Psychology fontSize="large" />,
      title: t("landing.features.ai.title"),
      description: t("landing.features.ai.description"),
    },
    {
      icon: <Language fontSize="large" />,
      title: t("landing.features.multilingual.title"),
      description: t("landing.features.multilingual.description"),
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Farmers" },
    { number: "50K+", label: "Livestock Tracked" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Support" },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Dairy Farmer",
      content:
        "FarmSense has revolutionized how I manage my farm. The AI insights are incredible!",
      avatar: "/api/placeholder/64/64",
    },
    {
      name: "Priya Patel",
      role: "Crop Farmer",
      content:
        "The multilingual support makes it so easy to use. Highly recommended!",
      avatar: "/api/placeholder/64/64",
    },
    {
      name: "Amit Singh",
      role: "Livestock Owner",
      content:
        "Health monitoring for my cattle is now effortless. Amazing technology!",
      avatar: "/api/placeholder/64/64",
    },
  ];

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      {/* Floating Navigation Header */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: trigger ? "rgba(15, 23, 42, 0.9)" : "transparent",
          backdropFilter: trigger ? "blur(20px)" : "none",
          borderBottom: trigger ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              background: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            FarmSense
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<Login />}
              onClick={() => navigate("/login")}
              sx={{
                borderColor: "rgba(255, 255, 255, 0.3)",
                color: "white",
                textTransform: "none",
                borderRadius: 2,
                "&:hover": {
                  borderColor: "#10B981",
                  background: "rgba(16, 185, 129, 0.1)",
                },
              }}
            >
              Login
            </Button>

            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => navigate("/register")}
              sx={{
                background: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
                textTransform: "none",
                borderRadius: 2,
                fontWeight: 600,
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 8px 16px rgba(16, 185, 129, 0.4)",
                },
              }}
            >
              Sign Up
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Ultra-Modern Hero Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dynamic background pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(52, 211, 153, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)
            `,
          }}
        />

        {/* Floating Elements */}
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            right: "10%",
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #10B981, #34D399)",
            opacity: 0.6,
            animation: "float 6s ease-in-out infinite",
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-20px)" },
            },
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={4}>
                {/* Badge */}
                <Chip
                  icon={<Stars />}
                  label="🚀 Next-Gen Farm Management"
                  sx={{
                    alignSelf: "flex-start",
                    background: "rgba(16, 185, 129, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                    color: "#10B981",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                />

                {/* Main Headline */}
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                    fontWeight: 800,
                    lineHeight: 1.1,
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Smart Farming
                  <br />
                  <Box
                    component="span"
                    sx={{
                      background:
                        "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Redefined
                  </Box>
                </Typography>

                {/* Subtitle */}
                <Typography
                  variant="h5"
                  sx={{
                    color: "#94a3b8",
                    fontWeight: 400,
                    lineHeight: 1.6,
                    maxWidth: 500,
                  }}
                >
                  Harness the power of AI to optimize your farm operations,
                  monitor livestock health, and maximize yields with our
                  comprehensive platform.
                </Typography>

                {/* CTA Buttons */}
                <Stack direction="row" spacing={3} sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PersonAdd />}
                    endIcon={<ArrowForward />}
                    onClick={() => navigate("/register")}
                    sx={{
                      background:
                        "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      boxShadow: "0 8px 24px rgba(16, 185, 129, 0.4)",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 32px rgba(16, 185, 129, 0.5)",
                      },
                    }}
                  >
                    Start Free Trial
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Login />}
                    onClick={() => navigate("/login")}
                    sx={{
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      color: "white",
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      backdropFilter: "blur(10px)",
                      "&:hover": {
                        borderColor: "#10B981",
                        background: "rgba(16, 185, 129, 0.1)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Sign In
                  </Button>
                </Stack>

                {/* Trust Indicators */}
                <Stack
                  direction="row"
                  spacing={4}
                  alignItems="center"
                  sx={{ mt: 4 }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CheckCircle sx={{ color: "#10B981", fontSize: 20 }} />
                    <Typography sx={{ color: "#cbd5e1", fontSize: "0.9rem" }}>
                      Free 30-day trial
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CheckCircle sx={{ color: "#10B981", fontSize: 20 }} />
                    <Typography sx={{ color: "#cbd5e1", fontSize: "0.9rem" }}>
                      No credit card required
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: "center" }}>
              {/* Hero Image/Animation */}
              <GlassCard
                glassVariant="glass"
                intensity="medium"
                sx={{
                  p: 4,
                  background: "rgba(255, 255, 255, 0.04)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: 420,
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                    background: "transparent",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
                  }}
                >
                  {/* Subtle glow backdrop */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: 380,
                      height: 380,
                      borderRadius: "50%",
                      background:
                        "radial-gradient(closest-side, rgba(16,185,129,0.25), rgba(16,185,129,0.05) 60%, transparent 70%)",
                      filter: "blur(6px)",
                    }}
                  />
                  <img
                    src={projectLogo}
                    alt="FarmSense logo"
                    style={{
                      width: "62%",
                      height: "62%",
                      objectFit: "contain",
                      filter: "drop-shadow(0 10px 28px rgba(16,185,129,0.35))",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        "linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
                      animation: "shimmer 3s ease-in-out infinite",
                      "@keyframes shimmer": {
                        "0%": { transform: "translateX(-100%)" },
                        "100%": { transform: "translateX(100%)" },
                      },
                    }}
                  />
                </Box>
              </GlassCard>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Modern Features Section */}
      <Box
        sx={{
          py: 12,
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={6} alignItems="center">
            {/* Section Header */}
            <Stack spacing={2} alignItems="center" textAlign="center">
              <Chip
                label="FEATURES"
                sx={{
                  background: "linear-gradient(135deg, #10B981, #34D399)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  px: 2,
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  fontWeight: 700,
                  color: "#1e293b",
                  textAlign: "center",
                }}
              >
                Everything You Need to Succeed
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#64748b",
                  maxWidth: "500px",
                  textAlign: "center",
                }}
              >
                Empowering farmers with modern technology and traditional wisdom
              </Typography>
            </Stack>

            {/* Feature Grid */}
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                  <GlassCard
                    glassVariant="glass"
                    interactive
                    intensity="light"
                    sx={{
                      height: "100%",
                      textAlign: "center",
                      p: 4,
                      background: "rgba(255, 255, 255, 0.8)",
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    {/* Icon Circle */}
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        background: "linear-gradient(135deg, #10B981, #34D399)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 3,
                        boxShadow: "0 8px 24px rgba(16, 185, 129, 0.3)",
                        color: "white",
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
                  </GlassCard>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box sx={{ bgcolor: "primary.main", color: "white", py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Stack alignItems="center" spacing={1}>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {stat.number}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {stat.label}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 12, bgcolor: "grey.50" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            textAlign="center"
            sx={{ mb: 6, fontWeight: 700, color: "text.primary" }}
          >
            What Our Farmers Say
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Card
                  sx={{
                    p: 3,
                    height: "100%",
                    boxShadow: 3,
                    borderRadius: 2,
                  }}
                >
                  <Stack spacing={2}>
                    <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                      "{testimonial.content}"
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={testimonial.avatar} alt={testimonial.name} />
                      <Stack>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {testimonial.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 12,
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #10B981 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
            `,
          }}
        />

        <Container
          maxWidth="md"
          sx={{ textAlign: "center", position: "relative", zIndex: 2 }}
        >
          <Typography
            variant="h2"
            sx={{
              mb: 3,
              fontWeight: 800,
              fontSize: { xs: "2rem", md: "2.5rem" },
              background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Ready to Transform Your Farm?
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mb: 6,
              opacity: 0.9,
              maxWidth: 600,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Join thousands of farmers who are already using AI-powered solutions
            to optimize their operations and increase yields.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<PersonAdd />}
              endIcon={<ArrowForward />}
              onClick={() => navigate("/register")}
              sx={{
                bgcolor: "white",
                color: "#10B981",
                px: 5,
                py: 2,
                fontSize: "1.2rem",
                fontWeight: 700,
                borderRadius: 3,
                textTransform: "none",
                minWidth: 200,
                boxShadow: "0 8px 24px rgba(255, 255, 255, 0.2)",
                "&:hover": {
                  bgcolor: "#f8fafc",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 32px rgba(255, 255, 255, 0.3)",
                },
              }}
            >
              Start Free Trial
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<Login />}
              onClick={() => navigate("/login")}
              sx={{
                borderColor: "rgba(255, 255, 255, 0.4)",
                color: "white",
                px: 5,
                py: 2,
                fontSize: "1.2rem",
                fontWeight: 600,
                borderRadius: 3,
                textTransform: "none",
                minWidth: 200,
                backdropFilter: "blur(10px)",
                "&:hover": {
                  borderColor: "white",
                  background: "rgba(255, 255, 255, 0.1)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Sign In
            </Button>
          </Stack>

          {/* Trust Indicators */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={4}
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 6 }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <CheckCircle sx={{ color: "white", fontSize: 20 }} />
              <Typography sx={{ fontSize: "0.95rem", opacity: 0.9 }}>
                30-day free trial
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CheckCircle sx={{ color: "white", fontSize: 20 }} />
              <Typography sx={{ fontSize: "0.95rem", opacity: 0.9 }}>
                No credit card required
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CheckCircle sx={{ color: "white", fontSize: 20 }} />
              <Typography sx={{ fontSize: "0.95rem", opacity: 0.9 }}>
                Cancel anytime
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "grey.900", color: "white", py: 4 }}>
        <Container maxWidth="lg">
          <Typography textAlign="center" variant="body2">
            © 2024 FarmSense. {t("landing.trustedBy")}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
