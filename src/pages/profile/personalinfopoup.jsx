/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Stack } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useQueryClient } from 'react-query';
import CustomInput from '../../components/controls/custom-input';
import PhoneInput from '../../components/controls/phone-input';
import { setServerErrors } from '../../helpers';
import ToastSuccess from '../../components/ToastSuccess';
import ToastError from '../../components/ToastError';
import ProfileApiEndpoints from '../../services/profile/api';

const PersonalInfoPopup = ({ setOpen, userData }) => {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);

  const schema = yup
    .object({
      first_name: yup.string().required(i18n.t('validation.required')),
      last_name: yup.string().required(i18n.t('validation.required')),
      phone: yup.string().required(i18n.t('validation.required')),
      email: yup
        .string()
        .email(i18n.t('validation.email'))
        .required(i18n.t('validation.required')),
    })
    .required();

  const defaultValues = useMemo(
    () => ({
      first_name: userData?.first_name || '',
      last_name: userData?.last_name || '',
      phone: userData?.phone || '',
      email: userData?.email || '',
    }),
    [userData]
  );
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, touchedFields, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const onSubmit = handleSubmit(async data => {
    const newData = { ...data, dail_code: '+966' };

    try {
      setLoading(true);
      await ProfileApiEndpoints.updateUserInfo(newData);

      ToastSuccess(t('profile.editSection.popupEdit.toastSuccess'));

      queryClient.invalidateQueries({ queryKey: ['profile'] });
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

  useEffect(() => {
    if (userData) {
      reset(defaultValues);
    }
  }, [userData, defaultValues, reset]);
  return (
    <Box
      my='1rem'
      noValidate
      autoComplete='off'
      onSubmit={handleSubmit(onSubmit)}
      component='form'
    >
      <Stack spacing={2} direction='row'>
        <CustomInput
          label={t('employees.addEmployee.labelFirstNM')}
          placeholder={t('employees.addEmployee.placeFirstNM')}
          register={register}
          name='first_name'
          errors={errors}
          touchedFields={touchedFields}
          type='text'
          id='first_name'
        />
        <CustomInput
          label={t('employees.addEmployee.labelLastNM')}
          placeholder={t('employees.addEmployee.placeLastNM')}
          register={register}
          name='last_name'
          errors={errors}
          touchedFields={touchedFields}
          type='text'
          id='last_name'
        />
      </Stack>
      <Stack spacing={1} direction='column' my='1.5rem'>
        <PhoneInput
          label={t('employees.addEmployee.labelPhone')}
          placeholder={t('employees.addEmployee.placePhone')}
          register={register}
          name='phone'
          errors={errors}
          touchedFields={touchedFields}
          type='number'
          id='phone'
        />
      </Stack>
      <Stack spacing={1} direction='column' my='1.5rem'>
        <CustomInput
          label={t('employees.addEmployee.labelEmail')}
          placeholder={t('employees.addEmployee.placeEmail')}
          register={register}
          name='email'
          errors={errors}
          touchedFields={touchedFields}
          type='email'
          id='email'
        />
      </Stack>

      <Stack direction='row' pt={2} spacing={2}>
        <LoadingButton
          variant='primary'
          disabled={!isValid}
          loading={loading}
          type='submit'
          sx={{ width: '100%' }}
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

export default PersonalInfoPopup;
