/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable func-names */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { LoadingButton } from '@mui/lab';
import { useQueryClient } from 'react-query';
import { setServerErrors } from '../../helpers';
import ToastSuccess from '../../components/ToastSuccess';
import ToastError from '../../components/ToastError';
import { useSettingsContext } from '../../components/settings';
import CustomInput from '../../components/controls/custom-input';
import InputPassword from '../../components/controls/InputPassword';
import PhoneInput from '../../components/controls/phone-input';
import RulesAdmin from '../../components/employee/rules-admin';
import { useRouter } from '../../hooks';
import { useGetBranches } from '../../services/branches/query';
import { useGetEmployeeId } from '../../services/employees/query';
import CustomSelect from '../../components/controls/CustomSelect';
import EmployeesApiEndpoints from '../../services/employees/api';
import { useGetRoles } from '../../services/roles/query';

const typeData = [
  { id: 'employee', name: 'Employee' },
  { id: 'worker', name: 'Worker' },
];

const EmployeeForm = () => {
  const queryClient = useQueryClient();
  const settings = useSettingsContext();
  const { employee_id } = useParams();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
  const { data: employeeData } = useGetEmployeeId(employee_id);
  const { data: branchesData } = useGetBranches();
  const formattedBranches =
    branchesData?.data?.map(branch => ({
      id: branch.id,
      name: branch.name.en,
    })) || [];

  const { data: rolesData } = useGetRoles();

  const roles = rolesData?.data || [];

  const schema = yup
    .object({
      first_name: yup.string().required(i18n.t('validation.required')),
      last_name: yup.string().required(i18n.t('validation.required')),
      phone: yup.string().required(i18n.t('validation.required')),
      branch_id: yup.string().required(i18n.t('validation.required')),
      type: yup.string().required(i18n.t('validation.required')),
      password: employee_id
        ? yup.string()
        : yup.string().required('Password is required'),
      role_id: yup.number().required(i18n.t('validation.required')),
      email: yup
        .string()
        .email(i18n.t('validation.email'))
        .required(i18n.t('validation.required')),
    })
    .required();

  const defaultValues = useMemo(
    () => ({
      first_name: employeeData?.data?.first_name || '',
      last_name: employeeData?.data?.last_name || '',
      password: !employee_id ? employeeData?.data?.password || '' : '',
      phone: employeeData?.data?.phone || '',
      branch_id: employeeData?.data?.branch?.id || '',
      email: employeeData?.data?.email || '',
      type: employeeData?.data?.type || '',
      role_id: employeeData?.data?.role?.id || '',
    }),
    [employeeData]
  );

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

  useEffect(() => {
    if (employee_id) {
      reset(defaultValues);
    }
  }, [employeeData, defaultValues, employee_id, reset]);

  const onSubmit = handleSubmit(async data => {
    const newData = { ...data, dail_code: '+966' };
    try {
      setLoading(true);
      const apiCall = employee_id
        ? EmployeesApiEndpoints.editEmployee(employee_id, { ...newData, _method: 'put' })
        : EmployeesApiEndpoints.addEmployee(newData);
      await apiCall;
      ToastSuccess(
        t(
          employee_id
            ? 'employees.addEmployee.toastEdit'
            : 'employees.addEmployee.toastAdd'
        )
      );
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      router.push('/employees/list');
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

  return (
    <Box sx={{ width: '100%' }} mt={{ xs: 1, sm: 4 }}>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Box
          component='form'
          sx={{ width: '100%' }}
          noValidate
          autoComplete='off'
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Stack
                sx={{
                  height: '100%',
                  width: '100%',
                  borderRadius: '12px',
                  position: 'relative',
                  backgroundColor: 'white',
                }}
                spacing={2}
                p={{ xs: 2, sm: 5 }}
              >
                <Typography variant='h5' sx={{ textTransform: 'uppercase' }}>
                  {t('employees.addEmployee.overview')}
                </Typography>

                <Stack spacing={3} pt={1}>
                  <Stack spacing={2} direction='row'>
                    <CustomInput
                      label={t('employees.addEmployee.labelFirstNM')}
                      placeholder={t('employees.addEmployee.placeFirstNM')}
                      register={register}
                      name='first_name'
                      errors={errors}
                      touchedFields={touchedFields}
                      type='text'
                      id='first_name'
                    />
                    <CustomInput
                      label={t('employees.addEmployee.labelLastNM')}
                      placeholder={t('employees.addEmployee.placeLastNM')}
                      register={register}
                      name='last_name'
                      errors={errors}
                      touchedFields={touchedFields}
                      type='text'
                      id='last_name'
                    />
                  </Stack>
                  <InputPassword
                    label={t('employees.addEmployee.labelPass')}
                    placeholder='*****'
                    register={register}
                    name='password'
                    errors={errors}
                    touchedFields={touchedFields}
                    type='password'
                    id='password'
                  />
                  <CustomInput
                    label={t('employees.addEmployee.labelEmail')}
                    placeholder={t('employees.addEmployee.placeEmail')}
                    register={register}
                    name='email'
                    errors={errors}
                    touchedFields={touchedFields}
                    type='email'
                    id='email'
                  />
                  <PhoneInput
                    label={t('employees.addEmployee.labelPhone')}
                    placeholder={t('employees.addEmployee.placePhone')}
                    register={register}
                    name='phone'
                    errors={errors}
                    touchedFields={touchedFields}
                    type='number'
                    id='phone'
                  />
                  <CustomSelect
                    placeholder={t('employees.addEmployee.placeType')}
                    label={t('employees.addEmployee.labelType')}
                    name='type'
                    control={control}
                    errors={errors}
                    options={typeData}
                  />
                  <CustomSelect
                    placeholder={t('employees.addEmployee.placeBranch')}
                    label={t('employees.addEmployee.labelBranch')}
                    name='branch_id'
                    control={control}
                    errors={errors}
                    options={formattedBranches}
                  />

                  <Stack
                    direction='row'
                    spacing={2}
                    sx={{ display: { xs: 'none', md: 'flex' } }}
                    pt={1}
                  >
                    <LoadingButton
                      type='submit'
                      variant='contained'
                      sx={{ px: { sm: 7 } }}
                      loading={loading}
                    >
                      {employee_id
                        ? t('employees.addEmployee.btnEdit')
                        : t('employees.addEmployee.btnAdd')}
                    </LoadingButton>
                  </Stack>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack
                sx={{
                  height: '100%',
                  width: '100%',
                  borderRadius: '12px',
                  position: 'relative',
                  backgroundColor: 'white',
                }}
                spacing={2}
                p={{ xs: 2, sm: 5 }}
              >
                <Typography variant='h5' sx={{ textTransform: 'uppercase' }}>
                  {t('employees.addEmployee.rules')}
                </Typography>

                <RulesAdmin control={control} roles={roles} />

                <Stack
                  direction='row'
                  spacing={2}
                  sx={{ display: { xs: 'flex', md: 'none' } }}
                  pt={1}
                >
                  <LoadingButton
                    type='submit'
                    variant='contained'
                    sx={{ px: { sm: 7 } }}
                    loading={loading}
                  >
                    {employee_id
                      ? t('employees.addEmployee.btnEdit')
                      : t('employees.addEmployee.btnAdd')}
                  </LoadingButton>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default EmployeeForm;
