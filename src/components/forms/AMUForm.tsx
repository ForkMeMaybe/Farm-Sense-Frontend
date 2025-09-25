import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import livestockService from "../../services/livestockService";
import { amuService, drugService, AMURecord } from "../../services/farmService";

interface AMUFormProps {
  open: boolean;
  onClose: () => void;
  amuRecord?: AMURecord | null;
  mode: "create" | "edit";
  onSaved?: () => void;
}

const AMUForm: React.FC<AMUFormProps> = ({
  open,
  onClose,
  amuRecord,
  mode,
  onSaved,
}) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    health_record: amuRecord?.health_record || "",
    drug: amuRecord?.drug || "",
    dosage: amuRecord?.dosage || "",
    withdrawal_period: amuRecord?.withdrawal_period || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch livestock and drugs for dropdowns
  const { data: livestock = [], isLoading: livestockLoading, error: livestockError } = useQuery({
    queryKey: ["livestock"],
    queryFn: async () => {
      console.log("AMUForm - Making API call to livestockService.getAll");
      try {
        const result = await livestockService.getAll();
        console.log("AMUForm - Livestock API call result:", result);
        return result;
      } catch (error) {
        console.error("AMUForm - Livestock API call error:", error);
        throw error;
      }
    },
  });

  const { data: drugs = [], isLoading: drugsLoading, error: drugsError } = useQuery({
    queryKey: ["drugs"],
    queryFn: async () => {
      console.log("AMUForm - Making API call to drugService.getAll");
      try {
        const result = await drugService.getAll();
        console.log("AMUForm - Drugs API call result:", result);
        return result;
      } catch (error) {
        console.error("AMUForm - Drugs API call error:", error);
        throw error;
      }
    },
  });

  // Debug logging
  console.log("AMUForm - Livestock data:", livestock);
  console.log("AMUForm - Livestock loading:", livestockLoading);
  console.log("AMUForm - Livestock error:", livestockError);
  console.log("AMUForm - Drugs data:", drugs);
  console.log("AMUForm - Drugs loading:", drugsLoading);
  console.log("AMUForm - Drugs error:", drugsError);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.health_record) {
      newErrors.health_record = "Please select a health record";
    }

    if (!formData.drug) {
      newErrors.drug = "Please select a drug";
    }

    if (!formData.dosage.trim()) {
      newErrors.dosage = "Dosage is required";
    }

    if (
      !formData.withdrawal_period ||
      isNaN(Number(formData.withdrawal_period))
    ) {
      newErrors.withdrawal_period = "Withdrawal period must be a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const submitData = {
        ...formData,
        health_record: Number(formData.health_record),
        drug: Number(formData.drug),
        withdrawal_period: Number(formData.withdrawal_period),
      };

      if (mode === "create") {
        await amuService.create(submitData);
      } else if (amuRecord) {
        await amuService.update(amuRecord.id, submitData);
      }

      onSaved && onSaved();
      onClose();
    } catch (error) {
      console.error("Error saving AMU record:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          {mode === "create" ? "Add AMU Treatment" : "Edit AMU Treatment"}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Record antimicrobial usage for compliance tracking and withdrawal
            period monitoring.
          </Alert>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                required
                label="Select Livestock"
                value={formData.health_record}
                onChange={(e) => handleChange("health_record", e.target.value)}
                error={!!errors.health_record}
                helperText={
                  errors.health_record || 
                  livestockError ? "Error loading livestock" :
                  livestockLoading ? "Loading livestock..." :
                  "Choose the animal for this treatment"
                }
                variant="outlined"
                disabled={livestockLoading}
                sx={{ 
                  '& .MuiInputLabel-root': { 
                    color: 'text.primary',
                    fontWeight: 500 
                  },
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  }
                }}
              >
                {livestockLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Loading livestock...
                  </MenuItem>
                ) : livestock.length === 0 ? (
                  <MenuItem disabled>No livestock available</MenuItem>
                ) : (
                  livestock.map((animal) => (
                    <MenuItem key={animal.id} value={animal.id}>
                      {animal.tag_id} - {animal.species} ({animal.breed})
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                required
                label="Select Drug"
                value={formData.drug}
                onChange={(e) => handleChange("drug", e.target.value)}
                error={!!errors.drug}
                helperText={
                  errors.drug || 
                  drugsError ? "Error loading drugs" :
                  drugsLoading ? "Loading drugs..." :
                  "Choose the antimicrobial drug used"
                }
                variant="outlined"
                disabled={drugsLoading}
                sx={{ 
                  '& .MuiInputLabel-root': { 
                    color: 'text.primary',
                    fontWeight: 500 
                  },
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  }
                }}
              >
                {drugsLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Loading drugs...
                  </MenuItem>
                ) : drugs.length === 0 ? (
                  <MenuItem disabled>No drugs available</MenuItem>
                ) : (
                  drugs.map((drug) => (
                    <MenuItem key={drug.id} value={drug.id}>
                      {drug.name}
                      {drug.active_ingredient ? ` (${drug.active_ingredient})` : ''}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dosage"
                value={formData.dosage}
                onChange={(e) => handleChange("dosage", e.target.value)}
                error={!!errors.dosage}
                helperText={errors.dosage || "e.g., 10mg/kg, 2ml"}
                required
                placeholder="Enter dosage amount and unit"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Withdrawal Period (days)"
                type="number"
                value={formData.withdrawal_period}
                onChange={(e) =>
                  handleChange("withdrawal_period", e.target.value)
                }
                error={!!errors.withdrawal_period}
                helperText={
                  errors.withdrawal_period || "Days until safe for consumption"
                }
                required
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {mode === "create" ? "Add Treatment" : "Update Treatment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AMUForm;
