/* eslint-disable react/no-array-index-key */
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import * as yup from 'yup';
import ToastError from '../../../components/ToastError';
import ToastSuccess from '../../../components/ToastSuccess';
import CustomSelect from '../../../components/controls/CustomSelect';
import CustomInput from '../../../components/controls/custom-input';
import { setServerErrors } from '../../../helpers';
import SettingsApiEndpoints from '../../../services/settings/api';
import { useGetShowReferral } from '../../../services/settings/query';
import { useGetReferralCategory } from '../../../services/shard/query';

const ReferralForm = ({ id, setOpen }) => {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();

  const { data: referralData } = useGetShowReferral(id);

  const schema = yup.object({
    nameEn: yup.string().required(() => i18n.t('validation.required')),
    nameAr: yup.string().required(() => i18n.t('validation.required')),
  });


  const { data: referralCategory, isLoading: isReferralLoading } = useGetReferralCategory();


  const referralCategoryData = referralCategory?.data || [];
  const referralCategoryOptions = referralCategoryData?.map(
    (category) => ({
      id: category.id,
      name: i18n.language === 'ar' ? category.name.ar : category.name.en,
    })
  );


  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, touchedFields },
    control
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  useEffect(() => {
    if (id && referralData?.data) {
      const item = referralData.data;

      reset({
        nameEn: item.name?.en || '',
        nameAr: item.name?.ar || '',
        referral_category_id: item?.category?.id || '',
      });
    }
  }, [id, referralData, reset]);

  const onSubmit = handleSubmit(async data => {
    const formattedData = {
      name: {
        en: data.nameEn,
        ar: data.nameAr,
      },
      referral_category_id: data.referral_category_id
    };

    try {
      const apiCall = id
        ? SettingsApiEndpoints.editReferral(id, { ...formattedData, _method: 'put' })
        : SettingsApiEndpoints.addReferral(formattedData);

      await apiCall;

      ToastSuccess(
        t(id ? 'setting.referralsInfo.editToast' : 'setting.referralsInfo.addToast')
      );

      queryClient.invalidateQueries({ queryKey: ['referrals'] });
      setOpen(false);
    } catch (error) {
      if (error?.response?.status === 422) {
        setServerErrors(error.response.data.errors, setError);
      } else {
        ToastError(error?.response?.data?.message || t('validation.toastError'));
      }
    }
  });

  function handleCloseModal() {
    setOpen(false);
    reset()
  }

  return (
    <Box component='form' noValidate onSubmit={onSubmit}>
      <Grid container spacing={3.5}>
        <Grid item xs={12}>
          <CustomInput
            label={t('setting.referralsInfo.labelNameEn')}
            placeholder={t('setting.referralsInfo.placeName')}
            register={register}
            name='nameEn'
            errors={errors}
            touchedFields={touchedFields}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomInput
            label={t('setting.referralsInfo.labelNameAr')}
            placeholder={t('setting.referralsInfo.placeName')}
            register={register}
            name='nameAr'
            errors={errors}
            touchedFields={touchedFields}
          />
        </Grid>
        <Grid item xs={12}>


          <CustomSelect
            label='Referral Category'
            placeholder='Select Referral Category'
            name='referral_category_id'
            control={control}
            errors={errors}
            options={referralCategoryOptions || []}
          />
        </Grid>

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

export default ReferralForm;
