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
import { Add, Assessment } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import YieldRecordForm from "../components/forms/YieldRecordForm";
import { useDispatch, useSelector } from "react-redux";
import { fetchYieldRecords } from "../store/slices/farmSlices";
import { RootState } from "../store/store";

const YieldTrackingPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { records, loading } = useSelector((state: RootState) => state.yield);

  const [formOpen, setFormOpen] = useState(false);

  const handleAddNew = () => {
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
  };

  useEffect(() => {
    dispatch<any>(fetchYieldRecords());
  }, [dispatch]);

  const hasRecords = (records || []).length > 0;

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
            {t("yield.title")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track production yields and analyze trends
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
          onClick={handleAddNew}
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.warning.main} 30%, ${theme.palette.secondary.main} 90%)`,
            px: 3,
          }}
        >
          Record Yield
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && !hasRecords && (
        <Card sx={{ textAlign: "center", py: 8 }}>
          <CardContent>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: "auto",
                mb: 3,
                backgroundColor: theme.palette.warning.light,
              }}
            >
              <Assessment sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t("yield.productionTrends")}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Analyze production data and track performance
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              color="warning"
              onClick={handleAddNew}
            >
              {t("yield.title")}
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && hasRecords && <YieldRecordsGrid records={records} />}

      <YieldRecordForm
        open={formOpen}
        onClose={handleFormClose}
        mode="create"
        onSaved={() => dispatch<any>(fetchYieldRecords())}
      />
    </Box>
  );
};

type YieldRecordItem = {
  id: number;
  livestock: number;
  yield_type: string;
  quantity: number;
  unit: string;
  date: string;
};

const YieldRecordsGrid: React.FC<{ records: YieldRecordItem[] }> = ({
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
                <Avatar sx={{ bgcolor: "warning.main" }}>
                  <Assessment sx={{ color: "#fff" }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {rec.yield_type.charAt(0).toUpperCase() +
                      rec.yield_type.slice(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {rec.id} • Livestock #{rec.livestock}
                  </Typography>
                </Box>
              </Stack>
              <Chip
                label={`${rec.quantity} ${rec.unit}`}
                color="warning"
                variant="filled"
              />
            </Stack>

            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Date: {new Date(rec.date).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quantity: {rec.quantity} {rec.unit}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default YieldTrackingPage;
