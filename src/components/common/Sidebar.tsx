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
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Box sx={{ p: 3, textAlign: 'center' }}>
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
          }}
        >
          🌾 FarmSense
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            fontWeight: 500,
          }}
        >
          {t('auth.empoweringFarmers')}
        </Typography>
      </Box>
      
      <Divider sx={{ mx: 2, background: 'rgba(16, 185, 129, 0.2)' }} />
      
      <List sx={{ p: 1, mt: 2 }}>
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
                  : 'transparent',
                border: location.pathname === item.path 
                  ? '1px solid rgba(16, 185, 129, 0.3)'
                  : '1px solid transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: location.pathname === item.path 
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.15) 100%)'
                    : 'rgba(16, 185, 129, 0.08)',
                  transform: 'translateX(4px)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                },
                '&.Mui-selected': {
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.15) 100%)',
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
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      <List sx={{ p: 0 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleItemClick('/profile')}
            selected={location.pathname === '/profile'}
            sx={{
              minHeight: 48,
              px: 2.5,
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 3,
                justifyContent: 'center',
                color: location.pathname === '/profile' ? 'inherit' : 'text.secondary',
              }}
            >
              <AccountCircle />
            </ListItemIcon>
            <ListItemText primary={t('nav.profile')} />
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