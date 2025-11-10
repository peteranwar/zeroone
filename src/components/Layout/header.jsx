import { useTranslation } from 'react-i18next';
import { useCallback, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Button, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useResponsive } from '../../hooks/use-responsive';
import { useSettingsContext } from '../settings';

import { NAV, HEADER } from './config-layout';
import { bgBlur } from '../../ui/theme/css';
import localStorageProvider from '../../localStorageProvider';
import AccountPopover from './common/account-popover';
import MainImg from '../MainImg';
import NotificationsPopover from './common/notifications-popover';
import { settingNavIcon } from '../../assets/icons';
import { useGetProfile } from '../../services/profile/query';
import { setUser, setUserPermission } from '../../store/slices/userSlice';
import { permissions, usePermission } from '../../constants';

// ----------------------------------------------------------------------

export default function Header({ onOpenNav }) {
  const location = useLocation();
  const path = location.pathname;
  let numberOrder = null;
  const firstSegment = location.pathname.split('/')[1];
  const theme = useTheme();
  const { i18n, t } = useTranslation();
  const settings = useSettingsContext();
  const isNavMini = settings.themeLayout === 'mini';
  const lgUp = useResponsive('up', 'lg');
  const dispatch = useDispatch();

  const { data: userData } = useGetProfile();
  const { haveAccess } = usePermission();
  useEffect(() => {
    if (userData) {
      dispatch(setUser(userData));
      dispatch(setUserPermission(userData.data?.role?.permissions));
      localStorage.setItem(
        'userPermissions',
        JSON.stringify(userData.data?.role?.permissions)
      );
    }
  }, [userData]);
  const changeLanguage = useCallback(
    lng => {
      i18n.changeLanguage(lng);
      document.querySelector('html').dir = i18n.dir();
      document.querySelector('html').lang = lng;
      localStorageProvider.set('locale', lng);
    },
    [i18n]
  );

  if (path.startsWith('/order/details/')) {
    numberOrder = path.split('/').pop();
  }
  const hasSettingsAccess = haveAccess(permissions.setting.read);

  const renderContent = (
    <>
      {!lgUp && (
        <IconButton onClick={onOpenNav}>
          <MenuIcon />
        </IconButton>
      )}
      <Typography variant='h5' color='initial'>
        {t(`nav.${firstSegment || 'dashboard'}`) +
          (numberOrder ? `: #${numberOrder}` : '')}
      </Typography>
      ;
      <Stack
        flexGrow={1}
        direction='row'
        alignItems='center'
        justifyContent='flex-end'
        spacing={{ xs: 0.5, sm: 5 }}
      >
        {userData?.data && userData?.data?.id ? (
          <Box sx={{ flexGrow: 0 }} display='flex' alignItems='center' gap={0.5}>
            <Box sx={{ flexGrow: 0 }} display='flex' alignItems='center'>
              {i18n.language === 'en' ? (
                <Button
                  onClick={() => changeLanguage('ar')}
                  sx={{
                    minWidth: 'fit-content',
                    p: 0,
                    height: 'fit-content',
                    ':hover': { background: 'transparent' },
                  }}
                >
                  <MainImg name='lang-ar.png' alt='lang-ar' width={26} height={21} />
                </Button>
              ) : (
                <Button
                  onClick={() => changeLanguage('en')}
                  sx={{
                    minWidth: 'fit-content',
                    height: 'fit-content',
                    ':hover': { background: 'transparent' },
                    borderRadius: '4px',
                    p: 0,
                    m: 0,
                    overflow: 'hidden',
                  }}
                >
                  <MainImg name='lang-en.jpg' alt='lang-en' width={26} height={21} />
                </Button>
              )}
            </Box>
            <NotificationsPopover />
            <Button
              disabled={!hasSettingsAccess}
              component={Link}
              to='/settings'
              sx={{ lineHeight: 0, p: 0, m: 0, minWidth: 'fit-content' }}
            >
              {settingNavIcon}
            </Button>
            <AccountPopover data={userData?.data} />
          </Box>
        ) : (
          <Link to='/login' className='login-navbar'>
            {t('nav.login')}
          </Link>
        )}
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        height: HEADER.H_MOBILE,
        border: '0',
        borderRadius: '0',
        background: 'white !important',
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.W_VERTICAL + 2}px)`,
          height: HEADER.H_DESKTOP,
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI + 1}px)`,
          }),
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};
