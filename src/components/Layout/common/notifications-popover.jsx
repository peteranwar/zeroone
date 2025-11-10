/* eslint-disable import/no-unresolved */
import { Badge, Button, Divider, IconButton, Stack, Typography } from '@mui/material';
import React from 'react';
import {
  dotNotifications,
  notificationsIcon,
  profilePopupIcon,
  settingPopupIcon,
} from '../../../assets/icons';
import CustomPopover, { usePopover } from '../../custom-popover';

const NotificationsPopover = () => {
  const popover = usePopover();

  const data = [
    {
      id: 1,
      type: 'Settings',
      desc: 'Update Your copmany info',
      time: '2m',
      icon: settingPopupIcon,
      read: false,
    },
    {
      id: 2,
      type: 'Settings',
      desc: 'Update Your copmany info',
      time: '2m',
      icon: settingPopupIcon,
      read: false,
    },
    {
      id: 3,
      type: 'Settings',
      desc: 'Update Your copmany info',
      time: '2m',
      icon: settingPopupIcon,
      read: true,
    },
    {
      id: 4,
      type: 'Settings',
      desc: 'Update Your copmany info',
      time: '2m',
      icon: settingPopupIcon,
      read: true,
    },
    {
      id: 5,
      type: 'Settings',
      desc: 'Update Your copmany info',
      time: '2m',
      icon: settingPopupIcon,
      read: true,
    },
    {
      id: 6,
      type: 'Settings',
      desc: 'Update Your copmany info',
      time: '2m',
      icon: profilePopupIcon,
      read: true,
    },
    {
      id: 7,
      type: 'Settings',
      desc: 'Update Your copmany info',
      time: '2m',
      icon: settingPopupIcon,
      read: true,
    },
  ];

  return (
    <>
      <Stack justifyContent='center'>
        <IconButton onClick={popover.onOpen}>
          <Badge badgeContent={4} color='error'>
            {notificationsIcon}
          </Badge>
        </IconButton>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{
          minWidth: { xs: 300, sm: 400 },
          p: 0,
          maxHeight: { xs: 500, sm: 700 },
          overflow: 'auto',
        }}
      >
        <Stack spacing={1}>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            px={2.5}
            pt={3}
          >
            <Stack direction='row' spacing={2} alignItems='center'>
              <Typography variant='h5' color='initial'>
                Notification
              </Typography>
              <Typography
                variant='h6'
                color='initial'
                sx={{
                  background: 'rgba(236, 29, 35, .1)',
                  color: '#EC1D23',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '10px',
                }}
              >
                2 New
              </Typography>
            </Stack>
            <Button variant='text' sx={{ color: ' #EC1D23' }}>
              Clear All
            </Button>
          </Stack>
          <Divider sx={{ py: 1 }} />
          <Stack pb={1} pt={1}>
            {data?.map(item => (
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'
                key={item.id}
                px={2.5}
                py={2}
                sx={{ background: item.read ? '' : '#573E910F' }}
              >
                <Stack direction='row' alignItems='center' spacing={3}>
                  {item.icon}
                  <Stack direction='column' spacing={0.5}>
                    <Typography variant='h5' sx={{ fontWeight: 500 }}>
                      {item.type}
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{ color: theme => theme.palette.text.secondary }}
                    >
                      {item.desc}
                    </Typography>
                  </Stack>
                </Stack>
                <Typography
                  variant='body2'
                  sx={{
                    color: theme => theme.palette.text.secondary,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  {item.time}
                  {item.read ? '' : dotNotifications}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </CustomPopover>
    </>
  );
};

export default NotificationsPopover;
