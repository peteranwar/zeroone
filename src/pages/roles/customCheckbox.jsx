import CheckIcon from '@mui/icons-material/Check';
import { Box, Checkbox } from '@mui/material';
import React from 'react';

const CustomCheckbox = ({ checked, onChange }) => (
  <Checkbox
    checked={checked}
    onChange={onChange}
    icon={
      <Box
        sx={{
          width: 21,
          height: 21,
          border: '1px solid #737791',
          borderRadius: '6px',
        }}
      />
    }
    checkedIcon={
      <Box
        sx={{
          width: 21,
          height: 21,
          backgroundColor: '#4AB58E',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CheckIcon sx={{ color: '#fff', fontSize: 16 }} />
      </Box>
    }
  />
);

export default CustomCheckbox;
