/* eslint-disable eqeqeq */
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { useGetPurchasesId } from '../../../services/inventory/purchase-orders/query';
import {
  renderStatuesColor,
  renderStatuesText,
} from '../../../components/orders/columns';
import { editIconAction } from '../../../assets/icons';
import Overview from '../../../components/inventory/overview';
import { useSettingsContext } from '../../../components/settings';
import PaymentSummary from '../../../components/inventory/paymentSummary';
import ItemList from '../../../components/inventory/itemList';
import MainModal from '../../../components/MainModal';
import PurchaseForm from './purchaseForm';
import PurchaseApiEndpoints from '../../../services/inventory/purchase-orders/api';
import ToastSuccess from '../../../components/ToastSuccess';
import ToastError from '../../../components/ToastError';

const PurchaseDetails = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const settings = useSettingsContext();
  const { t } = useTranslation();

  const { id } = useParams();
  const { data: purchaseData } = useGetPurchasesId(id);
  const overviewData = [
    {
      id: 1,
      title: t('inventory.purchase.details.warehouse'),
      content: purchaseData?.data?.source?.name,
    },
    {
      id: 2,
      title: t('inventory.purchase.details.branch'),
      content: purchaseData?.data?.destination?.name,
    },
    {
      id: 3,
      title: t('inventory.purchase.details.creator'),
      content: purchaseData?.data?.created_by?.name,
    },
    {
      id: 4,
      title: t('inventory.purchase.details.deliveryDate'),
      content: purchaseData?.data?.date,
    },
    {
      id: 5,
      title: t('inventory.purchase.details.note'),
      content: purchaseData?.data?.note,
    },
  ];
  const paymentData = [
    {
      id: 1,
      title: t('inventory.purchase.details.subtotal'),
      content: purchaseData?.data?.subtotal,
    },
    {
      id: 2,
      title: t('inventory.purchase.details.tax'),
      content: purchaseData?.data?.tax,
    },
    {
      id: 3,
      title: t('inventory.purchase.details.additionalCost'),
      content: purchaseData?.data?.additional_cost,
    },
    {
      id: 4,
      title: t('inventory.purchase.details.totalCost'),
      content: purchaseData?.data?.total,
    },
  ];

  const handleStatus = async status => {
    try {
      await PurchaseApiEndpoints.updateStatus({ purchase_id: id, status });
      ToastSuccess(t('inventory.purchase.details.updateStatusToast'));
      queryClient.invalidateQueries({
        queryKey: ['purchase-id'],
      });
      setOpen(false);
    } catch (error) {
      ToastError(error?.response?.data?.message || t('validation.toastError'));
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
            <Box component={Link} to='/inventory/internal-purchase-orders' lineHeight={0}>
              <KeyboardArrowLeftIcon />
            </Box>
            {purchaseData?.data?.purchase_no}
          </Typography>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            sx={{
              ...renderStatuesColor(purchaseData?.data?.status?.toLowerCase()),
              borderRadius: '10px',
              fontWeight: '500',
              py: 1,
              px: 4,
            }}
          >
            {renderStatuesText(purchaseData?.data?.status?.toLowerCase(), t)}
          </Box>
        </Stack>
        {purchaseData?.data?.status === 'draft' ? (
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
        ) : purchaseData?.data?.status === 'pending' ? (
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
        ) : purchaseData?.data?.status === 'approve' ? (
          <Button variant='success' onClick={() => handleStatus('complete')}>
            {t('inventory.purchase.details.completed')}
          </Button>
        ) : null}
      </Stack>

      <Overview t={t} data={overviewData} />
      {!Number(purchaseData?.data?.total) == 0 && (
        <PaymentSummary t={t} data={paymentData} />
      )}
      <ItemList
        itemData={purchaseData?.data?.items}
        status={purchaseData?.data?.status}
      />

      <MainModal
        open={open}
        setOpen={() => setOpen(false)}
        title={t('inventory.purchase.details.editPurchase')}
      >
        <PurchaseForm purchaseData={purchaseData?.data} setOpen={setOpen} />
      </MainModal>
    </Container>
  );
};

export default PurchaseDetails;
