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
import TransferOrderApiEndpoints from '../../../services/inventory/transfer-order/api';
import { useGetWarehouse } from '../../../services/inventory/warehouse/query';

const TransferForm = ({ setOpen, transferData }) => {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const { data: rawBranchesData } = useGetBranches();
  const { data: rawWarehouseData } = useGetWarehouse();

  const branchesData = useMemo(() => {
    return (
      rawBranchesData?.data?.map(branch => ({
        id: branch.id,
        name: branch.name[i18n.language] || branch.name.en,
      })) || []
    );
  }, [rawBranchesData, i18n.language]);

  const warehouseData = useMemo(() => {
    return (
      rawWarehouseData?.data?.map(item => ({
        id: item.id,
        name: item.name[i18n.language] || item.name.en,
      })) || []
    );
  }, [rawWarehouseData, i18n.language]);

  const schema = yup.object({
    source_id: yup.string().required(() => i18n.t('validation.required')),
    destination_id: yup.string().required(() => i18n.t('validation.required')),
  });

  const defaultValues = useMemo(
    () => ({
      source_id: transferData?.source?.id || '',
      destination_id: transferData?.destination?.id || '',
      destination_type: transferData?.destination?.type || 'Branch',
      source_type: transferData?.source?.type || 'Branch',
      date: transferData?.date || '',
      note: transferData?.note || '',
    }),
    [transferData]
  );
  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues,
  });

  useEffect(() => {
    if (transferData) {
      reset(defaultValues);
    }
  }, [transferData, defaultValues, reset]);

  const destinationType = useWatch({
    control,
    name: 'destination_type',
  });
  const sourceType = useWatch({
    control,
    name: 'source_type',
  });

  const onSubmit = handleSubmit(async data => {
    try {
      setLoading(true);
      const apiCall = transferData
        ? TransferOrderApiEndpoints.editTransferOrder(transferData?.id, {
          ...data,
          _method: 'put',
        })
        : TransferOrderApiEndpoints.addTransferOrder(data);
      const response = await apiCall;
      navigate(`/inventory/transferOrder/${response?.data?.id}`);
      ToastSuccess(
        t(transferData ? 'inventory.transfer.editToast' : 'inventory.transfer.addToast')
      );
      queryClient.invalidateQueries({
        queryKey: [transferData ? 'transfer-id' : 'transfer-orders'],
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
    reset()
  }

  return (
    <Box component='form' noValidate onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormLabel
            sx={{
              marginBottom: '10px',
              fontWeight: '600',
              color: '#0A0A0A',
              fontSize: '12px',
            }}
          >
            {t('inventory.transfer.labelSourceType')}
          </FormLabel>
          <Controller
            name='source_type'
            control={control}
            defaultValue='Branch'
            render={({ field }) => (
              <RadioGroup row {...field}>
                <FormControlLabel
                  value='Branch'
                  control={<Radio />}
                  label={t('inventory.purchase.Branches')}
                />
                <FormControlLabel
                  value='Warehouse'
                  control={<Radio />}
                  label={t('inventory.purchase.Warehouse')}
                />
              </RadioGroup>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomSelect
            label={t('inventory.transfer.source')}
            placeholder={t('inventory.transfer.PlaceSource')}
            name='source_id'
            control={control}
            errors={errors}
            options={sourceType === 'Warehouse' ? warehouseData : branchesData || []}
          />
        </Grid>
        <Grid item xs={12}>
          <FormLabel
            sx={{
              marginBottom: '10px',
              fontWeight: '600',
              color: '#0A0A0A',
              fontSize: '12px',
            }}
          >
            {t('inventory.purchase.labelDestinationType')}
          </FormLabel>
          <Controller
            name='destination_type'
            control={control}
            defaultValue='Branch'
            render={({ field }) => (
              <RadioGroup row {...field}>
                <FormControlLabel
                  value='Branch'
                  control={<Radio />}
                  label={t('inventory.purchase.Branches')}
                />
                <FormControlLabel
                  value='Warehouse'
                  control={<Radio />}
                  label={t('inventory.purchase.Warehouse')}
                />
              </RadioGroup>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomSelect
            label={t('inventory.transfer.destination')}
            placeholder={t('inventory.purchase.placeDestination')}
            name='destination_id'
            control={control}
            errors={errors}
            options={destinationType === 'Warehouse' ? warehouseData : branchesData || []}
          />
        </Grid>

        <Grid item xs={12}>
          <CustomDate
            label={t('inventory.transfer.date')}
            placeholder={t('inventory.purchase.labelDate')}
            name='date'
            control={control}
            errors={errors}
          />
        </Grid>
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
            {transferData ? t('shard.edit') : t('shard.add')}
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

export default TransferForm;
