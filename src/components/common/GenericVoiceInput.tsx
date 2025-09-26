import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Stop as StopIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface GenericVoiceInputProps {
  onVoiceData: (data: Record<string, any>) => void;
  onClose?: () => void;
  isOpen?: boolean;
  formType: 'health' | 'feed_record' | 'yield_record' | 'drug' | 'feed';
  title: string;
  description: string;
}

interface ParsedField {
  field: string;
  value: string;
  confidence: number;
  originalText: string;
}

const GenericVoiceInput: React.FC<GenericVoiceInputProps> = ({ 
  onVoiceData, 
  onClose, 
  isOpen = false,
  formType,
  title,
  description
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedFields, setParsedFields] = useState<ParsedField[]>([]);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState('');
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<any>(null);

  // Form-specific field mappings
  const getFormFields = () => {
    switch (formType) {
      case 'health':
        return {
          livestock: 'Livestock ID',
          event_type: 'Event Type',
          event_date: 'Event Date',
          notes: 'Notes',
          diagnosis: 'Diagnosis',
          treatment_outcome: 'Treatment Outcome'
        };
      case 'feed_record':
        return {
          livestock: 'Livestock ID',
          feed_type: 'Feed Type',
          feed: 'Feed Name',
          quantity_kg: 'Quantity (kg)',
          price_per_kg: 'Price per kg',
          date: 'Date'
        };
      case 'yield_record':
        return {
          livestock: 'Livestock ID',
          yield_type: 'Yield Type',
          quantity: 'Quantity',
          quality_grade: 'Quality Grade',
          date: 'Date',
          notes: 'Notes'
        };
      case 'drug':
        return {
          name: 'Drug Name',
          active_ingredient: 'Active Ingredient',
          dosage_form: 'Dosage Form',
          dosage_strength: 'Dosage Strength',
          withdrawal_period_days: 'Withdrawal Period (days)',
          manufacturer: 'Manufacturer'
        };
      case 'feed':
        return {
          name: 'Feed Name',
          feed_type: 'Feed Type',
          protein_content: 'Protein Content (%)',
          energy_content: 'Energy Content (kcal/kg)',
          price_per_kg: 'Price per kg',
          manufacturer: 'Manufacturer'
        };
      default:
        return {};
    }
  };

  const getExamplePhrases = () => {
    switch (formType) {
      case 'health':
        return [
          "COW-001 had a vaccination today, routine check-up, healthy condition, no issues",
          "GOAT-123 is sick, showing symptoms of fever, diagnosed with infection, treatment started",
          "SHEEP-456 treatment completed, recovered well, no complications"
        ];
      case 'feed_record':
        return [
          "Fed COW-001 with 10 kg of hay today, cost 50 rupees per kg, total 500 rupees",
          "GOAT-123 given 5 kg concentrate feed, 100 rupees per kg, protein supplement",
          "SHEEP-456 fed 8 kg grass, 30 rupees per kg, natural feed"
        ];
      case 'yield_record':
        return [
          "COW-001 produced 15 liters of milk today, grade A quality, excellent yield",
          "CHICKEN-789 laid 8 eggs, grade A quality, good production",
          "GOAT-123 milk yield 3 liters, grade B quality, normal production"
        ];
      case 'drug':
        return [
          "Penicillin injection, 10ml dosage, 7 days withdrawal period, manufactured by ABC Pharma",
          "Antibiotic tablet, 500mg strength, 5 days withdrawal, oral dosage form",
          "Vaccine for cattle, 2ml injection, 0 days withdrawal, preventive medicine"
        ];
      case 'feed':
        return [
          "Cattle feed concentrate, 18% protein content, 3000 kcal energy, 50 rupees per kg",
          "Goat feed pellets, 16% protein, 2800 kcal energy, 45 rupees per kg",
          "Chicken feed mash, 20% protein, 3200 kcal energy, 40 rupees per kg"
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError('');
      };

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + ' ' + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setError('Speech recognition is not supported in this browser');
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setParsedFields([]);
      setError('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      processTranscript();
    }
  };

  const processTranscript = async () => {
    setIsProcessing(true);
    
    try {
      // Call the AI-powered voice parsing API
      const response = await fetch('/api/amu-insights/parse-voice/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          transcript: transcript,
          form_type: formType
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const aiResponse = await response.json();
      
      if (aiResponse.error) {
        setError(`AI parsing error: ${aiResponse.error}`);
        setParsedFields([]);
        return;
      }

      // Convert AI response to ParsedField format
      const fields: ParsedField[] = [];
      
      Object.entries(aiResponse).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          fields.push({
            field: key,
            value: String(value),
            confidence: 0.95, // High confidence for AI parsing
            originalText: transcript
          });
        }
      });

      setParsedFields(fields);
      
    } catch (error) {
      console.error('Error processing transcript with AI:', error);
      setError(`Failed to process voice input: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setParsedFields([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditField = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (editingField) {
      setParsedFields(prev => 
        prev.map(f => 
          f.field === editingField 
            ? { ...f, value: editValue }
            : f
        )
      );
      setEditingField(null);
      setEditValue('');
    }
  };

  const applyVoiceData = () => {
    const voiceData: Record<string, any> = {};
    parsedFields.forEach(field => {
      voiceData[field.field] = field.value;
    });
    onVoiceData(voiceData);
    if (onClose) onClose();
  };

  const getFieldLabel = (field: string) => {
    const fieldLabels = getFormFields();
    return fieldLabels[field as keyof typeof fieldLabels] || field;
  };

  if (!isSupported) {
    return (
      <Alert severity="warning">
        Voice input is not supported in this browser. Please use Chrome or Safari.
      </Alert>
    );
  }

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {/* Voice Controls */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Button
                  variant={isListening ? "contained" : "outlined"}
                  color={isListening ? "error" : "primary"}
                  onClick={isListening ? stopListening : startListening}
                  startIcon={isListening ? <StopIcon /> : <MicIcon />}
                  disabled={isProcessing}
                >
                  {isListening ? 'Stop Recording' : 'Start Recording'}
                </Button>
                
                {isListening && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} />
                    <Typography variant="body2">Listening...</Typography>
                  </Box>
                )}
              </Box>

              {transcript && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Transcript:</Typography>
                  <Typography variant="body2" sx={{ 
                    p: 2, 
                    bgcolor: 'grey.50', 
                    borderRadius: 1,
                    fontStyle: 'italic'
                  }}>
                    "{transcript}"
                  </Typography>
                </Box>
              )}

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Example Phrases */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>Example phrases:</Typography>
              {getExamplePhrases().map((phrase, index) => (
                <Typography 
                  key={index}
                  variant="body2" 
                  sx={{ 
                    p: 1, 
                    mb: 1, 
                    bgcolor: 'grey.50', 
                    borderRadius: 1,
                    fontStyle: 'italic',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(phrase);
                  }}
                >
                  "{phrase}"
                </Typography>
              ))}
            </CardContent>
          </Card>

          {/* Parsed Fields */}
          {parsedFields.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Detected Information
                </Typography>
                <Grid container spacing={2}>
                  {parsedFields.map((field, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={getFieldLabel(field.field)}
                          color="primary"
                          size="small"
                        />
                        <Typography variant="body2" sx={{ flex: 1 }}>
                          {field.value}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleEditField(field.field, field.value)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Edit Dialog */}
          <Dialog open={!!editingField} onClose={() => setEditingField(null)}>
            <DialogTitle>Edit {editingField && getFieldLabel(editingField)}</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                label={editingField && getFieldLabel(editingField)}
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditingField(null)}>Cancel</Button>
              <Button onClick={saveEdit} variant="contained">Save</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={applyVoiceData}
          variant="contained"
          disabled={parsedFields.length === 0}
          startIcon={<CheckIcon />}
        >
          Apply to Form
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenericVoiceInput;
