import React, { useEffect } from "react";
import {
  Box,
  Grid,
  Card,
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
    },
    {
      title: t("dashboard.healthyAnimals"),
      value: healthyAnimals,
      icon: <CheckCircle />,
      color: theme.palette.success.main,
      trend: "+2.1%",
    },
    {
      title: "Sick Animals",
      value: sickAnimals,
      icon: <Warning />,
      color: theme.palette.error.main,
      trend: "-1.3%",
    },
    {
      title: "Compliance Score",
      value: "98.5%",
      icon: <Assessment />,
      color: theme.palette.info.main,
      trend: "+0.8%",
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
    <Box>
      <Box sx={{ maxWidth: 1280, mx: "auto", px: { xs: 2, sm: 3 } }}>
        {/* Welcome Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {t("dashboard.welcomeBack")}, {user?.username}! 🌾
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Here's what's happening with your farm today
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 3 }}
              key={index}
              className="slide-in-left"
            >
              <GlassCard
                glassVariant="glass"
                interactive
                intensity="medium"
                sx={{
                  height: "100%",
                  background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                  border: `1px solid ${stat.color}30`,
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`,
                  },
                  "&:hover": {
                    background: `linear-gradient(135deg, ${stat.color}25 0%, ${stat.color}10 100%)`,
                    boxShadow: `0 20px 40px ${stat.color}20`,
                  },
                }}
              >
                <CardContent sx={{ position: "relative", zIndex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="overline"
                        sx={{
                          mb: 1,
                          color: "text.secondary",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}
                      >
                        {stat.title}
                      </Typography>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 800,
                          color: stat.color,
                          mb: 1,
                          lineHeight: 1.2,
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Chip
                        label={stat.trend}
                        size="small"
                        sx={{
                          background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}30)`,
                          color: stat.color,
                          fontWeight: 600,
                          borderRadius: 2,
                          "& .MuiChip-label": {
                            fontSize: "0.75rem",
                          },
                        }}
                      />
                    </Box>
                    <Avatar
                      sx={{
                        background: `linear-gradient(135deg, ${stat.color}, ${stat.color}CC)`,
                        width: 64,
                        height: 64,
                        boxShadow: `0 8px 16px ${stat.color}40`,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                  </Box>
                </CardContent>
              </GlassCard>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  {t("dashboard.quickActions")}
                </Typography>
                <Grid container spacing={2}>
                  {quickActions.map((action, index) => (
                    <Grid size={{ xs: 6 }} key={index}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: "center",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          backgroundColor: `${action.color}10`,
                          border: `1px solid ${action.color}30`,
                          "&:hover": {
                            backgroundColor: `${action.color}20`,
                            transform: "scale(1.05)",
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
                            backgroundColor: action.color,
                            mx: "auto",
                            mb: 1,
                            width: 48,
                            height: 48,
                          }}
                        >
                          {action.icon}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {action.title}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  {t("dashboard.recentActivity")}
                </Typography>
                <List sx={{ p: 0 }}>
                  {recentActivities.map((activity, idx) => (
                    <React.Fragment key={activity.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              backgroundColor:
                                activity.status === "success"
                                  ? theme.palette.success.main
                                  : activity.status === "warning"
                                  ? theme.palette.warning.main
                                  : theme.palette.info.main,
                              width: 40,
                              height: 40,
                            }}
                          >
                            {activity.type === "health" ? (
                              <LocalHospital />
                            ) : (
                              <Agriculture />
                            )}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          disableTypography
                          primary={
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {activity.animal}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="caption" display="block">
                                {activity.action}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {activity.time}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {idx < recentActivities.length - 1 && (
                        <Divider component="li" sx={{ ml: 7 }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Health Overview */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  {t("dashboard.healthAlerts")}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Health Status</Typography>
                    <Typography variant="body2">
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
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5, display: "block" }}
                  >
                    {healthyPercent}% healthy livestock
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Withdrawal Periods</Typography>
                    <Typography variant="body2">2 Active</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={75}
                    color="warning"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {t("dashboard.upcomingTasks")}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    <Chip
                      label="Vaccination Due (3)"
                      size="small"
                      color="warning"
                    />
                    <Chip
                      label="Health Checkup (2)"
                      size="small"
                      color="info"
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Floating Action Button */}
      {isMobile && (
        <Fab
          color="primary"
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1000,
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
