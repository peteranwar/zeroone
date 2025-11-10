import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tooltip,
  Stack,
  Typography,
} from '@mui/material';
import { Controller, useWatch } from 'react-hook-form';
import React from 'react';

const RulesAdmin = ({ roles, control }) => {
  const selectedRoleId = useWatch({ control, name: 'role_id' });

  return (
    <FormControl>
      <Controller
        name='role_id'
        control={control}
        render={({ field }) => (
          <RadioGroup
            {...field}
            aria-labelledby='demo-radio-buttons-group-label'
            sx={{ gap: 2 }}
            value={selectedRoleId ?? ''}
          >
            {roles.map(role => (
              <Box
                key={role.id}
                sx={{
                  p: '1rem',
                  borderRadius: '14px',
                  background: '#F3F6F9',
                  width: '100%',
                }}
              >
                <FormControlLabel
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontWeight: 600,
                      textTransform: 'capitalize',
                    },
                    '&.MuiFormControlLabel-root': { ml: 0 },
                  }}
                  value={role.id}
                  control={
                    <Radio
                      sx={{
                        color: '#737791',
                        '&.Mui-checked': {
                          color: '#EC1D23',
                          '& .MuiSvgIcon-root': {
                            borderRadius: '50%',
                            border: '6px solid #EC1D23',
                            backgroundColor: 'white',
                          },
                        },
                      }}
                    />
                  }
                  label={role.name}
                  labelPlacement='start'
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                />

                <Stack
                  sx={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  <Tooltip
                    title={role.permissions?.map(item => item?.name).join(' / ')}
                    placement='top-start'
                  >
                    <Typography variant='body2' sx={{ width: '90%' }}>
                      {role.permissions?.map(item => item?.name).join(' / ')}
                    </Typography>
                  </Tooltip>
                </Stack>
              </Box>
            ))}
          </RadioGroup>
        )}
      />
    </FormControl>
  );
};

export default RulesAdmin;
