/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable camelcase */
import { Box, Button, Container, Grid, Stack } from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';
import MainImg from '../../components/MainImg';
import ImagesTap from '../../components/orders/order-details/images-tap';
import JobOrderTap from '../../components/orders/order-details/job-order-tap';
import OrderDetailsTap from '../../components/orders/order-details/order-details-tap';
import OrderInfo from '../../components/orders/order-details/order-info';
import { useSettingsContext } from '../../components/settings';
import ConfirmStatusDialog from '../../components/shared/ConfirmStatusDialog';
import ToastError from '../../components/ToastError';
import ToastSuccess from '../../components/ToastSuccess';
import { permissions, usePermission } from '../../constants';
import OrdersApiEndpoints from '../../services/orders/api';
import { useGetOrderById } from '../../services/orders/query';

function CustomTabPanel({ children, value, index, ...other }) {
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const OrderDetails = () => {
  const { t } = useTranslation();
  const settings = useSettingsContext();
  const { orderId } = useParams();
  const queryClient = useQueryClient();
  const { haveAccess } = usePermission();
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const [value, setValue] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, status: '' });
  const [loading, setLoading] = useState(false);

  const { data: orderData } = useGetOrderById(orderId);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeStatus = status => {
    if (status === 'complete') {
      const remainingPayment = Number(orderData?.data?.summary?.remain_pay || 0);
      const afterImagesCount =
        orderData?.data?.media?.filter(img => img.type === 'after')?.length || 0;
      if (afterImagesCount < 5) {
        toast.error(t('orders.details.status.completePhotos'));
        return;
      }
      if (remainingPayment > 0) {
        toast.error(t('orders.details.status.completePayment'));
        return;
      }
    }

    const data = { order_id: orderId, status };

    setLoading(true);
    OrdersApiEndpoints.updateOrderStatus(data)
      .then(() => {
        ToastSuccess(t('orders.details.status.toastSuccess'));
        queryClient.invalidateQueries({ queryKey: ['order_id'] });
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      })
      .catch(error => {
        ToastError(error?.response?.data?.message || t('validation.toastError'));
      })
      .finally(() => {
        setLoading(false);
        setConfirmDialog({ open: false, status: '' });
      });
  };

  const hasChangeStatusAccess = haveAccess(permissions.order.changeStatus);
  const hasShowJobOrderAccess = haveAccess(permissions.order.showJobOrder);

  return (
    <Box sx={{ width: '100%' }} mt={{ xs: 1, sm: 4 }}>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack spacing={2} sx={{ borderRadius: '12px', backgroundColor: 'white' }} py={3}>
          <Box sx={{ width: '100%' }}>
            <Box
              display='flex'
              justifyContent='space-between'
              sx={{ flexDirection: { xs: 'column-reverse', md: 'row' } }}
              px={3}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label='tabs'
                indicatorColor='secondary'
                textColor='secondary'
              >
                <Tab label={t('orders.details.orderDetailsTap')} {...a11yProps(0)} />
                <Tab label={t('orders.details.imagesTap')} {...a11yProps(1)} />
                <Tab
                  label={t('orders.details.jobOrderTap')}
                  {...a11yProps(2)}
                  disabled={!hasShowJobOrderAccess}
                />
              </Tabs>

              <Stack direction='row' spacing={3}>
                {orderData?.data?.status === 'in-progress' && (
                  <>
                    <Button
                      disabled={!hasChangeStatusAccess}
                      onClick={() => setConfirmDialog({ open: true, status: 'ready' })}
                      variant='success'
                    >
                      {t('orders.details.ready')}
                    </Button>
                    <Button
                      disabled={!hasChangeStatusAccess}
                      onClick={() => setConfirmDialog({ open: true, status: 'cancel' })}
                      variant='danger'
                    >
                      {t('orders.details.cancelOrder')}
                    </Button>
                  </>
                )}
                {orderData?.data?.status === 'ready' && (
                  <Button
                    disabled={!hasChangeStatusAccess}
                    onClick={() => setConfirmDialog({ open: true, status: 'complete' })}
                    variant='success'
                  >
                    {t('orders.details.complete')}
                  </Button>
                )}
                {orderData?.data?.status === 'complete' && (
                  <Box
                    component='a'
                    href={orderData?.data?.invoice_url}
                    target='_blank'
                    display='flex'
                    alignItems='center'
                    fontWeight='bold'
                    color='primary'
                    sx={{ textDecoration: 'underline', cursor: 'pointer', gap:1}}
                  >
                    <MainImg name='pdf.svg' alt='invoice' />
                    {t('orders.details.viewInvoice')}
                  </Box>
                )}
              </Stack>
            </Box>

            {/* Tab Panels */}
            {value === 0 && (
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={12}
                  md={7}
                  sx={{ borderRight: '1px solid #F1F1F2', pr: 2 }}
                >
                  <CustomTabPanel value={value} index={0}>
                    <OrderDetailsTap orderData={orderData?.data} />
                  </CustomTabPanel>
                </Grid>
                <Grid item xs={12} md={5}>
                  <OrderInfo orderData={orderData?.data} t={t} />
                </Grid>
              </Grid>
            )}
            {value === 1 && (
              <CustomTabPanel value={value} index={1}>
                <ImagesTap
                  status={orderData?.data?.status}
                  OrderImages={orderData?.data?.media}
                  t={t}
                />
              </CustomTabPanel>
            )}
            {value === 2 && (
              <CustomTabPanel value={value} index={2}>
                <Stack alignItems='end'>
                  <Button
                    variant='contained'
                    color='error'
                    sx={{ width: 'fit-content' }}
                    onClick={reactToPrintFn}
                  >
                    {t('orders.details.print')}
                  </Button>
                </Stack>
                <div ref={contentRef} className='print-area'>
                  <MainImg
                    name='logo.png'
                    alt='zerOne-it logo'
                    width={110}
                    height={30}
                    className='print-logo'
                    sx={{ display: 'none' }}
                  />
                  <JobOrderTap orderData={orderData?.data} t={t} />
                </div>
              </CustomTabPanel>
            )}
          </Box>
        </Stack>
      </Container>

      {/* Confirm Dialog */}
      <ConfirmStatusDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, status: '' })}
        onConfirm={() => handleChangeStatus(confirmDialog.status)}
        loading={loading}
        statusName={confirmDialog.status}
      />
    </Box>
  );
};

export default OrderDetails;
