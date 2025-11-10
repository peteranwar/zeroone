import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router';
import { paymentIconTitle } from '../../../../assets/icons';
import { permissions, usePermission } from '../../../../constants';
import OrdersApiEndpoints from '../../../../services/orders/api';
import MainImg from '../../../MainImg';
import ConfirmDelete from '../../../shared/ConfirmDelete';
import ToastError from '../../../ToastError';
import ToastSuccess from '../../../ToastSuccess';
import { serviceHeadTHStyle } from '../style';
import PaymentForm from './add-payment-modal';

const PaymentsTable = ({ t, summary, paymentsData, clientname, detailsPage, status }) => {
  const [openMethodModal, setOpenMethodModal] = useState(false);
  const [open, setOpen] = useState({
    open: false,
    id: null,
  });
  const { orderId } = useParams();
  const queryClient = useQueryClient();
  const { haveAccess } = usePermission();

  const removePayment = () => {
    OrdersApiEndpoints.removePayments({
      order_id: orderId,
      payment_id: open.id,
    })
      .then(() => {
        ToastSuccess(t('orders.details.orderTap.removePaymentToaster'));
        queryClient.invalidateQueries({ queryKey: ['order_id'] });
        setOpen({ open: false, id: null });
      })
      .catch(error => {
        ToastError(error?.response?.data?.message || t('validation.toastError'));
      });
  };
  const hasCreatePaymentAccess = haveAccess(permissions.order.createPayment);
  const hasUpdatePaymentAccess = haveAccess(permissions.order.updatePayment);

  return (
    <Box pb={2} mt={4}>
      <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography
          variant='h5'
          textTransform='uppercase'
          display='flex'
          alignItems='center'
          gap={1}
        >
          {paymentIconTitle} {t('orders.details.orderTap.paymentRecords')}
        </Typography>
        {status !== 'cancel' && Number(summary?.remain_pay) !== 0 && (
          <Button
            disabled={!hasCreatePaymentAccess}
            variant='danger'
            onClick={() => setOpenMethodModal(true)}
          >
            {t('orders.details.orderTap.addPayment')}
          </Button>
        )}
      </Stack>

      {/* Table Container */}
      {paymentsData && paymentsData?.length > 0 && (
        <>
          <TableContainer component={Paper} sx={{ border: 'none', boxShadow: 'none' }}>
            <Table>
              {/* Table Head */}
              <TableHead sx={{ borderRadius: '12px' }}>
                <TableRow sx={{ backgroundColor: '#F3F6F9', borderRadius: '12px' }}>
                  <TableCell sx={serviceHeadTHStyle}>
                    {t('orders.details.orderTap.totalAmount')}
                  </TableCell>
                  <TableCell sx={serviceHeadTHStyle}>
                    {t('orders.details.orderTap.report')}
                  </TableCell>
                  <TableCell sx={serviceHeadTHStyle}>
                    {t('orders.details.orderTap.date')}
                  </TableCell>
                  <TableCell sx={serviceHeadTHStyle}>
                    {t('orders.details.orderTap.payment')}
                  </TableCell>
                  <TableCell sx={serviceHeadTHStyle}>
                    {t('orders.details.orderTap.status')}
                  </TableCell>

                  {status === 'in-progress' ||
                    (status === 'pending' && (
                      <TableCell sx={serviceHeadTHStyle}>
                        {t('home.table.action')}
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>

              {/* Table Body */}
              <TableBody>
                {paymentsData?.map(row => (
                  <TableRow key={row.id}>
                    {/* Total Amount Column */}
                    <TableCell
                      sx={{ fontWeight: 'bold', border: 'none', direction: 'ltr' }}
                    >
                      <MainImg
                        sx={{ marginInlineEnd: '.2rem' }}
                        name='money-grey.png'
                        width={12}
                        alt='money'
                      />
                      {row.total}
                    </TableCell>

                    {/* Report Column */}
                    <TableCell sx={{ border: 'none' }}>
                      <Typography component='span'>
                        <Trans
                          i18nKey='orders.details.orderTap.reportMsg'
                          values={{
                            name: clientname,
                            amount: `${row.total}`,
                            orderNumber: orderId,
                          }}
                          components={[
                            <strong style={{ fontWeight: 600 }} />,
                            <strong style={{ fontWeight: 600 }} />,
                            <strong style={{ fontWeight: 600 }} />,
                          ]}
                        />
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ border: 'none', whiteSpace: 'nowrap' }}>
                      {row.date}
                    </TableCell>

                    <TableCell sx={{ border: 'none' }}>{row.method}</TableCell>

                    <TableCell sx={{ border: 'none' }}>
                      {row.status === 'cancel' ? (
                        <Chip label={row.status} color='error' />
                      ) : (
                        <Chip
                          sx={{ color: 'white' }}
                          label={row.status || 'paid'}
                          color='success'
                        />
                      )}
                    </TableCell>
                    {(status === 'in-progress' ||
                      status === 'pending' ||
                      status === 'ready') &&
                      row.status === 'paid' && (
                        <TableCell sx={{ border: 'none' }}>
                          <IconButton
                            disabled={!hasUpdatePaymentAccess}
                            onClick={() => setOpen({ open: true, id: row.id })}
                            color='error'
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Divider sx={{ my: 2, borderColor: '#F1F1F2' }} />

          {/* summery */}
          {!detailsPage && (
            <Grid container spacing={1} mt={4} sx={{ maxWidth: '50%' }}>
              <Grid item xs={6}>
                <Typography color='text.secondary'>
                  {t('orders.create.totalPaid')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color='#4AB58E' textAlign='right'>
                  {summary?.payed} SAR
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography color='text.secondary'>
                  {t('orders.create.totalRemain')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color='error.main' textAlign='right' fontWeight='bold'>
                  {summary?.remain_pay} SAR
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2, borderColor: '#F1F1F2' }} />
              </Grid>
            </Grid>
          )}
        </>
      )}
      <PaymentForm
        maxAmount={summary?.remain_pay}
        minAmount={summary?.min_payment}
        open={openMethodModal}
        handleClose={() => setOpenMethodModal(false)}
      />

      <ConfirmDelete
        open={open.open}
        onClose={() => setOpen({ open: false, id: null })}
        onSubmitClicked={removePayment}
      />
    </Box>
  );
};

export default PaymentsTable;
