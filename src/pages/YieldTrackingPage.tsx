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
import { Add, Assessment } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import YieldRecordForm from "../components/forms/YieldRecordForm";

const YieldTrackingPage: React.FC = () => {
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

      <YieldRecordForm
        open={formOpen}
        onClose={handleFormClose}
        mode="create"
      />
    </Box>
  );
};

export default YieldTrackingPage;
