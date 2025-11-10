import React, { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useDispatch } from 'react-redux';
import CustomInput from '../../components/controls/custom-input';
import InputPassword from '../../components/controls/InputPassword';
import { setServerErrors } from '../../helpers';
import AuthApiEndpoints from '../../services/auth.api';
import ToastError from '../../components/ToastError';
import MainImg from '../../components/MainImg';
import { setUserPermission } from '../../store/slices/userSlice';

const LogIn = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const schema = yup
    .object({
      password: yup.string().required(i18n.t('validation.required')),
      email: yup
        .string()
        .email(i18n.t('validation.email'))
        .required(i18n.t('validation.required')),
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

    return AuthApiEndpoints.login(data)
      .then(res => {
        dispatch(setUserPermission(res.data?.user?.permissions));
        localStorage.setItem(
          'userPermissions',
          JSON.stringify(res.data?.user?.permissions)
        );
        setLoading(false);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('loginTime', new Date().getTime().toString());
        navigate('/');
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
      <Box
        sx={{ width: { xs: '85%', sm: '45%', md: '30%', lg: '25%' } }}
        noValidate
        autoComplete='off'
        onSubmit={handleSubmit(onSubmit)}
        component='form'
      >
        <MainImg name='logo.png' alt='skip-it logo' width={141} height={37} />
        <Typography variant='h3' mt={2}>
          {t('login.title')}
        </Typography>
        <Typography variant='body2' sx={{ color: theme => theme.palette.text.secondary }}>
          {t('login.desc')}
        </Typography>
        <Stack spacing={2} direction='column' my='1.5rem'>
          <CustomInput
            label={t('login.labelEmail')}
            placeholder={t('login.placeEmail')}
            register={register}
            name='email'
            errors={errors}
            touchedFields={touchedFields}
            type='email'
            id='email'
          />
        </Stack>
        <Stack spacing={1} direction='column' my='1.5rem'>
          <InputPassword
            label={t('login.labelPassword')}
            placeholder={t('login.placePassword')}
            register={register}
            name='password'
            errors={errors}
            touchedFields={touchedFields}
            type='password'
            id='password'
          />

          <Box textAlign='right' margin='auto' pt={1}>
            <Link to='/forget-password' style={{ fontSize: '12px', fontWeight: '600' }}>
              {t('login.forgetPass')}
            </Link>
          </Box>
        </Stack>
        <Box textAlign='center'>
          <LoadingButton
            disabled={!isValid}
            loading={loading}
            type='submit'
            variant='primary'
            fullWidth
            sx={{ mt: 2 }}
          >
            {t('login.btnLogin')}
          </LoadingButton>
        </Box>
      </Box>
    </Stack>
  );
};

export default LogIn;
