# FarmSense: Comprehensive Frontend Development Guide

## Project Overview

**FarmSense** is an intelligent, offline-ready livestock management system designed to monitor Maximum Residue Limits (MRL) and Antimicrobial Usage (AMU) in livestock. This guide provides complete details for developing the React frontend that integrates with the Django REST API backend.

### Key Problem Statement Features

- **AMU Monitoring**: Track antimicrobial usage and ensure compliance
- **MRL Compliance**: Monitor Maximum Residue Limits in livestock products
- **Digital Farm Management**: Complete livestock record management
- **AI-Based Insights**: Smart recommendations using Gemini AI
- **Offline-Ready**: Works without constant internet connectivity
- **Multi-Platform**: Web platform and mobile application support

---

## Backend API Analysis

### Authentication System

- **Base URL**: `http://localhost:8000/`
- **Authentication**: JWT-based using Djoser
- **User Model**: Custom user with email as primary identifier

### API Endpoints Structure

#### Authentication Endpoints (`/auth/`)

- `POST /auth/users/` - User registration (Django User creation)
- `POST /auth/jwt/create/` - Login (JWT token generation)
- `POST /auth/jwt/refresh/` - Refresh JWT token
- `POST /auth/jwt/verify/` - Verify JWT token
- `GET /auth/users/me/` - Get current user profile

#### Livestock Management Endpoints (`/api/`)

- `GET|POST /api/farms/` - Farm management (Farm Owner registration)
- `GET|POST /api/labourers/` - Labourer management (Farm Labourer registration)
- `GET|POST /api/livestock/` - Individual livestock records
- `GET|POST /api/health-records/` - Health and medical records
- `GET|POST /api/amu-records/` - Antimicrobial usage records
- `GET|POST /api/feed-records/` - Feed and nutrition tracking
- `GET|POST /api/yield-records/` - Production yield records
- `GET|POST /api/drugs/` - Drug database management
- `POST /api/amu-insights/generate/` - AI-powered AMU insights

---

## Data Models Structure

### Farm Model

```typescript
interface Farm {
  id: number;
  owner: number;
  name: string;
  location?: string;
}
```

### Livestock Model

```typescript
interface Livestock {
  id: number;
  farm: number;
  tag_id: string;
  species: string;
  breed: string;
  date_of_birth: string;
  gender: 'M' | 'F';
  health_status: 'healthy' | 'sick' | 'recovering';
  current_weight_kg?: number;
}
```

### Health Record Model

```typescript
interface HealthRecord {
  id: number;
  livestock: number;
  event_type: 'vaccination' | 'sickness' | 'check-up' | 'treatment';
  event_date: string;
  notes?: string;
  diagnosis?: string;
  treatment_outcome?: string;
  amu_records: AMURecord[];
}
```

### AMU Record Model

```typescript
interface AMURecord {
  id: number;
  health_record: number;
  drug: number;
  drug_name: string;
  dosage: string;
  withdrawal_period: number;
}
```

### Drug Model

```typescript
interface Drug {
  id: number;
  name: string;
  active_ingredient?: string;
  species_target?: string;
  recommended_dosage_min?: number;
  recommended_dosage_max?: number;
  unit?: string;
  notes?: string;
}
```

### Feed Record Model

```typescript
interface FeedRecord {
  id: number;
  livestock: number;
  feed_type: string;
  quantity_kg: number;
  date: string;
}
```

### Yield Record Model

```typescript
interface YieldRecord {
  id: number;
  livestock: number;
  yield_type: string;
  quantity: number;
  unit: string;
  date: string;
}
```

### Labourer Model

```typescript
interface Labourer {
  id: number;
  user: number;
  farm?: number;
  status: 'pending' | 'approved' | 'rejected';
  user_name: string;
  user_email: string;
  farm_name?: string;
}
```

### User Model (Django User)

```typescript
interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  owned_farm?: number;
  labourer_profile?: number;
}
```

### Registration Models

```typescript
interface FarmOwnerRegistration {
  email: string;
  username: string;
  password: string;
  re_password: string;
  farm_name: string;
  farm_location: string;
}

interface LabourerRegistration {
  email: string;
  username: string;
  password: string;
  re_password: string;
}
```

---

## React Frontend Architecture

### Recommended Tech Stack

- **Frontend Framework**: React 18+ with TypeScript
- **State Management**: Redux Toolkit or Zustand
- **Routing**: React Router v6
- **UI Library**: Material-UI v5 or Ant Design
- **Charts/Visualization**: Chart.js or Recharts
- **HTTP Client**: Axios
- **Form Management**: React Hook Form
- **Date Handling**: date-fns or Day.js
- **Offline Support**: React Query with persistence
- **PWA**: Workbox for service workers
- **Internationalization**: react-i18next with language detection
- **Font Support**: Google Fonts for Indic scripts

### Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── LoadingSpinner.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegistrationWizard.tsx
│   │   ├── UserTypeSelection.tsx
│   │   ├── FarmOwnerRegistration.tsx
│   │   ├── LabourerRegistration.tsx
│   │   └── ProtectedRoute.tsx
│   ├── livestock/
│   │   ├── LivestockList.tsx
│   │   ├── LivestockCard.tsx
│   │   ├── LivestockForm.tsx
│   │   └── LivestockDetails.tsx
│   ├── health/
│   │   ├── HealthRecordList.tsx
│   │   ├── HealthRecordForm.tsx
│   │   └── AMURecordForm.tsx
│   ├── feed/
│   │   ├── FeedTracker.tsx
│   │   └── FeedHistory.tsx
│   ├── yield/
│   │   ├── YieldTracker.tsx
│   │   └── YieldAnalytics.tsx
│   ├── dashboard/
│   │   ├── DashboardOverview.tsx
│   │   ├── AMUInsights.tsx
│   │   └── ComplianceStatus.tsx
│   └── charts/
│       ├── AMUChart.tsx
│       ├── YieldChart.tsx
│       └── HealthStatusChart.tsx
├── pages/
│   ├── Registration.tsx
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Livestock.tsx
│   ├── HealthRecords.tsx
│   ├── FeedManagement.tsx
│   ├── YieldTracking.tsx
│   ├── AMUMonitoring.tsx
│   ├── ComplianceReports.tsx
│   └── Settings.tsx
├── services/
│   ├── api.ts
│   ├── auth.ts
│   ├── livestock.ts
│   ├── health.ts
│   ├── amu.ts
│   └── insights.ts
├── store/
│   ├── index.ts
│   ├── authSlice.ts
│   ├── livestockSlice.ts
│   └── healthSlice.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useLivestock.ts
│   └── useAMUInsights.ts
├── types/
│   └── index.ts
├── utils/
│   ├── constants.ts
│   ├── formatters.ts
│   └── validators.ts
├── locales/
│   ├── en/
│   │   └── translation.json
│   ├── hi/
│   │   └── translation.json
│   ├── mr/
│   │   └── translation.json
│   ├── gu/
│   │   └── translation.json
│   ├── bn/
│   │   └── translation.json
│   ├── ta/
│   │   └── translation.json
│   ├── te/
│   │   └── translation.json
│   └── kn/
│       └── translation.json
└── i18n.ts
```

---

## Internationalization (i18n) System

### Supported Languages

The FarmSense application provides comprehensive multilingual support for Indian farmers:

1. **English (en)** - Default language
2. **Hindi (hi)** - हिंदी
3. **Marathi (mr)** - मराठी
4. **Gujarati (gu)** - ગુજરાતી
5. **Bengali (bn)** - বাংলা
6. **Tamil (ta)** - தமிழ்
7. **Telugu (te)** - తెలుగు
8. **Kannada (kn)** - ಕನ್ನಡ

### i18n Tech Stack

- **Library**: react-i18next (v13+)
- **Language Detection**: i18next-browser-languagedetector
- **Font Support**: Google Fonts for Indic scripts
- **Fallback Language**: English
- **Storage**: localStorage for user language preference

### Installation and Setup

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

### i18n Configuration

**File**: `src/i18n.ts`

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from './locales/en/translation.json';
import hiTranslation from './locales/hi/translation.json';
import mrTranslation from './locales/mr/translation.json';
import guTranslation from './locales/gu/translation.json';
import bnTranslation from './locales/bn/translation.json';
import taTranslation from './locales/ta/translation.json';
import teTranslation from './locales/te/translation.json';
import knTranslation from './locales/kn/translation.json';

const resources = {
  en: { translation: enTranslation },
  hi: { translation: hiTranslation },
  mr: { translation: mrTranslation },
  gu: { translation: guTranslation },
  bn: { translation: bnTranslation },
  ta: { translation: taTranslation },
  te: { translation: teTranslation },
  kn: { translation: knTranslation }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // React-specific options
    react: {
      useSuspense: true,
    }
  });

export default i18n;
```

