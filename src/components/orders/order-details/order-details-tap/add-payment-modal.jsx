import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Stack,
  Button,
  Grid,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useParams } from 'react-router';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import MainModal from '../../../MainModal';
import MainImg from '../../../MainImg';
import CustomInput from '../../../controls/custom-input';
import OrdersApiEndpoints from '../../../../services/orders/api';
import ToastSuccess from '../../../ToastSuccess';
// Payment method logos
const paymentMethods = [
  { label: 'Cash', value: 'cash' },
  { label: 'Bank transfer', value: 'bank_transfer' },
  {
    label: 'Mada',
    value: 'mada',
    img: 'bank-methods/mada.svg',
    height: 50,
    width: 50,
  },
  {
    label: 'VISA',
    value: 'visa',
    img: 'bank-methods/visa.svg',
    height: 50,
    width: 50,
  },
  {
    label: 'Mastercard',
    value: 'master_card',
    img: 'bank-methods/mastercard.svg',
    height: 50,
    width: 40,
  },
  {
    label: 'Tabby',
    value: 'tabby',
    img: 'bank-methods/tabby.svg',
    height: 50,
    width: 50,
  },
  {
    label: 'Tamara',
    value: 'tamara',
    img: 'bank-methods/tamara.svg',
    height: 50,
    width: 50,
  },
  {
    label: 'Apple pay',
    value: 'apple',
    img: 'bank-methods/Apple_Pay.png',
    height: 25,
    width: 50,
  },
];

const PaymentForm = ({ open, handleClose, minAmount = 10, maxAmount = 1000 }) => {
  const { orderId } = useParams();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const schema = yup.object().shape({
    total: yup
      .number()
      .typeError(t('orders.details.orderTap.amountError'))
      .positive(t('orders.details.orderTap.amountPositive'))
      .min(minAmount, `${t('orders.details.orderTap.amountMin')} ${minAmount}`)
      .max(maxAmount, `${t('orders.details.orderTap.amountMax')} ${maxAmount}`)
      .required(t('orders.details.orderTap.amountRequired')),
    payment_method: yup.string().required('Payment method is required'),
  });

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      const: '',
      payment_method: 'cash',
    },
  });

  // Handle Form Submit
  const onSubmit = data => {
    data.order_id = orderId;
    OrdersApiEndpoints.addPayment(data)
      .then(() => {
        handleClose();
        ToastSuccess(t('orders.details.orderTap.toastSuccess'));
        queryClient.invalidateQueries({ queryKey: ['order_id'] });
      })
      .catch(error => {
        toast.error(error?.response?.data?.message || t('validation.toastError'));
      });
  };
  return (
    <MainModal
      open={open}
      setOpen={handleClose}
      title={t('orders.details.orderTap.addPayment')}
    >
      <Box component='form' onSubmit={handleSubmit(onSubmit)}>
        {/* Amount Paid Input */}
        <Typography fontWeight='bold' gutterBottom>
          {t('orders.details.orderTap.amountPaid')}
        </Typography>
        <CustomInput
          placeholder={`${t(
            'orders.details.orderTap.enterAmount'
          )} (Min: ${minAmount}, Max: ${maxAmount})`}
          name='total'
          register={register}
          errors={errors}
        />

        {/* Payment Methods */}
        <Typography fontWeight='bold' gutterBottom mt={3} pb={2}>
          {t('orders.details.orderTap.paymentMethod')}
        </Typography>
        <Controller
          name='payment_method'
          control={control}
          render={({ field }) => (
            <RadioGroup {...field}>
              <Grid container spacing={2}>
                {paymentMethods.map(method => (
                  <Grid item xs={6} sm={4} key={method.value}>
                    <FormControlLabel
                      value={method.value}
                      control={<Radio color='primary' />}
                      label={
                        method.img ? (
                          <MainImg
                            name={method?.img}
                            alt={method.label}
                            height={method?.height}
                            width={method?.width}
                          />
                        ) : (
                          method.label
                        )
                      }
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '100%',
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </RadioGroup>
          )}
        />
        {errors.paymentMethod && (
          <Typography color='error' sx={{ mt: 1 }}>
            {errors.paymentMethod.message}
          </Typography>
        )}

        {/* Action Buttons */}
        <Stack direction='row' sx={{ justifyContent: 'space-between', pt: 4 }}>
          <LoadingButton type='submit' variant='contained' sx={{ width: '48%' }}>
            {t('shard.add')}
          </LoadingButton>
          <Button onClick={handleClose} variant='outlined' sx={{ width: '48%' }}>
            {t('shard.cancel')}
          </Button>
        </Stack>
      </Box>
    </MainModal>
  );
};

export default PaymentForm;
