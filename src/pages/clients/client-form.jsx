/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Grid } from '@mui/material';
import i18n from 'i18next';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import * as yup from 'yup';
import ToastError from '../../components/ToastError';
import ToastSuccess from '../../components/ToastSuccess';
import CustomSelect from '../../components/controls/CustomSelect';
import CustomInput from '../../components/controls/custom-input';
import RHFSwitch from '../../components/controls/rhf-switch';
import { setServerErrors } from '../../helpers';
import ClientsApiEndpoints from '../../services/clients/api';
import { useGetReferrals } from '../../services/shard/query';

const ClientForm = ({ setOpen, clientData }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const { data: referrals } = useGetReferrals();
  const referralsData = useMemo(() => {
    return (
      referrals?.data?.map(pos => ({
        id: pos.id,
        name: i18n.language === 'ar' ? pos.name.ar : pos.name.en,
      })) || []
    );
  }, [i18n.language, referrals?.data]);

  const schema = yup
    .object({
      name: yup.string().required(() => i18n.t('validation.required')),
      phone: yup.string().required(() => i18n.t('validation.required')),
      referral_id: yup.string().required(() => i18n.t('validation.required')),
      email: yup
        .string()
        .email(() => i18n.t('validation.email'))
        .nullable(),
      is_business: yup.boolean(),

      vat_no: yup.string().when('is_business', {
        is: true,
        then: schema => schema.required(i18n.t('validation.required')),
        otherwise: schema => schema.notRequired(),
      }),

      address: yup.string().when('is_business', {
        is: true,
        then: schema => schema.required(i18n.t('validation.required')),
        otherwise: schema => schema.notRequired(),
      }),
    })
    .required();

  const defaultValues = useMemo(
    () => ({
      name: clientData?.name || '',
      phone: clientData?.phone || '',
      referral_id: clientData?.referral_id || '',
      email: clientData?.email || '',
      is_business: clientData?.is_business || false,
      vat_no: clientData?.vat_no || '',
      address: clientData?.address || '',
    }),
    [clientData]
  );

  const {
    control,
    register,
    handleSubmit,
    setError,
    getValues,
    watch,
    reset,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const isBusiness = watch('is_business');

  useEffect(() => {
    if (clientData) {
      reset(defaultValues);
    }
  }, [clientData, defaultValues, reset]);

  const onSubmit = handleSubmit(async data => {
    const formatData = {
      ...data,
      _method: 'put',
      is_business: data.is_business === true ? 1 : 0,
    };
    try {
      setLoading(true);
      await ClientsApiEndpoints.updateClient(clientData.id, formatData);
      ToastSuccess(t('client.editForm.toastSuccessEdit'));

      queryClient.invalidateQueries({ queryKey: ['clients'] });
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

  function handleCloseModal() {
    setOpen(false);
    reset()
  }

  return (
    <Box
      component='form'
      sx={{ width: '100%' }}
      noValidate
      autoComplete='off'
      onSubmit={handleSubmit(onSubmit)}
    >
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12} md={12}>
          <CustomInput
            label={t('client.editForm.labelName')}
            placeholder={t('client.editForm.placeName')}
            register={register}
            name='name'
            errors={errors}
            touchedFields={touchedFields}
            type='text'
            id='name'
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <CustomInput
            label={t('client.editForm.labelPhone')}
            placeholder={t('client.editForm.placePhone')}
            register={register}
            name='phone'
            errors={errors}
            touchedFields={touchedFields}
            type='number'
            id='nameAr'
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <CustomInput
            label={t('client.editForm.labelEmail')}
            placeholder={t('client.editForm.placeEmail')}
            register={register}
            name='email'
            errors={errors}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <CustomSelect
            label={t('client.editForm.labelReferral')}
            placeholder={t('client.editForm.placeReferral')}
            name='referral_id'
            control={control}
            errors={errors}
            options={referralsData || []}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <RHFSwitch
            name='is_business'
            control={control}
            label={t('orders.create.business')}
            defaultValues={0}
            checkedColor='success'
          />
        </Grid>
        {isBusiness && (
          <>
            <Grid item xs={12} md={12}>
              <CustomInput
                label={t('orders.create.labelVat')}
                placeholder={t('orders.create.placeVat')}
                name='vat_no'
                register={register}
                errors={errors}
                type='number'
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <CustomInput
                label={t('orders.create.labelAddress')}
                placeholder={t('orders.create.placeAddress')}
                name='address'
                register={register}
                errors={errors}
              />
            </Grid>
          </>
        )}

        <Grid item xs={6} md={6}>
          <LoadingButton type='submit' variant='primary' loading={loading} fullWidth>
            {t('shard.edit')}
          </LoadingButton>
        </Grid>
        <Grid item xs={6} md={6}>
          <Button variant='black' sx={{ width: '100%' }} onClick={() => handleCloseModal()}>
            {t('shard.cancel')}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClientForm;
