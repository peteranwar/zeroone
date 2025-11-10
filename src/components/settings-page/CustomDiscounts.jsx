/* eslint-disable no-restricted-globals */
/* eslint-disable react/no-array-index-key */
import { Button, Chip, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const CustomDiscounts = ({
  discounts,
  setValue,
  setError,
  clearErrors,
  errors,
  register,
  hasUpdateAccess,
  watch,
}) => {
  const { t } = useTranslation();
  const discountInputValue = watch('discountsInput');

  const handleClick = () => {
    const input = document.getElementById('discount-input');
    const value = parseFloat(input.value);

    if (isNaN(value) || value <= 0 || value > 100) {
      setError('discounts', {
        type: 'manual',
        message: t('setting.settingInfo.errorDiscountMax'),
      });
      return;
    }

    if (isNaN(value) || discounts.map(Number).includes(value)) {
      setError('discounts', {
        type: 'manual',
        message: t('setting.settingInfo.errorDiscountExists'),
      });
      return;
    }

    clearErrors('discounts');
    setValue('discounts', [...discounts, value], { shouldValidate: true });
    input.value = '';
  };

  useEffect(() => {
    if (!isNaN(discountInputValue) && discountInputValue?.length === 0) {
      clearErrors('discounts');
    }
  }, [discountInputValue, clearErrors]);

  return (
    <>
      <Stack
        spacing={1}
        sx={{
          bgcolor: '#F3F6F9',
          p: '8px 14px',
          borderRadius: '12px',
        }}
      >
        {discounts.length > 0 && (
          <Stack direction='row' flexWrap='wrap' gap='6px' mt={0}>
            {discounts.map((val, index) => (
              <Chip
                key={index}
                label={`${val}%`}
                onDelete={() => {
                  const updated = discounts.filter((_, i) => i !== index);
                  setValue('discounts', updated, { shouldValidate: true });
                }}
                sx={{
                  '& .MuiChip-label': {
                    color: 'white',
                    fontWeight: 600,
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'white',
                    ':hover': {
                      color: 'white',
                    },
                  },
                  bgcolor: '#4AB58E',
                  px: 0.5,
                  height: '32px',
                  borderRadius: '10px',
                }}
              />
            ))}
          </Stack>
        )}

        <Stack
          direction='row'
          justifyContent='space-between'
          spacing={2}
          alignItems='center'
        >
          <TextField
            id='discount-input'
            name='discounts'
            placeholder={t('setting.settingInfo.placeDiscounts')}
            type='number'
            {...register('discountsInput')}
            sx={{
              '& .MuiOutlinedInput-root': {
                border: 'none',
                boxShadow: 'none',
                '& fieldset': {
                  border: 'none',
                },
                '&:hover fieldset': {
                  border: 'none',
                },
                '&.Mui-focused fieldset': {
                  border: 'none',
                },
              },
            }}
            inputProps={{ style: { padding: '0px 0px' } }}
          />
          <Button
            variant='contained'
            sx={{ py: 1, px: 2.5, minHeight: 0 }}
            onClick={handleClick}
            disabled={!hasUpdateAccess}
          >
            {t('setting.settingInfo.submit')}
          </Button>
        </Stack>
      </Stack>

      {errors.discounts?.message && (
        <Typography variant='body2' color='error' mt={0.5}>
          {errors.discounts.message}
        </Typography>
      )}
    </>
  );
};

export default CustomDiscounts;
