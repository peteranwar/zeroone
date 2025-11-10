import { Box, LinearProgress } from '@mui/material';
import React from 'react';

const Loading = () => {
  return (
    <Box
      sx={{
        zIndex: '555',
        width: '100%',
      }}
    >
      <LinearProgress />
    </Box>
  );
};

export default Loading;
