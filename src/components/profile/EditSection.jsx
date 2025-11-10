/* eslint-disable no-sequences */
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import SectionAvatar from './SectionAvatar';
import { editBtnIcon, personalInfoIcon } from '../../assets/icons';

const EditSection = ({ setOpen, setTypeModal, userData }) => {
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack display='flex' gap='1rem'>
        <Box
          display='flex'
          direction='row'
          alignItems='center'
          gap='1rem'
          sx={{ '& svg': { height: '30px' } }}
        >
          {personalInfoIcon}
          <Typography variant='h4' color='initial' sx={{ textTransform: 'uppercase' }}>
            {t('profile.editSection.title')}
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent='space-between'>
          <Stack sx={{ display: { xs: 'flex', sm: 'none' } }} alignItems='center'>
            <SectionAvatar image={userData?.image} />
          </Stack>
          <Stack width='100%'>
            <Box
              display='flex'
              flex='row'
              mt={{ xs: '1rem', sm: '2rem' }}
              alignItems='center'
              gap={{ xs: '1rem', sm: '2rem' }}
            >
              <Box sx={{ width: { xs: '56%', sm: '60%' } }}>
                <Typography variant='h6' color='#757095' fontWeight='500'>
                  {t('profile.editSection.firstName')}
                </Typography>
                <Typography variant='body1' mt='.7rem' color='black' fontWeight='600'>
                  {userData?.first_name}
                </Typography>
              </Box>
              <Box>
                <Typography variant='body1' color='#757095' fontWeight='500'>
                  {t('profile.editSection.lastName')}
                </Typography>
                <Typography variant='body1' mt='.7rem' color='black' fontWeight='600'>
                  {userData?.last_name}
                </Typography>
              </Box>
            </Box>

            <Box
              display='flex'
              flex='row'
              mt={{ xs: '1rem', sm: '2rem' }}
              alignItems='center'
              gap={{ xs: '1rem', sm: '2rem' }}
            >
              <Box sx={{ width: { xs: '56%', sm: '60%' } }}>
                <Typography variant='h6' color='#757095' fontWeight='500'>
                  {t('profile.editSection.email')}
                </Typography>
                <Typography variant='body1' mt='.7rem' color='black' fontWeight='600'>
                  {userData?.email}
                </Typography>
              </Box>
              <Box>
                <Typography variant='body1' color='#757095' fontWeight='500'>
                  {t('profile.editSection.phone')}
                </Typography>
                <Typography variant='body1' mt='.7rem' color='black' fontWeight='600'>
                  {userData?.dail_code} {userData?.phone}
                </Typography>
              </Box>
            </Box>
          </Stack>

          <Divider
            variant='middle'
            orientation='vertical'
            flexItem
            sx={{ mx: 1, display: { xs: 'none', sm: 'flex' } }}
          />

          <Stack
            width={{ xs: '50%', lg: '100%' }}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
            alignItems='center'
          >
            <SectionAvatar />
          </Stack>
        </Stack>

        <Button
          onClick={() => {
            setOpen(true), setTypeModal('edit-info');
          }}
          variant='outlined'
          startIcon={editBtnIcon}
          mt={2}
          sx={{
            width: 'fit-content',
            borderColor: 'black',
            py: 1,
            px: 4,
            borderWidth: '2px',
            mt: { xs: 1, sm: 3 },
            ':hover': { borderWidth: '2px' },
          }}
        >
          {t('profile.editSection.btn')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default EditSection;