### Translation File Structure

**English (`src/locales/en/translation.json`)**:

```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "add": "Add",
    "search": "Search",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success"
  },
  "auth": {
    "login": "Login",
    "register": "Register",
    "email": "Email Address",
    "username": "Username",
    "password": "Password",
    "confirmPassword": "Confirm Password",
    "farmOwner": "Farm Owner",
    "labourer": "Farm Labourer",
    "selectUserType": "Select User Type",
    "farmName": "Farm Name",
    "farmLocation": "Farm Location"
  },
  "dashboard": {
    "welcome": "Welcome to FarmSense",
    "totalLivestock": "Total Livestock",
    "healthyAnimals": "Healthy Animals",
    "recentTreatments": "Recent Treatments",
    "complianceStatus": "Compliance Status"
  },
  "livestock": {
    "title": "Livestock Management",
    "addNew": "Add New Animal",
    "tagId": "Tag ID",
    "species": "Species",
    "breed": "Breed",
    "gender": "Gender",
    "male": "Male",
    "female": "Female",
    "dateOfBirth": "Date of Birth",
    "healthStatus": "Health Status",
    "healthy": "Healthy",
    "sick": "Sick",
    "recovering": "Recovering",
    "currentWeight": "Current Weight (kg)"
  },
  "health": {
    "title": "Health Records",
    "addRecord": "Add Health Record",
    "eventType": "Event Type",
    "vaccination": "Vaccination",
    "sickness": "Sickness",
    "checkup": "Check-up",
    "treatment": "Treatment",
    "eventDate": "Event Date",
    "diagnosis": "Diagnosis",
    "treatmentOutcome": "Treatment Outcome",
    "notes": "Notes"
  },
  "amu": {
    "title": "Antimicrobial Usage",
    "drugName": "Drug Name",
    "dosage": "Dosage",
    "withdrawalPeriod": "Withdrawal Period (days)",
    "treatmentProgress": "Treatment Progress",
    "complianceScore": "Compliance Score",
    "insights": "AI Insights",
    "recommendations": "Recommendations"
  },
  "feed": {
    "title": "Feed Management",
    "feedType": "Feed Type",
    "quantity": "Quantity (kg)",
    "date": "Date",
    "totalConsumption": "Total Consumption"
  },
  "yield": {
    "title": "Yield Tracking",
    "yieldType": "Yield Type",
    "quantity": "Quantity",
    "unit": "Unit",
    "date": "Date",
    "milk": "Milk",
    "eggs": "Eggs"
  }
}
```

**Hindi (`src/locales/hi/translation.json`)**:

```json
{
  "common": {
    "save": "सेव करें",
    "cancel": "रद्द करें",
    "delete": "हटाएं",
    "edit": "संपादित करें",
    "add": "जोड़ें",
    "search": "खोजें",
    "loading": "लोड हो रहा है...",
    "error": "त्रुटि",
    "success": "सफलता"
  },
  "auth": {
    "login": "लॉगिन",
    "register": "पंजीकरण",
    "email": "ईमेल पता",
    "username": "उपयोगकर्ता नाम",
    "password": "पासवर्ड",
    "confirmPassword": "पासवर्ड की पुष्टि करें",
    "farmOwner": "फार्म मालिक",
    "labourer": "फार्म मजदूर",
    "selectUserType": "उपयोगकर्ता प्रकार चुनें",
    "farmName": "फार्म का नाम",
    "farmLocation": "फार्म का स्थान"
  },
  "dashboard": {
    "welcome": "फार्मसेंस में आपका स्वागत है",
    "totalLivestock": "कुल पशुधन",
    "healthyAnimals": "स्वस्थ पशु",
    "recentTreatments": "हाल के उपचार",
    "complianceStatus": "अनुपालन स्थिति"
  },
  "livestock": {
    "title": "पशुधन प्रबंधन",
    "addNew": "नया पशु जोड़ें",
    "tagId": "टैग आईडी",
    "species": "प्रजाति",
    "breed": "नस्ल",
    "gender": "लिंग",
    "male": "नर",
    "female": "मादा",
    "dateOfBirth": "जन्म तिथि",
    "healthStatus": "स्वास्थ्य स्थिति",
    "healthy": "स्वस्थ",
    "sick": "बीमार",
    "recovering": "ठीक हो रहा है",
    "currentWeight": "वर्तमान वजन (किग्रा)"
  }
}
```

### Language Switcher Component

**Component**: `src/components/common/LanguageSwitcher.tsx`

```typescript
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Box,
  Avatar,
  Typography 
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' }
];

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('i18nextLng', languageCode);
    
    // Update document direction for RTL languages (if needed in future)
    document.documentElement.dir = i18n.dir();
    
    // Update HTML lang attribute
    document.documentElement.lang = languageCode;
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <FormControl size="small" sx={{ minWidth: 150 }}>
      <InputLabel id="language-select-label">
        <LanguageIcon sx={{ mr: 1 }} />
        Language
      </InputLabel>
      <Select
        labelId="language-select-label"
        value={i18n.language}
        onChange={(e) => handleLanguageChange(e.target.value)}
        label="Language"
      >
        {languages.map((language) => (
          <MenuItem key={language.code} value={language.code}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span style={{ fontSize: '18px' }}>{language.flag}</span>
              <Box>
                <Typography variant="body2" component="div">
                  {language.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
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
```

### Font Configuration for Indic Scripts

**Add to `public/index.html`**:

```html
<head>
  <!-- Google Fonts for Indic Scripts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- Noto Sans for comprehensive Unicode support -->
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Noto+Sans+Devanagari:wght@100..900&family=Noto+Sans+Bengali:wght@100..900&family=Noto+Sans+Tamil:wght@100..900&family=Noto+Sans+Telugu:wght@100..900&family=Noto+Sans+Gujarati:wght@100..900&family=Noto+Sans+Kannada:wght@100..900&display=swap" rel="stylesheet">
</head>
```

**CSS for Language-Specific Fonts (`src/styles/fonts.css`)**:

```css
/* Default font */
body {
  font-family: 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

/* Language-specific font families */
html[lang="hi"] body,
html[lang="mr"] body {
  font-family: 'Noto Sans Devanagari', 'Noto Sans', sans-serif;
}

html[lang="bn"] body {
  font-family: 'Noto Sans Bengali', 'Noto Sans', sans-serif;
}

html[lang="ta"] body {
  font-family: 'Noto Sans Tamil', 'Noto Sans', sans-serif;
}

html[lang="te"] body {
  font-family: 'Noto Sans Telugu', 'Noto Sans', sans-serif;
}

html[lang="gu"] body {
  font-family: 'Noto Sans Gujarati', 'Noto Sans', sans-serif;
}

html[lang="kn"] body {
  font-family: 'Noto Sans Kannada', 'Noto Sans', sans-serif;
}

/* Ensure proper line height for Indic scripts */
html[lang="hi"] body,
html[lang="mr"] body,
html[lang="bn"] body,
html[lang="ta"] body,
html[lang="te"] body,
html[lang="gu"] body,
html[lang="kn"] body {
  line-height: 1.6;
}
```

### Translation Hook for Components

**Custom Hook**: `src/hooks/useTranslation.ts`

```typescript
import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = (namespace?: string) => {
  const { t, i18n, ready } = useI18nTranslation(namespace);
  
  const currentLanguage = i18n.language;
  const isRTL = i18n.dir() === 'rtl'; // For future RTL support
  
  // Helper function for pluralization
  const tp = (key: string, count: number) => t(key, { count });
  
  // Helper function for interpolation
  const ti = (key: string, values: Record<string, any>) => t(key, values);
  
  return {
    t,
    tp,
    ti,
    i18n,
    ready,
    currentLanguage,
    isRTL,
    changeLanguage: i18n.changeLanguage
  };
};
```

### Usage in Components

**Example**: Updated Registration Form with i18n

