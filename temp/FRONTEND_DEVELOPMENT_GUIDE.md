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
- **Authentication**: JWT-based using rest_framework_simplejwt (Updated from Djoser)
- **User Model**: Custom user with email as primary identifier
- **Token Header**: Uses "JWT" prefix instead of "Bearer"
- **Database**: PostgreSQL (Updated from SQLite)
- **CORS**: Configured for localhost:3000, localhost:5173, and ngrok tunnels

### API Endpoints Structure

#### Authentication Endpoints (`/auth/`)

- `POST /auth/users/` - User registration (Djoser)
- `POST /auth/jwt/create/` - Login (JWT token generation) (Djoser)
- `POST /auth/jwt/refresh/` - Refresh JWT token (Djoser)
- `POST /auth/jwt/verify/` - Verify JWT token (Djoser)
- `GET /auth/users/me/` - Get current user profile (Djoser)

**Note**: Authentication uses both Djoser and rest_framework_simplejwt for comprehensive JWT handling

#### Livestock Management Endpoints (`/api/`)

- `GET|POST|PUT|PATCH|DELETE /api/farms/` - Farm management (Full CRUD)
- `GET|POST|PUT|PATCH|DELETE /api/labourers/` - Labourer management with approval system
- `GET|POST|PUT|PATCH|DELETE /api/livestock/` - Individual livestock records
- `GET|POST|PUT|PATCH|DELETE /api/health-records/` - Health and medical records
- `GET|POST|PUT|PATCH|DELETE /api/amu-records/` - Antimicrobial usage records
- `GET|POST|PUT|PATCH|DELETE /api/feed-records/` - Feed and nutrition tracking
- `GET|POST|PUT|PATCH|DELETE /api/yield-records/` - Production yield records
- `GET|POST|PUT|PATCH|DELETE /api/drugs/` - Drug database management
- `POST /api/amu-insights/generate/` - AI-powered AMU insights (Gemini AI)
- `GET /api/amu-insights/chart-data/` - AMU chart data for analytics

#### Special Labourer Actions

- `POST /api/labourers/{id}/join_farm/` - Request to join a farm
- `POST /api/labourers/{id}/approve/` - Approve labourer (Farm owner only)
- `POST /api/labourers/{id}/reject/` - Reject labourer (Farm owner only)

---

## Data Models Structure

### Farm Model

```typescript
interface Farm {
  id: number;
  owner: number; // User ID - automatically set on creation
  name: string;
  location?: string;
}
```

### Livestock Model

```typescript
interface Livestock {
  id: number;
  farm: number; // Foreign key to Farm - automatically set for farm owner
  tag_id: string; // Unique identifier for the livestock
  species: string;
  breed: string;
  date_of_birth: string; // ISO date string (YYYY-MM-DD)
  gender: 'M' | 'F'; // Male or Female
  health_status: 'healthy' | 'sick' | 'recovering'; // Default: 'healthy'
  current_weight_kg?: number; // Current weight in kilograms (added field)
}

// Note: current_weight_kg field added for better dosage calculations
// Farm is automatically set based on the authenticated user's farm
```

### Health Record Model

```typescript
interface HealthRecord {
  id: number;
  livestock: number; // Foreign key to Livestock
  event_type: 'vaccination' | 'sickness' | 'check-up' | 'treatment';
  event_date: string; // ISO date string (YYYY-MM-DD)
  notes?: string;
  diagnosis?: string; // New field added
  treatment_outcome?: string; // New field added
  amu_records: AMURecord[]; // Nested AMU records (read-only)
}
```

### AMU Record Model

```typescript
interface AMURecord {
  id: number;
  health_record: number; // Foreign key to HealthRecord
  drug?: number; // Foreign key to Drug (nullable)
  drug_name?: string; // Read-only from drug.name (nullable)
  dosage: string; // Dosage amount and unit
  withdrawal_period: number; // Days until safe for consumption
}

// Note: Drug field is now nullable to handle cases where drug might be removed
// from database but AMU record should remain for historical tracking
```

### Drug Model

```typescript
interface Drug {
  id: number;
  name: string; // Unique drug name
  active_ingredient?: string;
  species_target?: string; // Target species for this drug
  recommended_dosage_min?: number; // Minimum recommended dosage
  recommended_dosage_max?: number; // Maximum recommended dosage  
  unit?: string; // Dosage unit (mg, ml, etc.)
  notes?: string; // Additional notes about the drug
}

// Used for drug database management and dosage recommendations
// Integrated with Gemini AI for dosage optimization insights
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
  user: number; // User ID - automatically set on creation
  farm?: number; // Farm ID - set when joining a farm
  status: 'pending' | 'approved' | 'rejected'; // Default: 'pending'
  user_name: string; // Read-only from user.username
  user_email: string; // Read-only from user.email  
  farm_name?: string; // Read-only from farm.name
}

// Additional fields are read-only and computed from relationships
// - user_name: Derived from related User model
// - user_email: Derived from related User model
// - farm_name: Derived from related Farm model
```

