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
import healthRecordService, {
  HealthRecord,
} from "../../services/healthService";

interface HealthRecordFormProps {
  open: boolean;
  onClose: () => void;
  healthRecord?: HealthRecord | null;
  mode: "create" | "edit";
}

const HealthRecordForm: React.FC<HealthRecordFormProps> = ({
  open,
  onClose,
  healthRecord,
  mode,
}) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    livestock: healthRecord?.livestock || "",
    event_type: healthRecord?.event_type || "check-up",
    event_date:
      healthRecord?.event_date || new Date().toISOString().split("T")[0],
    notes: healthRecord?.notes || "",
    diagnosis: healthRecord?.diagnosis || "",
    treatment_outcome: healthRecord?.treatment_outcome || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch livestock for dropdown
  const { data: livestock = [] } = useQuery({
    queryKey: ["livestock"],
    queryFn: livestockService.getAll,
  });

  const eventTypes = [
    { value: "vaccination", label: "Vaccination" },
    { value: "sickness", label: "Sickness" },
    { value: "check-up", label: "Check-up" },
    { value: "treatment", label: "Treatment" },
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

    if (!formData.event_type) {
      newErrors.event_type = "Event type is required";
    }

    if (!formData.event_date) {
      newErrors.event_date = "Event date is required";
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
      };

      if (mode === "create") {
        await healthRecordService.create(submitData);
      } else if (healthRecord) {
        await healthRecordService.update(healthRecord.id, submitData);
      }

      onClose();
    } catch (error) {
      console.error("Error saving health record:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          {mode === "create" ? "Add Health Record" : "Edit Health Record"}
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
              <FormControl fullWidth required error={!!errors.event_type}>
                <InputLabel>Event Type</InputLabel>
                <Select
                  value={formData.event_type}
                  onChange={(e) => handleChange("event_type", e.target.value)}
                  label="Event Type"
                >
                  {eventTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Event Date"
                type="date"
                value={formData.event_date}
                onChange={(e) => handleChange("event_date", e.target.value)}
                error={!!errors.event_date}
                helperText={errors.event_date}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Diagnosis"
                value={formData.diagnosis}
                onChange={(e) => handleChange("diagnosis", e.target.value)}
                multiline
                rows={2}
                placeholder="Enter diagnosis details..."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Treatment Outcome"
                value={formData.treatment_outcome}
                onChange={(e) =>
                  handleChange("treatment_outcome", e.target.value)
                }
                multiline
                rows={2}
                placeholder="Enter treatment outcome..."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                multiline
                rows={3}
                placeholder="Additional notes..."
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
          {mode === "create" ? "Add Health Record" : "Update Health Record"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HealthRecordForm;
