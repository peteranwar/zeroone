/* eslint-disable no-irregular-whitespace */
import React from 'react';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <Stack sx={{ position: 'absolute', bottom: 25, left: 0, width: '100%' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent='space-between'
        alignItems='center'
        mt={4}
        spacing={0.5}
        px={5}
      >
        <Typography
          variant='h6'
          sx={{
            color: theme => theme.palette.text.secondary,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {t('footer.copyRight')}
          <Typography variant='h6' fontWeight={600}>
            {t('footer.zero')}
          </Typography>
          {t('footer.reserved')}
        </Typography>
        <Typography variant='h6' sx={{ color: theme => theme.palette.text.secondary }}>
          {t('footer.conditions')}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Footer;
