import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import apiClient from "../services/api";

const ApiTest: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    data?: any;
  } | null>(null);

  const testApiConnection = async () => {
    setTesting(true);
    setResult(null);

    try {
      // Test basic connectivity
      const response = await apiClient.get("/auth/users/me/");

      // Check if response is HTML (ngrok error page)
      const isHtml =
        typeof response.data === "string" &&
        response.data.includes("<!DOCTYPE html>");

      setResult({
        success: !isHtml,
        message: isHtml
          ? "API returned HTML error page (ngrok tunnel issue)"
          : "API connection successful!",
        data: response.data,
      });
    } catch (error: any) {
      setResult({
        success: false,
        message: `API connection failed: ${error.message}`,
        data: error.response?.data,
      });
    } finally {
      setTesting(false);
    }
  };

  const testLivestockEndpoint = async () => {
    setTesting(true);
    setResult(null);

    try {
      const response = await apiClient.get("/api/livestock/");

      // Check if response is HTML (ngrok error page)
      const isHtml =
        typeof response.data === "string" &&
        response.data.includes("<!DOCTYPE html>");

      if (isHtml) {
        setResult({
          success: false,
          message:
            "Livestock endpoint returned HTML error page (ngrok tunnel issue)",
          data: response.data,
        });
      } else {
        setResult({
          success: true,
          message: `Livestock endpoint successful! Found ${
            Array.isArray(response.data)
              ? response.data.length
              : response.data?.results?.length || 0
          } records`,
          data: response.data,
        });
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: `Livestock endpoint failed: ${error.message}`,
        data: error.response?.data,
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          API Connection Test
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            onClick={testApiConnection}
            disabled={testing}
            startIcon={testing ? <CircularProgress size={20} /> : null}
          >
            Test Auth Endpoint
          </Button>

          <Button
            variant="outlined"
            onClick={testLivestockEndpoint}
            disabled={testing}
            startIcon={testing ? <CircularProgress size={20} /> : null}
          >
            Test Livestock Endpoint
          </Button>
        </Box>

        {result && (
          <Alert severity={result.success ? "success" : "error"}>
            <Typography variant="body2" gutterBottom>
              {result.message}
            </Typography>
            {result.data && (
              <Box sx={{ mt: 1 }}>
                <Typography
                  variant="caption"
                  component="pre"
                  sx={{
                    backgroundColor: "rgba(0,0,0,0.1)",
                    p: 1,
                    borderRadius: 1,
                    fontSize: "0.75rem",
                    overflow: "auto",
                    maxHeight: "200px",
                  }}
                >
                  {JSON.stringify(result.data, null, 2)}
                </Typography>
              </Box>
            )}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiTest;
