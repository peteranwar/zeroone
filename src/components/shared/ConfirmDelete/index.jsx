import { LoadingButton } from '@mui/lab';
import {
  Dialog,
  Typography,
  DialogActions,
  Button,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { deleteIconAction } from '../../../assets/icons';

const ConfirmDelete = ({ open, onClose, loading, onSubmitClicked }) => {
  const theme = useTheme();
  const mobileView = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();

  const closePopup = {
    color: '#112B3C',
    cursor: 'pointer',
    fontWeight: '600',
    borderRadius: '16px',
    ml: 'auto',
    border: '1px solid #E8E9F3',
    p: 1.3,
    lineHeight: 0,
  };

  return (
    <>
      {/* CONFIRM DELETE */}
      <Box
        component={Dialog}
        display='flex'
        mx='auto'
        sx={{
          '& .MuiPaper-root': {
            borderRadius: mobileView ? '12px' : '22px',
            width: mobileView ? '75vw' : '38vw',
            p: 4,
          },
        }}
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        textAlign='center'
        open={open}
        onClose={onClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <Box sx={closePopup} onClick={() => onClose()}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </Box>
        <Box
          mx='auto'
          mt={3}
          sx={{ 'svg': { width: '40px', height: { xs: '30px', sm: '40px' } } }}
        >
          {deleteIconAction}
        </Box>
        <Typography
          sx={{
            width: { xs: '100%', sm: '80%', lg: '45%' },
            marginInline: 'auto',
            pt: 3,
            pb: { xs: 2, sm: 7 },
          }}
          variant='h5'
        >
          {t('deleteConfirm.title')}
        </Typography>
        <Box
          component={DialogActions}
          display='flex'
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent='center'
          alignItems='center'
          p={0}
        >
          <Box
            component={LoadingButton}
            loading={loading}
            onClick={onSubmitClicked}
            variant='contained'
            width='100%'
          >
            {t('deleteConfirm.btnDel')}
          </Box>
          <Typography
            onClick={() => onClose()}
            color='text.secondary'
            variant='h6'
            width='100%'
            component={Button}
          >
            {t('deleteConfirm.btnCancel')}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default ConfirmDelete;
