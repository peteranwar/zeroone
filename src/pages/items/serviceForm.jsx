/* eslint-disable react/no-array-index-key */
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Grid, IconButton, Stack, Typography } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import * as yup from 'yup';
import { deleteIconAction } from '../../assets/icons';
import ToastError from '../../components/ToastError';
import ToastSuccess from '../../components/ToastSuccess';
import CustomSelect from '../../components/controls/CustomSelect';
import CustomInput from '../../components/controls/custom-input';
import RHFSwitch from '../../components/controls/rhf-switch';
import { setServerErrors } from '../../helpers';
import ItemsApiEndpoints from '../../services/items/api';
import { useGetItemId } from '../../services/items/query';
import { useGetPositions } from '../../services/shard/query';

const ServiceForm = ({ id, setOpen, services }) => {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();

  const { data: itemData } = useGetItemId(id);
  const { data: positionsData } = useGetPositions();

  const positionOptions = useMemo(() => {
    return (
      positionsData?.data?.map(pos => ({
        id: pos.id,
        name: i18n.language === 'ar' ? pos.name.ar : pos.name.en,
      })) || []
    );
  }, [i18n.language, positionsData?.data]);

  const ServicesData = useMemo(() => {
    return (
      services?.map(service => ({
        id: service.id,
        name: i18n.language === 'ar' ? service.name.ar : service.name.en,
      })) || []
    );
  }, [i18n.language, services]);

  const schema = yup.object({
    parent_id: yup.string().nullable(),

    employeeNameEn: yup.string().required(() => i18n.t('validation.required')),
    employeeNameAr: yup.string().required(() => i18n.t('validation.required')),

    positions: yup.mixed().when('parent_id', {
      is: value => !value,
      then: () =>
        yup
          .array()
          .of(
            yup.object().shape({
              id: yup.string().required(() => i18n.t('validation.required')),
              price: yup.string().required(() => i18n.t('validation.required')),
            })
          )
          .min(1, () => i18n.t('validation.required')),
      otherwise: () => yup.array().notRequired(),
    }),
  });

  const {
    control,
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
      positions: [{ id: '', price: '' }],
    },
  });

  const positions = watch('positions');
  const status = watch('status');

  useEffect(() => {
    if (id && itemData?.data) {
      const item = itemData.data;

      reset({
        employeeNameEn: item.name?.en || '',
        employeeNameAr: item.name?.ar || '',
        parent_id: item?.parent?.id || '',
        storage_unit: item?.storage_unit || '',
        ingredient_unit: item?.ingredient_unit || '',
        factor: item?.factor || '',
        price_per_unit: item?.price_per_unit || '',
        status: item.status === 'active',
        positions: item.item_position?.map(pos => ({
          id: pos.id,
          price: pos.price,
        })) || [{ id: '', price: '' }],
      });
    }
  }, [id, itemData, reset]);

  const addPosition = () => {
    setValue('positions', [...positions, { id: '', price: '' }]);
  };

  const removePosition = index => {
    const updated = [...positions];
    updated.splice(index, 1);
    setValue('positions', updated);
  };

  const onSubmit = handleSubmit(async data => {
    const ids = data.positions.map(p => p.id);
    const seen = new Set();
    const duplicates = new Set();

    ids.forEach(id => {
      if (seen.has(id)) duplicates.add(id);
      seen.add(id);
    });

    if (duplicates.size > 0) {
      data.positions.forEach((item, index) => {
        if (duplicates.has(item.id)) {
          setError(`positions.${index}.id`, {
            type: 'duplicate',
            message: i18n.t('validation.duplicate'),
          });
        }
      });
      return;
    }

    const formattedData = {
      name: {
        en: data.employeeNameEn,
        ar: data.employeeNameAr,
      },
      parent_id: data.parent_id,
      status: data.status ? 'active' : 'inactive',
      storage_unit: data.storage_unit,
      ingredient_unit: data.ingredient_unit,
      factor: data.factor,
      price_per_unit: data.price_per_unit,
    };

    if (Array.isArray(data.positions) && data.positions.length > 0) {
      const validPositions = data.positions.filter(item => item.id && item.price);

      if (validPositions.length > 0) {
        formattedData.position = validPositions.reduce((acc, item, index) => {
          acc[index] = {
            id: Number(item.id),
            price: Number(item.price),
          };
          return acc;
        }, {});
      }
    }

    try {
      const apiCall = id
        ? ItemsApiEndpoints.editItem(id, { ...formattedData, _method: 'put' })
        : ItemsApiEndpoints.addItem(formattedData);

      await apiCall;

      ToastSuccess(
        t(
          id
            ? 'services.addService.toastSuccessEdit'
            : 'services.addService.toastSuccessAdd'
        )
      );

      queryClient.invalidateQueries({ queryKey: ['items'] });
      setOpen(false);
    } catch (error) {
      if (error?.response?.status === 422) {
        setServerErrors(error.response.data.errors, setError);
      } else {
        ToastError(error?.response?.data?.message || t('validation.toastError'));
      }
    }
  });
  
  function handleCloseModal(){ 
    setOpen(false);
    reset()
  }

  return (
    <Box component='form' noValidate onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <CustomInput
            label={t('services.addService.labelNameEn')}
            placeholder={t('services.addService.placeName')}
            register={register}
            name='employeeNameEn'
            errors={errors}
            touchedFields={touchedFields}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomInput
            label={t('services.addService.labelNameAr')}
            placeholder={t('services.addService.placeName')}
            register={register}
            name='employeeNameAr'
            errors={errors}
            touchedFields={touchedFields}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box display='flex' alignItems='center'>
            <RHFSwitch
              name='status'
              control={control}
              label={t('services.addService.labelStatus')}
              defaultValues={false}
              checkedColor='success'
            />
            <Typography variant='h6' sx={{ mt: 2.5 }}>
              {status
                ? t('services.addService.active')
                : t('services.addService.inactive')}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <CustomSelect
            label={t('services.addService.labelParentService')}
            placeholder={t('services.addService.placeParentService')}
            name='parent_id'
            control={control}
            options={ServicesData}
            errors={errors}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomInput
            label={
              <Typography
                variant='body2'
                fontWeight={600}
                display='flex'
                alignItems='center'
                gap={0.5}
              >
                {t('services.addService.labelStorage')}
                <Typography variant='body2' color='text.secondary'>
                  {t('services.addService.exStorage')}
                </Typography>
              </Typography>
            }
            placeholder={t('services.addService.labelStorage')}
            register={register}
            name='storage_unit'
            errors={errors}
            touchedFields={touchedFields}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomInput
            label={
              <Typography
                variant='body2'
                fontWeight={600}
                display='flex'
                alignItems='center'
                gap={0.5}
              >
                {t('services.addService.labelIngredient')}
                <Typography variant='body2' color='text.secondary'>
                  {t('services.addService.exIngredient')}
                </Typography>
              </Typography>
            }
            placeholder={t('services.addService.labelIngredient')}
            register={register}
            name='ingredient_unit'
            errors={errors}
            touchedFields={touchedFields}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomInput
            label={
              <Typography
                variant='body2'
                fontWeight={600}
                display='flex'
                alignItems='center'
                gap={0.5}
              >
                {t('services.addService.labelFactor')}
                <Typography variant='body2' color='text.secondary'>
                  {t('services.addService.exFactor')}
                </Typography>
              </Typography>
            }
            placeholder={t('services.addService.labelFactor')}
            register={register}
            name='factor'
            errors={errors}
            touchedFields={touchedFields}
            type='number'
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomInput
            label={t('services.addService.labelPricePer')}
            placeholder={t('services.addService.labelPricePer')}
            register={register}
            name='price_per_unit'
            errors={errors}
            touchedFields={touchedFields}
            type='number'
          />
        </Grid>

        {positions.map((_, index) => (
          <Grid item xs={12} key={index}>
            <Stack direction='row' spacing={2}>
              <CustomSelect
                label={t('services.addService.labelPosition')}
                placeholder={t('services.addService.placePosition')}
                name={`positions.${index}.id`}
                control={control}
                options={positionOptions}
                errors={{
                  [`positions.${index}.id`]: errors?.positions?.[index]?.id,
                }}
              />
              <Box sx={{ width: '100%' }} pt={2}>
                <CustomInput
                  placeholder={t('services.addService.placePrice')}
                  register={register}
                  name={`positions.${index}.price`}
                  type='number'
                  labelEnd={t('shard.sar')}
                  errors={{
                    [`positions.${index}.price`]: errors?.positions?.[index]?.price,
                  }}
                  touched={touchedFields}
                />
              </Box>
            </Stack>
            {index !== 0 && (
              <Box textAlign='end' mb={index === positions.length ? 0 : -3}>
                <IconButton
                  color='error'
                  onClick={() => removePosition(index)}
                  sx={{
                    fontSize: '13px',
                    fontWeight: '600 !important',
                    'svg': { height: '18px' },
                    p: 0,
                    gap: 0.5,
                    mt: 2,
                    ':hover': { background: 'transparent' },
                  }}
                >
                  {deleteIconAction}
                  {t('services.addService.remove')}
                </IconButton>
              </Box>
            )}
          </Grid>
        ))}

        {positions.length < positionOptions.length ? (
          <Grid item xs={12}>
            <Button
              onClick={addPosition}
              color='error'
              sx={{ p: 0, ':hover': { background: 'transparent' } }}
            >
              {t('services.addService.addPosition')}
            </Button>
          </Grid>
        ) : (
          <Grid item xs={12} />
        )}

        <Grid item xs={6} mt={3}>
          <LoadingButton type='submit' variant='primary' fullWidth>
            {id ? t('shard.edit') : t('services.addService.add')}
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

export default ServiceForm;
