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
  IconButton,
  Tooltip,
} from "@mui/material";
import { Mic as MicIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useLivestock } from "../../hooks/useLivestock";
import { Livestock } from "../../services/livestockService";
import VoiceInput from "../common/VoiceInput";

interface LivestockFormProps {
  open: boolean;
  onClose: () => void;
  livestock?: Livestock | null;
  mode: "create" | "edit";
}

const LivestockForm: React.FC<LivestockFormProps> = ({
  open,
  onClose,
  livestock,
  mode,
}) => {
  const { t } = useTranslation();
  const { createLivestock, updateLivestock } = useLivestock();

  const [formData, setFormData] = useState({
    tag_id: livestock?.tag_id || "",
    species: livestock?.species || "",
    breed: livestock?.breed || "",
    date_of_birth: livestock?.date_of_birth || "",
    gender: livestock?.gender || "M",
    health_status: livestock?.health_status || "healthy",
    current_weight_kg: livestock?.current_weight_kg || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [voiceDialogOpen, setVoiceDialogOpen] = useState(false);

  const speciesOptions = [
    { value: "cow", label: "Cow" },
    { value: "buffalo", label: "Buffalo" },
    { value: "goat", label: "Goat" },
    { value: "sheep", label: "Sheep" },
    { value: "chicken", label: "Chicken" },
    { value: "pig", label: "Pig" },
  ];

  const breedOptions = {
    cow: ["Holstein", "Angus", "Jersey", "Hereford", "Simmental"],
    buffalo: ["Murrah", "Nili-Ravi", "Surti", "Mehsana"],
    goat: ["Boer", "Nubian", "Saanen", "Alpine", "Toggenburg"],
    sheep: ["Merino", "Dorper", "Suffolk", "Hampshire"],
    chicken: ["Rhode Island Red", "Leghorn", "Sussex", "Orpington"],
    pig: ["Yorkshire", "Duroc", "Hampshire", "Landrace"],
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleVoiceData = (voiceData: Partial<LivestockFormData>) => {
    setFormData((prev) => ({ ...prev, ...voiceData }));
    setVoiceDialogOpen(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tag_id.trim()) {
      newErrors.tag_id = "Tag ID is required";
    }

    if (!formData.species) {
      newErrors.species = "Species is required";
    }

    if (!formData.breed.trim()) {
      newErrors.breed = "Breed is required";
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = "Date of birth is required";
    }

    if (
      formData.current_weight_kg &&
      isNaN(Number(formData.current_weight_kg))
    ) {
      newErrors.current_weight_kg = "Weight must be a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const submitData = {
        ...formData,
        current_weight_kg: formData.current_weight_kg
          ? Number(formData.current_weight_kg)
          : undefined,
      };

      if (mode === "create") {
        await createLivestock.mutateAsync(submitData);
      } else if (livestock) {
        await updateLivestock.mutateAsync({
          id: livestock.id,
          data: submitData,
        });
      }

      onClose();
    } catch (error) {
      console.error("Error saving livestock:", error);
    }
  };

  const isLoading = createLivestock.isPending || updateLivestock.isPending;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            {mode === "create" ? "Add New Livestock" : "Edit Livestock"}
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
              <TextField
                fullWidth
                label="Tag ID"
                value={formData.tag_id}
                onChange={(e) => handleChange("tag_id", e.target.value)}
                error={!!errors.tag_id}
                helperText={errors.tag_id}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.species}>
                <InputLabel>Species</InputLabel>
                <Select
                  value={formData.species}
                  onChange={(e) => handleChange("species", e.target.value)}
                  label="Species"
                >
                  {speciesOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Breed"
                value={formData.breed}
                onChange={(e) => handleChange("breed", e.target.value)}
                error={!!errors.breed}
                helperText={errors.breed || "Enter the breed name (e.g., Holstein, Angus, Boer)"}
                required
                placeholder="e.g., Holstein, Angus, Boer, Jersey"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleChange("date_of_birth", e.target.value)}
                error={!!errors.date_of_birth}
                helperText={errors.date_of_birth}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  label="Gender"
                >
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Health Status</InputLabel>
                <Select
                  value={formData.health_status}
                  onChange={(e) =>
                    handleChange("health_status", e.target.value)
                  }
                  label="Health Status"
                >
                  <MenuItem value="healthy">Healthy</MenuItem>
                  <MenuItem value="sick">Sick</MenuItem>
                  <MenuItem value="recovering">Recovering</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Current Weight (kg)"
                type="number"
                value={formData.current_weight_kg}
                onChange={(e) =>
                  handleChange("current_weight_kg", e.target.value)
                }
                error={!!errors.current_weight_kg}
                helperText={errors.current_weight_kg}
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading
            ? "Saving..."
            : mode === "create"
            ? "Add Livestock"
            : "Update Livestock"}
        </Button>
      </DialogActions>

      <VoiceInput
        isOpen={voiceDialogOpen}
        onClose={() => setVoiceDialogOpen(false)}
        onVoiceData={handleVoiceData}
      />
    </Dialog>
  );
};

export default LivestockForm;
