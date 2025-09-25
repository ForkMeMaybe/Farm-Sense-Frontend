import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface ModernButtonProps extends Omit<ButtonProps, 'variant'> {
  gradient?: boolean;
  glowing?: boolean;
  buttonVariant?: 'contained' | 'outlined' | 'text' | 'glass';
}

const StyledModernButton = styled(Button, {
  shouldForwardProp: (prop) => !['gradient', 'glowing', 'buttonVariant'].includes(prop as string),
})<ModernButtonProps>(({ theme, gradient, glowing, buttonVariant }) => ({
  borderRadius: theme.spacing(2),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  padding: theme.spacing(1.5, 3),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',

  // Base styles for different variants
  ...(buttonVariant === 'glass' && {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: theme.palette.text.primary,
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.3)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    },
  }),

  // Gradient effect
  ...(gradient && {
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    color: 'white',
    
    '&:hover': {
      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    },
  }),

  // Glowing effect
  ...(glowing && {
    boxShadow: `0 0 20px ${theme.palette.primary.main}40`,
    
    '&:hover': {
      boxShadow: `0 0 30px ${theme.palette.primary.main}60`,
    },
  }),

  // Hover effects
  '&:hover': {
    transform: 'translateY(-2px)',
    ...(buttonVariant !== 'glass' && {
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    }),
  },

  '&:active': {
    transform: 'translateY(0)',
  },

  // Ripple effect overlay
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.5s',
  },

  '&:hover::before': {
    left: '100%',
  },

  // Loading state
  '&.Mui-disabled': {
    background: theme.palette.grey[300],
    color: theme.palette.grey[500],
    transform: 'none',
    boxShadow: 'none',
  },
}));

const ModernButton: React.FC<ModernButtonProps> = ({
  children,
  gradient = false,
  glowing = false,
  buttonVariant = 'contained',
  ...props
}) => {
  return (
    <StyledModernButton
      gradient={gradient}
      glowing={glowing}
      buttonVariant={buttonVariant}
      variant={buttonVariant === 'glass' ? 'contained' : buttonVariant}
      {...props}
    >
      {children}
    </StyledModernButton>
  );
};

export default ModernButton;