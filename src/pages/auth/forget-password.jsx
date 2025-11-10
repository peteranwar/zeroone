import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import LoadingButton from '@mui/lab/LoadingButton';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { Stack, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AuthApiEndpoints from '../../services/auth.api';
import ToastSuccess from '../../components/ToastSuccess';
import { setServerErrors } from '../../helpers';
import ToastError from '../../components/ToastError';
import CustomInput from '../../components/controls/custom-input';

const ForgetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const schema = yup
    .object({
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

    AuthApiEndpoints.forgetPassword(data)
      .then(() => {
        setLoading(false);
        ToastSuccess(t('forgetPassword.toastSuccess'));

        navigate('/otp-verification', { state: { email: data.email } });
      })
      .catch(error => {
        setLoading(false);
        if (error?.response?.status === 422) {
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
        sx={{ width: { xs: '85%', sm: '45%', md: '30%', lg: '25%' } }}
        noValidate
        autoComplete='off'
        onSubmit={handleSubmit(onSubmit)}
        component='form'
        spacing={{ xs: 3, sm: 5 }}
      >
        <Stack spacing={0.5}>
          <Typography variant='h3'>{t('forgetPassword.title')}</Typography>
          <Typography
            variant='body2'
            sx={{ color: theme => theme.palette.text.secondary }}
          >
            {t('forgetPassword.desc')}
          </Typography>
        </Stack>

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

        <LoadingButton
          disabled={!isValid}
          loading={loading}
          type='submit'
          variant='primary'
          fullWidth
          sx={{ mt: 3 }}
        >
          {t('forgetPassword.btn')}
        </LoadingButton>

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

export default ForgetPassword;
