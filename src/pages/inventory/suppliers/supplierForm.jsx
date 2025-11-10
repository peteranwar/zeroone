/* eslint-disable react/no-array-index-key */
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Grid } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import * as yup from 'yup';
import ToastError from '../../../components/ToastError';
import ToastSuccess from '../../../components/ToastSuccess';
import CustomInput from '../../../components/controls/custom-input';
import PhoneInput from '../../../components/controls/phone-input';
import { setServerErrors } from '../../../helpers';
import SuppliersApiEndpoints from '../../../services/inventory/suppliers/api';
import { useGetSupplierId } from '../../../services/inventory/suppliers/query';

const SupplierForm = ({ id, setOpen }) => {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();

  const { data: itemData } = useGetSupplierId(id);
  const [loading, setLoading] = useState(false);

  const schema = yup.object({
    nameEn: yup.string().required(() => i18n.t('validation.required')),
    phone: yup.string().required(() => i18n.t('validation.required')),
    address: yup.string().required(() => i18n.t('validation.required')),
    vat_no: yup.string().required(() => i18n.t('validation.required')),
  });

  const defaultValues = useMemo(
    () => ({
      nameEn: itemData?.data?.name?.en || '',
      phone: itemData?.data?.phone || '',
      address: itemData?.data?.address || '',
      vat_no: itemData?.data?.vat_no || '',
    }),
    [itemData]
  );

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  useEffect(() => {
    if (id) {
      reset(defaultValues);
    }
  }, [itemData, defaultValues, id, reset]);

  const onSubmit = handleSubmit(async data => {
    const newData = {
      ...data,
      name: {
        en: data.nameEn,
      },
    };
    try {
      setLoading(true);
      const apiCall = id
        ? SuppliersApiEndpoints.editSupplier(id, { ...newData, _method: 'put' })
        : SuppliersApiEndpoints.addSupplier(newData);
      await apiCall;
      ToastSuccess(
        t(id ? 'inventory.suppliers.editToast' : 'inventory.suppliers.addToast')
      );
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
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
    <Box component='form' noValidate onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CustomInput
            label={t('inventory.suppliers.labelNameEn')}
            placeholder={t('inventory.suppliers.PlaceName')}
            register={register}
            name='nameEn'
            errors={errors}
            touchedFields={touchedFields}
          />
        </Grid>
        <Grid item xs={12}>
          <PhoneInput
            label={t('inventory.suppliers.labelPhone')}
            placeholder={t('inventory.suppliers.PlacePhone')}
            register={register}
            name='phone'
            errors={errors}
            touchedFields={touchedFields}
            type='number'
            id='phone'
          />
        </Grid>
        <Grid item xs={12}>
          <CustomInput
            label={t('inventory.suppliers.vat')}
            placeholder={t('inventory.suppliers.vat')}
            register={register}
            name='vat_no'
            errors={errors}
            type='text'
            touchedFields={touchedFields}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomInput
            label={t('inventory.warehouse.labelAddress')}
            placeholder={t('inventory.warehouse.PlaceAddress')}
            register={register}
            name='address'
            errors={errors}
            touchedFields={touchedFields}
          />
        </Grid>

        <Grid item xs={6} mt={3}>
          <LoadingButton type='submit' loading={loading} variant='primary' fullWidth>
            {id ? t('shard.edit') : t('shard.add')}
          </LoadingButton>
        </Grid>
        <Grid item xs={6} mt={3}>
          <Button variant='black' fullWidth onClick={() => handleCloseModal()}>
            {t('shard.cancel')}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SupplierForm;
