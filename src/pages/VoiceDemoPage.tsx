import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Alert,
  Paper,
} from '@mui/material';
import { Mic as MicIcon, PlayArrow as PlayIcon } from '@mui/icons-material';
import VoiceInput from '../components/common/VoiceInput';

interface LivestockFormData {
  tag_id: string;
  species: string;
  breed: string;
  date_of_birth: string;
  gender: string;
  health_status: string;
  current_weight_kg: string;
}

const VoiceDemoPage: React.FC = () => {
  const [voiceDialogOpen, setVoiceDialogOpen] = useState(false);
  const [demoData, setDemoData] = useState<Partial<LivestockFormData>>({});

  const handleVoiceData = (data: Partial<LivestockFormData>) => {
    setDemoData(data);
    setVoiceDialogOpen(false);
  };

  const examplePhrases = [
    "I have a cow with tag COW-001, it's a Holstein breed, female, healthy, weighs 500 kg, born in 2023",
    "This is goat number GOAT-123, it's a Boer goat, male, currently sick, weighs 45 kg, born 2022",
    "Sheep with ID SHEEP-456, Merino breed, female, healthy condition, 60 kg weight, born 2023",
    "Chicken tagged CHICKEN-789, Rhode Island Red breed, female, healthy, weighs 2 kg, born 2024",
    "I'm adding a new cow, tag COW-002, Jersey breed, female, healthy, 450 kg, born January 2023",
    "Goat with tag GOAT-456, Nubian breed, male, recovering from illness, 50 kg, born 2022",
    "Buffalo ID BUFFALO-789, Murrah breed, female, healthy, weighs 600 kg, born 2021",
    "Pig tagged PIG-123, Yorkshire breed, male, healthy, 200 kg weight, born 2023",
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#1F2937' }}>
        🎤 Voice Input Demo
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>How it works:</strong> Click the microphone button and speak naturally about your livestock. 
          Our AI-powered system will intelligently parse your speech and extract all relevant information.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Voice Input Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Try Voice Input
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Click the button below to start voice input for livestock data.
              </Typography>
              
              <Button
                variant="contained"
                size="large"
                startIcon={<MicIcon />}
                onClick={() => setVoiceDialogOpen(true)}
                sx={{ 
                  bgcolor: '#10B981',
                  '&:hover': { bgcolor: '#059669' },
                  px: 4,
                  py: 2
                }}
              >
                Start Voice Input
              </Button>

              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                <strong>Note:</strong> Voice input works best in Chrome or Safari browsers.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Example Phrases */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Example Phrases
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Try saying one of these phrases:
              </Typography>
              
              {examplePhrases.map((phrase, index) => (
                <Paper
                  key={index}
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    bgcolor: 'grey.50',
                    border: '1px solid',
                    borderColor: 'grey.200',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'grey.100',
                    }
                  }}
                  onClick={() => {
                    // Copy to clipboard
                    navigator.clipboard.writeText(phrase);
                  }}
                >
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    "{phrase}"
                  </Typography>
                </Paper>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Results Display */}
        {Object.keys(demoData).length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🎯 Extracted Information
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(demoData).map(([key, value]) => (
                    <Grid item xs={12} sm={6} md={4} key={key}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={key.replace('_', ' ').toUpperCase()}
                          color="primary"
                          size="small"
                        />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {value}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Voice Input Guide */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎯 How to Speak for Best Recognition
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#10B981' }}>
                    📝 Tag ID Examples:
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace', bgcolor: 'grey.50', p: 1, borderRadius: 1 }}>
                    "Tag COW-001" or "ID GOAT-123" or "Animal ID SHEEP-456"
                  </Typography>
                  
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#10B981', mt: 2 }}>
                    🐄 Species Examples:
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace', bgcolor: 'grey.50', p: 1, borderRadius: 1 }}>
                    "cow", "cattle", "buffalo", "goat", "sheep", "chicken", "pig"
                  </Typography>
                  
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#10B981', mt: 2 }}>
                    🏷️ Breed Examples:
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace', bgcolor: 'grey.50', p: 1, borderRadius: 1 }}>
                    "Holstein breed", "Jersey", "Boer goat", "Merino sheep"
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#10B981' }}>
                    ⚖️ Gender Examples:
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace', bgcolor: 'grey.50', p: 1, borderRadius: 1 }}>
                    "male", "female", "bull", "cow", "ram", "ewe", "rooster", "hen"
                  </Typography>
                  
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#10B981', mt: 2 }}>
                    🏥 Health Examples:
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace', bgcolor: 'grey.50', p: 1, borderRadius: 1 }}>
                    "healthy", "sick", "recovering", "well", "ill", "better"
                  </Typography>
                  
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#10B981', mt: 2 }}>
                    📅 Date Examples:
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace', bgcolor: 'grey.50', p: 1, borderRadius: 1 }}>
                    "born 2023", "birth date 2023-01-15", "born January 2023"
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Features List */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🚀 Voice Input Features
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>✅ AI-Powered:</strong> Uses Perplexity AI for intelligent parsing
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>✅ Natural Speech:</strong> Speak naturally about your livestock
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>✅ Smart Extraction:</strong> AI extracts all relevant information
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>✅ High Accuracy:</strong> AI understands context and relationships
              </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>✅ Edit & Correct:</strong> Edit any detected information
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>✅ Mobile Friendly:</strong> Works great on mobile devices
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>✅ Offline Capable:</strong> Works without internet connection
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>✅ AI Understanding:</strong> Comprehends complex speech patterns
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <VoiceInput
        isOpen={voiceDialogOpen}
        onClose={() => setVoiceDialogOpen(false)}
        onVoiceData={handleVoiceData}
      />
    </Box>
  );
};

export default VoiceDemoPage;
