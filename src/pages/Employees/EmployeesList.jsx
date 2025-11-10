/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Container,
  Stack,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import ToastSuccess from '../../components/ToastSuccess';
import ToastError from '../../components/ToastError';
import { useSettingsContext } from '../../components/settings';
import Scrollbar from '../../components/scrollbar';
import { TableHeadCustom, TableNoData, TableSkeleton } from '../../components/table';
import { useGetEmployees } from '../../services/employees/query';
import EmployeeTableRow from './table/employee-table-row';
import { useRouter } from '../../hooks';
import EmployeesApiEndpoints from '../../services/employees/api';
import { permissions, usePermission } from '../../constants';

const EmployeesList = () => {
  const queryClient = useQueryClient();
  const settings = useSettingsContext();
  const { t } = useTranslation();
  const router = useRouter();
  const { haveAccess } = usePermission();
  const hasCreateAccess = haveAccess(permissions.employee.create);
  const hasUpdateAccess = haveAccess(permissions.employee.update);
  const hasDeleteAccess = haveAccess(permissions.employee.delete);

  const TABLE_HEAD = [
    { id: 'EmpName ', label: t('employees.table.name'), width: 120 },
    { id: 'phoneNumber ', label: t('employees.table.phone'), width: 120 },
    { id: 'EmailAddress', label: t('employees.table.email'), width: 120 },
    { id: 'Type', label: t('employees.table.type'), width: 100 },
    { id: 'Branch', label: t('employees.table.branch'), width: 120 },
    { id: 'Rules', label: t('employees.table.rules'), width: 100 },
    { id: '', label: t('employees.table.action'), width: 88 },
  ];

  const { data: employeesData, isLoading } = useGetEmployees();

  const handleDeleteRow = async id => {
    if (!id) return;
    try {
      await EmployeesApiEndpoints.editEmployee(id, { _method: 'delete' });
      ToastSuccess(t('employees.toastDel'));

      queryClient.invalidateQueries({ queryKey: ['employees'] });
    } catch (error) {
      ToastError(error || t('validation.toastError'));
    }
  };

  return (
    <Box sx={{ width: '100%' }} mt={{ xs: 1, sm: 4 }}>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack
          sx={{
            height: '100%',
            width: '100%',
            borderRadius: '12px',
            position: 'relative',
            backgroundColor: 'white',
          }}
          spacing={2}
          p={3}
        >
          <Stack alignItems='end'>
            <Button
              variant='contained'
              sx={{
                width: { xs: '100%', sm: '12rem' },
                borderColor: '#E2E8F0',
                gap: '10px',
              }}
              component={Link}
              to='/employees/add'
              disabled={!hasCreateAccess}
            >
              {t('employees.btnAdd')}
            </Button>
          </Stack>

          <TableContainer
            sx={{
              position: 'relative',
              overflow: 'unset',
              pt: 1,
              '& .MuiTableRow-root:nth-last-child(-n+2) td, & .MuiTableRow-root:nth-last-child(-n+2) th':
                {
                  borderBottom: 'none',
                },
            }}
          >
            <Scrollbar>
              <Table sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  headLabel={TABLE_HEAD}
                  rowCount={employeesData?.data?.length}
                />

                <TableBody>
                  {isLoading && [1, 2, 3, 4].map(el => <TableSkeleton key={el} />)}
                  {employeesData?.data &&
                    employeesData?.data?.length > 0 &&
                    employeesData?.data?.map(row => (
                      <EmployeeTableRow
                        hasUpdateAccess={hasUpdateAccess}
                        hasDeleteAccess={hasDeleteAccess}
                        t={t}
                        key={row.id}
                        row={row}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => router.push(`/employees/edit/${row.id}`)}
                      />
                    ))}

                  <TableNoData
                    tableName={t('employees.table.empData')}
                    notFound={employeesData?.data?.length < 1}
                  />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        </Stack>
      </Container>
    </Box>
  );
};

export default EmployeesList;
