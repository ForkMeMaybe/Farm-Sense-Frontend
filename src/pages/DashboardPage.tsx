import React, { useEffect } from "react";
import {
  Box,
  CardContent,
  Typography,
  Paper,
  Fab,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Container,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import GlassCard from "../components/common/GlassCard";
import {
  Add,
  Pets,
  LocalHospital,
  Warning,
  CheckCircle,
  Agriculture,
  Assessment,
  TrendingUp,
  TrendingDown,
  Refresh,
  MoreVert,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../store/store";
import { fetchLivestock } from "../store/slices/livestockSlice";

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);
  const { animals } = useSelector((state: RootState) => state.livestock);
  const animalList = Array.isArray(animals) ? animals : [];

  useEffect(() => {
    dispatch(fetchLivestock());
  }, [dispatch]);

  // Calculate statistics
  const totalAnimals = animalList.length;
  const healthyAnimals = animalList.filter(
    (animal) => animal.health_status === "healthy"
  ).length;
  const sickAnimals = animalList.filter(
    (animal) => animal.health_status === "sick"
  ).length;
  const healthyPercent =
    totalAnimals > 0 ? Math.round((healthyAnimals / totalAnimals) * 100) : 0;

  const stats = [
    {
      title: t("dashboard.totalLivestock"),
      value: totalAnimals,
      icon: <Pets />,
      color: theme.palette.primary.main,
      trend: "+5.2%",
      trendDirection: "up",
      subtitle: "Total registered animals",
    },
    {
      title: t("dashboard.healthyAnimals"),
      value: healthyAnimals,
      icon: <CheckCircle />,
      color: theme.palette.success.main,
      trend: "+2.1%",
      trendDirection: "up",
      subtitle: "Animals in good health",
    },
    {
      title: "Sick Animals",
      value: sickAnimals,
      icon: <Warning />,
      color: theme.palette.error.main,
      trend: "-1.3%",
      trendDirection: "down",
      subtitle: "Requiring attention",
    },
    {
      title: "Compliance Score",
      value: "98.5%",
      icon: <Assessment />,
      color: theme.palette.info.main,
      trend: "+0.8%",
      trendDirection: "up",
      subtitle: "Overall farm compliance",
    },
  ];

  const quickActions = [
    {
      title: t("dashboard.addAnimal"),
      icon: <Pets />,
      color: theme.palette.primary.main,
      action: () => navigate("/livestock"),
    },
    {
      title: t("dashboard.recordHealth"),
      icon: <LocalHospital />,
      color: theme.palette.error.main,
      action: () => navigate("/health-records"),
    },
    {
      title: t("dashboard.trackFeed"),
      icon: <Agriculture />,
      color: theme.palette.success.main,
      action: () => navigate("/feed-management"),
    },
    {
      title: t("dashboard.viewReports"),
      icon: <Assessment />,
      color: theme.palette.info.main,
      action: () => navigate("/yield-tracking"),
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "health",
      animal: "Cow #A001",
      action: "Vaccination completed",
      time: "2 hours ago",
      status: "success",
    },
    {
      id: 2,
      type: "feed",
      animal: "Buffalo #B002",
      action: "Feed recorded - 25kg",
      time: "4 hours ago",
      status: "info",
    },
    {
      id: 3,
      type: "health",
      animal: "Goat #G003",
      action: "Treatment started",
      time: "1 day ago",
      status: "warning",
    },
  ];

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        minHeight: "100vh",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        {/* Welcome Header */}
        <Box sx={{ mb: 6, pt: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  background:
                    "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  lineHeight: 1.2,
                }}
              >
                {t("dashboard.welcomeBack")}, {user?.username}! 🌾
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: "1rem", md: "1.125rem" },
                }}
              >
                Here's what's happening with your farm today
              </Typography>
            </Box>
            <Tooltip title="Refresh Data">
              <IconButton
                onClick={() => dispatch(fetchLivestock())}
                sx={{
                  background: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.9)",
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* Statistics Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 4,
            mb: 6,
          }}
        >
          {stats.map((stat, index) => (
            <Box
              key={index}
              className="slide-in-left"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <GlassCard
                glassVariant="glass"
                interactive
                intensity="medium"
                sx={{
                  height: "100%",
                  background: `linear-gradient(135deg, ${stat.color}08 0%, ${stat.color}03 100%)`,
                  border: `1px solid ${stat.color}20`,
                  position: "relative",
                  overflow: "hidden",
                  backdropFilter: "blur(20px)",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`,
                  },
                  "&:hover": {
                    background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}08 100%)`,
                    boxShadow: `0 25px 50px ${stat.color}25`,
                    transform: "translateY(-8px)",
                  },
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <CardContent sx={{ position: "relative", zIndex: 1, p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="overline"
                        sx={{
                          mb: 1,
                          color: "text.secondary",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          letterSpacing: "0.1em",
                        }}
                      >
                        {stat.title}
                      </Typography>
                      <Typography
                        variant="h2"
                        sx={{
                          fontWeight: 800,
                          color: stat.color,
                          mb: 0.5,
                          lineHeight: 1.1,
                          fontSize: { xs: "2rem", md: "2.5rem" },
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2, fontSize: "0.875rem" }}
                      >
                        {stat.subtitle}
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        background: `linear-gradient(135deg, ${stat.color}, ${stat.color}CC)`,
                        width: 56,
                        height: 56,
                        boxShadow: `0 8px 20px ${stat.color}40`,
                        ml: 2,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      icon={
                        stat.trendDirection === "up" ? (
                          <TrendingUp />
                        ) : (
                          <TrendingDown />
                        )
                      }
                      label={stat.trend}
                      size="small"
                      sx={{
                        background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}25)`,
                        color: stat.color,
                        fontWeight: 600,
                        borderRadius: 3,
                        border: `1px solid ${stat.color}30`,
                        "& .MuiChip-label": {
                          fontSize: "0.75rem",
                        },
                        "& .MuiChip-icon": {
                          fontSize: "1rem",
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </GlassCard>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 4,
          }}
        >
          {/* Quick Actions */}
          <Box>
            <GlassCard
              glassVariant="glass"
              interactive
              intensity="medium"
              sx={{
                height: "100%",
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "text.primary" }}
                  >
                    {t("dashboard.quickActions")}
                  </Typography>
                  <IconButton size="small" sx={{ color: "text.secondary" }}>
                    <MoreVert />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 2,
                  }}
                >
                  {quickActions.map((action, index) => (
                    <Box key={index}>
                      <Paper
                        sx={{
                          p: 2.5,
                          textAlign: "center",
                          cursor: "pointer",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          backgroundColor: `rgba(255, 255, 255, 0.8)`,
                          backdropFilter: "blur(10px)",
                          border: `1px solid ${action.color}20`,
                          borderRadius: 3,
                          "&:hover": {
                            backgroundColor: `${action.color}08`,
                            transform: "translateY(-4px)",
                            boxShadow: `0 12px 24px ${action.color}20`,
                            border: `1px solid ${action.color}40`,
                          },
                        }}
                        onClick={action.action}
                        role="button"
                        aria-label={
                          typeof action.title === "string"
                            ? action.title
                            : undefined
                        }
                      >
                        <Avatar
                          sx={{
                            background: `linear-gradient(135deg, ${action.color}, ${action.color}CC)`,
                            mx: "auto",
                            mb: 1.5,
                            width: 52,
                            height: 52,
                            boxShadow: `0 4px 12px ${action.color}30`,
                          }}
                        >
                          {action.icon}
                        </Avatar>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, fontSize: "0.875rem" }}
                        >
                          {action.title}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </GlassCard>
          </Box>

          {/* Recent Activity */}
          <Box>
            <GlassCard
              glassVariant="glass"
              interactive
              intensity="medium"
              sx={{
                height: "100%",
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "text.primary" }}
                  >
                    {t("dashboard.recentActivity")}
                  </Typography>
                  <IconButton size="small" sx={{ color: "text.secondary" }}>
                    <MoreVert />
                  </IconButton>
                </Box>
                <List sx={{ p: 0 }}>
                  {recentActivities.map((activity, idx) => (
                    <React.Fragment key={activity.id}>
                      <ListItem
                        sx={{
                          px: 0,
                          py: 1.5,
                          borderRadius: 2,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: "rgba(16, 185, 129, 0.05)",
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              background: `linear-gradient(135deg, ${
                                activity.status === "success"
                                  ? theme.palette.success.main
                                  : activity.status === "warning"
                                  ? theme.palette.warning.main
                                  : theme.palette.info.main
                              }, ${
                                activity.status === "success"
                                  ? theme.palette.success.dark
                                  : activity.status === "warning"
                                  ? theme.palette.warning.dark
                                  : theme.palette.info.dark
                              })`,
                              width: 44,
                              height: 44,
                              boxShadow: `0 4px 12px ${
                                activity.status === "success"
                                  ? theme.palette.success.main
                                  : activity.status === "warning"
                                  ? theme.palette.warning.main
                                  : theme.palette.info.main
                              }30`,
                            }}
                          >
                            {activity.type === "health" ? (
                              <LocalHospital sx={{ fontSize: "1.2rem" }} />
                            ) : (
                              <Agriculture sx={{ fontSize: "1.2rem" }} />
                            )}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          disableTypography
                          primary={
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                mb: 0.5,
                                color: "text.primary",
                              }}
                            >
                              {activity.animal}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography
                                variant="caption"
                                display="block"
                                sx={{ mb: 0.5, color: "text.secondary" }}
                              >
                                {activity.action}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontSize: "0.75rem" }}
                              >
                                {activity.time}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {idx < recentActivities.length - 1 && (
                        <Divider component="li" sx={{ ml: 7, opacity: 0.3 }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </GlassCard>
          </Box>

          {/* Health Overview */}
          <Box>
            <GlassCard
              glassVariant="glass"
              interactive
              intensity="medium"
              sx={{
                height: "100%",
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "text.primary" }}
                  >
                    {t("dashboard.healthAlerts")}
                  </Typography>
                  <IconButton size="small" sx={{ color: "text.secondary" }}>
                    <MoreVert />
                  </IconButton>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "text.primary" }}
                    >
                      Health Status
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "text.secondary" }}
                    >
                      {healthyAnimals}/{totalAnimals}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={
                      totalAnimals > 0
                        ? (healthyAnimals / totalAnimals) * 100
                        : 0
                    }
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: "rgba(16, 185, 129, 0.1)",
                      "& .MuiLinearProgress-bar": {
                        background: "linear-gradient(90deg, #10B981, #059669)",
                        borderRadius: 6,
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: "block", fontWeight: 500 }}
                  >
                    {healthyPercent}% healthy livestock
                  </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "text.primary" }}
                    >
                      Withdrawal Periods
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "text.secondary" }}
                    >
                      2 Active
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={75}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: "rgba(245, 158, 11, 0.1)",
                      "& .MuiLinearProgress-bar": {
                        background: "linear-gradient(90deg, #F59E0B, #D97706)",
                        borderRadius: 6,
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
                  >
                    {t("dashboard.upcomingTasks")}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                    <Chip
                      label="Vaccination Due (3)"
                      size="small"
                      sx={{
                        background: "linear-gradient(135deg, #F59E0B, #D97706)",
                        color: "white",
                        fontWeight: 600,
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #D97706, #B45309)",
                        },
                      }}
                    />
                    <Chip
                      label="Health Checkup (2)"
                      size="small"
                      sx={{
                        background: "linear-gradient(135deg, #3B82F6, #2563EB)",
                        color: "white",
                        fontWeight: 600,
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #2563EB, #1D4ED8)",
                        },
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </GlassCard>
          </Box>
        </Box>
      </Container>

      {/* Floating Action Button */}
      {isMobile && (
        <Fab
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1000,
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            boxShadow: "0 8px 24px rgba(16, 185, 129, 0.4)",
            "&:hover": {
              background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
              transform: "scale(1.1)",
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onClick={() => navigate("/livestock")}
        >
          <Add />
        </Fab>
      )}
    </Box>
  );
};

export default DashboardPage;
