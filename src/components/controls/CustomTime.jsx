import { FormControl, TextField } from '@mui/material';
import React from 'react';

const CustomTime = ({
    errors,
    id,
    checked,
    onChange,
    value
}) => {
    const inputProps = {
        step: 300,
    };
    return (
        <FormControl>
            <TextField
                sx={{ borderRadius: '20px', height: '50px' }}
                id={id}
                // label={placeholder ? '' : label}
                // placeholder={placeholder}
                variant='outlined'
                value={value}
                type='time'
                error={errors}
                inputProps={inputProps}
                onChange={onChange}
                disabled={!checked}
            />

        </FormControl>
    );
};

export default CustomTime;
