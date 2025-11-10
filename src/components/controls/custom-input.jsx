import {
  FormControl,
  FormHelperText,
  FormLabel,
  InputAdornment,
  TextField,
} from '@mui/material';
import React from 'react';

function CustomInput({
  label,
  placeholder,
  register,
  name,
  errors,
  type,
  id,
  labelEnd,
  labelStart,
  disabled,
  otherProps,
  value,
  onKeyDown
}) {
  return (
    <FormControl>
      <FormLabel
        sx={{
          marginBottom: '10px',
          fontWeight: '600',
          color: '#0A0A0A',
          fontSize: '12px',
        }}
      >
        {label}
      </FormLabel>

      <TextField
        sx={{
          borderRadius: '20px',
          height: type === 'textarea' ? 'auto' : '44px',
          '& textarea': { height: '100% !important' },
          '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
            display: 'none',
          },
        }}
        id={id}
        label={placeholder ? '' : label}
        placeholder={placeholder}
        variant='outlined'
        disabled={disabled}
        value={value}
        type={type}
        error={Boolean(errors?.[name])}
        {...register(name)}
        {...otherProps}
        onKeyDown={onKeyDown}
        InputProps={{
          endAdornment: labelEnd && (
            <InputAdornment position='end'>{labelEnd}</InputAdornment>
          ),
          startAdornment: labelStart && (
            <InputAdornment position='start'>{labelStart}</InputAdornment>
          ),
        }}
      />

      {errors?.[name] && (
        <FormHelperText sx={{ color: 'red', mt: 1 }} id={name}>
          {errors[name]?.message}
        </FormHelperText>
      )}
    </FormControl>
  );
}

export default CustomInput;
