import PersonIcon from '@mui/icons-material/Person';
import { Avatar, Box, Divider, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import { contactInfoStyle } from './style';

const OrderInfo = ({ orderData, t }) => {
  console.log('orderDataorderData',orderData)
  return (
    <Stack spacing={2} px={2} mt={3}>
      {/* CUSTOMER INFORMATION */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '12px',
          backgroundColor: 'white',
        }}
      >
        <Typography variant='h6' fontWeight='bold' pb={1}>
          {t('orders.details.customerInfo.title')}
        </Typography>

        <Stack direction='row' alignItems='center' spacing={2} mt={1}>
          <Avatar sx={{ bgcolor: '#F3F6F9' }}>
            <PersonIcon color='secondary' />
          </Avatar>
          <Stack>
            <Typography fontWeight='bold'>{orderData?.client?.name}</Typography>
            {orderData?.client?.order_count && (
              <Typography color='textSecondary'>
                {orderData?.client?.order_count || 0}{' '}
                {t('orders.details.customerInfo.previousOrders')}
              </Typography>
            )}
          </Stack>
        </Stack>

        <Divider sx={{ my: 2, borderColor: '#F1F1F2' }} />

        {/* CONTACT INFO */}
        <Typography variant='h6' fontWeight='600' pb={1}>
          {t('orders.details.customerInfo.contactInfo')}
        </Typography>
        <Stack spacing={1} mt={1}>
          <Box sx={contactInfoStyle}>{orderData?.client?.phone}</Box>
          <Box sx={contactInfoStyle}>{orderData?.client?.email}</Box>
        </Stack>
      </Paper>

      {/* ORDER NOTE */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '12px',
          background: '#F3F6F9',
        }}
      >
        <Typography variant='h6' fontWeight='600'>
          {t('orders.details.customerInfo.orderNote')}
        </Typography>
        <Typography
          sx={{
            mt: 1,
            color: 'text.secondary',
          }}
        >
          {orderData?.order_date}
        </Typography>
      </Paper>

      {/* CAR INFORMATION */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '12px',
          backgroundColor: 'white',
        }}
      >
        <Typography variant='h6' fontWeight='600'>
          {t('orders.details.customerInfo.carInfo')}
        </Typography>
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            background: '#F3F6F9',
            borderRadius: '8px',
            color: 'text.secondary',
            textAlign: 'center',
          }}
        >
          {`${orderData?.client_car?.name} - ${orderData?.client_car?.model} ` ||
            t('orders.details.customerInfo.noCarInfo')}
        </Box>
      </Paper>


      {/* SIGNATURE */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '12px',
          backgroundColor: 'white',
        }}
      >
        <Typography variant='h6' fontWeight='600'>
          Signature
        </Typography>
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            background: '#F3F6F9',
            borderRadius: '8px',
            color: 'text.secondary',
            textAlign: 'center',
          }}
        >
         {orderData?.signature ? <img width='100%' height={200} src={orderData.signature} />: '~'}
        </Box>
      </Paper>
    </Stack>
  );
};

export default OrderInfo;
