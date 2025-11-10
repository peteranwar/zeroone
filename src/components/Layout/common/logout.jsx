import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { logoutIcon } from '../../../assets/icons';
import { useSettingsContext } from '../../settings';

export default function Logout() {
  const settings = useSettingsContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isMini = settings.themeLayout === 'mini';

  const handleLogout = () => {
    localStorage.setItem('token', null);
    localStorage.setItem('userPermissions', null);
    navigate('/login');
    window.location.reload();
  };

  return (
    <Box>
      <Button
        onClick={handleLogout}
        sx={{
          // p: 0,
          flexDirection: isMini ? 'column' : 'row',
          justifyContent: 'flex-start',
          ':hover': {
            backgroundColor: 'transparent',
          },
        }}
      >
        {logoutIcon}
        <Typography
          mx={{ xs: 0.85, md: 1.5 }}
          variant={isMini ? 'body2' : 'body1'}
          color='#FA615F'
        >
          {t('nav.logout')}
        </Typography>
      </Button>
    </Box>
  );
}
