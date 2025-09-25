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
import { Add, Agriculture } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import FeedRecordForm from "../components/forms/FeedRecordForm";

const FeedManagementPage: React.FC = () => {
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

      <FeedRecordForm open={formOpen} onClose={handleFormClose} mode="create" />
    </Box>
  );
};

export default FeedManagementPage;