```typescript
// components/auth/FarmOwnerRegistration.tsx
import { useTranslation } from '../../hooks/useTranslation';

const FarmOwnerRegistration: React.FC<FarmOwnerRegistrationProps> = ({
  onSubmit,
  onBack,
  loading,
  error
}) => {
  const { t } = useTranslation();
  
  // ... form logic
  
  return (
    <div className="farm-owner-registration">
      <div className="form-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeftIcon />
        </button>
        <h2>{t('auth.farmOwner')}</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
        <div className="form-section">
          <h3>{t('auth.accountInfo')}</h3>
          
          <div className="form-group">
            <label htmlFor="email">{t('auth.email')}</label>
            <input
              {...register('email')}
              type="email"
              id="email"
              placeholder={t('auth.email')}
            />
          </div>

          <div className="form-group">
            <label htmlFor="farm_name">{t('auth.farmName')}</label>
            <input
              {...register('farm_name')}
              type="text"
              id="farm_name"
              placeholder={t('auth.farmName')}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onBack}>
            {t('common.cancel')}
          </button>
          <button type="submit" disabled={loading}>
            {loading ? t('common.loading') : t('common.save')}
          </button>
        </div>
      </form>
    </div>
  );
};
```

### Number and Date Formatting

**Utility**: `src/utils/formatters.ts`

```typescript
import { format } from 'date-fns';
import { enIN, hi, mr, gu, bn, ta, te, kn } from 'date-fns/locale';

const localeMap = {
  en: enIN,
  hi: hi,
  mr: mr,
  gu: gu,
  bn: bn,
  ta: ta,
  te: te,
  kn: kn
};

export const formatDate = (date: Date, language: string): string => {
  const locale = localeMap[language as keyof typeof localeMap] || enIN;
  return format(date, 'PPP', { locale });
};

export const formatNumber = (num: number, language: string): string => {
  return new Intl.NumberFormat(language === 'en' ? 'en-IN' : language, {
    notation: 'standard'
  }).format(num);
};

export const formatCurrency = (amount: number, language: string): string => {
  return new Intl.NumberFormat(language === 'en' ? 'en-IN' : language, {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};
```

### Translation Management

**Translation Keys Structure**:

- **Hierarchical**: Use dot notation (`auth.login`, `livestock.addNew`)
- **Namespaced**: Group related translations together
- **Descriptive**: Use meaningful key names
- **Consistent**: Follow naming conventions across all languages

**Best Practices**:

1. Always provide fallback text in English
2. Keep translations short and contextual
3. Use interpolation for dynamic content
4. Consider cultural context for each language
5. Test with different text lengths for UI layout

---

## User Registration System

### Three-Tier User System

The application supports three types of users:

1. **Django User**: Base authentication user (created via `/auth/users/`)
2. **Farm Owner**: User + Farm (linked via `owned_farm` relationship)
3. **Farm Labourer**: User + Labourer profile (linked via `labourer_profile` relationship)

### Registration Flow Architecture

**Components**: `RegistrationWizard.tsx`, `UserTypeSelection.tsx`, `FarmOwnerRegistration.tsx`, `LabourerRegistration.tsx`

#### Step 1: User Type Selection

**Component**: `UserTypeSelection.tsx`

```typescript
interface UserTypeSelectionProps {
  onSelectType: (type: 'farm-owner' | 'labourer') => void;
}

const UserTypeSelection: React.FC<UserTypeSelectionProps> = ({ onSelectType }) => {
  return (
    <div className="user-type-selection">
      <h2>Choose Your Registration Type</h2>
      <div className="type-cards">
        <div 
          className="type-card farm-owner"
          onClick={() => onSelectType('farm-owner')}
        >
          <FarmIcon />
          <h3>Farm Owner</h3>
          <p>Register as a farm owner to manage your livestock and operations</p>
        </div>
        <div 
          className="type-card labourer"
          onClick={() => onSelectType('labourer')}
        >
          <WorkerIcon />
          <h3>Farm Labourer</h3>
          <p>Register as a farm labourer to work with existing farms</p>
        </div>
      </div>
    </div>
  );
};
```

#### Step 2: Form-Specific Registration

**Farm Owner Registration Fields**:

- Email (required)
- Username (required)
- Password (required)
- Confirm Password (required)
- Farm Name (required)
- Farm Location (required)

**Farm Labourer Registration Fields**:

- Email (required)
- Username (required)
- Password (required)
- Confirm Password (required)

### Registration API Flow

#### Farm Owner Registration Process

```typescript
const registerFarmOwner = async (data: FarmOwnerRegistration) => {
  try {
    // Step 1: Create Django User
    const userResponse = await api.post('/auth/users/', {
      email: data.email,
      username: data.username,
      password: data.password,
      re_password: data.re_password
    });

    if (userResponse.status === 201) {
      // Step 2: Login to get JWT token
      const loginResponse = await api.post('/auth/jwt/create/', {
        email: data.email,
        password: data.password
      });

      const { access } = loginResponse.data;
      
      // Step 3: Create Farm with authenticated user
      const farmResponse = await api.post('/api/farms/', {
        name: data.farm_name,
        location: data.farm_location
      }, {
        headers: { Authorization: `JWT ${access}` }
      });

      return {
        success: true,
        user: userResponse.data,
        farm: farmResponse.data,
        token: access
      };
    }
  } catch (error) {
    throw new Error(`Registration failed: ${error.response?.data?.message || error.message}`);
  }
};
```

#### Farm Labourer Registration Process

```typescript
const registerLabourer = async (data: LabourerRegistration) => {
  try {
    // Step 1: Create Django User
    const userResponse = await api.post('/auth/users/', {
      email: data.email,
      username: data.username,
      password: data.password,
      re_password: data.re_password
    });

    if (userResponse.status === 201) {
      // Step 2: Login to get JWT token
      const loginResponse = await api.post('/auth/jwt/create/', {
        email: data.email,
        password: data.password
      });

      const { access } = loginResponse.data;

      // Step 3: Create Labourer profile
      const labourerResponse = await api.post('/api/labourers/', {}, {
        headers: { Authorization: `JWT ${access}` }
      });

      return {
        success: true,
        user: userResponse.data,
        labourer: labourerResponse.data,
        token: access
      };
    }
  } catch (error) {
    throw new Error(`Registration failed: ${error.response?.data?.message || error.message}`);
  }
};
```

### Registration Wizard Implementation

**Component**: `RegistrationWizard.tsx`

```typescript
interface RegistrationWizardProps {}

const RegistrationWizard: React.FC<RegistrationWizardProps> = () => {
  const [step, setStep] = useState<'type-selection' | 'registration'>('type-selection');
  const [userType, setUserType] = useState<'farm-owner' | 'labourer' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleTypeSelection = (type: 'farm-owner' | 'labourer') => {
    setUserType(type);
    setStep('registration');
  };

  const handleFarmOwnerRegistration = async (data: FarmOwnerRegistration) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await registerFarmOwner(data);
      
      // Store token and redirect
      localStorage.setItem('token', result.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLabourerRegistration = async (data: LabourerRegistration) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await registerLabourer(data);
      
      // Store token and redirect
      localStorage.setItem('token', result.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToTypeSelection = () => {
    setStep('type-selection');
    setUserType(null);
    setError(null);
  };

  return (
    <div className="registration-wizard">
      {step === 'type-selection' && (
        <UserTypeSelection onSelectType={handleTypeSelection} />
      )}
      
      {step === 'registration' && userType === 'farm-owner' && (
        <FarmOwnerRegistration
          onSubmit={handleFarmOwnerRegistration}
          onBack={handleBackToTypeSelection}
          loading={loading}
          error={error}
        />
      )}
      
      {step === 'registration' && userType === 'labourer' && (
        <LabourerRegistration
          onSubmit={handleLabourerRegistration}
          onBack={handleBackToTypeSelection}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
};
```

### Form Validation Schema

**Farm Owner Validation**:

```typescript
import * as yup from 'yup';

const farmOwnerSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  username: yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  re_password: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
  farm_name: yup.string().min(2, 'Farm name must be at least 2 characters').required('Farm name is required'),
  farm_location: yup.string().min(2, 'Farm location must be at least 2 characters').required('Farm location is required')
});
```

**Labourer Validation**:

```typescript
const labourerSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  username: yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  re_password: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required')
});
```

### Error Handling

**Common Registration Errors**:

- Email already exists
- Username already taken
- Password validation failures
- Network connectivity issues
- Server validation errors

**Error Display Component**:

```typescript
interface ErrorAlertProps {
  error: string | null;
  onDismiss: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onDismiss }) => {
  if (!error) return null;

  return (
    <div className="error-alert">
      <ExclamationIcon />
      <span>{error}</span>
      <button onClick={onDismiss}>
        <CloseIcon />
      </button>
    </div>
  );
};
```

### Success States

**Registration Success Flow**:

1. Show success message
2. Auto-redirect to dashboard
3. Display welcome message based on user type
4. Guide user through next steps

### React Hook Form Implementation Examples

**Farm Owner Registration Form**:

