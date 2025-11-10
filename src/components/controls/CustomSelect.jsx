import {
  Autocomplete,
  FormControl,
  FormHelperText,
  FormLabel,
  InputAdornment,
  TextField,
} from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';

const CustomSelect = ({
  label,
  placeholder,
  control,
  name,
  errors,
  options,
  disabled,
  onChange,
  icon,
}) => {
  return (
    <FormControl fullWidth error={Boolean(errors?.[name])}>
      {/* Label */}
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

      {/* Select / Autocomplete */}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Autocomplete
            {...field}
            options={options || []}
            getOptionLabel={option => option?.name || ''}
            isOptionEqualToValue={(option, value) => option?.id === value}
            onChange={(_, newValue) => {
              field.onChange(newValue?.id || '');
              if (onChange) onChange(newValue); // ← هنا أرسل الـ object كله
            }}
            value={options.find(option => option.id === field.value) || null}
            disabled={disabled}
            renderInput={params => (
              <TextField
                {...params}
                placeholder={placeholder}
                variant='outlined'
                sx={{
                  background: '#F3F6F9',
                  borderRadius: '12px',
                  height: '50px',
                  '& .MuiOutlinedInput-root': {
                    border: errors?.[name] ? '1px solid red' : '0',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent',
                  },
                  '& .Mui-disabled': { borderColor: 'transparent' },
                }}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: icon ? (
                    <InputAdornment position='start'>{icon}</InputAdornment>
                  ) : null,
                }}
              />
            )}
          />
        )}
      />

      {/* Error Message */}
      {errors?.[name] && (
        <FormHelperText sx={{ color: 'red', mt: 0.5 }}>
          {errors[name]?.message}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default CustomSelect;
