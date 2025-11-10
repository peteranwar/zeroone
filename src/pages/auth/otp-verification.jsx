/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingButton from '@mui/lab/LoadingButton';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Stack, Typography } from '@mui/material';
import * as yup from 'yup';
import { useLocation, useNavigate } from 'react-router';
import OTPInput from 'react-otp-input';
import AuthApiEndpoints from '../../services/auth.api';
import { setServerErrors } from '../../helpers';
import ToastError from '../../components/ToastError';
import ToastSuccess from '../../components/ToastSuccess';

const OTPVerification = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(120);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const otpSchema = yup.object().shape({
    otp: yup
      .string()
      .length(5, i18n.t('validation.otp'))
      .required(i18n.t('validation.required')),
  });

  const {
    handleSubmit,
    setError,
    formState: { errors, isValid },
    control,
  } = useForm({
    resolver: yupResolver(otpSchema),
    mode: 'all',
  });

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleResend = useCallback(() => {
    AuthApiEndpoints.forgetPassword({ email })
      .then(() => {
        setTimer(120);
        ToastSuccess(t('forgetPassword.toastSuccess'));
      })
      .catch(error => {
        if (error?.response?.data.code === 422) {
          const responseErrors = error.response.data.errors;
          setServerErrors(responseErrors, setError);
        } else {
          ToastError(error || t('validation.toastError'));
        }
      });
  }, [email, setError, t]);

  const onSubmit = async data => {
    setLoading(true);
    AuthApiEndpoints.confirmOtp({
      email,
      otp: data?.otp,
    })
      .then(() => {
        ToastSuccess(t('otp.toastSuccess'));
        navigate('/new-password', { state: { email, otp: data.otp } });
      })
      .catch(error => {
        if (error?.response?.data.code === 422) {
          const responseErrors = error.response.data.errors;
          setServerErrors(responseErrors, setError);
        } else {
          ToastError(error || t('validation.toastError'));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Stack
      sx={{
        background: 'white',
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Stack
        component='form'
        onSubmit={handleSubmit(onSubmit)}
        sx={{ width: { xs: '85%', sm: '45%', md: '35%', lg: '22%' } }}
        spacing={3}
      >
        <Stack spacing={0.5}>
          <Typography variant='h3'>{t('otp.title')}</Typography>
          <Typography
            variant='body2'
            sx={{ color: theme => theme.palette.text.secondary, textAlign: 'center' }}
          >
            {t('otp.desc')}
          </Typography>
        </Stack>

        {/* OTP Input */}
        <Controller
          name='otp'
          control={control}
          render={({ field }) => (
            <OTPInput
              {...field}
              numInputs={5}
              shouldAutoFocus
              value={field.value}
              onChange={value => field.onChange(value)}
              renderSeparator={() => null}
              containerStyle={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
              }}
              renderInput={props => (
                <input
                  {...props}
                  type='number'
                  style={{
                    textAlign: 'center',
                    width: '50px',
                    height: '48px',
                    borderRadius: '14px',
                    border: `1px solid transparent`,
                    background: '#F3F6F9',
                  }}
                />
              )}
            />
          )}
        />
        {errors.otp && (
          <Typography color='error' textAlign='center'>
            {errors.otp.message}
          </Typography>
        )}

        <LoadingButton
          disabled={!isValid}
          loading={loading}
          type='submit'
          variant='contained'
          fullWidth
          sx={{ mt: 2 }}
        >
          {t('otp.btn')}
        </LoadingButton>

        {/* Timer or Resend OTP */}
        <Typography textAlign='center'>
          {timer > 0 ? (
            <Typography
              variant='body1'
              sx={{ color: theme => theme.palette.text.secondary }}
            >
              {t('otp.timer')} {timer}
              {t('otp.s')}
            </Typography>
          ) : (
            <Typography
              variant='body1'
              textAlign='center'
              sx={{
                color: theme => theme.palette.text.secondary,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                justifyContent: 'center',
              }}
            >
              {t('otp.receive')}
              <Button
                sx={{
                  color: theme => theme.palette.common.primary,
                  p: 0,
                  ':hover': { background: 'transparent' },
                }}
                onClick={handleResend}
              >
                {t('otp.resend')}
              </Button>
            </Typography>
          )}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default OTPVerification;