```typescript
// components/auth/FarmOwnerRegistration.tsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

interface FarmOwnerRegistrationProps {
  onSubmit: (data: FarmOwnerRegistration) => void;
  onBack: () => void;
  loading: boolean;
  error: string | null;
}

const FarmOwnerRegistration: React.FC<FarmOwnerRegistrationProps> = ({
  onSubmit,
  onBack,
  loading,
  error
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<FarmOwnerRegistration>({
    resolver: yupResolver(farmOwnerSchema),
    mode: 'onChange'
  });

  return (
    <div className="farm-owner-registration">
      <div className="form-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeftIcon />
        </button>
        <h2>Register as Farm Owner</h2>
      </div>

      {error && <ErrorAlert error={error} onDismiss={() => {}} />}

      <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
        <div className="form-section">
          <h3>Account Information</h3>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              {...register('username')}
              type="text"
              id="username"
              className={errors.username ? 'error' : ''}
            />
            {errors.username && <span className="error-text">{errors.username.message}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                {...register('password')}
                type="password"
                id="password"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-text">{errors.password.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="re_password">Confirm Password</label>
              <input
                {...register('re_password')}
                type="password"
                id="re_password"
                className={errors.re_password ? 'error' : ''}
              />
              {errors.re_password && <span className="error-text">{errors.re_password.message}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Farm Information</h3>
          
          <div className="form-group">
            <label htmlFor="farm_name">Farm Name</label>
            <input
              {...register('farm_name')}
              type="text"
              id="farm_name"
              className={errors.farm_name ? 'error' : ''}
            />
            {errors.farm_name && <span className="error-text">{errors.farm_name.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="farm_location">Farm Location</label>
            <input
              {...register('farm_location')}
              type="text"
              id="farm_location"
              placeholder="Enter farm address or location"
              className={errors.farm_location ? 'error' : ''}
            />
            {errors.farm_location && <span className="error-text">{errors.farm_location.message}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onBack}
            className="btn btn-secondary"
            disabled={loading}
          >
            Back
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isValid || loading}
          >
            {loading ? <LoadingSpinner /> : 'Create Farm Account'}
          </button>
        </div>
      </form>
    </div>
  );
};
```

**Labourer Registration Form**:

```typescript
// components/auth/LabourerRegistration.tsx
const LabourerRegistration: React.FC<LabourerRegistrationProps> = ({
  onSubmit,
  onBack,
  loading,
  error
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<LabourerRegistration>({
    resolver: yupResolver(labourerSchema),
    mode: 'onChange'
  });

  return (
    <div className="labourer-registration">
      <div className="form-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeftIcon />
        </button>
        <h2>Register as Farm Labourer</h2>
        <p>Create your account to join existing farms as a labourer</p>
      </div>

      {error && <ErrorAlert error={error} onDismiss={() => {}} />}

      <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
        <div className="form-section">
          <h3>Account Information</h3>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              {...register('username')}
              type="text"
              id="username"
              className={errors.username ? 'error' : ''}
            />
            {errors.username && <span className="error-text">{errors.username.message}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                {...register('password')}
                type="password"
                id="password"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-text">{errors.password.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="re_password">Confirm Password</label>
              <input
                {...register('re_password')}
                type="password"
                id="re_password"
                className={errors.re_password ? 'error' : ''}
              />
              {errors.re_password && <span className="error-text">{errors.re_password.message}</span>}
            </div>
          </div>
        </div>

        <div className="info-section">
          <div className="info-card">
            <InfoIcon />
            <div>
              <h4>Next Steps</h4>
              <p>After registration, you can browse and request to join farms in your area.</p>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onBack}
            className="btn btn-secondary"
            disabled={loading}
          >
            Back
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isValid || loading}
          >
            {loading ? <LoadingSpinner /> : 'Create Labourer Account'}
          </button>
        </div>
      </form>
    </div>
  );
};
```

### User Type-Based Dashboard Routing

**Post-Registration Routing Logic**:

```typescript
// hooks/useAuthRedirect.ts
const useAuthRedirect = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.owned_farm) {
        // Farm owner - redirect to farm management dashboard
        navigate('/dashboard/farm-owner');
      } else if (user.labourer_profile) {
        // Labourer - redirect to labourer dashboard
        navigate('/dashboard/labourer');
      } else {
        // Regular user - redirect to general dashboard
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);
};
```

---

## Core Features Implementation

### 1. Dashboard Overview

**Component**: `DashboardOverview.tsx`

**Features**:

- Farm statistics overview
- Active livestock count
- Recent health events
- AMU compliance status
- Quick action buttons
- Yield performance metrics

**Key Metrics to Display**:

- Total livestock count by species
- Health status distribution
- Recent AMU treatments
- Withdrawal period alerts
- Feed consumption trends
- Productivity metrics

### 2. Livestock Management

**Components**: `LivestockList.tsx`, `LivestockForm.tsx`, `LivestockDetails.tsx`

**Features**:

- Add/Edit/Delete livestock
- Individual animal profiles
- Photo upload capability
- QR code generation for tag_id
- Health status tracking
- Weight tracking over time
- Breeding information

**Advanced Features**:

- Bulk import via CSV
- Filter by species, breed, health status
- Search functionality
- Export livestock data

### 3. Health Records Management

**Components**: `HealthRecordList.tsx`, `HealthRecordForm.tsx`

**Features**:

- Create health events (vaccination, treatment, check-up)
- Medical history timeline
- Diagnosis tracking
- Treatment outcome monitoring
- Veterinarian notes
- Photo/document attachments

**Event Types**:

- Vaccination schedules
- Illness diagnosis and treatment
- Regular health check-ups
- Emergency treatments

### 4. AMU (Antimicrobial Usage) Monitoring

**Components**: `AMURecordForm.tsx`, `AMUChart.tsx`, `AMUInsights.tsx`

**Key Features**:

- Drug administration tracking
- Dosage calculation based on weight
- Withdrawal period monitoring
- Compliance alerts
- AI-powered dosage recommendations
- Treatment progress tracking

**AMU Workflow Implementation**:

1. **Treatment Logging**: Form to log drug, animal, dosage, start date
2. **Progress Tracker**: Visual progress bar showing treatment completion
3. **Daily Reminders**: Notification system for pending doses
4. **Completion Handling**: Automatic withdrawal period calculation
5. **Compliance Reporting**: Generate AMU usage reports

**AMU Analytics Dashboard**:

- Total antibiotic usage (grams)
- Usage per animal (mg/kg)
- Percentage of animals treated
- Treatment days statistics
- Drug usage patterns
- Compliance score

### 5. Feed & Nutrition Tracking

**Components**: `FeedTracker.tsx`, `FeedHistory.tsx`

**Features**:

- Daily feed logging
- Feed type categorization
- Quantity tracking
- Cost calculation
- Nutrition analysis
- Feed conversion ratio

**Feed Management**:

- Feed inventory management
- Automatic consumption calculations
- Feed schedule planning
- Cost optimization suggestions

### 6. Yield Production Tracking

**Components**: `YieldTracker.tsx`, `YieldAnalytics.tsx`

**Features**:

- Daily yield recording (milk, eggs, etc.)
- Production trends analysis
- Quality metrics tracking
- Seasonal pattern recognition
- Performance benchmarking

**Yield Analytics**:

- Production charts by time period
- Yield per animal analysis
- Seasonal trends
- Productivity forecasting

### 7. Drug Database Management

**Components**: `DrugList.tsx`, `DrugForm.tsx`

**Features**:

- Comprehensive drug database
- Dosage guidelines by species
- Active ingredient tracking
- Withdrawal period information
- Drug interaction warnings

### 8. AI-Powered Insights

**Components**: `AMUInsights.tsx`, `InsightCard.tsx`

**Features Integration**:

- Gemini AI-powered recommendations
- Dosage optimization suggestions
- Health pattern recognition
- Treatment effectiveness analysis
- Risk assessment alerts

**Implementation**:

```typescript
const generateAMUInsights = async (livestockId: number) => {
  const response = await api.post('/api/amu-insights/generate/', {
    livestock_id: livestockId
  });
  return response.data.insights;
};
```

### 9. Compliance & Reporting

**Components**: `ComplianceReports.tsx`, `ReportGenerator.tsx`

**Features**:

- Automated compliance checks
- MRL monitoring alerts
- Withdrawal period tracking
- Government reporting templates
- Export capabilities (PDF, Excel)

**Report Types**:

- Monthly AMU usage reports
- Compliance status reports
- Health incident reports
- Production efficiency reports
- Cost analysis reports

---

