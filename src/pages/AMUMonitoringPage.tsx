import React, { useEffect, useState } from "react";
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
import { Add, Medication } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import AMUForm from "../components/forms/AMUForm";
import { useDispatch, useSelector } from "react-redux";
import { fetchAMURecords } from "../store/slices/farmSlices";
import { RootState } from "../store/store";

const AMUMonitoringPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { records, loading } = useSelector((state: RootState) => state.amu);

  const [formOpen, setFormOpen] = useState(false);

  const handleAddNew = () => {
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
  };

  useEffect(() => {
    dispatch<any>(fetchAMURecords());
  }, [dispatch]);

  const hasRecords = (records || []).length > 0;

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
            "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
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
                background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "2rem", md: "2.5rem" },
                lineHeight: 1.2,
              }}
            >
              {t("amu.title")}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontWeight: 500,
                fontSize: { xs: "1rem", md: "1.125rem" },
              }}
            >
              Monitor antimicrobial usage and ensure compliance
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            size="large"
            onClick={handleAddNew}
            sx={{
              background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
              px: 4,
              py: 1.5,
              borderRadius: 3,
              boxShadow: "0 8px 24px rgba(59, 130, 246, 0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 32px rgba(59, 130, 246, 0.5)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            Add Treatment
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
                  background: "linear-gradient(135deg, #3B82F6, #2563EB)",
                  boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)",
                }}
              >
                <Medication sx={{ fontSize: 50, color: "white" }} />
              </Avatar>
              <Typography
                variant="h5"
                sx={{ mb: 2, fontWeight: 700, color: "text.primary" }}
              >
                {t("amu.activeTreatments")}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ mb: 4, fontSize: "1.1rem" }}
              >
                Track antimicrobial treatments and withdrawal periods
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddNew}
                sx={{
                  background:
                    "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  boxShadow: "0 8px 24px rgba(59, 130, 246, 0.4)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 32px rgba(59, 130, 246, 0.5)",
                  },
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                Start Treatment
              </Button>
            </Box>
          </Box>
        )}

        {!loading && hasRecords && <AMURecordsGrid records={records} />}
      </Box>

      <AMUForm
        open={formOpen}
        onClose={handleFormClose}
        mode="create"
        onSaved={() => dispatch<any>(fetchAMURecords())}
      />
    </Box>
  );
};

type AMURecordItem = {
  id: number;
  health_record: number;
  drug?: number;
  drug_name?: string;
  dosage: string;
  withdrawal_period: number;
};

const AMURecordsGrid: React.FC<{ records: AMURecordItem[] }> = ({
  records,
}) => {
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
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <Medication sx={{ color: "#fff" }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {rec.drug_name || `Drug #${rec.drug}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {rec.id} • Health Record #{rec.health_record}
                  </Typography>
                </Box>
              </Stack>
              <Chip
                label={`${rec.withdrawal_period} days`}
                color="warning"
                variant="filled"
              />
            </Stack>

            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Dosage: {rec.dosage}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Withdrawal Period: {rec.withdrawal_period} days
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default AMUMonitoringPage;
