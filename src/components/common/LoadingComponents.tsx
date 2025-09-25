import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// Shimmer animation
const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

// Pulse animation
const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
`;

// Skeleton card for dashboard cards
export const SkeletonCard: React.FC<{ height?: number }> = ({ height = 200 }) => (
  <Box
    sx={{
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderRadius: 3,
      p: 3,
      border: '1px solid rgba(255, 255, 255, 0.3)',
    }}
  >
    <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" width="100%" height={height} sx={{ borderRadius: 2 }} />
    <Skeleton variant="text" width="60%" height={24} sx={{ mt: 2 }} />
  </Box>
);

// Skeleton for list items
export const SkeletonListItem: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      p: 2,
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderRadius: 2,
      mb: 1,
      border: '1px solid rgba(255, 255, 255, 0.3)',
    }}
  >
    <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
    <Box sx={{ flex: 1 }}>
      <Skeleton variant="text" width="70%" height={24} />
      <Skeleton variant="text" width="50%" height={20} />
    </Box>
  </Box>
);

// Modern loading spinner
const SpinnerContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '200px',
}));

const Spinner = styled('div')(({ theme }) => ({
  width: '48px',
  height: '48px',
  border: '4px solid rgba(16, 185, 129, 0.1)',
  borderTopColor: theme.palette.primary.main,
  borderRadius: '50%',
  animation: `${shimmer} 1s linear infinite`,
}));

export const ModernSpinner: React.FC<{ size?: 'small' | 'medium' | 'large' }> = ({ 
  size = 'medium' 
}) => {
  const sizeMap = { small: 24, medium: 48, large: 72 };
  const borderMap = { small: 2, medium: 4, large: 6 };
  
  return (
    <SpinnerContainer>
      <Spinner
        sx={{
          width: sizeMap[size],
          height: sizeMap[size],
          borderWidth: borderMap[size],
        }}
      />
    </SpinnerContainer>
  );
};

// Page loading overlay
export const PageLoadingOverlay: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    }}
  >
    <ModernSpinner size="large" />
    {children}
  </Box>
);

// Animated dots loader
const DotsContainer = styled(Box)({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
});

const Dot = styled('div')<{ delay: number }>(({ delay }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: '#10B981',
  animation: `${pulse} 1.4s infinite`,
  animationDelay: `${delay}s`,
}));

export const DotsLoader: React.FC = () => (
  <DotsContainer>
    <Dot delay={0} />
    <Dot delay={0.2} />
    <Dot delay={0.4} />
  </DotsContainer>
);

// Content placeholder with glassmorphism
export const ContentPlaceholder: React.FC<{ 
  lines?: number; 
  showAvatar?: boolean;
  showButton?: boolean;
}> = ({ 
  lines = 3, 
  showAvatar = false, 
  showButton = false 
}) => (
  <Box
    sx={{
      p: 3,
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderRadius: 3,
      border: '1px solid rgba(255, 255, 255, 0.3)',
    }}
  >
    {showAvatar && (
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Skeleton variant="circular" width={56} height={56} sx={{ mr: 2 }} />
        <Box>
          <Skeleton variant="text" width={120} height={24} />
          <Skeleton variant="text" width={80} height={20} />
        </Box>
      </Box>
    )}
    
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        variant="text"
        width={index === lines - 1 ? '75%' : '100%'}
        height={20}
        sx={{ mb: 1 }}
      />
    ))}
    
    {showButton && (
      <Skeleton 
        variant="rectangular" 
        width={120} 
        height={40} 
        sx={{ borderRadius: 2, mt: 2 }} 
      />
    )}
  </Box>
);

export default {
  SkeletonCard,
  SkeletonListItem,
  ModernSpinner,
  PageLoadingOverlay,
  DotsLoader,
  ContentPlaceholder,
};