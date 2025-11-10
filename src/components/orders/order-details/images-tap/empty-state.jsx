import React from 'react';
import { Box, Typography } from '@mui/material';
// Placeholder icon
import { useTranslation } from 'react-i18next';
import MainImg from '../../../MainImg';

const EmptyState = ({ message, height = 200 }) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height,
        borderRadius: 3,
        padding: 3,
        textAlign: 'center',
        color: '#78909C', // Muted text color
      }}
    >
      <MainImg name='no-images.svg' alt='img' height='40%' />
      <Typography pt={3} variant='h5'>
        {message || t('orders.details.imageTap.noImages')}
      </Typography>
    </Box>
  );
};

export default EmptyState;
