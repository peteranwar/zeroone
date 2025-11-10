import { Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { profilePopupIcon, settingPopupIcon } from '../../../assets/icons';
import { permissions, usePermission } from '../../../constants';
import { useRouter } from '../../../hooks';
import { useResponsive } from '../../../hooks/use-responsive';
import CustomPopover, { usePopover } from '../../custom-popover';

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

export default function AccountPopover({ data }) {
  const { t } = useTranslation();
  const sm = useResponsive('down', 'sm');
  const router = useRouter();
  const popover = usePopover();
  const { haveAccess } = usePermission();
  const hasSettingsAccess = haveAccess(permissions.setting.read);

  const OPTIONS = [
    {
      id: 1,
      label: t('nav.profile'),
      linkTo: '/profile',
      icon: profilePopupIcon,
    },
    {
      id: 2,
      label: t('nav.settings'),
      linkTo: '/settings',
      icon: settingPopupIcon,
      disabled: !hasSettingsAccess,
    },
  ];
  const handleLogout = async () => {
    localStorage.setItem('token', null);
    router.push('/login');
    window.location.reload();
    localStorage.setItem('userPermissions', null);
  };

  const handleClickItem = path => {
    popover.onClose();
    router.push(path);
  };

  return (
    <>
      <IconButton
        component={m.button}
        whileTap={sm && 'tap'}
        whileHover={sm && 'hover'}
        onClick={popover.onOpen}
        sx={{
          ':hover': {
            backgroundColor: 'transparent',
          },
        }}
      >
        <Avatar
          src={data?.image}
          alt={data?.first_name}
          sx={{
            width: 45,
            height: 45,
            border: theme => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {data?.first_name?.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{ minWidth: 250, p: 0 }}
      >
        <Box sx={{ p: 2, pb: 2 }}>
          <Typography variant='body1' fontWeight={600} mb='.7rem'>
            {t('nav.userProfile')}
          </Typography>
          <Stack direction='row' alignItems='center' spacing={1.5}>
            <Avatar
              src={data?.image}
              alt={data?.first_name}
              sx={{
                width: 48,
                height: 48,
              }}
            >
              {data?.first_name?.charAt(0).toUpperCase()}
            </Avatar>
            <Stack spacing={0.2}>
              <Typography variant='body1'>
                {data?.first_name} {data?.last_name}
              </Typography>
              <Typography
                sx={{ fontSize: '13px', color: theme => theme.palette.text.secondary }}
              >
                {data?.email}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        <Divider variant='middle' sx={{ mb: 1 }} />

        <Stack>
          {OPTIONS.map(option => (
            <Stack key={option?.id}>
              <MenuItem disabled={option.disabled} onClick={() => handleClickItem(option.linkTo)}>
                <Stack direction='row' spacing={1.5} alignItems='center'>
                  {option?.icon}
                  <Stack>
                    <Typography variant='body1'>{option.label}</Typography>
                  </Stack>
                </Stack>
              </MenuItem>
              <Divider variant='middle' />
            </Stack>
          ))}
        </Stack>

        <Box sx={{ p: '.5rem .5rem 1rem .5rem' }}>
          <Button
            variant='danger'
            onClick={handleLogout}
            sx={{
              width: '100%',
            }}
          >
            {t('nav.logout2')}
          </Button>
        </Box>
      </CustomPopover>
    </>
  );
}
