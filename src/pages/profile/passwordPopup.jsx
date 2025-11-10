/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Box, Button, Stack } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import InputPassword from '../../components/controls/InputPassword';
import { setServerErrors } from '../../helpers';
import ToastSuccess from '../../components/ToastSuccess';
import ToastError from '../../components/ToastError';
import ProfileApiEndpoints from '../../services/profile/api';

const PasswordPopup = ({ setOpen }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const schema = yup
    .object({
      current_password: yup.string().required(() => i18n.t('validation.required')),
      password: yup.string().required(i18n.t('validation.required')),
      password_confirmation: yup
        .string()
        .required(i18n.t('validation.passConfirm'))
        .oneOf([yup.ref('password')], 'Passwords must match'),
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

  const onSubmit = handleSubmit(async data => {
    try {
      setLoading(true);
      await ProfileApiEndpoints.updateUserPassword(data);

      ToastSuccess(t('profile.passwordSection.popupEdit.toastSuccess'));
      setOpen(false);
    } catch (error) {
      if (error?.response?.status === 422) {
        setServerErrors(error.response.data.errors, setError);
      } else {
        ToastError(error?.response?.data?.message || t('validation.toastError'));
      }
    } finally {
      setLoading(false);
    }
  });
  return (
    <Box
      my='1rem'
      noValidate
      autoComplete='off'
      onSubmit={handleSubmit(onSubmit)}
      component='form'
      sx={{ '& .MuiSvgIcon-root': { fill: '#130F26' } }}
    >
      <Stack spacing={1} direction='column' my='.15rem'>
        <Stack spacing={1} direction='column' my='1.5rem'>
          <InputPassword
            label={t('profile.passwordSection.popupEdit.labelCurrentPass')}
            placeholder={t('profile.passwordSection.popupEdit.placeCurrentPass')}
            register={register}
            name='current_password'
            errors={errors}
            touchedFields={touchedFields}
            type='password'
            id='current_password'
          />
        </Stack>
      </Stack>
      <Stack spacing={1} direction='column' my='1.5rem'>
        <InputPassword
          label={t('profile.passwordSection.popupEdit.labelNewPass')}
          placeholder={t('profile.passwordSection.popupEdit.placeNewPass')}
          register={register}
          name='password'
          errors={errors}
          touchedFields={touchedFields}
          type='password'
          id='password'
        />
      </Stack>
      <Stack spacing={1} direction='column' my='1.5rem'>
        <InputPassword
          label={t('profile.passwordSection.popupEdit.labelConfirmPass')}
          placeholder={t('profile.passwordSection.popupEdit.placeNewPass')}
          register={register}
          name='password_confirmation'
          errors={errors}
          touchedFields={touchedFields}
          type='password'
          id='password_confirmation'
        />
      </Stack>

      <Stack direction='row' pt={2} spacing={2}>
        <LoadingButton
          loading={loading}
          type='submit'
          sx={{ width: '100%' }}
          variant='primary'
        >
          {t('profile.update')}
        </LoadingButton>
        <Button
          variant='black'
          sx={{ width: '100%', color: '#737791' }}
          onClick={() => setOpen(false)}
        >
          {t('shard.cancel')}
        </Button>
      </Stack>
    </Box>
  );
};

export default PasswordPopup;
