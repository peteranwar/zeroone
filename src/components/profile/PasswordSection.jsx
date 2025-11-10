/* eslint-disable no-sequences */
import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { editBtnIcon, passwordInfo } from '../../assets/icons';

const PasswordSection = ({ setOpen, setTypeModal }) => {
  const { t } = useTranslation();
  return (
    <Stack spacing={2.5}>
      <Stack display='flex' gap='1rem'>
        <Box
          display='flex'
          direction='row'
          alignItems='center'
          gap='1rem'
          sx={{ '& svg': { height: '30px' } }}
        >
          {passwordInfo}
          <Typography variant='h4' color='initial' sx={{ textTransform: 'uppercase' }}>
            {t('profile.passwordSection.title')}
          </Typography>
        </Box>
      </Stack>

      <Box>
        <Typography variant='h6' fontWeight='600'>
          {t('profile.passwordSection.password')}
        </Typography>
        <Typography variant='h5' mt='.7rem' sx={{ color: '#757095' }} fontWeight='600'>
          *********
        </Typography>
      </Box>

      <Button
        onClick={() => {
          setOpen(true), setTypeModal('password');
        }}
        variant='outlined'
        startIcon={editBtnIcon}
        sx={{
          width: 'fit-content',
          borderColor: 'black',
          py: 1,
          px: 4,
          borderWidth: '2px',
          ':hover': { borderWidth: '2px' },
        }}
      >
        {t('profile.passwordSection.btn')}
      </Button>
    </Stack>
  );
};

export default PasswordSection;
