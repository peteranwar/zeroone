import { Box } from '@mui/material';
import React from 'react';

const CloseToastIcon = () => {
  return (
    <Box
      display='flex'
      alignItems='center'
      p={1.2}
      sx={{
        borderInlineStart: '1px solid #fff',
        height: 'fit-content',
        margin: 'auto',
        marginInlineStart: '.8rem',
      }}
    >
      <svg
        width='12'
        height='12'
        viewBox='0 0 16 16'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M14 2L8 8M8 8L2 14M8 8L2 2M8 8L14 14'
          stroke='white'
          strokeWidth='3'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </Box>
  );
};

export default CloseToastIcon;
