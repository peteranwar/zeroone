/* eslint-disable no-unused-vars */
import { Avatar, Button, Stack, Box } from '@mui/material';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import { VisuallyHiddenInput } from '../../pages/profile/style';
import ToastSuccess from '../ToastSuccess';
import ToastError from '../ToastError';
import { addPhotoIcon } from '../../assets/icons';
import ProfileApiEndpoints from '../../services/profile/api';

const SectionAvatar = ({ image }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const uploadImage = async e => {
    if (e.target.files[0]) {
      const formData = new FormData();
      formData.append('image', e.target.files[0]);

      try {
        setLoading(true);
        await ProfileApiEndpoints.updateUserImage(formData);
        ToastSuccess(t('profile.sectionAvatar.toastSuccess'));
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      } catch (error) {
        ToastError(error || t('validation.toastError'));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Stack
      sx={{ width: 'fit-content', height: '100%' }}
      alignItems='center'
      justifyContent='center'
    >
      <Box
        sx={{
          width: '8rem',
          height: '8rem',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(177.71deg, #23282E -71.59%, rgba(35, 40, 46, 0) 113.62%)',
        }}
      >
        <Box
          sx={{
            width: '7.7rem',
            height: '7.7rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
          }}
        >
          <Avatar
            alt='User Avatar'
            src={image || ''}
            sx={{
              width: '7rem',
              height: '7rem',
            }}
          />
        </Box>
      </Box>

      {loading ? (
        <CircularProgress size='25px' sx={{ mt: 2 }} />
      ) : (
        <Button
          component='label'
          variant='text'
          startIcon={addPhotoIcon}
          href='#file-upload'
          onChange={uploadImage}
          sx={{
            color: '#5A5E6E',
            mt: 1,
            textTransform: 'capitalize',
            '&.MuiButtonBase-root': { fontWeight: 600 },
          }}
        >
          {t('profile.sectionAvatar.btn')}
          <VisuallyHiddenInput type='file' />
        </Button>
      )}
    </Stack>
  );
};

export default SectionAvatar;