## Responsive Design System

### Mobile-First Breakpoints

**Breakpoint Configuration**:

```typescript
// utils/breakpoints.ts
export const breakpoints = {
  xs: 0,      // Extra small devices (phones)
  sm: 600,    // Small devices (large phones)
  md: 900,    // Medium devices (tablets)
  lg: 1200,   // Large devices (desktops)
  xl: 1536    // Extra large devices (large desktops)
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Material-UI theme breakpoints
export const muiBreakpoints = {
  values: breakpoints,
  up: (key: Breakpoint) => `@media (min-width:${breakpoints[key]}px)`,
  down: (key: Breakpoint) => `@media (max-width:${breakpoints[key] - 0.05}px)`,
  between: (start: Breakpoint, end: Breakpoint) => 
    `@media (min-width:${breakpoints[start]}px) and (max-width:${breakpoints[end] - 0.05}px)`,
  only: (key: Breakpoint) => {
    const keys = Object.keys(breakpoints) as Breakpoint[];
    const index = keys.indexOf(key);
    const nextKey = keys[index + 1];
    
    if (index === keys.length - 1) {
      return `@media (min-width:${breakpoints[key]}px)`;
    }
    return `@media (min-width:${breakpoints[key]}px) and (max-width:${breakpoints[nextKey] - 0.05}px)`;
  }
};
```

### Responsive Layout Components

**Grid System Component**:

```typescript
// components/common/ResponsiveGrid.tsx
import React from 'react';
import { Grid, Container, useTheme, useMediaQuery } from '@mui/material';

interface ResponsiveGridProps {
  children: React.ReactNode;
  spacing?: number;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  spacing = 2,
  maxWidth = 'lg'
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Container maxWidth={maxWidth}>
      <Grid 
        container 
        spacing={isMobile ? 1 : spacing}
        sx={{
          padding: {
            xs: theme.spacing(1),
            sm: theme.spacing(2),
            md: theme.spacing(3)
          }
        }}
      >
        {children}
      </Grid>
    </Container>
  );
};

export default ResponsiveGrid;
```

**Responsive Card Component**:

```typescript
// components/common/ResponsiveCard.tsx
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  useTheme, 
  useMediaQuery,
  Box 
} from '@mui/material';

interface ResponsiveCardProps {
  children: React.ReactNode;
  actions?: React.ReactNode;
  variant?: 'elevated' | 'outlined';
  padding?: number;
}

const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  children,
  actions,
  variant = 'elevated',
  padding
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Card 
      variant={variant}
      sx={{
        width: '100%',
        marginBottom: {
          xs: theme.spacing(1),
          sm: theme.spacing(2)
        },
        borderRadius: {
          xs: theme.spacing(1),
          sm: theme.spacing(2)
        }
      }}
    >
      <CardContent
        sx={{
          padding: padding ? theme.spacing(padding) : {
            xs: theme.spacing(1.5),
            sm: theme.spacing(2),
            md: theme.spacing(3)
          },
          '&:last-child': {
            paddingBottom: padding ? theme.spacing(padding) : {
              xs: theme.spacing(1.5),
              sm: theme.spacing(2),
              md: theme.spacing(3)
            }
          }
        }}
      >
        {children}
      </CardContent>
      {actions && (
        <CardActions
          sx={{
            padding: {
              xs: theme.spacing(1),
              sm: theme.spacing(2)
            },
            flexDirection: {
              xs: 'column',
              sm: 'row'
            },
            gap: {
              xs: theme.spacing(1),
              sm: theme.spacing(0.5)
            }
          }}
        >
          {actions}
        </CardActions>
      )}
    </Card>
  );
};

export default ResponsiveCard;
```

### Mobile Navigation System

**Responsive Header Component**:

```typescript
// components/common/ResponsiveHeader.tsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Box
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Pets,
  LocalHospital,
  Agriculture,
  Assessment
} from '@mui/icons-material';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from '../../hooks/useTranslation';

const ResponsiveHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();

  const menuItems = [
    { text: t('nav.dashboard'), icon: <Dashboard />, path: '/dashboard' },
    { text: t('nav.livestock'), icon: <Pets />, path: '/livestock' },
    { text: t('nav.health'), icon: <LocalHospital />, path: '/health' },
    { text: t('nav.feed'), icon: <Agriculture />, path: '/feed' },
    { text: t('nav.reports'), icon: <Assessment />, path: '/reports' }
  ];

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <AppBar 
        position="sticky"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.primary.main
        }}
      >
        <Toolbar
          sx={{
            minHeight: {
              xs: 56,
              sm: 64
            },
            paddingX: {
              xs: theme.spacing(1),
              sm: theme.spacing(2)
            }
          }}
        >
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontSize: {
                xs: '1.1rem',
                sm: '1.25rem'
              }
            }}
          >
            FarmSense
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LanguageSwitcher />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            paddingTop: theme.spacing(1)
          }
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text}
              onClick={handleMobileMenuToggle}
              sx={{
                minHeight: 48,
                paddingX: theme.spacing(2)
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default ResponsiveHeader;
```

### Touch-Optimized Form Components

**Mobile-Friendly Form Input**:

```typescript
// components/common/ResponsiveInput.tsx
import React from 'react';
import {
  TextField,
  useTheme,
  useMediaQuery,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface ResponsiveInputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'numeric' | 'tel' | 'url';
}

const ResponsiveInput: React.FC<ResponsiveInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  autoComplete,
  inputMode
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <TextField
      fullWidth
      label={label}
      type={inputType}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error}
      required={required}
      placeholder={placeholder}
      autoComplete={autoComplete}
      inputMode={inputMode}
      variant="outlined"
      size={isMobile ? 'medium' : 'small'}
      sx={{
        marginBottom: theme.spacing(2),
        '& .MuiOutlinedInput-root': {
          minHeight: {
            xs: 56, // Touch-friendly height on mobile
            sm: 48
          },
          fontSize: {
            xs: '16px', // Prevents zoom on iOS
            sm: '14px'
          }
        },
        '& .MuiInputLabel-root': {
          fontSize: {
            xs: '16px',
            sm: '14px'
          }
        }
      }}
      InputProps={{
        ...(isPassword && {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                size={isMobile ? 'large' : 'medium'}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        })
      }}
    />
  );
};

export default ResponsiveInput;
```

### Responsive Data Tables

**Mobile-Optimized Table Component**:

```typescript
// components/common/ResponsiveTable.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery,
  Box,
  Chip
} from '@mui/material';

interface Column {
  field: string;
  headerName: string;
  width?: number;
  renderCell?: (value: any, row: any) => React.ReactNode;
  hideOnMobile?: boolean;
}

interface ResponsiveTableProps {
  columns: Column[];
  rows: any[];
  loading?: boolean;
  onRowClick?: (row: any) => void;
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  columns,
  rows,
  loading = false,
  onRowClick
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Mobile card view
  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {rows.map((row, index) => (
          <Card 
            key={index}
            variant="outlined"
            onClick={() => onRowClick?.(row)}
            sx={{
              cursor: onRowClick ? 'pointer' : 'default',
              '&:hover': onRowClick ? {
                backgroundColor: theme.palette.action.hover
              } : {}
            }}
          >
            <CardContent sx={{ padding: theme.spacing(2), '&:last-child': { pb: 2 } }}>
              {columns
                .filter(col => !col.hideOnMobile)
                .map((column) => (
                  <Box key={column.field} sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {column.headerName}:
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: 'right', maxWidth: '60%' }}>
                      {column.renderCell 
                        ? column.renderCell(row[column.field], row)
                        : row[column.field]
                      }
                    </Typography>
                  </Box>
                ))}
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  // Desktop table view
  return (
    <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell 
                key={column.field}
                sx={{ 
                  fontWeight: 600,
                  minWidth: column.width || 'auto'
                }}
              >
                {column.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow 
              key={index}
              hover={!!onRowClick}
              onClick={() => onRowClick?.(row)}
              sx={{
                cursor: onRowClick ? 'pointer' : 'default',
                '&:last-child td, &:last-child th': { border: 0 }
              }}
            >
              {columns.map((column) => (
                <TableCell key={column.field}>
                  {column.renderCell 
                    ? column.renderCell(row[column.field], row)
                    : row[column.field]
                  }
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResponsiveTable;
```

---

## Mobile-Specific Features

### Touch & Gesture Interactions

**Touch-Optimized Components**:

