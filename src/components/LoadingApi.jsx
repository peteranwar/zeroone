import { Box, CircularProgress } from '@mui/material';
import React from 'react';

const LoadingApi = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '30vh',
      }}
    >
      <CircularProgress sx={{ color: '#EF4130' }} />
    </Box>
  );
};

export default LoadingApi;
