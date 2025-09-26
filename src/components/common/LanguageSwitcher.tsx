import React, { useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import { Language as LanguageIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const theme = useTheme();

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem("i18nextLng", languageCode);
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = languageCode;
  };

  const normalizedLang = (i18n.language || "en").split("-")[0];
  const currentLanguage =
    languages.find((lang) => lang.code === normalizedLang) || languages[0];

  return (
    <FormControl 
      size="small" 
      sx={{ 
        minWidth: 140,
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          border: '1px solid rgba(16, 185, 129, 0.3)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          '&:hover': {
            borderColor: 'rgba(16, 185, 129, 0.5)',
          },
          '&.Mui-focused': {
            borderColor: '#10B981',
            boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)',
          }
        }
      }}
    >
      <Select
        value={currentLanguage.code}
        onChange={(e) => handleLanguageChange(e.target.value)}
        displayEmpty
        sx={{
          "& .MuiSelect-select": {
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            gap: 1,
            minHeight: 'auto',
            height: '40px',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#374151',
          },
          "& .MuiSelect-icon": {
            color: '#10B981',
            fontSize: '1.2rem',
          }
        }}
        renderValue={(value) => {
          const selectedLang = languages.find(lang => lang.code === value) || languages[0];
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: '100%' }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                {selectedLang.flag}
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '0.875rem'
                }}
              >
                {selectedLang.name}
              </Typography>
            </Box>
          );
        }}
      >
        {languages.map((language) => (
          <MenuItem 
            key={language.code} 
            value={language.code}
            sx={{
              py: 1.5,
              px: 2,
              '&:hover': {
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
              }
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: '100%' }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  borderRadius: 1,
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                {language.flag}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="body2" 
                  component="div"
                  sx={{ 
                    fontWeight: 500,
                    color: '#374151',
                    fontSize: '0.875rem'
                  }}
                >
                  {language.name}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#6B7280',
                    fontSize: '0.75rem'
                  }}
                >
                  {language.nativeName}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSwitcher;
