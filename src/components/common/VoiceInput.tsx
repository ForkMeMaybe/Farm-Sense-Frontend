import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
  PlayArrow as PlayIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface VoiceInputProps {
  onVoiceData: (data: Partial<LivestockFormData>) => void;
  onClose?: () => void;
  isOpen?: boolean;
}

interface LivestockFormData {
  tag_id: string;
  species: string;
  breed: string;
  date_of_birth: string;
  gender: string;
  health_status: string;
  current_weight_kg: string;
}

interface ParsedField {
  field: keyof LivestockFormData;
  value: string;
  confidence: number;
  originalText: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onVoiceData, onClose, isOpen = false }) => {
  const [isListening, setIsListening] = useState(false);
  const { i18n } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedFields, setParsedFields] = useState<ParsedField[]>([]);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState('');
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<any>(null);

  // Enhanced species and breed mappings for voice recognition
  const speciesMappings = {
    'cow': [
      'cow', 'cattle', 'bull', 'cows', 'cattle', 'beef', 'dairy cow', 
      'milking cow', 'dairy cattle', 'beef cattle', 'cow animal'
    ],
    'buffalo': [
      'buffalo', 'water buffalo', 'buff', 'buffalos', 'indian buffalo',
      'asian buffalo', 'domestic buffalo'
    ],
    'goat': [
      'goat', 'billy', 'nanny', 'goats', 'billy goat', 'nanny goat',
      'mountain goat', 'domestic goat'
    ],
    'sheep': [
      'sheep', 'lamb', 'ewe', 'ram', 'sheep', 'lambs', 'ewes', 'rams',
      'wool sheep', 'domestic sheep'
    ],
    'chicken': [
      'chicken', 'hen', 'rooster', 'cock', 'chick', 'chickens', 'hens',
      'roosters', 'cocks', 'chicks', 'poultry', 'domestic chicken'
    ],
    'pig': [
      'pig', 'swine', 'hog', 'sow', 'boar', 'pigs', 'swine', 'hogs',
      'sows', 'boars', 'domestic pig', 'farm pig'
    ],
  };

  const breedMappings = {
    cow: {
      'holstein': 'Holstein',
      'holstein friesian': 'Holstein',
      'angus': 'Angus',
      'aberdeen angus': 'Angus',
      'jersey': 'Jersey',
      'jersey cow': 'Jersey',
      'hereford': 'Hereford',
      'simmental': 'Simmental',
      'gir': 'Gir',
      'sahiwal': 'Sahiwal',
      'tharparkar': 'Tharparkar',
      'red sindhi': 'Red Sindhi',
    },
    buffalo: {
      'murrah': 'Murrah',
      'nili ravi': 'Nili-Ravi',
      'nili ravi buffalo': 'Nili-Ravi',
      'surti': 'Surti',
      'mehsana': 'Mehsana',
      'jaffarabadi': 'Jaffarabadi',
      'bhadawari': 'Bhadawari',
    },
    goat: {
      'boer': 'Boer',
      'boer goat': 'Boer',
      'nubian': 'Nubian',
      'saanen': 'Saanen',
      'alpine': 'Alpine',
      'toggenburg': 'Toggenburg',
      'jamnapari': 'Jamnapari',
      'barbari': 'Barbari',
      'osmanabadi': 'Osmanabadi',
    },
    sheep: {
      'merino': 'Merino',
      'dorper': 'Dorper',
      'suffolk': 'Suffolk',
      'hampshire': 'Hampshire',
      'deccani': 'Deccani',
      'nellore': 'Nellore',
      'mandya': 'Mandya',
    },
    chicken: {
      'rhode island red': 'Rhode Island Red',
      'rhode island': 'Rhode Island Red',
      'leghorn': 'Leghorn',
      'white leghorn': 'Leghorn',
      'sussex': 'Sussex',
      'orpington': 'Orpington',
      'kadaknath': 'Kadaknath',
      'aseel': 'Aseel',
      'ancona': 'Ancona',
    },
    pig: {
      'yorkshire': 'Yorkshire',
      'large white': 'Yorkshire',
      'duroc': 'Duroc',
      'hampshire': 'Hampshire',
      'landrace': 'Landrace',
      'berkshire': 'Berkshire',
      'pietrain': 'Pietrain',
    },
  };

  const genderMappings = {
    'male': 'M',
    'female': 'F',
    'm': 'M',
    'f': 'F',
    'bull': 'M',
    'cow': 'F',
    'ram': 'M',
    'ewe': 'F',
    'rooster': 'M',
    'hen': 'F',
    'boar': 'M',
    'sow': 'F',
    'billy': 'M',
    'nanny': 'F',
    'cock': 'M',
    'chick': 'F',
    'stag': 'M',
    'doe': 'F',
    'buck': 'M',
    'doe': 'F',
    'tom': 'M',
    'queen': 'F',
  };

  const healthMappings = {
    'healthy': 'healthy',
    'sick': 'sick',
    'recovering': 'recovering',
    'ill': 'sick',
    'diseased': 'sick',
    'well': 'healthy',
    'good': 'healthy',
    'fine': 'healthy',
    'okay': 'healthy',
    'ok': 'healthy',
    'unwell': 'sick',
    'unhealthy': 'sick',
    'disease': 'sick',
    'infection': 'sick',
    'better': 'recovering',
    'improving': 'recovering',
    'healing': 'recovering',
  };

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      // Set language based on current app locale (fallback en-IN)
      const locale = i18n?.language || 'en';
      const localeMap: Record<string, string> = {
        en: 'en-IN',
        'en-US': 'en-US',
        hi: 'hi-IN',
        mr: 'mr-IN',
        gu: 'gu-IN',
        te: 'te-IN',
        ta: 'ta-IN',
        kn: 'kn-IN',
      };
      recognitionRef.current.lang = localeMap[locale] || 'en-IN';

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
  }, [i18n?.language]);

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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/amu-insights/parse-voice/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          transcript: transcript,
          language: (i18n?.language || 'en')
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
            field: key as keyof LivestockFormData,
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
    const voiceData: Partial<LivestockFormData> = {};
    parsedFields.forEach(field => {
      voiceData[field.field] = field.value;
    });
    onVoiceData(voiceData);
    if (onClose) onClose();
  };

  const getFieldLabel = (field: keyof LivestockFormData) => {
    const labels = {
      tag_id: 'Tag ID',
      species: 'Species',
      breed: 'Breed',
      date_of_birth: 'Date of Birth',
      gender: 'Gender',
      health_status: 'Health Status',
      current_weight_kg: 'Weight (kg)',
    };
    return labels[field];
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
        <Typography variant="h6">Voice Input for Livestock</Typography>
        <Typography variant="body2" color="text.secondary">
          Speak the livestock details naturally. Example: "Tag COW-001, cow, Holstein breed, female, healthy, weight 500 kg, born 2023"
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

export default VoiceInput;
