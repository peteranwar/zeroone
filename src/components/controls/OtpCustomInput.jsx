/* eslint-disable consistent-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-return-assign */
import React, { useState, useRef, useEffect } from 'react';
import { ErrorMessage } from '@hookform/error-message';
import { Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

const OtpCustomInput = ({ name, errors, control, actionResend, initialTimer = 120 }) => {
  const { t } = useTranslation();
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(initialTimer);

  // ✅ العد التنازلي للمؤقت
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // ✅ إعادة ضبط المؤقت عند إعادة إرسال OTP
  const handleResend = () => {
    setTimer(initialTimer);
    actionResend();
  };

  // ✅ التعامل مع تغيير القيم داخل الإدخالات
  const handleChange = (index, event, field) => {
    const { value } = event.target;
    if (!/^\d*$/.test(value)) return;

    const otpArray = field.value ? field.value.split('') : new Array(5).fill('');
    otpArray[index] = value.substring(value.length - 1);

    field.onChange(otpArray.join(''));

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ✅ الرجوع عند مسح القيم
  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const renderButton = () => (
    <Box>
      {timer !== 0 ? (
        <Box
          sx={{
            display: 'flex',
            gap: '.5rem',
            width: '100%',
            justifyContent: 'center',
          }}
        >
          <Typography variant='body1' color='text.secondary'>
            {t('otp.again')}
          </Typography>
          <Typography variant='body1' color='initial'>
            {timer}
          </Typography>
          <Typography variant='body1' color='initial'>
            {t('otp.sec')}
          </Typography>
        </Box>
      ) : (
        <Button
          onClick={handleResend}
          sx={{ color: 'primary.main', textDecoration: 'underline' }}
        >
          {t('otp.resend')}
        </Button>
      )}
    </Box>
  );

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: t('otp.required') }}
      render={({ field }) => (
        <Box>
          <Box
            className='otp-input-container'
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: '1rem',
              gap: '10px',
              '& input': {
                width: '50px !important',
                height: '48px !important',
                background: '#F3F6F9',
                borderRadius: '14px !important',
                border: '0px solid #BFC7CE !important',
                textAlign: 'center',
                fontSize: '20px',
              },
            }}
          >
            {[...Array(5)].map((_, index) => (
              <input
                key={index}
                type='text'
                value={field.value ? field.value[index] || '' : ''}
                onChange={event => handleChange(index, event, field)}
                onKeyDown={event => handleKeyDown(index, event)}
                ref={el => (inputRefs.current[index] = el)}
                maxLength='1'
              />
            ))}
          </Box>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              margin: '1rem 0 .5rem',
            }}
          >
            {renderButton()}
          </Box>
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <Typography variant='subtitle2' sx={{ color: 'red', mb: '-.5rem' }}>
                {message}
              </Typography>
            )}
          />
        </Box>
      )}
    />
  );
};

export default OtpCustomInput;
