import React from 'react';
import { Box } from '@mui/material';
import ImageViewer from 'react-simple-image-viewer';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const CustomImageViewer = ({ images, currentIndex, onClose }) => {
  if (currentIndex === null) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark overlay
        zIndex: 1300, // Highest priority
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ImageViewer
        src={images}
        currentIndex={currentIndex}
        disableScroll={false}
        closeOnClickOutside
        onClose={onClose}
        leftArrowComponent={<ArrowBackIosIcon sx={{ fontSize: 50, fontWeight: 800 }} />}
        rightArrowComponent={
          <ArrowBackIosIcon
            sx={{ fontSize: 50, fontWeight: 800, transform: 'scaleX(-1)' }}
          />
        }
      />
    </Box>
  );
};

export default CustomImageViewer;
