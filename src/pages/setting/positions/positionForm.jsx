/* eslint-disable react/no-array-index-key */
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import * as yup from 'yup';
import ToastError from '../../../components/ToastError';
import ToastSuccess from '../../../components/ToastSuccess';
import CustomInput from '../../../components/controls/custom-input';
import { setServerErrors } from '../../../helpers';
import SettingsApiEndpoints from '../../../services/settings/api';
import { useGetShowPosition } from '../../../services/settings/query';

const PositionForm = ({ id, setOpen }) => {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();

  const { data: positionData } = useGetShowPosition(id);

  const schema = yup.object({
    nameEn: yup.string().required(() => i18n.t('validation.required')),
    nameAr: yup.string().required(() => i18n.t('validation.required')),
  });

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
    if (id && positionData?.data) {
      const item = positionData.data;

      reset({
        nameEn: item.name?.en || '',
        nameAr: item.name?.ar || '',
      });
    }
  }, [id, positionData, reset]);

  const onSubmit = handleSubmit(async data => {
    const formattedData = {
      name: {
        en: data.nameEn,
        ar: data.nameAr,
      },
    };

    try {
      const apiCall = id
        ? SettingsApiEndpoints.editPosition(id, { ...formattedData, _method: 'put' })
        : SettingsApiEndpoints.addPosition(formattedData);

      await apiCall;

      ToastSuccess(
        t(id ? 'setting.positionsInfo.editToast' : 'setting.positionsInfo.addToast')
      );

      queryClient.invalidateQueries({ queryKey: ['positions'] });
      setOpen(false);
    } catch (error) {
      if (error?.response?.status === 422) {
        setServerErrors(error.response.data.errors, setError);
      } else {
        ToastError(error?.response?.data?.message || t('validation.toastError'));
      }
    }
  });

  function handleCloseModal() {
    setOpen(false);
    reset()
  }

  return (
    <Box component='form' noValidate onSubmit={onSubmit}>
      <Grid container spacing={3.5}>
        <Grid item xs={12}>
          <CustomInput
            label={t('setting.positionsInfo.labelNameEn')}
            placeholder={t('setting.positionsInfo.placeName')}
            register={register}
            name='nameEn'
            errors={errors}
            touchedFields={touchedFields}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomInput
            label={t('setting.positionsInfo.labelNameAr')}
            placeholder={t('setting.positionsInfo.placeName')}
            register={register}
            name='nameAr'
            errors={errors}
            touchedFields={touchedFields}
          />
        </Grid>

        <Grid item xs={6} mt={3}>
          <LoadingButton type='submit' variant='primary' fullWidth>
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

export default PositionForm;
