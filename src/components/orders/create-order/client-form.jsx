/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { yupResolver } from '@hookform/resolvers/yup';
import SearchIcon from '@mui/icons-material/Search';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { clientInfoIcon } from '../../../assets/icons';
import { setServerErrors } from '../../../helpers';
import { useRouter } from '../../../hooks';
import OrdersApiEndpoints from '../../../services/orders/api';
import { useGetCarsByClientId } from '../../../services/orders/query';
import { useGetReferrals } from '../../../services/shard/query';
import { resetCars } from '../../../store/slices/carSlice';
import CustomInput from '../../controls/custom-input';
import CustomSelect from '../../controls/CustomSelect';
import RHFSwitch from '../../controls/rhf-switch';
import ToastError from '../../ToastError';
import ToastSuccess from '../../ToastSuccess';
import AddCarModal from '../add-order/add-car-modal';

const ClientForm = ({ clientData, orderId }) => {
  const dispatch = useDispatch();
  const carsData = useSelector(state => state.car.carsList);
  const [cars, setCars] = useState(carsData);
  const [clientId, setClientId] = useState(null);
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const [openAddCarModal, setOpenAddCarModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { data } = useGetCarsByClientId(clientId ? { client_id: clientId } : undefined, {
    onSuccess: data => {
      const modifiedCars = data?.data?.map(car => ({
        ...car,
        name: `${car.name} - ${car.model} - ${car.plate_number}`,
      }));
      setCars(modifiedCars);
    },
  });

  const schema = yup.object().shape({
    phone: yup.string().required(i18n.t('validation.required')),

    name: yup.string().required(i18n.t('validation.required')),
    client_car_id:
      carsData?.length === 0 && yup.string().required(i18n.t('validation.required')),
    referral_id: yup.string().required(i18n.t('validation.required')),
    email: yup.string().email('Invalid email').nullable(),

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
  });

  const defaultValues = useMemo(
    () => ({
      phone: clientData?.phone || '',
      name: clientData?.name || '',
      client_car_id: clientData?.clientCar?.id,
      referral_id: clientData?.referral?.id || '',
      email: clientData?.email || '',
      is_business: clientData?.is_business || false,
      vat_no: clientData?.vat_no || '',
      address: clientData?.address || '',
    }),
    [clientData, carsData]
  );

  const { data: referrals } = useGetReferrals();
  const referralsData = useMemo(() => {
    return (
      referrals?.data?.map(pos => ({
        id: pos.id,
        name: i18n.language === 'ar' ? pos.name.ar : pos.name.en,
      })) || []
    );
  }, [i18n.language, referrals?.data]);
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setError,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      phone: '',
      name: '',
      car_id: '',
      referral_id: '',
      email: '',
    },
  });
  const isBusiness = watch('is_business');
  useEffect(() => {
    if (carsData[0]?.id) {
      setValue('client_car_id', carsData[0]?.id);
    }
  }, [clientData, carsData, carsData, reset]);

  const handleClientByPhone = async (searchBy) => {
    const phone = getValues('phone');
    const name = getValues('name');
    console.log('searchBysearchBy', searchBy)
    try {
      const { data } = await queryClient.fetchQuery({
        queryKey: ['client', phone],
        queryFn: () => OrdersApiEndpoints.getClientByPhone({ ...(searchBy === 'name' ? { name } : { phone }), has_order: 0 }),
      });

      if (data) {
        if (data?.client) {
          dispatch(resetCars());
          ToastSuccess(t('client.dataUpdated'));
          setClientId(data?.client?.id);
        } else {
          ToastSuccess(searchBy === 'name'? t('client.notFoundName') : t('client.notFound'));
          setClientId(null);
          setCars([]);
        }
        reset({
          phone: data?.client?.phone,
          name: data?.client?.name || '',
          referral_id: data?.client?.referral_id || '',
          email: data?.client?.email || '',
          is_business: data?.client?.is_business || false,
          vat_no: data?.client?.vat_no || '',
          address: data?.client?.address || '',
        });
      }
    } catch (err) {
      ToastError(err);
    }
  };

  useEffect(() => {
    if (orderId) {
      reset(defaultValues);
      setClientId(clientData.id);
    }
  }, [orderId, defaultValues, reset, clientData.id]);

  const onSubmit = async data => {
    const carInfo = carsData[0];
    const newData = carInfo
      ? {
        ...data,
        is_business: data.is_business === true ? 1 : 0,
        car_id: carInfo.car_id,
        car_model_id: carInfo.car_model_id,
        plate_number: carInfo.plate_number,
        client_car_id: null,
      }
      : {
        ...data,
        is_business: data.is_business === true ? 1 : 0,
        client_car_id: data.client_car_id,
      };

    if (orderId) {
      newData._method = 'put';
      try {
        setLoading(true);
        const res = await OrdersApiEndpoints.updateOrder(orderId, newData);
        ToastSuccess(t('client.addSuccess'));
        dispatch(resetCars());
        if (orderId) {
          queryClient.invalidateQueries({ queryKey: ['order_id'] });
        } else {
          router.push(`/orders/new/${res?.data?.order?.id}`);
        }
      } catch (error) {
        if (error?.response?.status === 422) {
          setServerErrors(error.response.data.errors, setError);
        } else {
          ToastError(error?.response?.data?.message || t('validation.toastError'));
        }
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const res = await OrdersApiEndpoints.addClient(newData);
        ToastSuccess(t('client.addSuccess'));
        dispatch(resetCars());
        if (orderId) {
          queryClient.invalidateQueries({ queryKey: ['order_id'] });
        } else {
          router.push(`/orders/new/${res?.data?.order?.id}`);
        }
      } catch (error) {
        if (error?.response?.status === 422) {
          setServerErrors(error.response.data.errors, setError);
        } else {
          ToastError(error?.response?.data?.message || t('validation.toastError'));
        }
      } finally {
        setLoading(false);
      }
    }
  };


  return (
    <Stack
      spacing={2}
      mt={3}
      sx={{
        borderRadius: '20px',
        position: 'relative',
        backgroundColor: 'white',
      }}
      p={3}
    >
      <Box component='form' onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack direction='row' spacing={1} alignItems='center'>
              {clientInfoIcon}
              <Typography variant='h5' textTransform='uppercase'>
                {t('orders.create.clientInfo')}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomInput
              label={t('orders.create.labelPhone')}
              placeholder={t('orders.create.placePhone')}
              name='phone'
              disabled={orderId}
              register={register}
              type='number'
              errors={errors}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                  e.preventDefault();
                  const phone = getValues('phone');
                  return handleClientByPhone(phone);
                }
              }}
              labelEnd={
                <Button
                  disabled={orderId}
                  sx={{
                    gap: 0.5,
                    color: 'red',
                    fontWeight: 600,
                    fontSize: '12px',
                    background: 'transparent',
                    p: 0,
                    ':hover': { background: 'transparent' },
                  }}

                  onClick={() => {
                    const phone = getValues('phone');
                    return handleClientByPhone(phone);
                  }}
                >
                  <SearchIcon fontSize='small' />
                  {t('orders.create.search')}
                </Button>
              }
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomInput
              label={t('orders.create.labelName')}
              placeholder={t('orders.create.placeName')}
              name='name'
              register={register}
              errors={errors}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                  e.preventDefault();
                  return handleClientByPhone('name');
                }
              }}
              labelEnd={
                <Button
                  disabled={orderId}
                  sx={{
                    gap: 0.5,
                    color: 'red',
                    fontWeight: 600,
                    fontSize: '12px',
                    background: 'transparent',
                    p: 0,
                    ':hover': { background: 'transparent' },
                  }}

                  onClick={() => {
                    return handleClientByPhone('name');
                  }}
                >
                  <SearchIcon fontSize='small' />
                  {t('orders.create.search')}
                </Button>
              }
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomInput
              label={t('orders.create.labelEmail')}
              placeholder={t('orders.create.placeEmail')}
              name='email'
              register={register}
              errors={errors}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomSelect
              label={t('orders.create.labelCar')}
              placeholder={t('orders.create.placeCar')}
              name='client_car_id'
              control={control}
              errors={errors}
              options={cars?.length > 0 ? cars : carsData}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomSelect
              label={t('orders.create.labelReferral')}
              placeholder={t('orders.create.placeReferral')}
              name='referral_id'
              control={control}
              errors={errors}
              options={referralsData || []}
            />
          </Grid>
          <Grid item xs={12} md={4}>
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
              <Grid item xs={12} md={4}>
                <CustomInput
                  label={t('orders.create.labelVat')}
                  placeholder={t('orders.create.placeVat')}
                  name='vat_no'
                  register={register}
                  errors={errors}
                  type='number'
                />
              </Grid>

              <Grid item xs={12} md={4}>
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

          <Grid item xs={12}>
            <Button
              variant='text'
              color='primary'
              onClick={() => setOpenAddCarModal(true)}
              sx={{
                background: 'rgba(25, 25, 27, 0.08)',
                ':hover': { background: 'rgba(25, 25, 27, 0.2)' },
              }}
            >
              {t('orders.create.addCar')}
            </Button>
          </Grid>
          <Grid item xs={12} mt={2}>
            <Stack direction='row' justifyContent='flex-end' mt={3}>
              <LoadingButton
                loading={loading}
                variant='contained'
                color='primary'
                type='submit'
              >
                {t('orders.create.save')}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <AddCarModal
        open={openAddCarModal}
        handleClose={() => setOpenAddCarModal(false)}
        t={t}
        i18n={i18n}
        clientId={clientId}
      />
    </Stack>
  );
};

export default ClientForm;
