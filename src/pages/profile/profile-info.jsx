import { Box, Container, Stack } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainModal from '../../components/MainModal';
import ContentPersonal from './personalinfopoup';
import ContentPassword from './passwordPopup';
import EditSection from '../../components/profile/EditSection';
import PasswordSection from '../../components/profile/PasswordSection';
import { useSettingsContext } from '../../components/settings';
import { useGetProfile } from '../../services/profile/query';

const Profile = () => {
  const settings = useSettingsContext();
  const [open, setOpen] = useState(false);
  const [typeModal, setTypeModal] = useState('');
  const { t } = useTranslation();
  const { data: userData } = useGetProfile();

  return (
    <>
      <Box sx={{ width: '100%' }} mt={{ xs: 1, sm: 4 }}>
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
          <Stack spacing={2}>
            <Stack
              sx={{
                height: '100%',
                width: '100%',
                borderRadius: '12px',
                position: 'relative',
                backgroundColor: 'white',
              }}
              spacing={2}
              p={{ xs: 2, sm: 5 }}
            >
              <EditSection
                setOpen={setOpen}
                setTypeModal={setTypeModal}
                userData={userData?.data}
              />
            </Stack>
            <Stack
              sx={{
                height: '100%',
                width: '100%',
                borderRadius: '12px',
                position: 'relative',
                backgroundColor: 'white',
              }}
              spacing={2}
              p={{ xs: 2, sm: 5 }}
            >
              <PasswordSection setOpen={setOpen} setTypeModal={setTypeModal} />
            </Stack>
          </Stack>
        </Container>
      </Box>

      {typeModal === 'edit-info' ? (
        <MainModal open={open} setOpen={setOpen} title={t('profile.editSection.title')}>
          <ContentPersonal setOpen={setOpen} userData={userData?.data} />
        </MainModal>
      ) : (
        <MainModal
          open={open}
          setOpen={setOpen}
          title={t('profile.passwordSection.popupEdit.title')}
        >
          <ContentPassword setOpen={setOpen} />
        </MainModal>
      )}
    </>
  );
};

export default Profile;
