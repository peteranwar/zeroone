/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid, Stack, Typography } from '@mui/material';
import i18n from 'i18next';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { LoadingButton } from '@mui/lab';
import { useQueryClient } from 'react-query';
import CustomInput from '../../components/controls/custom-input';
import CustomDiscounts from '../../components/settings-page/CustomDiscounts';
import ToastError from '../../components/ToastError';
import ToastSuccess from '../../components/ToastSuccess';
import { permissions, usePermission } from '../../constants';
import { setServerErrors } from '../../helpers';
import SettingsApiEndpoints from '../../services/settings/api';
import { useGetSettings } from '../../services/settings/query';

const GeneralSettingsInfo = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { data: settingsData } = useGetSettings();
  const { haveAccess } = usePermission();
  const hasUpdateAccess = haveAccess(permissions.setting.update);

  const schema = yup
    .object({
      discounts: yup.array().required(() => i18n.t('validation.required')),
      min_payment: yup
        .string()
        .required(() => i18n.t('validation.required'))
        .test(
          'min-payment-range',
          () => i18n.t('setting.settingInfo.errorDiscountMax', { min: 1, max: 100 }),
          value => {
            const num = Number(value);
            return num >= 1 && num <= 100;
          }
        ),
      max_payment: yup
        .string()
        .required(() => i18n.t('validation.required'))
        .test(
          'max-payment-range',
          () => i18n.t('setting.settingInfo.errorDiscountMax', { min: 1, max: 100 }),
          value => {
            const num = Number(value);
            return num >= 1 && num <= 100;
          }
        ),
    })
    .required();

  const defaultValues = useMemo(
    () => ({
      min_payment: Number(settingsData?.data?.min_payment) || '',
      max_payment: Number(settingsData?.data?.max_payment) || '',
      discounts: settingsData?.data?.discounts || '',
    }),
    [settingsData]
  );

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    setValue,
    reset,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: {
      discounts: [],
    },
  });

  useEffect(() => {
    if (settingsData) {
      reset(defaultValues);
    }
  }, [settingsData, defaultValues, reset]);

  const discounts = watch('discounts') || [];

  const onSubmit = handleSubmit(async data => {
    try {
      setLoading(true);

      // data.discounts.forEach((val, index) => {
      //   data[`discounts[${index}]`] = val;
      // });
      // delete data.discounts;


      await SettingsApiEndpoints.addSetting(data);
      ToastSuccess(t('setting.settingInfo.toastSuccess'));
      queryClient.invalidateQueries({ queryKey: ['settings'] });
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
      component='form'
      sx={{
        width: '100%',
        flexGrow: 1,
      }}
      noValidate
      autoComplete='off'
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography variant='h5' sx={{ textTransform: 'uppercase' }}>
        {t('setting.labelSettings')}
      </Typography>

      <Grid container mt={2} spacing={3}>
        <Grid item xs={12}>
          <Typography
            variant='body1'
            sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600 }}
          >
            {t('setting.settingInfo.discounts')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <CustomDiscounts
            discounts={discounts}
            setValue={setValue}
            setError={setError}
            clearErrors={clearErrors}
            errors={errors}
            register={register}
            watch={watch}
            hasUpdateAccess={hasUpdateAccess}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography
            variant='body1'
            sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600 }}
          >
            {t('setting.settingInfo.payment')}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomInput
            label={t('setting.settingInfo.labelMin')}
            placeholder={t('setting.settingInfo.placeMin')}
            register={register}
            name='min_payment'
            errors={errors}
            touchedFields={touchedFields}
            type='number'
            labelEnd='%'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomInput
            label={t('setting.settingInfo.labelMax')}
            placeholder={t('setting.settingInfo.placeMax')}
            register={register}
            name='max_payment'
            errors={errors}
            touchedFields={touchedFields}
            type='number'
            labelEnd='%'
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack pt={5} direction='row' spacing={2.5}>
            <LoadingButton
              type='submit'
              variant='contained'
              fullWidth
              loading={loading}
              disabled={!hasUpdateAccess}
            >
              {t('shard.save')}
            </LoadingButton>
            {/* <Button variant='outlined' fullWidth onClick={() => reset()}>
              {t('shard.cancel')}
            </Button> */}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GeneralSettingsInfo;
