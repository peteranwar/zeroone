import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

import LoadingButton from '@mui/lab/LoadingButton';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';

import { Box, Stack, Typography } from '@mui/material';
import AuthApiEndpoints from '../../services/auth.api';
import { setServerErrors } from '../../helpers';
import ToastError from '../../components/ToastError';
import ToastSuccess from '../../components/ToastSuccess';
import InputPassword from '../../components/controls/InputPassword';

const NewPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const schema = yup
    .object({
      password: yup.string().required(i18n.t('validation.required')),
      password_confirmation: yup
        .string()
        .required(i18n.t('validation.required'))
        .oneOf([yup.ref('password'), null], i18n.t('validation.passConfirmError')),
    })
    .required();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, touchedFields, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const onSubmit = async data => {
    setLoading(true);

    const requestData = {
      ...data,
      email: location.state?.email,
      otp: location.state?.otp,
    };

    return AuthApiEndpoints.resetPassword(requestData)
      .then(() => {
        setLoading(false);
        ToastSuccess(t('resetPassword.toastSuccess'));
        navigate('/login');
      })
      .catch(error => {
        setLoading(false);

        if (error?.response?.status === 422) {
          const responseErrors = error.response.data.errors;
          setServerErrors(responseErrors, setError);
        } else {
          ToastError(error || t('validation.toastError'));
        }
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
        noValidate
        autoComplete='off'
        onSubmit={handleSubmit(onSubmit)}
        component='form'
        sx={{ width: { xs: '85%', sm: '45%', md: '30%', lg: '25%' } }}
        spacing={3}
      >
        <Stack spacing={0.5}>
          <Typography variant='h3'>{t('resetPassword.title')}</Typography>
          <Typography
            variant='body2'
            sx={{ color: theme => theme.palette.text.secondary }}
          >
            {t('resetPassword.desc')}
          </Typography>
        </Stack>
        <InputPassword
          label={t('resetPassword.labelPass')}
          placeholder={t('login.placePassword')}
          register={register}
          name='password'
          errors={errors}
          touchedFields={touchedFields}
          type='password'
          id='password'
        />

        <InputPassword
          label={t('resetPassword.labelConfirmPass')}
          placeholder={t('login.placePassword')}
          register={register}
          name='password_confirmation'
          errors={errors}
          touchedFields={touchedFields}
          type='password'
          id='password_confirmation'
        />
        <Box pt={2}>
          <LoadingButton
            disabled={!isValid}
            loading={loading}
            type='submit'
            variant='primary'
            fullWidth
          >
            {t('resetPassword.submit')}
          </LoadingButton>
        </Box>

        <Typography
          variant='body1'
          textAlign='center'
          sx={{ color: theme => theme.palette.text.secondary }}
        >
          {t('forgetPassword.back')}
          {'  '}
          <Typography
            variant='body1'
            component={Link}
            sx={{ color: theme => theme.palette.common.primary }}
            to='/login'
          >
            {t('forgetPassword.signIn')}
          </Typography>
        </Typography>
      </Stack>
    </Stack>
  );
};

export default NewPassword;
