import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Collapse,
  Chip,
  Alert,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import apiClient from "../services/api";
import authService from "../services/authService";

const DebugInfo: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [apiStatus, setApiStatus] = useState<
    "checking" | "connected" | "error"
  >("checking");
  const [authStatus, setAuthStatus] = useState<
    "authenticated" | "not_authenticated"
  >("not_authenticated");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    checkApiStatus();
    checkAuthStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      setApiStatus("checking");
      const response = await apiClient.get("/auth/users/me/");
      setApiStatus("connected");
      setError("");
    } catch (err: any) {
      setApiStatus("error");
      setError(err.message || "API connection failed");
    }
  };

  const checkAuthStatus = () => {
    setAuthStatus(
      authService.isAuthenticated() ? "authenticated" : "not_authenticated"
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
      case "authenticated":
        return "success";
      case "checking":
        return "warning";
      case "error":
      case "not_authenticated":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Card sx={{ mb: 3, border: "1px solid #e0e0e0" }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Debug Information
          </Typography>
          <Button
            onClick={() => setExpanded(!expanded)}
            endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
            size="small"
          >
            {expanded ? "Hide" : "Show"}
          </Button>
        </Box>

        <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            label={`API: ${apiStatus}`}
            color={getStatusColor(apiStatus) as any}
            size="small"
          />
          <Chip
            label={`Auth: ${authStatus}`}
            color={getStatusColor(authStatus) as any}
            size="small"
          />
        </Box>

        <Collapse in={expanded}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>API Base URL:</strong>{" "}
              {import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Access Token:</strong>{" "}
              {authService.isAuthenticated() ? "Present" : "Missing"}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Error:</strong> {error}
                </Typography>
              </Alert>
            )}

            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={checkApiStatus}
                disabled={apiStatus === "checking"}
              >
                Test API Connection
              </Button>
              <Button variant="outlined" size="small" onClick={checkAuthStatus}>
                Check Auth Status
              </Button>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default DebugInfo;
