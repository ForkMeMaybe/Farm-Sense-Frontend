import React from 'react';
import { Card, CardProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface GlassCardProps extends Omit<CardProps, 'variant'> {
  glassVariant?: 'glass' | 'solid' | 'gradient';
  interactive?: boolean;
  intensity?: 'light' | 'medium' | 'strong';
}

const StyledGlassCard = styled(Card, {
  shouldForwardProp: (prop) => 
    !['glassVariant', 'interactive', 'intensity'].includes(prop as string),
})<GlassCardProps>(({ theme, glassVariant = 'glass', interactive = false, intensity = 'medium' }) => {
  const getBackgroundByVariant = () => {
    switch (glassVariant) {
      case 'glass':
        const opacityMap = { light: 0.7, medium: 0.85, strong: 0.95 };
        return `rgba(255, 255, 255, ${opacityMap[intensity]})`;
      case 'gradient':
        return 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)';
      case 'solid':
      default:
        return theme.palette.background.paper;
    }
  };

  const getBlurByIntensity = () => {
    const blurMap = { light: 'blur(10px)', medium: 'blur(20px)', strong: 'blur(30px)' };
    return glassVariant === 'glass' ? blurMap[intensity] : 'none';
  };

  return {
    background: getBackgroundByVariant(),
    backdropFilter: getBlurByIntensity(),
    WebkitBackdropFilter: getBlurByIntensity(),
    borderRadius: theme.spacing(3),
    border: glassVariant === 'glass' ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
    boxShadow: glassVariant === 'glass' 
      ? '0 8px 32px rgba(0, 0, 0, 0.1)' 
      : theme.shadows[4],
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    
    '&::before': glassVariant === 'glass' ? {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
    } : {},

    ...(interactive && {
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: glassVariant === 'glass' 
          ? '0 20px 40px rgba(0, 0, 0, 0.15)' 
          : '0 20px 40px rgba(0, 0, 0, 0.1)',
        background: glassVariant === 'glass' 
          ? `rgba(255, 255, 255, ${Math.min(1, (intensity === 'light' ? 0.7 : intensity === 'medium' ? 0.85 : 0.95) + 0.1)})` 
          : getBackgroundByVariant(),
      },
      '&:active': {
        transform: 'translateY(-4px)',
      },
    }),

    // Add subtle gradient overlay for depth
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.05) 100%)',
      pointerEvents: 'none',
      borderRadius: 'inherit',
      opacity: glassVariant === 'glass' ? 1 : 0,
    },

    '& > *': {
      position: 'relative',
      zIndex: 1,
    },
  };
});

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  glassVariant = 'glass',
  interactive = false,
  intensity = 'medium',
  className,
  ...props
}) => {
  return (
    <StyledGlassCard
      glassVariant={glassVariant}
      interactive={interactive}
      intensity={intensity}
      className={`glass-card ${className || ''}`}
      {...props}
    >
      {children}
    </StyledGlassCard>
  );
};

export default GlassCard;