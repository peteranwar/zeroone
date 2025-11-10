/* eslint-disable react/no-array-index-key */
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import * as yup from 'yup';
import CustomInput from '../../../components/controls/custom-input';
import CustomDate from '../../../components/controls/CustomDate';
import CustomSelect from '../../../components/controls/CustomSelect';
import ToastError from '../../../components/ToastError';
import ToastSuccess from '../../../components/ToastSuccess';
import { setServerErrors } from '../../../helpers';
import { useGetBranches } from '../../../services/branches/query';
import PurchaseApiEndpoints from '../../../services/inventory/purchase-orders/api';
import { useGetSuppliers } from '../../../services/inventory/suppliers/query';
import { useGetWarehouse } from '../../../services/inventory/warehouse/query';

const PurchaseForm = ({ purchaseData, setOpen }) => {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Branches Data
  const { data: rawBranchesData } = useGetBranches();
  const branchesData =
    rawBranchesData?.data?.map(branch => ({
      id: branch.id,
      name: branch.name[i18n.language],
    })) || [];

  // WarehouseData
  const { data: rawWarehouseData } = useGetWarehouse();
  const warehouseData =
    rawWarehouseData?.data?.map(item => ({
      id: item.id,
      name: item.name[i18n.language],
    })) || [];

  const schema = yup.object({
    sourceable_id: yup.string().required(() => i18n.t('validation.required')),
    destination_id: yup.string().required(() => i18n.t('validation.required')),
  });

  const defaultValues = useMemo(
    () => ({
      supplier_id: purchaseData?.supplier?.id || null,
      destination_id: purchaseData?.destination?.id || '',
      destination_type: purchaseData?.destination?.type || 'Branch',
      delivery_date: purchaseData?.date || '',
      note: purchaseData?.note || '',
      additional_cost: Number(purchaseData?.additional_cost) || '',
      tax: Number(purchaseData?.tax) || '',
      type: "internal",
      sourceable_id: purchaseData?.source?.id || '',
      sourceable_type: purchaseData?.source?.type || '',
    }),
    [purchaseData]
  );

  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const destinationType = useWatch({
    control,
    name: 'destination_type',
  });

  useEffect(() => {
    if (purchaseData) {
      reset(defaultValues);
    }
  }, [purchaseData, defaultValues, reset]);

  const onSubmit = handleSubmit(async formData => {

    const data = {
      ...formData,
      type: 'internal',
      sourceable_type: "Warehouse", 
      destination_type: "Branch", 
    };
    
    try {
      setLoading(true);
      const apiCall = purchaseData
        ? PurchaseApiEndpoints.editPurchase(purchaseData?.id, { ...data, _method: 'put' })
        : PurchaseApiEndpoints.addPurchase(data);


      const response = await apiCall;
      
      navigate(`/inventory/internal-purchase-details/${response?.data?.id}`);
      ToastSuccess(
        t(purchaseData ? 'inventory.purchase.editToast' : 'inventory.purchase.addToast')
      );
      queryClient.invalidateQueries({
        queryKey: [purchaseData ? 'purchase-id' : 'purchases'],
      });
      setOpen(false);
    } catch (error) {
      if (error?.response?.status === 422) {
        setServerErrors(error.response.data.errors, setError);
      } else {
        ToastError(error?.response?.data?.message || t('validation.toastError'));
      }
    } finally {
      setLoading(false);
    }
  });

  function handleCloseModal() {
    setOpen(false);
    reset();
  }

  return (
    <Box component='form' noValidate onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
        </Grid>
        <Grid item xs={12}>
          <CustomSelect
            label={t('inventory.purchase.labelDestination')}
            placeholder={t('inventory.purchase.placeDestination')}
            name='sourceable_id'
            control={control}
            errors={errors}
            options={warehouseData || []}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomSelect
            label={t('inventory.purchase.labelBranch')}
            placeholder={t('inventory.purchase.placeBranch')}
            name='destination_id'
            control={control}
            errors={errors}
            options={branchesData || []}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomDate
            label={t('inventory.purchase.labelDate')}
            placeholder={t('inventory.purchase.labelDate')}
            name='delivery_date'
            control={control}
            errors={errors}
          />
        </Grid>
        {purchaseData && (
          <>
            <Grid item xs={6}>
              <CustomInput
                label={t('inventory.purchase.labelCost')}
                placeholder={t('inventory.purchase.labelCost')}
                register={register}
                name='additional_cost'
                errors={errors}
                touchedFields={touchedFields}
                type='number'
                labelEnd={t('shard.sar')}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomInput
                label={t('inventory.purchase.labelTax')}
                placeholder={t('inventory.purchase.labelTax')}
                register={register}
                name='tax'
                errors={errors}
                touchedFields={touchedFields}
                type='number'
                labelEnd={t('shard.sar')}
              />
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <CustomInput
            label={t('inventory.purchase.labelNote')}
            placeholder={t('inventory.purchase.placeNote')}
            register={register}
            name='note'
            errors={errors}
            touchedFields={touchedFields}
            type='textarea'
            otherProps={{
              multiline: true,
              rows: 4,
            }}
          />
        </Grid>

        <Grid item xs={6} mt={3}>
          <LoadingButton type='submit' loading={loading} variant='primary' fullWidth>
            {purchaseData ? t('shard.edit') : t('shard.add')}
          </LoadingButton>
        </Grid>
        <Grid item xs={6} mt={3}>
          <Button variant='black' fullWidth onClick={() => handleCloseModal()}>
            {t('shard.cancel')}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PurchaseForm;
