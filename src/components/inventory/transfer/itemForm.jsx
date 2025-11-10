/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Grid, IconButton, Stack } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { deleteIconAction } from '../../../assets/icons';
import { setServerErrors } from '../../../helpers';
import TransferOrderApiEndpoints from '../../../services/inventory/transfer-order/api';
import { useGetShowItem } from '../../../services/inventory/transfer-order/query';
import { useGetItems } from '../../../services/items/query';
import ToastSuccess from '../../ToastSuccess';
import CustomSelect from '../../controls/CustomSelect';
import CustomInput from '../../controls/custom-input';

const ItemForm = ({ id, setOpen }) => {
  const { id: transfer_id } = useParams();
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const { data: itemsData } = useGetItems({ parent: 1 });
  const formattedItems =
    itemsData?.data?.map(item => ({
      id: item.id,
      name: item.name[i18n.language],
    })) || [];

  const { data: itemData } = useGetShowItem({
    transfer_id,
    item_id: id,
  });

  const schema = yup.object({
    items: yup.array().of(
      yup.object().shape({
        id: yup.string().required(() => i18n.t('validation.required')),
        qty: yup.string().required(() => i18n.t('validation.required')),
      })
    ),
  });

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    reset,
    watch,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: {
      items: [{ id: '', qty: '' }],
    },
  });

  const items = watch('items');

  useEffect(() => {
    if (id && itemData) {
      reset({
        items: [
          {
            id: itemData?.data?.item?.id || '',
            qty: Number(itemData?.data?.qty) || '',
          },
        ],
      });
    }
  }, [id, itemData, reset]);

  const addPosition = () => {
    setValue('items', [...items, { id: '', qty: '' }]);
  };

  const removePosition = index => {
    const updated = [...items];
    updated.splice(index, 1);
    setValue('items', updated);
  };

  const onSubmit = handleSubmit(async data => {
    const payload = id
      ? {
          transfer_id,
          item_id: data?.items[0]?.id,
          qty: data?.items[0]?.qty,
        }
      : { transfer_id, items };
    try {
      const apiCall = id
        ? TransferOrderApiEndpoints.updateItem(payload)
        : TransferOrderApiEndpoints.addItem(payload);

      await apiCall;

      ToastSuccess(
        t(
          id
            ? 'inventory.purchase.details.items.editToast'
            : 'inventory.purchase.details.items.addToast'
        )
      );

      queryClient.invalidateQueries({ queryKey: ['transfer-id'] });
      setOpen(false);
    } catch (error) {
      if (error?.response?.status === 422) {
        setServerErrors(error.response.data.errors, setError);
      } else {
        toast.error(error?.response?.data?.message || t('validation.toastError'));
      }
    }
  });

  function handleCloseModal() {
    setOpen(false);
    reset()
  }


  return (
    <Box component='form' noValidate onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {items.map((_, index) => (
          <Grid item xs={12} key={index}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <CustomSelect
                label={t('inventory.purchase.details.items.labelItem')}
                placeholder={t('inventory.purchase.details.items.placeItem')}
                name={`items.${index}.id`}
                control={control}
                errors={{
                  [`items.${index}.id`]: errors?.items?.[index]?.id,
                }}
                options={formattedItems || []}
              />
              <Box sx={{ width: '100%' }}>
                <CustomInput
                  label={t('inventory.purchase.details.items.labelQty')}
                  placeholder={t('inventory.purchase.details.items.placeQty')}
                  register={register}
                  name={`items.${index}.qty`}
                  errors={{
                    [`items.${index}.qty`]: errors?.items?.[index]?.qty,
                  }}
                  touched={touchedFields}
                  type='number'
                />
              </Box>
            </Stack>
            {index !== 0 && (
              <Box textAlign='end' mb={index === items.length ? 0 : -2}>
                <IconButton
                  color='error'
                  onClick={() => removePosition(index)}
                  sx={{
                    fontSize: '13px',
                    fontWeight: '700 !important',
                    'svg': { height: '18px' },
                    p: 0,
                    gap: 0.5,
                    mt: 2,
                    ':hover': { background: 'transparent' },
                  }}
                >
                  {deleteIconAction}
                  {t('setting.carInfo.remove')}
                </IconButton>
              </Box>
            )}
          </Grid>
        ))}

        {!id && (
          <Grid item xs={12}>
            <Button
              onClick={addPosition}
              color='error'
              sx={{ p: 0, ':hover': { background: 'transparent' }, fontWeight: '700' }}
            >
              {t('inventory.purchase.details.items.addMore')}
            </Button>
          </Grid>
        )}

        <Grid item xs={6} mt={3}>
          <LoadingButton type='submit' variant='primary' fullWidth>
            {id ? t('shard.edit') : t('shard.add')}
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

export default ItemForm;
