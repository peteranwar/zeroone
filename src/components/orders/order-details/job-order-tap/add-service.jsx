/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Grid } from '@mui/material';
import i18n from 'i18next';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import * as yup from 'yup';
import OrdersApiEndpoints from '../../../../services/orders/api';
import CustomInput from '../../../controls/custom-input';
import ToastError from '../../../ToastError';
import ToastSuccess from '../../../ToastSuccess';

const AddService = ({ orderId, itemId,handleCloseModal }) => {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const schema = yup
        .object({
            service: yup.string().required(() => i18n.t('validation.required')),
        })
        .required();

    const {
        control,
        register,
        handleSubmit,
        setError,
        getValues,
        watch,
        reset,
        formState: { errors, touchedFields },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'all',
    });

    const onSubmit = handleSubmit(async data => {
        setLoading(true);
        OrdersApiEndpoints.updateJobOrderById({
            order_id: orderId,
            item_id: itemId,
            'additional_service': [{
                name: data.service,
                length: data.length,
            }],
        })
            .then(() => {
                ToastSuccess(t('orders.details.jopTap.updateSuccess'));
                queryClient.invalidateQueries({ queryKey: ['job_order_id'] });
                handleCloseModal()
            })
            .catch(error => {
                ToastError(error || t('validation.toastError'));
            })
            .finally(() => {
                setLoading(false);
            });
    });

    return (
        <Box
            component='form'
            sx={{ width: '100%' }}
            noValidate
            autoComplete='off'
            onSubmit={handleSubmit(onSubmit)}
        >
            <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item xs={12} md={12}>
                    <CustomInput
                        label='Service name'
                        placeholder='Service name'
                        register={register}
                        name='service'
                        errors={errors}
                        touchedFields={touchedFields}
                        type='text'
                        id='service'
                    />
                </Grid>

                <Grid item xs={12} md={12}>
                    <CustomInput
                        label='Service length'
                        placeholder='Service length'
                        register={register}
                        name='length'
                        errors={errors}
                        touchedFields={touchedFields}
                        type='number'
                        id='length'
                    />
                </Grid>
                <Grid item md={12}>
                    <LoadingButton type='submit' variant='primary' loading={loading} fullWidth>
                        Add
                    </LoadingButton>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AddService;
