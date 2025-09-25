import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
  Avatar,
  Chip,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Add, LocalHospital } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import HealthRecordForm from "../components/forms/HealthRecordForm";
import { useDispatch, useSelector } from "react-redux";
import { fetchHealthRecords } from "../store/slices/healthSlice";
import { RootState } from "../store/store";

const HealthRecordsPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { records, loading } = useSelector((state: RootState) => state.health);

  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    dispatch<any>(fetchHealthRecords());
  }, [dispatch]);

  const hasRecords = (records || []).length > 0;

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

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && !hasRecords && (
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
                  background:
                    "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
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
        )}

        {!loading && hasRecords && <GridRecords records={records} />}
      </Box>

      <HealthRecordForm
        open={formOpen}
        onClose={handleFormClose}
        mode="create"
        onSaved={() => dispatch<any>(fetchHealthRecords())}
      />
    </Box>
  );
};

type RecordItem = {
  id: number;
  livestock: number;
  event_type: string;
  event_date: string;
  diagnosis?: string;
  treatment_outcome?: string;
  notes?: string;
};

const eventColor: Record<
  string,
  "default" | "primary" | "secondary" | "success" | "error" | "info" | "warning"
> = {
  vaccination: "success",
  sickness: "error",
  "check-up": "info",
  treatment: "warning",
};

const GridRecords: React.FC<{ records: RecordItem[] }> = ({ records }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 3,
      }}
    >
      {records.map((rec) => (
        <Card key={rec.id} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "error.main" }}>
                  <LocalHospital sx={{ color: "#fff" }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {new Date(rec.event_date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {rec.id} • Livestock #{rec.livestock}
                  </Typography>
                </Box>
              </Stack>
              <Chip
                label={rec.event_type}
                color={eventColor[rec.event_type] || "default"}
                variant="filled"
              />
            </Stack>

            {(rec.diagnosis || rec.treatment_outcome || rec.notes) && (
              <>
                <Divider sx={{ my: 2 }} />
                {rec.diagnosis && (
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    Diagnosis: {rec.diagnosis}
                  </Typography>
                )}
                {rec.treatment_outcome && (
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    Outcome: {rec.treatment_outcome}
                  </Typography>
                )}
                {rec.notes && (
                  <Typography variant="body2" color="text.secondary">
                    {rec.notes}
                  </Typography>
                )}
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default HealthRecordsPage;
