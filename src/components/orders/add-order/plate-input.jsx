/* eslint-disable react/no-array-index-key */
import React, { useRef } from 'react';
import { Box, TextField, Typography } from '@mui/material';

const PlateNumberInput = ({ setValue, watch, errors }) => {
  const letterRefs = [useRef(), useRef(), useRef()];
  const plateLetters = watch('plate_letters');
  const plateNumber = watch('plate_number');

  const handleNumberChange = e => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setValue('plate_number', value);
    if (value.length >= 3) {
      letterRefs[0].current?.focus();
    }
  };

  const handleLetterChange = (index, e) => {
    const value = e.target.value
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .slice(0, 1);
    const updated = [...plateLetters];
    updated[index] = value;
    setValue('plate_letters', updated);
    if (value && index < 2) {
      letterRefs[index + 1]?.current?.focus();
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Plate Number (left input) */}
        <TextField
          placeholder='ex:123'
          value={plateNumber}
          onChange={handleNumberChange}
          inputProps={{ maxLength: 4, style: { textAlign: 'center' } }}
          sx={{ backgroundColor: '#f5f7fa', borderRadius: 3, flex: 1 }}
        />

        {/* Letters (right inputs) */}
        {plateLetters.map((val, i) => (
          <TextField
            key={i}
            value={val}
            onChange={e => handleLetterChange(i, e)}
            inputRef={letterRefs[i]}
            inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
            sx={{ backgroundColor: '#f5f7fa', borderRadius: 3, width: 60 }}
          />
        ))}
      </Box>

      {/* Error Messages Below Inputs */}
      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
        <Box sx={{ flex: 1 }}>
          {errors.plateNumber && (
            <Typography variant='caption' color='error'>
              {errors.plateNumber.message}
            </Typography>
          )}
        </Box>
        {plateLetters.map((_, i) => (
          <Box key={i} sx={{ width: 60 }}>
            {errors.plateLetters?.[i] && (
              <Typography variant='caption' color='error'>
                {errors.plateLetters[i]?.message}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PlateNumberInput;
