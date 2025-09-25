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
}

const AMUForm: React.FC<AMUFormProps> = ({
  open,
  onClose,
  amuRecord,
  mode,
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
  const { data: livestock = [] } = useQuery({
    queryKey: ["livestock"],
    queryFn: livestockService.getAll,
  });

  const { data: drugs = [] } = useQuery({
    queryKey: ["drugs"],
    queryFn: drugService.getAll,
  });

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
              <FormControl fullWidth required error={!!errors.health_record}>
                <InputLabel>Select Livestock</InputLabel>
                <Select
                  value={formData.health_record}
                  onChange={(e) =>
                    handleChange("health_record", e.target.value)
                  }
                  label="Select Livestock"
                >
                  {livestock.map((animal) => (
                    <MenuItem key={animal.id} value={animal.id}>
                      {animal.tag_id} - {animal.species} ({animal.breed})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.drug}>
                <InputLabel>Select Drug</InputLabel>
                <Select
                  value={formData.drug}
                  onChange={(e) => handleChange("drug", e.target.value)}
                  label="Select Drug"
                >
                  {drugs.map((drug) => (
                    <MenuItem key={drug.id} value={drug.id}>
                      {drug.name}{" "}
                      {drug.active_ingredient && `(${drug.active_ingredient})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<CircularProgress size={20} />}
        >
          {mode === "create" ? "Add Treatment" : "Update Treatment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AMUForm;
