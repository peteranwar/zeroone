import React from 'react';
import {
  Box,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
  Typography,
} from '@mui/material';

const PhoneInput = ({
  label,
  placeholder,
  register,
  name,
  errors,
  id,
  otherProps,
  disabled,
  value,
}) => {
  return (
    <FormControl sx={{ position: 'relative' }}>
      <FormLabel
        sx={{
          marginBottom: '10px',
          fontWeight: '600',
          width: '100%',
          color: 'black',
          fontSize: '12px',
        }}
      >
        {label}
      </FormLabel>

      <TextField
        sx={{
          borderRadius: '12px',
          height: '50px',
          '& input': { pl: '65px', pr: '65px', py: '16.5px' },
          '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
            display: 'none',
          },
          '& input[type=number]': {
            MozAppearance: 'textfield',
          },
        }}
        id={id}
        label={placeholder ? '' : label}
        placeholder={placeholder}
        variant='outlined'
        disabled={disabled}
        type='number'
        value={value}
        inputMode='numeric'
        pattern='[0-9]*'
        error={Boolean(errors?.[name])}
        {...otherProps}
        {...register(name)}
      />

      {errors?.[name] && (
        <FormHelperText sx={{ color: 'red' }} id={name}>
          {errors[name]?.message}
        </FormHelperText>
      )}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          position: 'absolute',
          top: '3.45rem',
          left: '1rem',
          transform: 'translateY(-50%)',
        }}
      >
        <Typography
          style={{ direction: 'ltr' }}
          variant='body1'
          fontSize='12px'
          color='#737791'
        >
          +966
        </Typography>
        <Divider
          orientation='vertical'
          flexItem
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            position: 'absolute',
            top: '50%',
            left: '2rem',
            transform: 'translateY(-50%)',
            height: '1.5rem',
            paddingLeft: '.5rem',
          }}
        />
      </Box>
    </FormControl>
  );
};

export default PhoneInput;
