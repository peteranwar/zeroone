/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Box } from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CustomInput from './custom-input';
import { inputPassword } from '../../pages/profile/style';

const InputPassword = ({
  label,
  placeholder,
  register,
  name,
  errors,
  touchedFields,
  type,
  id,
}) => {
  const [showPassword, setShowPassword] = useState('password');
  const togglePassword = () => {
    if (showPassword === 'password') {
      setShowPassword('text');
    } else {
      setShowPassword('password');
    }
  };
  return (
    <div className='input-password'>
      <Box sx={{ position: 'relative' }}>
        <CustomInput
          label={label}
          placeholder={placeholder}
          register={register}
          name={name}
          errors={errors}
          touchedFields={touchedFields}
          type={showPassword}
          id={id}
        />
        <VisibilityOffIcon onClick={() => togglePassword()} sx={inputPassword} />
      </Box>
    </div>
  );
};

export default InputPassword;
