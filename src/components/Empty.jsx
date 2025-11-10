import React from 'react';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { emptyCategoryIcon } from '../assets/icons';

const Empty = ({ title, icon, widthLg, height, color }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: height || '50vh',
      }}
    >
      <Stack
        spacing={3}
        textAlign='center'
        direction='column'
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {icon || emptyCategoryIcon}

        <Typography
          variant='body1'
          sx={{
            color: color || theme.palette.text.secondary,
            width: { xs: '100%', sm: '80%', lg: widthLg || '65%' },
          }}
        >
          {title}
        </Typography>
      </Stack>
    </Box>
  );
};

export default Empty;
