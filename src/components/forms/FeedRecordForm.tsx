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
  IconButton,
  Tooltip,
} from "@mui/material";
import { Mic as MicIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import livestockService from "../../services/livestockService";
import { feedService, FeedRecord } from "../../services/farmService";
import apiClient from "../../services/api";
import GenericVoiceInput from "../common/GenericVoiceInput";

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
    feed: (feedRecord as any)?.feed || "",
    quantity_kg: feedRecord?.quantity_kg || "",
    price_per_kg: (feedRecord as any)?.price_per_kg || "",
    date: feedRecord?.date || new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [voiceDialogOpen, setVoiceDialogOpen] = useState(false);

  // Fetch livestock and feeds for dropdowns
  const { data: livestock = [] } = useQuery({
    queryKey: ["livestock"],
    queryFn: livestockService.getAll,
  });

  const { data: feeds = [] } = useQuery({
    queryKey: ["feeds"],
    queryFn: async () => {
      const res = await apiClient.get("/api/feeds/");
      return res.data;
    },
  });

  // feed_type is free text per backend model

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleVoiceData = (data: Record<string, any>) => {
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        handleChange(key, value);
      }
    });
    setVoiceDialogOpen(false);
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

    if (formData.price_per_kg && isNaN(Number(formData.price_per_kg))) {
      newErrors.price_per_kg = "Price must be a valid number";
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
        feed: formData.feed ? Number(formData.feed) : null,
        price_per_kg: formData.price_per_kg ? Number(formData.price_per_kg) : null,
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            {mode === "create" ? "Record Feed" : "Edit Feed Record"}
          </Typography>
          {mode === "create" && (
            <Tooltip title="Use voice input to fill the form">
              <IconButton
                onClick={() => setVoiceDialogOpen(true)}
                color="primary"
                sx={{ 
                  bgcolor: 'primary.light',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.main',
                  }
                }}
              >
                <MicIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
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
              <TextField
                fullWidth
                required
                label="Feed Type"
                value={formData.feed_type}
                onChange={(e) => handleChange("feed_type", e.target.value)}
                error={!!errors.feed_type}
                helperText={errors.feed_type}
                placeholder="e.g., Hay, Grass, Silage, Concentrate"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Feed (from catalog) — optional"
                value={formData.feed}
                onChange={(e) => handleChange("feed", e.target.value)}
                helperText="If empty, price comes from 'Price per kg' below; otherwise from feed's cost."
              >
                {feeds.map((f: any) => (
                  <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>
                ))}
              </TextField>
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
                label="Price per kg (optional)"
                type="number"
                value={formData.price_per_kg}
                onChange={(e) => handleChange("price_per_kg", e.target.value)}
                error={!!errors.price_per_kg}
                helperText={errors.price_per_kg}
                inputProps={{ min: 0, step: 0.01 }}
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

      <GenericVoiceInput
        isOpen={voiceDialogOpen}
        onClose={() => setVoiceDialogOpen(false)}
        onVoiceData={handleVoiceData}
        formType="feed_record"
        title="Feed Record Voice Input"
        description="Speak naturally about the feeding details, animal, feed type, and quantities"
      />
    </Dialog>
  );
};

export default FeedRecordForm;
