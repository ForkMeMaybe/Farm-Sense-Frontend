import React, { useState } from "react";
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
  CircularProgress,
  Alert,
} from "@mui/material";
import { Add, Pets, Edit, Visibility } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useLivestock } from "../hooks/useLivestock";
import LivestockForm from "../components/forms/LivestockForm";

const LivestockPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { livestock, isLoading, isFetching, error, deleteLivestock } =
    useLivestock();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedLivestock, setSelectedLivestock] = useState(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return theme.palette.success.main;
      case "sick":
        return theme.palette.error.main;
      case "recovering":
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getSpeciesEmoji = (species: string | undefined) => {
    if (!species || typeof species !== "string") {
      return "🐾";
    }
    switch (species.toLowerCase()) {
      case "cow":
        return "🐄";
      case "buffalo":
        return "🐃";
      case "goat":
        return "🐐";
      case "sheep":
        return "🐑";
      case "chicken":
        return "🐔";
      default:
        return "🐾";
    }
  };

  // Validate livestock data to ensure it's not HTML or malformed
  const isValidLivestockData = (data: any): data is Livestock[] => {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.id === "number" &&
        typeof item.tag_id === "string" &&
        typeof item.species === "string"
    );
  };

  // Filter out invalid data (like HTML responses from ngrok)
  const validLivestock = isValidLivestockData(livestock) ? livestock : [];
  const hasInvalidData =
    !isLoading &&
    !error &&
    livestock.length > 0 &&
    !isValidLivestockData(livestock);

  const handleDelete = async (id: number, tagId: string) => {
    if (window.confirm(`Are you sure you want to delete ${tagId}?`)) {
      await deleteLivestock.mutateAsync(id);
    }
  };

  const handleAddNew = () => {
    setSelectedLivestock(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEdit = (livestock: any) => {
    setSelectedLivestock(livestock);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedLivestock(null);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {t("livestock.title")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your livestock records and track their health status
            </Typography>
          </Box>
        </Box>

        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Failed to load livestock data
          </Typography>
          <Typography variant="body2">
            {error.message || "An error occurred while fetching data"}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Check your network connection and ensure the backend is running on
            http://localhost:8000
          </Typography>
        </Alert>

        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
      }
    }}>
      <Box sx={{ position: 'relative', zIndex: 1 }}>

        {hasInvalidData && (
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Invalid Data Received
            </Typography>
            <Typography variant="body2">
              The server returned invalid data (possibly an HTML error page). This
              usually means the backend is not running or the ngrok tunnel is not
              properly configured.
            </Typography>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Expected: JSON array of livestock objects | Received: HTML or
              malformed data
            </Typography>
          </Alert>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 6,
            pt: 2,
          }}
        >
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800, 
                mb: 1,
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2rem', md: '2.5rem' },
                lineHeight: 1.2,
              }}
            >
              {t("livestock.title")}
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ 
                fontWeight: 500,
                fontSize: { xs: '1rem', md: '1.125rem' },
              }}
            >
              Manage your livestock records and track their health status
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            size="large"
            onClick={handleAddNew}
            sx={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              px: 4,
              py: 1.5,
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 32px rgba(16, 185, 129, 0.5)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {t("livestock.addNew")}
          </Button>
        </Box>

        {validLivestock.length === 0 ? (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}>
            <Box sx={{
              textAlign: "center",
              p: 6,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              maxWidth: 500,
            }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mx: "auto",
                  mb: 3,
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                }}
              >
                <Pets sx={{ fontSize: 50, color: 'white' }} />
              </Avatar>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: 'text.primary' }}>
                {t("livestock.noAnimals")}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem' }}>
                {t("livestock.addFirstAnimal")}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddNew}
                sx={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(16, 185, 129, 0.5)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {t("livestock.addAnimal")}
              </Button>
            </Box>
          </Box>
      ) : (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 3 
          }}>
            {validLivestock.map((animal) => (
              <Box key={animal.id}>
                <Card
                  sx={{
                    height: "100%",
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: 4,
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                      background: 'rgba(255, 255, 255, 0.95)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Avatar
                        sx={{
                          background: 'linear-gradient(135deg, #10B981, #059669)',
                          mr: 2,
                          fontSize: "1.5rem",
                          width: 48,
                          height: 48,
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                        }}
                      >
                        {getSpeciesEmoji(animal.species)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                          {animal.tag_id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                          {t(`species.${animal.species.toLowerCase()}`)} •{" "}
                          {animal.gender === "M"
                            ? t("livestock.male")
                            : t("livestock.female")}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ 
                        p: 2, 
                        background: 'rgba(16, 185, 129, 0.05)', 
                        borderRadius: 2, 
                        border: '1px solid rgba(16, 185, 129, 0.1)' 
                      }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1, fontSize: '0.875rem' }}
                        >
                          <strong>{t("livestock.breed")}:</strong> {animal.breed}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1, fontSize: '0.875rem' }}
                        >
                          <strong>{t("livestock.dateOfBirth")}:</strong>{" "}
                          {new Date(animal.date_of_birth).toLocaleDateString()}
                        </Typography>
                        {animal.current_weight_kg && (
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                            <strong>{t("livestock.currentWeight")}:</strong>{" "}
                            {animal.current_weight_kg} kg
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Chip
                        label={t(`livestock.${animal.health_status}`)}
                        size="small"
                        sx={{
                          background: `linear-gradient(135deg, ${getHealthStatusColor(
                            animal.health_status
                          )}, ${getHealthStatusColor(animal.health_status)}CC)`,
                          color: 'white',
                          fontWeight: 600,
                          borderRadius: 3,
                          boxShadow: `0 2px 8px ${getHealthStatusColor(animal.health_status)}40`,
                        }}
                      />
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton 
                          size="small" 
                          sx={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            '&:hover': { background: 'rgba(59, 130, 246, 0.2)' },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <Visibility sx={{ fontSize: '1rem', color: '#3B82F6' }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(animal)}
                          sx={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            '&:hover': { background: 'rgba(16, 185, 129, 0.2)' },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <Edit sx={{ fontSize: '1rem', color: '#10B981' }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(animal.id, animal.tag_id)}
                          disabled={deleteLivestock.isPending}
                          sx={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            '&:hover': { background: 'rgba(239, 68, 68, 0.2)' },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          🗑️
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <LivestockForm
        open={formOpen}
        onClose={handleFormClose}
        livestock={selectedLivestock}
        mode={formMode}
      />
    </Box>
  );
};

export default LivestockPage;
