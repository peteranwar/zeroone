/* eslint-disable no-restricted-globals */
import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FormControl, FormLabel, TextField, FormHelperText } from '@mui/material';
import { Controller } from 'react-hook-form';
import { format } from 'date-fns';

const CustomDate = ({ label, placeholder, name, control, errors, id, disabled }) => {
  return (
    <FormControl fullWidth>
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

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DatePicker
            {...field}
            id={id}
            disabled={disabled}
            value={field.value ? new Date(field.value) : null}
            onChange={date => {
              if (date instanceof Date && !isNaN(date)) {
                field.onChange(format(date, 'yyyy-MM-dd'));
              } else {
                field.onChange(null);
              }
            }}
            renderInput={params => (
              <TextField
                {...params}
                placeholder={placeholder}
                error={Boolean(errors?.[name])}
                sx={{
                  borderRadius: '20px',
                  height: '44px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                  },
                }}
              />
            )}
          />
        )}
      />

      {errors?.[name] && (
        <FormHelperText sx={{ color: 'red', mt: 1 }} id={name}>
          {errors[name]?.message}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default CustomDate;
