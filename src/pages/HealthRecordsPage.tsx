import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
  Avatar,
} from "@mui/material";
import { Add, LocalHospital } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import HealthRecordForm from "../components/forms/HealthRecordForm";

const HealthRecordsPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [formOpen, setFormOpen] = useState(false);

  const handleAddNew = () => {
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
  };

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
            "radial-gradient(circle at 20% 80%, rgba(239, 68, 68, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
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
                background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "2rem", md: "2.5rem" },
                lineHeight: 1.2,
              }}
            >
              {t("health.title")}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontWeight: 500,
                fontSize: { xs: "1rem", md: "1.125rem" },
              }}
            >
              Track health events, treatments, and medical history
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            size="large"
            onClick={handleAddNew}
            sx={{
              background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
              px: 4,
              py: 1.5,
              borderRadius: 3,
              boxShadow: "0 8px 24px rgba(239, 68, 68, 0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 32px rgba(239, 68, 68, 0.5)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {t("health.addRecord")}
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              p: 6,
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(20px)",
              borderRadius: 4,
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              maxWidth: 500,
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: "auto",
                mb: 3,
                background: "linear-gradient(135deg, #EF4444, #DC2626)",
                boxShadow: "0 8px 24px rgba(239, 68, 68, 0.3)",
              }}
            >
              <LocalHospital sx={{ fontSize: 50, color: "white" }} />
            </Avatar>
            <Typography
              variant="h5"
              sx={{ mb: 2, fontWeight: 700, color: "text.primary" }}
            >
              {t("health.healthHistory")}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mb: 4, fontSize: "1.1rem" }}
            >
              Start recording health events for your livestock
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddNew}
              sx={{
                background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                px: 4,
                py: 1.5,
                borderRadius: 3,
                boxShadow: "0 8px 24px rgba(239, 68, 68, 0.4)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 32px rgba(239, 68, 68, 0.5)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {t("health.addRecord")}
            </Button>
          </Box>
        </Box>
      </Box>

      <HealthRecordForm
        open={formOpen}
        onClose={handleFormClose}
        mode="create"
      />
    </Box>
  );
};

export default HealthRecordsPage;
