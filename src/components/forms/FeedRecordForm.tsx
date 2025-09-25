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
import { feedService, FeedRecord } from "../../services/farmService";

interface FeedRecordFormProps {
  open: boolean;
  onClose: () => void;
  feedRecord?: FeedRecord | null;
  mode: "create" | "edit";
  onSaved?: () => void;
}

const FeedRecordForm: React.FC<FeedRecordFormProps> = ({
  open,
  onClose,
  feedRecord,
  mode,
  onSaved,
}) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    livestock: feedRecord?.livestock || "",
    feed_type: feedRecord?.feed_type || "",
    quantity_kg: feedRecord?.quantity_kg || "",
    date: feedRecord?.date || new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch livestock for dropdown
  const { data: livestock = [] } = useQuery({
    queryKey: ["livestock"],
    queryFn: livestockService.getAll,
  });

  const feedTypes = [
    "Hay",
    "Grass",
    "Silage",
    "Concentrate",
    "Grain",
    "Protein Supplement",
    "Mineral Supplement",
    "Vitamin Supplement",
    "Commercial Feed",
    "Other",
  ];

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.livestock) {
      newErrors.livestock = "Please select livestock";
    }

    if (!formData.feed_type.trim()) {
      newErrors.feed_type = "Feed type is required";
    }

    if (
      !formData.quantity_kg ||
      isNaN(Number(formData.quantity_kg)) ||
      Number(formData.quantity_kg) <= 0
    ) {
      newErrors.quantity_kg = "Quantity must be a valid positive number";
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
        quantity_kg: Number(formData.quantity_kg),
      };

      if (mode === "create") {
        await feedService.create(submitData);
      } else if (feedRecord) {
        await feedService.update(feedRecord.id, submitData);
      }

      onSaved && onSaved();
      onClose();
    } catch (error) {
      console.error("Error saving feed record:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          {mode === "create" ? "Record Feed" : "Edit Feed Record"}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.livestock}>
                <InputLabel>Select Livestock</InputLabel>
                <Select
                  value={formData.livestock}
                  onChange={(e) => handleChange("livestock", e.target.value)}
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
              <FormControl fullWidth required error={!!errors.feed_type}>
                <InputLabel>Feed Type</InputLabel>
                <Select
                  value={formData.feed_type}
                  onChange={(e) => handleChange("feed_type", e.target.value)}
                  label="Feed Type"
                >
                  {feedTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity (kg)"
                type="number"
                value={formData.quantity_kg}
                onChange={(e) => handleChange("quantity_kg", e.target.value)}
                error={!!errors.quantity_kg}
                helperText={errors.quantity_kg}
                required
                inputProps={{ min: 0, step: 0.1 }}
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
          {mode === "create" ? "Record Feed" : "Update Feed Record"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedRecordForm;
