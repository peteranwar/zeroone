import React, { useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Stack,
  Button,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useParams } from 'react-router';
import { useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import OrdersApiEndpoints from '../../../services/orders/api';
import ToastSuccess from '../../ToastSuccess';
import ToastError from '../../ToastError';
import { useGetSettings } from '../../../services/settings/query';
import CustomInput from '../../controls/custom-input';

const SummarySection = ({ summary, typeOrder }) => {
  const { t, i18n } = useTranslation();
  const { orderId } = useParams();
  const queryClient = useQueryClient();
  const [isGift, setIsGift] = useState(typeOrder === 'gift');
  const { data: settingsData } = useGetSettings();
  const schema = yup.object().shape({
    order_code: yup.string().required(i18n.t('validation.required')),
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      order_code: '',
    },
  });
  const handleDiscount = discount => {
    const data = {
      discount,
      '_method': 'put',
    };
    OrdersApiEndpoints.updateOrder(orderId, data)
      .then(() => {
        ToastSuccess(t('orders.create.discount.toastSuccess'));
        queryClient.invalidateQueries({ queryKey: ['order_id'] });
      })
      .catch(err => {
        ToastError(err?.response?.data?.message || t('validation.toastError'));
      });
  };
  const onSubmit = async data => {
    data._method = 'put';
    OrdersApiEndpoints.updateOrder(orderId, data)
      .then(() => {
        ToastSuccess(t('orders.create.discount.toastSuccess'));
        queryClient.invalidateQueries({ queryKey: ['order_id'] });
      })
      .catch(err => {
        ToastError(err?.response?.data?.message || t('validation.toastError'));
      });
  };
  const handleChangeIsGift = event => {
    setIsGift(event.target.checked);
    const newData = {
      _method: 'put',
      is_gift: event.target.checked === true ? 1 : 0,
    };
    OrdersApiEndpoints.updateOrder(orderId, newData)
      .then(() => {
        ToastSuccess(t('orders.create.discount.toastSuccessGift'));
        queryClient.invalidateQueries({ queryKey: ['order_id'] });
      })
      .catch(err => {
        ToastError(err?.response?.data?.message || t('validation.toastError'));
      });
  };
  return (
    <Stack mt={2}>
      <Typography variant='h5' pb={3} textTransform='uppercase'>
        {t('orders.create.summary')}
      </Typography>

      <Grid container spacing={2} justifyContent='space-between'>
        <Grid item xs={12} sm={5}>
          <Stack sx={{ width: '100%' }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id='discount-label'>
                {t('orders.create.discount.title')}
              </InputLabel>

              <Select
                onChange={e => handleDiscount(e.target.value)}
                labelId='discount-label'
                label={t('orders.create.discount.title')}
                value={Number(summary?.discount)}
              >
                {settingsData?.data?.discounts?.map(option => (
                  <MenuItem key={option} value={option}>
                    {`${option}%`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack
              direction='row'
              alignItems='center'
              justifyContent='space-between'
              spacing={2}
              width='100%'
            >
              <Typography color='text.secondary'>
                {t('orders.create.subtotal')}
              </Typography>
              <Typography textAlign='right'>
                {summary?.subtotal} {t('shard.sar')}
              </Typography>
            </Stack>
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='space-between'
              spacing={2}
            >
              <Typography color='text.secondary'>
                {t('orders.create.discount.title')}
              </Typography>
              <Typography textAlign='right'>
                {summary?.discount_value} {t('shard.sar')}
              </Typography>
            </Stack>
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='space-between'
              spacing={2}
            >
              <Typography fontWeight='bold'>{t('orders.create.total')}</Typography>
              <Typography textAlign='right' fontWeight='bold'>
                {summary?.total} {t('shard.sar')}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box
            component='form'
            onSubmit={handleSubmit(onSubmit)}
            type='submit'
            mt={{ xs: 'auto', sm: -1.5 }}
          >
            <CustomInput
              placeholder={t('orders.create.discount.orderCode')}
              name='order_code'
              register={register}
              errors={errors}
              labelEnd={
                <Button
                  variant='text'
                  type='submit'
                  sx={{
                    borderRadius: '10px',
                    py: { xs: 0.9, sm: 0.9 },
                    minHeight: 'auto',
                  }}
                >
                  {t('shard.verify')}
                </Button>
              }
            />

            {/* <Switch
              checked={isGift}
              onChange={handleChangeIsGift}
              inputProps={{ 'aria-label': 'controlled' }}
              color='success'
            /> */}
            <FormControlLabel
              sx={{
                mt: { xs: 2, sm: 4 },
                ml: 0,
                '& .MuiFormControlLabel-label': { fontWeight: '600', fontSize: '12px' },
              }}
              control={
                <Switch
                  checked={isGift}
                  onChange={handleChangeIsGift}
                  inputProps={{ 'aria-label': 'controlled' }}
                  color='success'
                />
              }
              label='Is Gift'
              labelPlacement='top'
            />
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default SummarySection;