```typescript
// hooks/useTouch.ts
import { useState, useEffect } from 'react';

interface TouchHandlers {
  onTouchStart?: (e: TouchEvent) => void;
  onTouchMove?: (e: TouchEvent) => void;
  onTouchEnd?: (e: TouchEvent) => void;
}

export const useTouch = (handlers: TouchHandlers) => {
  useEffect(() => {
    const { onTouchStart, onTouchMove, onTouchEnd } = handlers;
    
    if (onTouchStart) document.addEventListener('touchstart', onTouchStart);
    if (onTouchMove) document.addEventListener('touchmove', onTouchMove);
    if (onTouchEnd) document.addEventListener('touchend', onTouchEnd);
    
    return () => {
      if (onTouchStart) document.removeEventListener('touchstart', onTouchStart);
      if (onTouchMove) document.removeEventListener('touchmove', onTouchMove);
      if (onTouchEnd) document.removeEventListener('touchend', onTouchEnd);
    };
  }, [handlers]);
};

// Swipe detection hook
export const useSwipe = (onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  
  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };
  
  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStart) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    const minSwipeDistance = 50;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        onSwipe(deltaX > 0 ? 'right' : 'left');
      }
    } else {
      if (Math.abs(deltaY) > minSwipeDistance) {
        onSwipe(deltaY > 0 ? 'down' : 'up');
      }
    }
    
    setTouchStart(null);
  };
  
  useTouch({ onTouchStart: handleTouchStart, onTouchEnd: handleTouchEnd });
};
```

**Swipeable Cards Component**:

```typescript
// components/common/SwipeableCard.tsx
import React from 'react';
import { Card, CardContent, Box, IconButton } from '@mui/material';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import { useSwipe } from '../../hooks/useTouch';

interface SwipeableCardProps {
  children: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onEdit,
  onDelete,
  onView
}) => {
  const [swipeOffset, setSwipeOffset] = React.useState(0);
  const [showActions, setShowActions] = React.useState(false);

  useSwipe((direction) => {
    if (direction === 'left') {
      setShowActions(true);
    } else if (direction === 'right') {
      setShowActions(false);
    }
  });

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      <Card
        sx={{
          transform: `translateX(${swipeOffset}px)`,
          transition: 'transform 0.3s ease',
          touchAction: 'pan-y'
        }}
      >
        <CardContent>{children}</CardContent>
      </Card>
      
      {/* Action buttons revealed on swipe */}
      {showActions && (
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'action.hover',
            paddingX: 1
          }}
        >
          {onView && (
            <IconButton color="primary" onClick={onView} size="large">
              <Visibility />
            </IconButton>
          )}
          {onEdit && (
            <IconButton color="info" onClick={onEdit} size="large">
              <Edit />
            </IconButton>
          )}
          {onDelete && (
            <IconButton color="error" onClick={onDelete} size="large">
              <Delete />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
};

export default SwipeableCard;
```

### Camera & Media Integration

**Camera Component for Livestock Photos**:

```typescript
// components/common/CameraCapture.tsx
import React, { useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Fab
} from '@mui/material';
import {
  CameraAlt,
  FlipCameraAndroid,
  Close,
  Check
} from '@mui/icons-material';

interface CameraCaptureProps {
  open: boolean;
  onClose: () => void;
  onCapture: (imageBlob: Blob) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
  open,
  onClose,
  onCapture
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          setCapturedImage(canvas.toDataURL());
        }
      }, 'image/jpeg', 0.8);
    }
  };

  const confirmCapture = () => {
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          onCapture(blob);
          handleClose();
        }
      }, 'image/jpeg', 0.8);
    }
  };

  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    onClose();
  };

  React.useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => stopCamera();
  }, [open, facingMode]);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      fullScreen
      sx={{ '& .MuiDialog-paper': { backgroundColor: 'black' } }}
    >
      <DialogTitle sx={{ color: 'white', textAlign: 'center' }}>
        Take Photo
        <IconButton
          sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
          onClick={handleClose}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ padding: 0, position: 'relative' }}>
        {!capturedImage ? (
          <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            
            {/* Camera controls */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 2,
                alignItems: 'center'
              }}
            >
              <IconButton
                onClick={() => setFacingMode(facingMode === 'user' ? 'environment' : 'user')}
                sx={{ color: 'white' }}
                size="large"
              >
                <FlipCameraAndroid />
              </IconButton>
              
              <Fab
                color="primary"
                onClick={capturePhoto}
                size="large"
                sx={{ backgroundColor: 'white', color: 'black' }}
              >
                <CameraAlt />
              </Fab>
            </Box>
          </Box>
        ) : (
          <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
            <img
              src={capturedImage}
              alt="Captured"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
            
            <Box
              sx={{
                position: 'absolute',
                bottom: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 2
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setCapturedImage(null)}
                sx={{ color: 'white', borderColor: 'white' }}
              >
                Retake
              </Button>
              <Button
                variant="contained"
                onClick={confirmCapture}
                startIcon={<Check />}
              >
                Use Photo
              </Button>
            </Box>
          </Box>
        )}
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </DialogContent>
    </Dialog>
  );
};

export default CameraCapture;
```

### Offline Capability

**Service Worker Configuration**:

```typescript
// public/sw.js
const CACHE_NAME = 'farmsense-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  // Add other static assets
];

// Cache essential translations for offline use
const TRANSLATION_CACHE = 'translations-v1';
const translationsToCache = [
  '/locales/en/translation.json',
  '/locales/hi/translation.json',
  // Add other critical translations
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
      caches.open(TRANSLATION_CACHE).then((cache) => cache.addAll(translationsToCache))
    ])
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineData());
  }
});

async function syncOfflineData() {
  // Sync offline form submissions, photos, etc.
  const offlineData = await getOfflineData();
  
  for (const data of offlineData) {
    try {
      await syncDataToServer(data);
      await removeOfflineData(data.id);
    } catch (error) {
      console.log('Sync failed, will retry later');
    }
  }
}
```

**Offline Storage Hook**:

```typescript
// hooks/useOfflineStorage.ts
import { useState, useEffect } from 'react';

interface OfflineData {
  id: string;
  type: string;
  data: any;
  timestamp: number;
}

export const useOfflineStorage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<OfflineData[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load offline queue from localStorage
    loadOfflineQueue();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineQueue = () => {
    const stored = localStorage.getItem('offlineQueue');
    if (stored) {
      setOfflineQueue(JSON.parse(stored));
    }
  };

  const addToOfflineQueue = (type: string, data: any) => {
    const item: OfflineData = {
      id: Date.now().toString(),
      type,
      data,
      timestamp: Date.now()
    };

    const newQueue = [...offlineQueue, item];
    setOfflineQueue(newQueue);
    localStorage.setItem('offlineQueue', JSON.stringify(newQueue));
  };

  const removeFromOfflineQueue = (id: string) => {
    const newQueue = offlineQueue.filter(item => item.id !== id);
    setOfflineQueue(newQueue);
    localStorage.setItem('offlineQueue', JSON.stringify(newQueue));
  };

  const syncOfflineData = async () => {
    for (const item of offlineQueue) {
      try {
        // Implement actual sync logic based on item.type
        await syncToServer(item);
        removeFromOfflineQueue(item.id);
      } catch (error) {
        console.error('Sync failed for item:', item.id);
      }
    }
  };

  return {
    isOnline,
    offlineQueue,
    addToOfflineQueue,
    removeFromOfflineQueue,
    syncOfflineData
  };
};

const syncToServer = async (item: OfflineData) => {
  // Implement server sync logic
  const response = await fetch('/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  
  if (!response.ok) {
    throw new Error('Sync failed');
  }
};
```

### Progressive Web App (PWA)

**PWA Configuration**:

```typescript
// public/manifest.json
{
  "name": "FarmSense - Livestock Management",
  "short_name": "FarmSense",
  "description": "Intelligent livestock management with AMU monitoring",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#4CAF50",
  "background_color": "#ffffff",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "categories": ["agriculture", "productivity", "business"],
  "lang": "en-IN",
  "scope": "/",
  "shortcuts": [
    {
      "name": "Add Livestock",
      "short_name": "Add Animal",
      "description": "Quickly add a new livestock record",
      "url": "/livestock/add",
      "icons": [{ "src": "/icons/shortcut-add.png", "sizes": "96x96" }]
    },
    {
      "name": "Health Records",
      "short_name": "Health",
      "description": "View and manage health records",
      "url": "/health",
      "icons": [{ "src": "/icons/shortcut-health.png", "sizes": "96x96" }]
    }
  ]
}
```

### Mobile Performance Optimization

**Image Optimization Hook**:

