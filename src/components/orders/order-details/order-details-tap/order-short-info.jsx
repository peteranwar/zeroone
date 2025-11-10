import { Stack, Typography } from '@mui/material';
import React from 'react';
import { spanStyle } from '../style';
import { renderStatuesColor, renderStatuesText } from '../../columns';

const OrderShortInfo = ({ t, orderData }) => {
  return (
    <Stack pb={4} spacing={2}>
      <Stack direction='row' alignItems='center' spacing={1}>
        <Typography variant='h5'>
          {t('orders.details.orderTap.order')}-{orderData?.code}
        </Typography>
        <Typography
          variant='body1'
          sx={{
            py: 0.5,
            px: 2,
            ...renderStatuesColor(orderData?.status?.toLowerCase()),
            borderRadius: '10px',
            width: 'maxContent',
          }}
        >
          {renderStatuesText(orderData?.status?.toLowerCase(), t)}
        </Typography>
      </Stack>
      <Stack direction='row' sx={{ color: 'text.secondary', flexWrap: 'wrap' }}>
        <Typography variant='body2'>{t('orders.details.orderTap.orderDate')}</Typography>
        <Typography
          variant='body2'
          sx={{
            fontWeight: 'bold',
            pl: 0.5,
          }}
        >
          {orderData?.order_date}
        </Typography>
        <Typography variant='body2' sx={spanStyle}>
          .
        </Typography>
        <Typography variant='body2'>
          {t('orders.details.orderTap.deliveryDate')}
        </Typography>
        <Typography
          variant='body2'
          sx={{
            fontWeight: 'bold',
            pl: 0.5,
          }}
        >
          {orderData?.delivery_date}
        </Typography>
        {orderData?.branch?.name && (
          <>
            <Typography variant='body2' sx={spanStyle}>
              .
            </Typography>
            <Typography variant='body2'>{t('orders.details.orderTap.branch')}</Typography>
            <Typography
              variant='body2'
              sx={{
                fontWeight: 'bold',
                pl: 0.5,
              }}
            >
              {orderData?.branch?.name}
            </Typography>
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default OrderShortInfo;
