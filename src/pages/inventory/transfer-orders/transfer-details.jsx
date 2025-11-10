/* eslint-disable eqeqeq */
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { editIconAction } from '../../../assets/icons';
import Overview from '../../../components/inventory/overview';
import PaymentSummary from '../../../components/inventory/paymentSummary';
import TransferItemList from '../../../components/inventory/transfer/transfer-items-list';
import MainModal from '../../../components/MainModal';
import {
  renderStatuesColor,
  renderStatuesText,
} from '../../../components/orders/columns';
import { useSettingsContext } from '../../../components/settings';
import ToastError from '../../../components/ToastError';
import ToastSuccess from '../../../components/ToastSuccess';
import TransferOrderApiEndpoints from '../../../services/inventory/transfer-order/api';
import { useGetTransferOrderId } from '../../../services/inventory/transfer-order/query';
import TransferForm from './transfer-form';

const TransferDetails = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const settings = useSettingsContext();
  const { t } = useTranslation();

  const { id } = useParams();
  const { data: transferData } = useGetTransferOrderId(id);
  const overviewData = [
    {
      id: 1,
      title: t('inventory.transfer.table.source'),
      content: transferData?.data?.source?.name,
    },
    {
      id: 2,
      title: t('inventory.purchase.details.destination'),
      content: transferData?.data?.destination?.name,
    },
    {
      id: 3,
      title: t('inventory.purchase.details.creator'),
      content: transferData?.data?.created_by?.name,
    },
    {
      id: 4,
      title: t('inventory.purchase.details.deliveryDate'),
      content: transferData?.data?.date,
    },
    {
      id: 5,
      title: t('inventory.purchase.details.note'),
      content: transferData?.data?.note,
    },
  ];
  const paymentData = [
    {
      id: 1,
      title: t('inventory.purchase.details.subtotal'),
      content: transferData?.data?.subtotal,
    },
    {
      id: 2,
      title: t('inventory.purchase.details.tax'),
      content: transferData?.data?.tax,
    },
    {
      id: 3,
      title: t('inventory.purchase.details.additionalCost'),
      content: transferData?.data?.additional_cost,
    },
    {
      id: 4,
      title: t('inventory.purchase.details.totalCost'),
      content: transferData?.data?.total,
    },
  ];

  const handleStatus = async status => {
    try {
      await TransferOrderApiEndpoints.updateStatus({ transfer_id: id, status });
      ToastSuccess(t('inventory.purchase.details.updateStatusToast'));
      queryClient.invalidateQueries({
        queryKey: ['transfer-id'],
      });
      setOpen(false);
    } catch (error) {
      ToastError(error || t('validation.toastError'));
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack
        my={2}
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'start', sm: 'center' }}
        justifyContent='space-between'
        spacing={2}
      >
        <Stack direction='row' alignItems='center' spacing={2}>
          <Typography variant='h5' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box component={Link} to='/inventory/purchase-orders' lineHeight={0}>
              <KeyboardArrowLeftIcon />
            </Box>
            {transferData?.data?.transfer_no}
          </Typography>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            sx={{
              ...renderStatuesColor(transferData?.data?.status?.toLowerCase()),
              borderRadius: '10px',
              fontWeight: '500',
              py: 1,
              px: 4,
            }}
          >
            {renderStatuesText(transferData?.data?.status?.toLowerCase(), t)}
          </Box>
        </Stack>
        {transferData?.data?.status === 'draft' ? (
          <Stack direction='row' alignItems='center' spacing={2}>
            <Button
              variant='black'
              sx={{ '& svg': { color: 'black' }, px: { sm: 5 } }}
              startIcon={editIconAction}
              onClick={() => setOpen(true)}
            >
              {t('shard.edit')}
            </Button>
            <Button variant='success' onClick={() => handleStatus('pending')}>
              {t('inventory.purchase.details.submitReview')}
            </Button>
          </Stack>
        ) : transferData?.data?.status === 'pending' ? (
          <Stack direction='row' alignItems='center' spacing={2}>
            <Button
              variant='black'
              sx={{ px: { sm: 5 } }}
              onClick={() => handleStatus('reject')}
            >
              {t('inventory.purchase.details.reject')}
            </Button>
            <Button variant='success' onClick={() => handleStatus('approve')}>
              {t('inventory.purchase.details.approved')}
            </Button>
          </Stack>
        ) : (transferData?.data?.status === 'approve' && transferData?.data?.type !== 'sending') ? (
          <Button variant='danger' onClick={() => handleStatus('close')}>
            {t('shard.close')}
          </Button>
        ) : null}
      </Stack>

      <Overview t={t} data={overviewData} />
      {!Number(transferData?.data?.total) == 0 && (
        <PaymentSummary t={t} data={paymentData} />
      )}
      <TransferItemList
        itemData={transferData?.data?.items}
        status={transferData?.data?.status}
        hideActionColumn={
          (transferData?.data?.status === 'close' && transferData?.data?.type === 'receive') ||
          (transferData?.data?.status === 'approve' && transferData?.data?.type === 'sending')
        }
      />

      <MainModal
        open={open}
        setOpen={() => setOpen(false)}
        title={t('inventory.purchase.details.editPurchase')}
      >
        <TransferForm transferData={transferData?.data} setOpen={setOpen} />
      </MainModal>
    </Container>
  );
};

export default TransferDetails;
