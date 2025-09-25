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
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import livestockService from "../../services/livestockService";
import { yieldService, YieldRecord } from "../../services/farmService";

interface YieldRecordFormProps {
  open: boolean;
  onClose: () => void;
  yieldRecord?: YieldRecord | null;
  mode: "create" | "edit";
  onSaved?: () => void;
}

const YieldRecordForm: React.FC<YieldRecordFormProps> = ({
  open,
  onClose,
  yieldRecord,
  mode,
  onSaved,
}) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    livestock: yieldRecord?.livestock || "",
    yield_type: yieldRecord?.yield_type || "",
    quantity: yieldRecord?.quantity || "",
    unit: yieldRecord?.unit || "",
    date: yieldRecord?.date || new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch livestock for dropdown
  const { data: livestock = [] } = useQuery({
    queryKey: ["livestock"],
    queryFn: livestockService.getAll,
  });

  const yieldTypes = [
    { type: "milk", unit: "liters" },
    { type: "eggs", unit: "pieces" },
    { type: "meat", unit: "kg" },
    { type: "wool", unit: "kg" },
    { type: "manure", unit: "kg" },
    { type: "other", unit: "kg" },
  ];

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleYieldTypeChange = (yieldType: string) => {
    const selectedType = yieldTypes.find((yt) => yt.type === yieldType);
    setFormData((prev) => ({
      ...prev,
      yield_type: yieldType,
      unit: selectedType?.unit || "kg",
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.livestock) {
      newErrors.livestock = "Please select livestock";
    }

    if (!formData.yield_type.trim()) {
      newErrors.yield_type = "Yield type is required";
    }

    if (
      !formData.quantity ||
      isNaN(Number(formData.quantity)) ||
      Number(formData.quantity) <= 0
    ) {
      newErrors.quantity = "Quantity must be a valid positive number";
    }

    if (!formData.unit.trim()) {
      newErrors.unit = "Unit is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const submitData = {
        ...formData,
        livestock: Number(formData.livestock),
        quantity: Number(formData.quantity),
      };

      if (mode === "create") {
        await yieldService.create(submitData);
      } else if (yieldRecord) {
        await yieldService.update(yieldRecord.id, submitData);
      }

      onSaved && onSaved();
      onClose();
    } catch (error) {
      console.error("Error saving yield record:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          {mode === "create" ? "Record Yield" : "Edit Yield Record"}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                required
                label="Select Livestock"
                value={formData.livestock}
                onChange={(e) => handleChange("livestock", e.target.value)}
                error={!!errors.livestock}
                helperText={errors.livestock}
              >
                {livestock.map((animal) => (
                  <MenuItem key={animal.id} value={animal.id}>
                    {animal.tag_id} - {animal.species} ({animal.breed})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                required
                label="Yield Type"
                value={formData.yield_type}
                onChange={(e) => handleYieldTypeChange(e.target.value)}
                error={!!errors.yield_type}
                helperText={errors.yield_type}
              >
                {yieldTypes.map((type) => (
                  <MenuItem key={type.type} value={type.type}>
                    {type.type.charAt(0).toUpperCase() + type.type.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
                error={!!errors.quantity}
                helperText={errors.quantity}
                required
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Unit"
                value={formData.unit}
                onChange={(e) => handleChange("unit", e.target.value)}
                error={!!errors.unit}
                helperText={errors.unit}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                error={!!errors.date}
                helperText={errors.date}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {mode === "create" ? "Record Yield" : "Update Yield Record"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default YieldRecordForm;
