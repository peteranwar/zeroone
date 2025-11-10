/* eslint-disable react/no-array-index-key */
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, FormControlLabel, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import * as yup from 'yup';
import { infoIcon } from '../../assets/icons';
import ToastError from '../../components/ToastError';
import ToastSuccess from '../../components/ToastSuccess';
import CustomInput from '../../components/controls/custom-input';
import { setServerErrors } from '../../helpers';
import RolesApiEndpoints from '../../services/roles/api';
import { useGetPermissions, useGetShowRole } from '../../services/roles/query';
import CustomCheckbox from './customCheckbox';

const RoleForm = ({ id, setOpen }) => {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const { data: roleData } = useGetShowRole(id);
  const { data: permissionsData } = useGetPermissions();

  const schema = yup.object({
    name: yup.string().required(() => i18n.t('validation.required')),
    permissions: yup
      .array()
      .of(yup.number())
      .min(1, () => i18n.t('validation.required')),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    reset,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: {
      name: '',
      permissions: [],
    },
  });

  const selectedPermissions = watch('permissions');

  useEffect(() => {
    if (id && roleData?.data) {
      const item = roleData.data;
      reset({
        name: item.name || '',
        permissions: item.permissions?.map(p => p.id) || [],
      });
    }
  }, [id, roleData, reset]);

  const handleTogglePermission = id => {
    const current = watch('permissions');
    const updated = current.includes(id)
      ? current.filter(p => p !== id)
      : [...current, id];

    setValue('permissions', updated, { shouldValidate: true });
  };

  const allPermissionIds = permissionsData
    ? Object.values(permissionsData.data)
        .flat()
        .map(p => p.id)
    : [];

  const isAllSelected =
    allPermissionIds.length > 0 &&
    allPermissionIds.every(id => selectedPermissions.includes(id));

  const handleSelectAll = checked => {
    setValue('permissions', checked ? allPermissionIds : [], {
      shouldValidate: true,
    });
  };

  const onSubmit = handleSubmit(async data => {
    try {
      const apiCall = id
        ? RolesApiEndpoints.editRole(id, { ...data, _method: 'put' })
        : RolesApiEndpoints.addRole(data);

      await apiCall;

      ToastSuccess(t(id ? 'roles.editToast' : 'roles.addToast'));
      queryClient.invalidateQueries({ queryKey: ['roles'] });
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
            label={t('roles.labelName')}
            placeholder={t('roles.labelName')}
            register={register}
            name='name'
            errors={errors}
            touchedFields={touchedFields}
          />
        </Grid>

        <Grid item xs={12}>
          <Stack
            direction='row'
            alignItems='center'
            justifyContent='space-between'
            mb={2}
          >
            <Typography variant='body1' fontWeight={600} color='text.secondary'>
              {t('roles.titleRole')}
            </Typography>
            <FormControlLabel
              sx={{ fontSize: '1px' }}
              control={
                <CustomCheckbox
                  checked={isAllSelected}
                  onChange={e => handleSelectAll(e.target.checked)}
                />
              }
              label={
                <Typography
                  fontWeight={500}
                  variant='body2'
                  textTransform='capitalize'
                  color='text.secondary'
                >
                  {t('roles.selectAll')}
                </Typography>
              }
            />
          </Stack>

          {permissionsData &&
            Object.entries(permissionsData.data).map(([group, perms]) => (
              <Box key={group} sx={{ mb: 3 }}>
                <Typography
                  variant='body1'
                  fontWeight={500}
                  mb={1}
                  sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}
                >
                  {t('roles.accessFor')} {group.replaceAll('_', ' ')} {infoIcon}
                </Typography>

                <Grid container spacing={1}>
                  {perms.map(item => (
                    <Grid item key={item.id}>
                      <FormControlLabel
                        control={
                          <CustomCheckbox
                            checked={selectedPermissions.includes(item.id)}
                            onChange={() => handleTogglePermission(item.id)}
                          />
                        }
                        label={
                          <Typography
                            fontWeight={500}
                            variant='body2'
                            textTransform='capitalize'
                            color='text.secondary'
                          >
                            {item.name.replaceAll('_', ' ')}
                          </Typography>
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}

          {errors.permissions && (
            <Typography color='error' mt={1} fontSize={13}>
              {errors.permissions.message}
            </Typography>
          )}
        </Grid>

        <Grid item xs={6}>
          <LoadingButton type='submit' variant='primary' fullWidth>
            {id ? t('shard.edit') : t('shard.add')}
          </LoadingButton>
        </Grid>
        <Grid item xs={6}>
          <Button variant='black' fullWidth onClick={() => handleCloseModal()}>
            {t('shard.cancel')}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RoleForm;
