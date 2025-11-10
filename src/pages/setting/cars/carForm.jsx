/* eslint-disable react/no-array-index-key */
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Grid, IconButton, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import * as yup from 'yup';
import { deleteIconAction } from '../../../assets/icons';
import ToastError from '../../../components/ToastError';
import ToastSuccess from '../../../components/ToastSuccess';
import CustomInput from '../../../components/controls/custom-input';
import { setServerErrors } from '../../../helpers';
import SettingsApiEndpoints from '../../../services/settings/api';
import { useGetShowCar } from '../../../services/settings/query';

const CarForm = ({ id, setOpen }) => {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();

  const { data: carData } = useGetShowCar(id);

  const schema = yup.object({
    nameEn: yup.string().required(() => i18n.t('validation.required')),
    nameAr: yup.string().required(() => i18n.t('validation.required')),
    model: yup.array().of(
      yup.object().shape({
        nameEn: yup.string().required(() => i18n.t('validation.required')),
        nameAr: yup.string().required(() => i18n.t('validation.required')),
      })
    ),
  });

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    watch,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: {
      model: [{ nameEn: '', nameAr: '' }],
    },
  });

  const models = watch('model');

  useEffect(() => {
    if (id && carData?.data) {
      const item = carData.data;

      reset({
        nameEn: item.translator_name?.en || '',
        nameAr: item.translator_name?.ar || '',
        model: item.models?.map(pos => ({
          nameEn: pos.translator_name.en,
          nameAr: pos.translator_name.ar,
        })) || [{ nameEn: '', nameAr: '' }],
      });
    }
  }, [id, carData, reset]);

  const addPosition = () => {
    setValue('model', [...models, { nameEn: '', nameAr: '' }]);
  };

  const removePosition = index => {
    const updated = [...models];
    updated.splice(index, 1);
    setValue('model', updated);
  };

  const onSubmit = handleSubmit(async data => {
    const formattedData = {
      name: {
        en: data.nameEn,
        ar: data.nameAr,
      },
      model: data.model.map(item => ({
        name: {
          en: item?.nameEn,
          ar: item?.nameAr,
        },
      })),
    };

    try {
      const apiCall = id
        ? SettingsApiEndpoints.editCars(id, { ...formattedData, _method: 'put' })
        : SettingsApiEndpoints.addCar(formattedData);

      await apiCall;

      ToastSuccess(t(id ? 'setting.carInfo.editToast' : 'setting.carInfo.addToast'));

      queryClient.invalidateQueries({ queryKey: ['cars'] });
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
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <CustomInput
            label={t('setting.carInfo.labelNameEn')}
            placeholder={t('setting.carInfo.placeName')}
            register={register}
            name='nameEn'
            errors={errors}
            touchedFields={touchedFields}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomInput
            label={t('setting.carInfo.labelNameAr')}
            placeholder={t('setting.carInfo.placeName')}
            register={register}
            name='nameAr'
            errors={errors}
            touchedFields={touchedFields}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant='body1'
            sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600 }}
          >
            {t('setting.carInfo.modelTitle')}
          </Typography>
        </Grid>

        {models.map((_, index) => (
          <Grid item xs={12} key={index}>
            <Stack direction='row' spacing={2}>
              <CustomInput
                label={t('setting.carInfo.labelModelEn')}
                placeholder={t('setting.carInfo.placeModal')}
                register={register}
                name={`model.${index}.nameEn`}
                errors={{
                  [`model.${index}.nameEn`]: errors?.model?.[index]?.nameEn,
                }}
              />
              <Box sx={{ width: '100%' }}>
                <CustomInput
                  label={t('setting.carInfo.labelModelAr')}
                  placeholder={t('setting.carInfo.placeModal')}
                  register={register}
                  name={`model.${index}.nameAr`}
                  errors={{
                    [`model.${index}.nameAr`]: errors?.model?.[index]?.nameAr,
                  }}
                  touched={touchedFields}
                />
              </Box>
            </Stack>
            {index !== 0 && (
              <Box textAlign='end' mb={index === models.length ? 0 : -2}>
                <IconButton
                  color='error'
                  onClick={() => removePosition(index)}
                  sx={{
                    fontSize: '13px',
                    fontWeight: '700 !important',
                    'svg': { height: '18px' },
                    p: 0,
                    gap: 0.5,
                    mt: 2,
                    ':hover': { background: 'transparent' },
                  }}
                >
                  {deleteIconAction}
                  {t('setting.carInfo.remove')}
                </IconButton>
              </Box>
            )}
          </Grid>
        ))}

        <Grid item xs={12}>
          <Button
            onClick={addPosition}
            color='error'
            sx={{ p: 0, ':hover': { background: 'transparent' }, fontWeight: '700' }}
          >
            {t('setting.carInfo.addAnotherModel')}
          </Button>
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

export default CarForm;
