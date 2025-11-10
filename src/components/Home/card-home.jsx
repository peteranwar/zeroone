import { Stack, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { trendingDownIcon, trendingUpIcon } from '../../assets/icons';

const CardHome = ({ title, data, icon }) => {
  const { t } = useTranslation();
  return (
    <Stack
      sx={{
        backgroundColor: 'white',
        px: 2,
        py: { xs: 1.5, sm: 3 },
        borderRadius: '16px',
      }}
      spacing={1.5}
      color='white'
    >
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <Stack direction='row' spacing={1.5}>
          <Typography
            variant='body1'
            sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600 }}
          >
            {title}
          </Typography>
        </Stack>
        {icon}
      </Stack>
      <Typography variant='h4' color='initial'>
        {data?.count}
      </Typography>
      <Typography
        variant='body1'
        sx={{
          color: data?.diff_type === 'up' ? '#00B69B' : '#F93C65',
          display: 'flex',
          gap: '6px',
          alignItems: 'center',
        }}
      >
        {data?.diff_type === 'up' ? trendingUpIcon : trendingDownIcon}
        {data?.diff}
        <Typography variant='body2' sx={{ color: '#737791', fontWeight: 600 }}>
          {t('home.cards.lastMonth')}
        </Typography>
      </Typography>
    </Stack>
  );
};

export default CardHome;
