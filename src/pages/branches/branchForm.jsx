/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Grid, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import * as yup from 'yup';
import CustomInput from '../../components/controls/custom-input';
import CustomSelect from '../../components/controls/CustomSelect';
import RHFSwitch from '../../components/controls/rhf-switch';
import ToastError from '../../components/ToastError';
import ToastSuccess from '../../components/ToastSuccess';
import { setServerErrors } from '../../helpers';
import BranchesApiEndpoints from '../../services/branches/api';
import { useGetBranchId } from '../../services/branches/query';
import { useGetCities } from '../../services/shard/query';

const BranchForm = ({ id, setOpen }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();

  const { data: citiesData } = useGetCities({
    with: 'districts',
    },
    i18n.language
  );
  
  const { data: branchIdData } = useGetBranchId(id);

  const schema = yup
    .object({
      nameEn: yup.string().required(() => i18n.t('validation.required')),
      nameAr: yup.string().required(() => i18n.t('validation.required')),
      city_id: yup.string().required(() => i18n.t('validation.required')),
      district_id: yup.string().required(() => i18n.t('validation.required')),
    })
    .required();

  const defaultValues = useMemo(
    () => ({
      nameEn: branchIdData?.data?.name?.en || '',
      nameAr: branchIdData?.data?.name?.ar || '',
      city_id: branchIdData?.data?.city?.id || '',
      district_id: branchIdData?.data?.district?.id || '',
      status: branchIdData?.data?.status === 'active',
    }),
    [branchIdData]
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

  const status = watch('status');
  const cityId = watch('city_id');
  const districtsOptions = cityId
    ? citiesData?.data.find(city => city.id === Number(cityId))?.districts || []
    : [];

  useEffect(() => {
    if (id) {
      reset(defaultValues);
    }
  }, [branchIdData, defaultValues, id, reset]);

  const onSubmit = handleSubmit(async data => {
    try {
      setLoading(true);
      const formattedData = {
        ...data,
        status: data.status ? 'active' : 'inactive',
        name: {
          en: data.nameEn,
          ar: data.nameAr,
        },
      };
      const apiCall = id
        ? BranchesApiEndpoints.editBranch(id, { ...formattedData, _method: 'put' })
        : BranchesApiEndpoints.addBranch(formattedData);

      await apiCall;
      ToastSuccess(
        t(
          id
            ? 'branches.addBranch.toastSuccessEdit'
            : 'branches.addBranch.toastSuccessAdd'
        )
      );

      queryClient.invalidateQueries({ queryKey: ['branches'] });
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
            label={t('branches.addBranch.labelNameEn')}
            placeholder={t('branches.addBranch.placeName')}
            register={register}
            name='nameEn'
            errors={errors}
            touchedFields={touchedFields}
            type='text'
            id='nameEn'
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <CustomInput
            label={t('branches.addBranch.labelNameAr')}
            placeholder={t('branches.addBranch.placeName')}
            register={register}
            name='nameAr'
            errors={errors}
            touchedFields={touchedFields}
            type='text'
            id='nameAr'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomSelect
            placeholder={t('branches.addBranch.city')}
            label={t('branches.addBranch.labelAddress')}
            name='city_id'
            control={control}
            errors={errors}
            options={citiesData?.data || []}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ mt: { sm: 2.2 } }}>
          <CustomSelect
            name='district_id'
            control={control}
            errors={errors}
            options={districtsOptions || []}
            placeholder={t('branches.addBranch.district')}
          />
        </Grid>
        <Grid item xs={7} md={7}>
          <Box display='flex' alignItems='center'>
            <RHFSwitch
              name='status'
              checkedColor='success'
              control={control}
              labelPlacement='top'
              label={t('branches.addBranch.labelStatus')}
              defaultValues={false}
            />
            <Typography
              variant='h6'
              sx={{ color: theme => theme.palette.text.secondary, mt: 2.5 }}
            >
              {status ? t('branches.addBranch.active') : t('branches.addBranch.inactive')}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={6} md={6}>
          <LoadingButton type='submit' variant='primary' loading={loading} fullWidth>
            {id ? t('shard.edit') : t('branches.addBranch.add')}
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

export default BranchForm;
