/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-bind */
import {
  Box,
  Button,
  Container,
  Stack,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useSettingsContext } from '../../../components/settings';
import Scrollbar from '../../../components/scrollbar';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  useTable,
} from '../../../components/table';
import MainModal from '../../../components/MainModal';
import ToastSuccess from '../../../components/ToastSuccess';
import ToastError from '../../../components/ToastError';
import { permissions, usePermission } from '../../../constants';
import SupplierTableRow from './table/supplier-table-row';
import SupplierForm from './supplierForm';
import { useGetSuppliers } from '../../../services/inventory/suppliers/query';
import SuppliersApiEndpoints from '../../../services/inventory/suppliers/api';

const SuppliersList = () => {
  const queryClient = useQueryClient();
  const settings = useSettingsContext();
  const { t } = useTranslation();
  const [open, setOpen] = useState({
    open: false,
    id: null,
  });
  const { haveAccess } = usePermission();
  const hasCreateAccess = haveAccess(permissions.item.create);
  const hasUpdateAccess = haveAccess(permissions.item.update);
  const hasDeleteAccess = haveAccess(permissions.item.delete);

  const TABLE_HEAD = [
    { id: 'nameEn ', label: t('inventory.suppliers.table.nameEn'), width: 120 },
    {
      id: 'vat',
      label: t('inventory.suppliers.vat'),
      width: 120,
    },
    { id: 'phone', label: t('inventory.suppliers.table.phone'), width: 120 },
    { id: 'address', label: t('inventory.warehouse.table.address'), width: 120 },
    { id: '', label: t('shard.action'), width: 88 },
  ];

  const { dense, page, rowsPerPage, onChangePage, onChangeDense, onChangeRowsPerPage } =
    useTable({ defaultOrderBy: 'orderNumber' });

  const { data: suppliersData, isLoading } = useGetSuppliers({
    paginate: 1,
    page: Number(page + 1),
    per_page: rowsPerPage,
  });

  const handleDeleteRow = async id => {
    if (!id) return;
    try {
      await SuppliersApiEndpoints.editSupplier(id, { _method: 'delete' });
      ToastSuccess(t('inventory.suppliers.deleteToast'));

      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
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
              variant='primary'
              sx={{
                width: { xs: '100%', sm: '12rem' },
                borderColor: '#E2E8F0',
                gap: '10px',
              }}
              onClick={() => setOpen(prev => ({ ...prev, open: true }))}
              disabled={!hasCreateAccess}
            >
              {t('inventory.suppliers.addSupplier')}
            </Button>
          </Stack>

          <TableContainer
            sx={{
              position: 'relative',
              overflow: 'unset',
              pt: 3,
            }}
          >
            <Scrollbar>
              <Table sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  headLabel={TABLE_HEAD}
                  rowCount={suppliersData?.data?.length}
                />

                <TableBody>
                  {isLoading && [1, 2, 3, 4].map(el => <TableSkeleton key={el} />)}
                  {suppliersData?.data &&
                    suppliersData?.data?.length > 0 &&
                    suppliersData?.data?.map(row => (
                      <SupplierTableRow
                        hasUpdateAccess={hasUpdateAccess}
                        hasDeleteAccess={hasDeleteAccess}
                        t={t}
                        key={row.id}
                        row={row}
                        onDeleteRow={() => handleDeleteRow(row?.id)}
                        onEditRow={() =>
                          setOpen(prev => ({ ...prev, open: true, id: row?.id }))
                        }
                      />
                    ))}

                  <TableNoData
                    tableName={t('inventory.suppliers.empData')}
                    notFound={suppliersData?.data?.length < 1}
                  />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={
              suppliersData?.pagination?.meta?.page?.total || suppliersData?.data?.length
            }
            page={+page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            backIconButtonProps={{
              disabled: !suppliersData?.pagination?.meta?.page?.isPrevious,
            }}
            nextIconButtonProps={{
              disabled: !suppliersData?.pagination?.meta?.page?.isNext,
            }}
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Stack>
      </Container>

      <MainModal
        open={open.open}
        setOpen={() => setOpen(prev => ({ ...prev, open: false, id: null }))}
        title={
          open.id
            ? t('inventory.suppliers.editSupplier')
            : t('inventory.suppliers.newSupplier')
        }
      >
        <SupplierForm id={open?.id} setOpen={setOpen} />
      </MainModal>
    </Box>
  );
};

export default SuppliersList;
