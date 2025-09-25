import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard,
  Pets,
  LocalHospital,
  Medication,
  Agriculture,
  Assessment,
  AccountCircle,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, isMobile }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: t('nav.dashboard'), icon: <Dashboard />, path: '/dashboard' },
    { text: t('nav.livestock'), icon: <Pets />, path: '/livestock' },
    { text: t('nav.health'), icon: <LocalHospital />, path: '/health-records' },
    { text: t('nav.amu'), icon: <Medication />, path: '/amu-monitoring' },
    { text: t('nav.feed'), icon: <Agriculture />, path: '/feed-management' },
    { text: t('nav.yield'), icon: <Assessment />, path: '/yield-tracking' },
  ];

  const handleItemClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawerContent = (
    <Box 
      sx={{ 
        overflow: 'auto', 
        height: '100%',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.2)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}
    >
      <Box sx={{ p: 3, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Box sx={{ 
          mb: 2,
          p: 2,
          borderRadius: 3,
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 800, 
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
              letterSpacing: '-0.02em',
              fontSize: '1.5rem',
            }}
          >
            🌾 FarmSense
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 500,
              fontSize: '0.8rem',
              lineHeight: 1.4,
            }}
          >
            {t('auth.empoweringFarmers')}
          </Typography>
        </Box>
      </Box>
      
      <Divider sx={{ mx: 2, background: 'rgba(16, 185, 129, 0.2)' }} />
      
      <List sx={{ p: 1, mt: 2, position: 'relative', zIndex: 1 }}>
        {menuItems.map((item, index) => (
          <ListItem key={item.text} disablePadding className="slide-in-left" style={{ animationDelay: `${index * 0.1}s` }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleItemClick(item.path)}
              sx={{
                minHeight: 56,
                mx: 1,
                borderRadius: 3,
                mb: 0.5,
                background: location.pathname === item.path 
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)'
                  : 'rgba(255, 255, 255, 0.6)',
                border: location.pathname === item.path 
                  ? '1px solid rgba(16, 185, 129, 0.4)'
                  : '1px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: location.pathname === item.path 
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)'
                    : 'transparent',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                },
                '&:hover': {
                  background: location.pathname === item.path 
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.15) 100%)'
                    : 'rgba(16, 185, 129, 0.08)',
                  transform: 'translateX(6px)',
                  boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  '&::before': {
                    opacity: 1,
                  },
                },
                '&.Mui-selected': {
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.2) 100%)',
                    transform: 'translateX(6px)',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 2.5,
                  justifyContent: 'center',
                  color: location.pathname === item.path ? '#10B981' : 'text.secondary',
                  fontSize: '1.3rem',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 500,
                  fontSize: '0.95rem',
                  color: location.pathname === item.path ? '#10B981' : 'text.primary',
                  position: 'relative',
                  zIndex: 1,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2, mx: 2, background: 'rgba(16, 185, 129, 0.2)' }} />

      <List sx={{ p: 1, position: 'relative', zIndex: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleItemClick('/profile')}
            selected={location.pathname === '/profile'}
            sx={{
              minHeight: 48,
              px: 2.5,
              mx: 1,
              borderRadius: 3,
              background: location.pathname === '/profile' 
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)'
                : 'rgba(255, 255, 255, 0.6)',
              border: location.pathname === '/profile' 
                ? '1px solid rgba(16, 185, 129, 0.4)'
                : '1px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: location.pathname === '/profile' 
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.15) 100%)'
                  : 'rgba(16, 185, 129, 0.08)',
                transform: 'translateX(6px)',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              },
              '&.Mui-selected': {
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.2) 100%)',
                  transform: 'translateX(6px)',
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 3,
                justifyContent: 'center',
                color: location.pathname === '/profile' ? '#10B981' : 'text.secondary',
                transition: 'all 0.3s ease',
              }}
            >
              <AccountCircle />
            </ListItemIcon>
            <ListItemText 
              primary={t('nav.profile')}
              primaryTypographyProps={{
                fontWeight: location.pathname === '/profile' ? 600 : 500,
                fontSize: '0.95rem',
                color: location.pathname === '/profile' ? '#10B981' : 'text.primary',
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          top: 64,
          height: 'calc(100% - 64px)',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;