## Permission System

### Authentication & Authorization

The backend implements a sophisticated permission system:

#### User Roles

- **Farm Owner**: Full access to their farm data, can manage labourers
- **Labourer**: Limited access based on approval status and specific permissions
- **Unauthenticated**: No access to API endpoints

#### Permission Classes

- `IsFarmOwner`: Restricts access to farm owners only
- `IsFarmMember`: Allows both owners and approved labourers with different permission levels

#### Labourer Workflow

1. **Registration**: User creates labourer profile (status: 'pending')
2. **Farm Request**: Labourer requests to join a specific farm
3. **Email Notification**: Farm owner receives email notification
4. **Approval/Rejection**: Farm owner approves or rejects the request
5. **Email Confirmation**: Labourer receives status update via email

### AI Integration (Gemini AI)

#### AMU Insights Generation

- **Endpoint**: `POST /api/amu-insights/generate/`
- **API Key**: Configured in backend (AIzaSyDf19mZiktXbM6oxXl_3NHXbl5FEh7I4jM)
- **Model**: gemini-1.5-flash
- **Features**:
  - Dosage optimization based on animal weight
  - Treatment effectiveness analysis
  - Health pattern recognition
  - Risk assessment and recommendations

#### Chart Data Analytics

- **Endpoint**: `GET /api/amu-insights/chart-data/`
- **Features**:
  - 12-month AMU usage trends
  - Drug usage patterns by month
  - Treatment frequency analysis
  - Visual chart data for frontend consumption

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

### Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── LoadingSpinner.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
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
└── utils/
    ├── constants.ts
    ├── formatters.ts
    └── validators.ts
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

## Mobile-Specific Features

### Offline Capability

- Service worker implementation
- Local data synchronization
- Offline form completion
- Background sync when online

### Mobile-Optimized Components

- Touch-friendly interfaces
- Camera integration for photos
- GPS location tracking
- Push notifications for reminders

### Progressive Web App (PWA)

- Installable on mobile devices
- Native app-like experience
- Background synchronization
- Push notification support

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

- **Clean & Intuitive**: Easy navigation for farmers
- **Data-Driven**: Emphasis on charts and metrics
- **Mobile-First**: Responsive design approach
- **Accessibility**: WCAG 2.1 compliance
- **Offline-Ready**: Clear offline/online status

### Component Design Standards

- Consistent spacing using 8px grid
- Clear typography hierarchy
- Icon-based navigation
- Touch-friendly button sizes (minimum 44px)
- Loading states for all async operations

---

## State Management Architecture

### Redux Store Structure

```typescript
interface RootState {
  auth: {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
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

// JWT token interceptor - Note: Uses "JWT" prefix, not "Bearer"
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `JWT ${token}`;
  }
  return config;
});

// Automatic token refresh interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post('/auth/jwt/refresh/', {
          refresh: refreshToken
        });
        
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        originalRequest.headers.Authorization = `JWT ${access}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login if refresh fails
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
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

- Multiple language support
- Text size adjustability
- High contrast mode
- Voice navigation support

---

## Implementation Priority

### Phase 1: Core Features (MVP)

1. Authentication system
2. Basic livestock management
3. Simple health record tracking
4. Basic AMU logging
5. Essential dashboard metrics

### Phase 2: Enhanced Features

1. Advanced AMU monitoring
2. AI-powered insights
3. Comprehensive reporting
4. Mobile optimization
5. Offline capabilities

### Phase 3: Advanced Features

1. Inventory management
2. Advanced analytics
3. Government compliance reporting
4. Multi-farm management
5. API integrations

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

### Documentation

- Component documentation
- API integration guides
- User documentation
- Developer onboarding guides

---

## Conclusion

This comprehensive guide provides a complete roadmap for developing the FarmSense React frontend. The implementation focuses on creating an intuitive, feature-rich livestock management system that addresses the specific needs identified in the problem statement while ensuring scalability, performance, and user experience excellence.

The system integrates advanced AMU monitoring, AI-powered insights, and comprehensive farm management capabilities, making it a competitive solution in the digital agriculture space.
