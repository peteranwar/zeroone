import { Backdrop, Box, Fade, Modal, Stack, Typography } from '@mui/material';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: '30rem' },
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  borderRadius: '20px',
  boxShadow: 24,
  p: 4,
};

const closePopup = {
  color: '#737791',
  cursor: 'pointer',
  fontWeight: '600',
  borderRadius: '16px',
  ml: 'auto',
  p: 1.3,
  lineHeight: 0,
};

const MainModal = ({ open, setOpen, children, iconImg, handleOnClose, title }) => {
  const closeModal = () => {
    setOpen(false);
    if (handleOnClose) {
      handleOnClose();
    }
  };
  return (
    <Modal
      aria-labelledby='transition-modal-title'
      aria-describedby='transition-modal-description'
      open={open}
      onClose={closeModal}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box id='main-modal'>
          <Box sx={style}>
            <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
              <Typography variant='h5' color='initial'>
                {title}
              </Typography>
              <Box sx={closePopup} onClick={closeModal}>
                <CloseIcon sx={{ fontSize: '25px' }} />
              </Box>
            </Box>
            {iconImg && (
              <Stack alignItems='center' spacing={1}>
                {iconImg}
              </Stack>
            )}
            {children}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default MainModal;
