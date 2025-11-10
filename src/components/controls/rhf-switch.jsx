import { Controller } from 'react-hook-form';
import Switch from '@mui/material/Switch';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function RHFSwitch({
  name,
  control,
  helperText,
  label,
  checkedColor = 'secondary',
  uncheckedColor = 'default',
  labelPlacement = 'top',
  ...other
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <FormControlLabel
            label={label}
            labelPlacement={labelPlacement}
            sx={{
              '& .MuiTypography-root': { fontWeight: 600, fontSize: '12px' },
              ml: 0,
            }}
            control={
              <Switch
                {...field}
                checked={!!field.value}
                color={field.value ? checkedColor : uncheckedColor}
                {...other}
              />
            }
          />

          {(!!error || helperText) && (
            <FormHelperText error={!!error}>
              {error ? error?.message : helperText}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}
