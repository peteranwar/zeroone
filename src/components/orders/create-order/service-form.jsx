/* eslint-disable no-console */
/* eslint-disable react/no-array-index-key */
import { yupResolver } from '@hookform/resolvers/yup';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, Grid, IconButton, Stack, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import * as yup from 'yup';
import { serviceIconTitle } from '../../../assets/icons';
import { useGetEmployees } from '../../../services/employees/query';
import OrdersApiEndpoints from '../../../services/orders/api';
import { useGetPositions } from '../../../services/shard/query';
import ToastError from '../../ToastError';
import ToastSuccess from '../../ToastSuccess';
import CustomSelect from '../../controls/CustomSelect';
import CustomInput from '../../controls/custom-input';
import SummarySection from './summery';

const ServicesForm = ({ servicesData, orderId, summary, typeOrder }) => {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const { data: employeesData } = useGetEmployees();
  const { data: positionsData } = useGetPositions();

  const [serviceData, setServiceData] = useState({});
  const [loading, setLoading] = useState(false);

  const schema = yup.object({
    services: yup.array().of(
      yup.object().shape({
        position_id: yup.string().required(i18n.t('validation.required')),
        service_id: yup.string().required(i18n.t('validation.required')),
        employee_id: yup.string().nullable(),
      })
    ),
  });

  const {
    control,
    handleSubmit,
    register,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      services: [{ position_id: '', service_id: '', employee_id: '', price: '' }],
    },
    resolver: yupResolver(schema),
  });

  const services = watch('services');

  const positionOptions = useMemo(() => {
    return (
      positionsData?.data?.map(pos => ({
        id: pos.id,
        name: i18n.language === 'ar' ? pos.name.ar : pos.name.en,
      })) || []
    );
  }, [i18n.language, positionsData?.data]);

  const employeeOptions = useMemo(() => {
    return (
      employeesData?.data?.map(emp => ({
        id: emp.id,
        name: `${emp.first_name} ${emp.last_name}`,
      })) || []
    );
  }, [employeesData]);

  const addService = () => {
    setValue('services', [
      ...services,
      { position_id: '', service_id: '', employee_id: '', price: '' },
    ]);
  };

  const removeService = index => {
    const updated = [...services];
    updated.splice(index, 1);
    setValue('services', updated);
  };

  const handleServiceChange = (index, selectedService) => {
    const price = selectedService?.price || '';
    setValue(`services.${index}.price`, price);
  };

  const handlePositionChange = async (index, selectedOption) => {
    const positionId = selectedOption?.id;
    setValue(`services.${index}.position_id`, positionId);
    setValue(`services.${index}.service_id`, '');
    setValue(`services.${index}.price`, '');

    try {
      const res = await OrdersApiEndpoints.getServiceDependOnPosition({
        position_id: positionId,
      });
      const options = res.data.map(service => ({
        ...service,
        name: service.name[i18n.language],
      }));
      setServiceData(prev => ({ ...prev, [index]: options }));
    } catch (err) {
      console.error('Error fetching service options:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!servicesData || servicesData.length === 0) {
        reset({
          services: [{ position_id: '', service_id: '', employee_id: '', price: '' }],
        });
        setServiceData({});
        return;
      }

      const formatted = servicesData.map(item => ({
        position_id: item.position.id,
        service_id: item.service.id,
        employee_id: item.employee.id || '',
        price: item.price,
      }));

      reset({ services: formatted });

      const dataMap = {};

      await Promise.all(
        servicesData.map(async (item, index) => {
          try {
            const res = await OrdersApiEndpoints.getServiceDependOnPosition({
              position_id: item.position.id,
            });

            const formattedOptions = res?.data.map(service => ({
              ...service,
              name: service.name[i18n.language],
            }));

            dataMap[index] = formattedOptions;
          } catch (err) {
            console.error(`Error loading services for index ${index}`, err);
            dataMap[index] = [];
          }
        })
      );

      setServiceData(dataMap);
    };

    init();
  }, [servicesData, i18n.language, reset]);

  const onSubmit = handleSubmit(async data => {
    try {
      setLoading(true);
      data.order_id = orderId;
      await OrdersApiEndpoints.addServices(data);
      ToastSuccess(t('orders.create.services.updateSuccess'));
      queryClient.invalidateQueries({ queryKey: ['order_id'] });
    } catch (error) {
      ToastError(error?.response?.data?.message || t('validation.toastError'));
    } finally {
      setLoading(false);
    }
  });

  return (
    <Stack
      spacing={2}
      p={3}
      mt={4}
      sx={{ borderRadius: '20px', backgroundColor: 'white' }}
    >
      <Box component='form' noValidate onSubmit={onSubmit}>
        <Stack direction='row' spacing={1} alignItems='center' mb={3.5}>
          {serviceIconTitle}
          <Typography variant='h5' textTransform='uppercase'>
            {t('orders.create.services.title')}
          </Typography>
        </Stack>

        {services.map((item, index) => (
          <Grid container spacing={2} key={index} alignItems='flex-start' mb={3}>
            <Grid item xs={12} md={3}>
              <CustomSelect
                label={t('orders.create.labelPosition')}
                placeholder={t('orders.create.placePosition')}
                name={`services.${index}.position_id`}
                control={control}
                options={positionOptions}
                onChange={val => handlePositionChange(index, val)}
                errors={{
                  [`services.${index}.position_id`]:
                    errors?.services?.[index]?.position_id,
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <CustomSelect
                label={t('orders.create.labelService')}
                placeholder={t('orders.create.placeService')}
                name={`services.${index}.service_id`}
                control={control}
                options={serviceData[index] || []}
                onChange={val => handleServiceChange(index, val)}
                errors={{
                  [`services.${index}.service_id`]: errors?.services?.[index]?.service_id,
                }}
              />
            </Grid>


            <Grid item xs={12} md={3}>
              <CustomSelect
                label={t('orders.create.labelEmp')}
                placeholder={t('orders.create.placeEmp')}
                name={`services.${index}.employee_id`}
                control={control}
                options={employeeOptions}
                errors={errors}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <CustomInput
                label={t('orders.create.labelPrice')}
                placeholder='0.00'
                name={`services.${index}.price`}
                type='number'
                register={register}
                errors={errors}
                labelEnd='SAR'
                disabled
              />
            </Grid>

            <Grid item xs={12} md={1}>
              {index > 0 && (
                <IconButton
                  onClick={() => removeService(index)}
                  color='error'
                  sx={{ mt: 4 }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Grid>
          </Grid>
        ))}

        <Button variant='text' color='secondary' onClick={addService}>
          {t('orders.create.addMore')}
        </Button>

        <Stack direction='row' justifyContent='flex-end' mt={3}>
          <LoadingButton
            type='submit'
            variant='contained'
            color='primary'
            loading={loading}
          >
            {t('orders.create.submit')}
          </LoadingButton>
        </Stack>
      </Box>

      <Divider sx={{ my: 2, borderColor: '#F1F1F2' }} />

      {servicesData?.length > 0 && (
        <SummarySection summary={summary} typeOrder={typeOrder} t={t} />
      )}
    </Stack>
  );
};

export default ServicesForm;
