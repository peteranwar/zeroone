/* eslint-disable eqeqeq */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useQueryClient } from 'react-query';
import MainModal from '../../MainModal';
import CustomSelect from '../../controls/CustomSelect';
import { useGetCars } from '../../../services/shard/query';
import { addCar } from '../../../store/slices/carSlice';
import OrdersApiEndpoints from '../../../services/orders/api';
import ToastSuccess from '../../ToastSuccess';
import { setServerErrors } from '../../../helpers';
import ToastError from '../../ToastError';
import CustomInput from '../../controls/custom-input';
import ColorSelect from '../../controls/color-select';
import { colorList } from '../../../constants';
import ClientsApiEndpoints from '../../../services/clients/api';

const AddCarModal = ({ open, handleClose, t, i18n, clientId, carData }) => {
  const queryClient = useQueryClient();
  const [modalCarsData, setModalCarsData] = useState([]);
  const { data: cars } = useGetCars();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleTypeCarsChange = selectedCar => {
    setModalCarsData(selectedCar?.models);
  };

  const schema = yup.object().shape({
    car_id: yup.string().required(i18n.t('validation.required')),
    car_model_id: yup.string().required(i18n.t('validation.required')),
    model_year: yup.string().required(i18n.t('validation.required')),
    color: yup.string().required(i18n.t('validation.required')),

    plate_number: yup
      .string()
      .required(i18n.t('validation.required'))
      .min(4, 'Plate number must be at least 4 characters'),
  });
  const defaultValues = useMemo(
    () => ({
      car_id: carData?.car_id || '',
      car_model_id: carData?.car_model_id || '',
      model_year: carData?.model_year,
      color: carData?.color || '',
      plate_number: carData?.plate_number || '',
    }),
    [carData]
  );
  const {
    handleSubmit,
    control,
    watch,
    reset,
    register,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      carType: '',
      carModel: '',
      plate_number: '',
    },
  });

  useEffect(() => {
    if (carData) {
      reset(defaultValues);

      const selectedCar = cars?.data?.find(car => car.id == carData.car_id);
      if (selectedCar) {
        setModalCarsData(selectedCar.models || []);
      }
    }
  }, [carData, defaultValues, reset, cars]);

  const selectedCarType = watch('car_id');

  const onSubmit = async data => {
    const formatData = {
      ...data,
      _method: 'put',
      client_id: clientId,
    };
    if (!clientId) {
      data.name = `${cars?.data.find(modal => modal.id == data.car_id).name} - ${
        modalCarsData.find(modal => modal.id == data.car_model_id).name
      } - ${data.plate_number}`;
      data.id = modalCarsData.find(modal => modal.id == data.car_model_id).id;
      dispatch(addCar(data));
      handleClose();
    } else {
      try {
        setLoading(true);
        data.client_id = clientId;
        const api = carData
          ? ClientsApiEndpoints.updateCar(carData.id, formatData)
          : OrdersApiEndpoints.addCar(data);
        await api;
        ToastSuccess(carData ? t('client.car.editSuccess') : t('client.car.addSuccess'));
        if (carData) {
          queryClient.invalidateQueries({ queryKey: ['client-id'] });
        } else {
          queryClient.invalidateQueries({ queryKey: ['client_cars'] });
        }
        handleClose();
        reset();
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
    <MainModal
      open={open}
      setOpen={handleClose}
      title={
        carData
          ? t('orders.details.orderTap.editCar')
          : t('orders.details.orderTap.addCar')
      }
    >
      <Box component='form' onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <CustomSelect
            label={t('orders.details.orderTap.labelTypeCar')}
            placeholder={t('orders.details.orderTap.placeTypeCar')}
            name='car_id'
            control={control}
            errors={errors}
            options={cars?.data || []}
            onChange={val => handleTypeCarsChange(val)}
          />

          <CustomSelect
            label={t('orders.details.orderTap.labelCarModal')}
            placeholder={t('orders.details.orderTap.placeCarModal')}
            name='car_model_id'
            control={control}
            disabled={!selectedCarType}
            options={modalCarsData || []}
            errors={errors}
          />
          <CustomInput
            label={t('orders.details.orderTap.model_year')}
            placeholder='2025'
            name='model_year'
            register={register}
            errors={errors}
            type='number'
          />
          <ColorSelect
            name='color'
            label={t('orders.details.orderTap.color')}
            control={control}
            options={colorList}
            placeholder={t('orders.details.orderTap.placeColor')}
            errors={errors}
          />
          <CustomInput
            label={t('orders.details.orderTap.plateNumber')}
            placeholder='ex:123ARB'
            name='plate_number'
            register={register}
            errors={errors}
          />
        </Stack>

        <Stack direction='row' spacing={2} mt={5}>
          <LoadingButton type='submit' variant='primary' loading={loading} fullWidth>
            {carData ? t('shard.edit') : t('shard.add')}
          </LoadingButton>
          <Button
            onClick={() => {
              handleClose();
              reset();
            }}
            variant='outlined'
            fullWidth
          >
            {t('shard.cancel')}
          </Button>
        </Stack>
      </Box>
    </MainModal>
  );
};

export default AddCarModal;
