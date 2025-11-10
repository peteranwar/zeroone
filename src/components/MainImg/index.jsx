import { Box } from '@mui/material';
import React from 'react';

const MainImg = ({ name, ...otherProps }) => {
  return (
    <Box
      component='img'
      src={`/assets/images/${name}`}
      loading='lazy'
      decoding='async'
      {...otherProps}
    />
  );
};

export default MainImg;
