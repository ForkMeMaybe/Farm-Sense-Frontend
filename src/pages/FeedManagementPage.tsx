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
import { Add, Agriculture } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import FeedRecordForm from "../components/forms/FeedRecordForm";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeedRecords } from "../store/slices/farmSlices";
import { RootState } from "../store/store";

const FeedManagementPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { records, loading } = useSelector((state: RootState) => state.feed);

  const [formOpen, setFormOpen] = useState(false);

  const handleAddNew = () => {
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
  };

  useEffect(() => {
    dispatch<any>(fetchFeedRecords());
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
            {t("feed.title")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track feed consumption and nutrition plans
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
          onClick={handleAddNew}
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.primary.main} 90%)`,
            px: 3,
          }}
        >
          Record Feed
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
                backgroundColor: theme.palette.success.light,
              }}
            >
              <Agriculture sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t("feed.feedHistory")}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Monitor feed consumption and optimize nutrition
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              color="success"
              onClick={handleAddNew}
            >
              {t("feed.title")}
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && hasRecords && <FeedRecordsGrid records={records} />}

      <FeedRecordForm
        open={formOpen}
        onClose={handleFormClose}
        mode="create"
        onSaved={() => dispatch<any>(fetchFeedRecords())}
      />
    </Box>
  );
};

type FeedRecordItem = {
  id: number;
  livestock: number;
  feed_type: string;
  quantity_kg: number;
  date: string;
};

const FeedRecordsGrid: React.FC<{ records: FeedRecordItem[] }> = ({
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
                <Avatar sx={{ bgcolor: "success.main" }}>
                  <Agriculture sx={{ color: "#fff" }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {rec.feed_type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {rec.id} • Livestock #{rec.livestock}
                  </Typography>
                </Box>
              </Stack>
              <Chip
                label={`${rec.quantity_kg} kg`}
                color="success"
                variant="filled"
              />
            </Stack>

            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Date: {new Date(rec.date).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quantity: {rec.quantity_kg} kg
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default FeedManagementPage;
