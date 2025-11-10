import React from 'react';
import { Stack, Typography } from '@mui/material';
import MainImg from '../../../MainImg';

const PaymentDetails = ({ summaryData, t }) => {
  const paymentData = [
    { id: 1, price: summaryData?.subtotal, title: 'subtotal' },
    { id: 2, price: summaryData?.discount_value, title: 'discount' },
    { id: 3, price: summaryData?.tax, title: 'tax' },
    {
      id: 4,
      price: summaryData?.total,
      title: 'totalAmount',
      font: '700',
    },
    {
      id: 5,
      price: summaryData?.payed,
      title: 'totalPaid',
      font: 'bold',
      color: ' #4AB58E',
    },
    {
      id: 6,
      price: summaryData?.remain_pay,
      title: 'totalRemaining',
      font: 'bold',
      color: 'error.main',
    },
  ];

  return (
    <Stack spacing={2} py={2}>
      <Stack direction='row' alignItems='center' justifyContent='space-between'>
        <Typography variant='h5' color='initial' pb={1}>
          {t('orders.details.orderTap.paymentDetails')}
        </Typography>
      </Stack>
      <Stack spacing={2}>
        {paymentData?.map(item => (
          <React.Fragment key={item?.id}>
            <Stack direction='row' alignItems='center' justifyContent='space-between'>
              <Typography
                variant='body1'
                color={item?.color ? item?.color : 'initial'}
                sx={{
                  fontWeight: item?.font,
                }}
              >
                {t(`orders.details.orderTap.${item?.title}`)}
              </Typography>
              <Stack direction='row' alignItems='center' spacing={0.5}>
                <MainImg
                  name={item?.title === 'total' ? 'money.png' : 'money-grey.png'}
                  width={12}
                  alt='money'
                />
                <Typography
                  variant='body1'
                  sx={{
                    color:
                      item?.title === 'total'
                        ? 'initial'
                        : theme => theme.palette.text.secondary,
                    fontWeight: item?.title === 'total' ? 600 : 500,
                  }}
                >
                  {item?.price}
                </Typography>
              </Stack>
            </Stack>
          </React.Fragment>
        ))}
      </Stack>
    </Stack>
  );
};

export default PaymentDetails;