```typescript
// hooks/useImageOptimization.ts
import { useState, useCallback } from 'react';

export const useImageOptimization = () => {
  const compressImage = useCallback((file: File, maxWidth = 800, quality = 0.8): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const resizeForMobile = useCallback((file: File): Promise<Blob> => {
    return compressImage(file, 600, 0.7); // Smaller size for mobile
  }, [compressImage]);

  return { compressImage, resizeForMobile };
};
```

### Device-Specific Features

**Device Detection Hook**:

```typescript
// hooks/useDevice.ts
import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  hasTouchScreen: boolean;
  supportsCamera: boolean;
  supportsGeolocation: boolean;
}

export const useDevice = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isIOS: false,
    isAndroid: false,
    hasTouchScreen: false,
    supportsCamera: false,
    supportsGeolocation: false
  });

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isTablet = /iPad|Android.*(?!.*Mobile)/i.test(userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(userAgent);
      const isAndroid = /Android/i.test(userAgent);
      const hasTouchScreen = 'ontouchstart' in window;
      const supportsCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      const supportsGeolocation = 'geolocation' in navigator;

      setDeviceInfo({
        isMobile: isMobile && !isTablet,
        isTablet,
        isDesktop: !isMobile,
        isIOS,
        isAndroid,
        hasTouchScreen,
        supportsCamera,
        supportsGeolocation
      });
    };

    checkDevice();
  }, []);

  return deviceInfo;
};
```

---

## Advanced Features Implementation

### 1. Inventory Integration

**Components**: `InventoryTracker.tsx`, `StockAlerts.tsx`

**Features**:

- Track drug inventory levels
- Auto-deduct when treatments logged
- Low stock alerts
- Expiration date tracking
- Purchase order generation

### 2. Alerts & Reminders System

**Components**: `AlertCenter.tsx`, `NotificationList.tsx`

**Alert Types**:

- Daily treatment reminders
- Missed dose alerts
- Withdrawal period warnings
- Low inventory notifications
- Health check-up schedules
- Vaccination due dates

### 3. Visual Treatment Tracker

**Components**: `TreatmentProgress.tsx`, `ProgressTimeline.tsx`

**Features**:

- Color-coded progress bars
- Timeline visualization
- Treatment completion status
- Risk level indicators

### 4. Smart Features (Future Expansion)

**Components**: `WithdrawalTracker.tsx`, `BenchmarkComparison.tsx`

**Features**:

- Automatic withdrawal period calculation
- Farm benchmarking against industry standards
- Veterinarian dashboard for remote monitoring
- Integration with government databases

---

## UI/UX Design Guidelines

### Color Scheme

