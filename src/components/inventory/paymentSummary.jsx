/* eslint-disable no-unused-vars */
import { Box, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { paymentSummaryIcon, sarIcon } from '../../assets/icons';

const PaymentSummary = ({ t, data }) => {
  return (
    <Stack
      sx={{
        borderRadius: '12px',
        backgroundColor: 'white',
      }}
      spacing={2}
      p={{ xs: 2, sm: 5 }}
      mt={2}
    >
      <Stack>
        <Box display='flex' direction='row' alignItems='center' gap='.5rem'>
          {paymentSummaryIcon}
          <Typography variant='h5' color='initial' sx={{ textTransform: 'uppercase' }}>
            {t('inventory.purchase.details.payment')}
          </Typography>
        </Box>

        <Grid container spacing={3} mt={1}>
          {data?.map(item => (
            <Grid item xs={6} key={item?.id}>
              <Stack spacing={1}>
                <Typography variant='body1' color='text.secondary'>
                  {item?.title}
                </Typography>
                <Typography variant='body1' fontWeight={600}>
                  {item?.content} {sarIcon}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
};

export default PaymentSummary;
