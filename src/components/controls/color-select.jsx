import {
  Autocomplete,
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import { colorList } from '../../constants';

const ColorSelectAutocomplete = ({
  name,
  control,
  label,
  placeholder,
  errors,
  disabled,
}) => {
  return (
    <FormControl fullWidth error={Boolean(errors?.[name])}>
      {label && (
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
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Autocomplete
            options={colorList}
            getOptionLabel={option => option.name || ''}
            isOptionEqualToValue={(option, value) => option.value === value?.value}
            onChange={(_, newValue) => field.onChange(newValue?.value || '')}
            value={colorList.find(color => color.value === field.value) || null}
            disabled={disabled}
            renderOption={(props, option) => (
              <Box component='li' {...props} display='flex' alignItems='center'>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    backgroundColor: option.value,
                    borderRadius: '4px',
                    marginRight: 1,
                    border: '1px solid #ccc',
                  }}
                />
                <Typography>{option.name}</Typography>
              </Box>
            )}
            renderInput={params => (
              <TextField
                {...params}
                placeholder={placeholder || 'Select'}
                sx={{
                  background: '#F3F6F9',
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-root': {
                    border: errors?.[name] ? '1px solid red' : '0',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent',
                  },
                }}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: field.value ? (
                    <InputAdornment position='start'>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          backgroundColor: field.value,
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                          marginRight: 0,
                        }}
                      />
                    </InputAdornment>
                  ) : null,
                }}
              />
            )}
          />
        )}
      />

      {errors?.[name] && <FormHelperText>{errors[name]?.message}</FormHelperText>}
    </FormControl>
  );
};

export default ColorSelectAutocomplete;