- **Primary**: Green (#4CAF50) - represents agriculture/health
- **Secondary**: Blue (#2196F3) - represents technology/data
- **Warning**: Orange (#FF9800) - for alerts
- **Error**: Red (#F44336) - for critical issues
- **Success**: Light Green (#8BC34A) - for completed actions

### Design Principles

- **Mobile-First**: Responsive design starting from 320px mobile screens
- **Touch-Friendly**: 48px minimum touch targets, gesture-based navigation
- **Clean & Intuitive**: Easy navigation for farmers on all devices
- **Data-Driven**: Emphasis on charts and metrics with mobile-optimized views
- **Cross-Platform**: Consistent experience across web, tablet, and mobile
- **Performance-Optimized**: Fast loading on slow networks
- **Accessibility**: WCAG 2.1 compliance across all screen sizes
- **Offline-Ready**: Clear offline/online status with mobile-friendly indicators

### Component Design Standards

- **Responsive Grid System**: 8px base grid with flexible breakpoints
- **Typography Scale**: Fluid typography using clamp() for all screen sizes
- **Touch-First Design**: Minimum 48px touch targets (Material Design)
- **Mobile Navigation**: Hamburger menus, bottom tabs, swipe gestures
- **Adaptive Icons**: SVG icons that scale properly on all devices
- **Loading States**: Skeleton screens optimized for mobile connections
- **Error Handling**: Mobile-friendly error messages and recovery options

---

## State Management Architecture

### Redux Store Structure

```typescript
interface RootState {
  auth: {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    userType: 'farm-owner' | 'labourer' | null;
  };
  registration: {
    step: 'type-selection' | 'registration' | 'success';
    userType: 'farm-owner' | 'labourer' | null;
    loading: boolean;
    error: string | null;
  };
  livestock: {
    animals: Livestock[];
    selectedAnimal: Livestock | null;
    loading: boolean;
  };
  health: {
    records: HealthRecord[];
    amuRecords: AMURecord[];
    loading: boolean;
  };
  feed: {
    records: FeedRecord[];
    totalConsumption: number;
  };
  yield: {
    records: YieldRecord[];
    analytics: YieldAnalytics;
  };
  alerts: {
    notifications: Notification[];
    unreadCount: number;
  };
  i18n: {
    currentLanguage: string;
    availableLanguages: string[];
    isLoading: boolean;
  };
}
```

---

## API Integration Services

### Base API Service

```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `JWT ${token}`;
  }
  return config;
});
```

### Authentication Service

```typescript
// services/auth.ts
export const authService = {
  // Create Django User
  createUser: (userData: {
    email: string;
    username: string;
    password: string;
    re_password: string;
  }) => api.post('/auth/users/', userData),

  // Login
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/jwt/create/', credentials),

  // Refresh token
  refreshToken: (refresh: string) =>
    api.post('/auth/jwt/refresh/', { refresh }),

  // Get current user
  getCurrentUser: () => api.get('/auth/users/me/'),

  // Register farm owner (complete flow)
  registerFarmOwner: async (data: FarmOwnerRegistration) => {
    // Step 1: Create user
    const userResponse = await authService.createUser({
      email: data.email,
      username: data.username,
      password: data.password,
      re_password: data.re_password
    });

    // Step 2: Login
    const loginResponse = await authService.login({
      email: data.email,
      password: data.password
    });

    // Step 3: Create farm
    const farmResponse = await api.post('/api/farms/', {
      name: data.farm_name,
      location: data.farm_location
    }, {
      headers: { Authorization: `JWT ${loginResponse.data.access}` }
    });

    return {
      user: userResponse.data,
      farm: farmResponse.data,
      token: loginResponse.data.access
    };
  },

  // Register labourer (complete flow)
  registerLabourer: async (data: LabourerRegistration) => {
    // Step 1: Create user
    const userResponse = await authService.createUser({
      email: data.email,
      username: data.username,
      password: data.password,
      re_password: data.re_password
    });

    // Step 2: Login
    const loginResponse = await authService.login({
      email: data.email,
      password: data.password
    });

    // Step 3: Create labourer profile
    const labourerResponse = await api.post('/api/labourers/', {}, {
      headers: { Authorization: `JWT ${loginResponse.data.access}` }
    });

    return {
      user: userResponse.data,
      labourer: labourerResponse.data,
      token: loginResponse.data.access
    };
  }
};
```

### Livestock Service

```typescript
// services/livestock.ts
export const livestockService = {
  getAll: () => api.get('/api/livestock/'),
  getById: (id: number) => api.get(`/api/livestock/${id}/`),
  create: (data: Partial<Livestock>) => api.post('/api/livestock/', data),
  update: (id: number, data: Partial<Livestock>) => 
    api.put(`/api/livestock/${id}/`, data),
  delete: (id: number) => api.delete(`/api/livestock/${id}/`),
};
```

### AMU Service

```typescript
// services/amu.ts
export const amuService = {
  getRecords: () => api.get('/api/amu-records/'),
  createRecord: (data: Partial<AMURecord>) => 
    api.post('/api/amu-records/', data),
  generateInsights: (livestockId: number) =>
    api.post('/api/amu-insights/generate/', { livestock_id: livestockId }),
};
```

---

## Performance Optimization

### Data Loading Strategies

- Implement pagination for large datasets
- Use React Query for caching and background updates
- Lazy loading for non-critical components
- Image optimization and lazy loading

### Bundle Optimization

- Code splitting by routes
- Tree shaking for unused code
- Compression and minification
- CDN for static assets

---

## Testing Strategy

### Unit Testing

- Jest + React Testing Library
- Component testing
- Custom hook testing
- Service layer testing

### Integration Testing

- API integration tests
- User workflow testing
- End-to-end testing with Cypress

### Performance Testing

- Lighthouse audits
- Bundle size monitoring
- Runtime performance testing

### Internationalization Testing

- **Translation Coverage**: Verify all keys exist in all language files
- **Font Loading**: Test proper font rendering for each script
- **Layout Testing**: Check UI layout with different text lengths
- **Language Switching**: Test seamless language transitions
- **Fallback Testing**: Verify English fallback for missing translations
- **Cultural Testing**: Validate date, number, and currency formats
- **Screen Reader Testing**: Test accessibility in multiple languages

---

## Deployment & DevOps

### Build Configuration

- Environment-specific builds
- CI/CD pipeline setup
- Docker containerization
- Progressive deployment

### Monitoring

- Error tracking (Sentry)
- Performance monitoring
- User analytics
- API monitoring

---

## Security Considerations

### Authentication Security

- JWT token refresh mechanism
- Secure token storage
- Session timeout handling
- CSRF protection

### Data Security

- Input validation
- XSS prevention
- Secure API communication
- Data encryption at rest

---

## Accessibility Features

### WCAG Compliance

- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus management

### Inclusive Design

- **Multiple Language Support**: 8 Indian languages + English
- **Script Support**: Devanagari, Bengali, Tamil, Telugu, Gujarati, Kannada
- **Font Optimization**: Language-specific font loading
- **Text Size Adjustability**: Scalable fonts for all scripts
- **High Contrast Mode**: Works across all languages
- **Voice Navigation Support**: Language-aware voice commands
- **Cultural Localization**: Region-specific date, number, and currency formats

---

## Implementation Priority

### Phase 1: Core Features (MVP)

1. **Multi-tier Registration System**
   - User type selection interface
   - Farm owner registration flow
   - Labourer registration flow
   - Post-registration routing

2. **Authentication System**
   - JWT-based login
   - Role-based access control
   - Protected routes

3. **Basic Livestock Management**
   - Add/edit livestock records
   - Basic livestock listing

4. **Simple Health Record Tracking**
   - Create health events
   - Basic medical history

5. **Basic AMU Logging**
   - Treatment recording
   - Drug administration tracking

6. **Internationalization System**
   - i18n setup with react-i18next
   - English and Hindi translations (minimum)
   - Language switcher component
   - Basic font support for Indic scripts

7. **Essential Dashboard Metrics**
   - Role-specific dashboards
   - Basic farm statistics

### Phase 2: Enhanced Features

1. **Complete Multilingual Support**
   - All 8 Indian languages implementation
   - Advanced font loading and optimization
   - Cultural localization (dates, numbers, currency)
   - Language-specific form validation

2. **Advanced AMU Monitoring**
   - Multilingual drug database
   - Localized treatment recommendations
   - Region-specific compliance standards

3. **AI-Powered Insights**
   - Multilingual AI responses
   - Localized recommendations

4. **Comprehensive Reporting**
   - Multilingual report generation
   - Localized government forms

5. **Mobile Optimization**
   - Touch-friendly language switcher
   - Optimized fonts for mobile screens

6. **Offline Capabilities**
   - Cached translations for offline use

### Phase 3: Advanced Features

1. Inventory management
2. Advanced analytics
3. Government compliance reporting
4. Multi-farm management
5. API integrations

---

## Routing Configuration

### React Router Setup

```typescript
// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegistrationWizard />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Farm Owner Specific Routes */}
        <Route path="/dashboard/farm-owner" element={
          <ProtectedRoute requiredRole="farm-owner">
            <FarmOwnerDashboard />
          </ProtectedRoute>
        } />
        
        {/* Labourer Specific Routes */}
        <Route path="/dashboard/labourer" element={
          <ProtectedRoute requiredRole="labourer">
            <LabourerDashboard />
          </ProtectedRoute>
        } />
        
        {/* Shared Protected Routes */}
        <Route path="/livestock" element={
          <ProtectedRoute>
            <Livestock />
          </ProtectedRoute>
        } />
        
        <Route path="/health-records" element={
          <ProtectedRoute>
            <HealthRecords />
          </ProtectedRoute>
        } />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
```

### Protected Route Component

```typescript
// components/auth/ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'farm-owner' | 'labourer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    const hasRequiredRole = requiredRole === 'farm-owner' 
      ? user?.owned_farm 
      : user?.labourer_profile;
      
    if (!hasRequiredRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
```

---

## Performance Optimization

### Bundle Optimization

**Webpack Configuration for Mobile**:

```javascript
// webpack.config.js (if ejected)
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  plugins: [
    // Analyze bundle size
    process.env.ANALYZE && new BundleAnalyzerPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      // Reduce bundle size by using production builds
      '@mui/icons-material': '@mui/icons-material/esm',
    },
  },
};
```

**Lazy Loading Implementation**:

```typescript
// utils/lazyLoading.ts
import React, { Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

// Lazy load components
export const LazyLoadingWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense 
    fallback={
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    }
  >
    {children}
  </Suspense>
);

// Lazy loaded components
export const LivestockListPage = React.lazy(() => import('../pages/livestock/LivestockListPage'));
export const HealthRecordsPage = React.lazy(() => import('../pages/health/HealthRecordsPage'));
export const AMURecordsPage = React.lazy(() => import('../pages/amu/AMURecordsPage'));
export const AnalyticsPage = React.lazy(() => import('../pages/analytics/AnalyticsPage'));
export const ProfilePage = React.lazy(() => import('../pages/profile/ProfilePage'));
```

---

## Deployment Strategy

### Build Configuration

**Environment Variables**:

```bash
# .env.production
REACT_APP_API_BASE_URL=https://api.farmsense.in
REACT_APP_ENVIRONMENT=production
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_PWA=true

# .env.development
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_ENVIRONMENT=development
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_PWA=false
```

**Build Scripts**:

```json
{
  "scripts": {
    "build": "react-scripts build",
    "build:analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js",
    "build:mobile": "GENERATE_SOURCEMAP=false npm run build",
    "predeploy": "npm run build",
    "deploy:web": "netlify deploy --prod --dir=build",
    "deploy:mobile": "npx cap sync && npx cap open android"
  }
}
```

### Mobile App Deployment (Capacitor)

**Capacitor Configuration**:

```typescript
// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.farmsense.app',
  appName: 'FarmSense',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    },
    Geolocation: {
      permissions: ['location']
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#4CAF50',
      showSpinner: false
    }
  }
};

export default config;
```

### PWA Optimization

**Service Worker Registration**:

```typescript
// src/serviceWorkerRegistration.ts
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

export function register(config?: {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
}) {
  if ('serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL!, window.location.href);
    
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/sw.js`;

      if (isLocalhost) {
        checkValidServiceWorker(swUrl, config);
      } else {
        registerValidSW(swUrl, config);
      }
    });
  }
}
```

### Deployment Targets

**Web Deployment (Netlify)**:

```toml
# netlify.toml
[build]
  publish = "build"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  REACT_APP_API_BASE_URL = "https://api.farmsense.in"
```

**Mobile App Store Deployment**:

```bash
# Android deployment
npx cap add android
npx cap sync android
npx cap open android
# Build signed APK/AAB in Android Studio

# iOS deployment
npx cap add ios
npx cap sync ios
npx cap open ios
# Build and deploy through Xcode
```

---

## Development Best Practices

### Code Quality

- TypeScript for type safety
- ESLint + Prettier for code formatting
- Husky for pre-commit hooks
- Component documentation with Storybook

### Git Workflow

- Feature branch strategy
- Pull request reviews
- Semantic versioning
- Automated testing on PRs

### Testing Strategy

- Unit tests with Jest and React Testing Library
- Integration tests for API interactions
- E2E tests with Cypress
- Mobile testing with device emulators

### Documentation

- Component documentation with Storybook
- API integration guides
- User documentation
- Developer onboarding guides

---

## Conclusion

This comprehensive guide provides a complete roadmap for developing the FarmSense React frontend with full mobile-web compatibility. The implementation focuses on creating an intuitive, feature-rich livestock management system that addresses the specific needs identified in the problem statement while ensuring:

### Key Features Delivered

1. **Three-tier user registration system** (Farm Owners, Labourers, Django Users)
2. **Comprehensive livestock management** with AMU monitoring
3. **Multilingual support** for 8 Indian languages plus English
4. **Mobile-first responsive design** for cross-device compatibility
5. **Progressive Web App** capabilities for native-like experience
6. **Offline functionality** for rural connectivity challenges
7. **Advanced analytics and AI insights** for farm optimization

### Technical Excellence

- Modern React 18+ with TypeScript
- Material-UI for consistent design system
- Redux Toolkit for state management
- i18next for internationalization
- Capacitor for mobile app deployment
- PWA for offline capabilities
- Performance optimization for mobile devices

The system integrates advanced AMU monitoring, AI-powered insights, and comprehensive farm management capabilities, making it a competitive solution in the digital agriculture space that specifically addresses Indian market needs with mobile-first design and multilingual support.
