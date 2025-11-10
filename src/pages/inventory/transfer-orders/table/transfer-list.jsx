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
import { toast } from 'react-toastify';
import { useSettingsContext } from '../../../../components/settings';
import Scrollbar from '../../../../components/scrollbar';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  useTable,
} from '../../../../components/table';
import MainModal from '../../../../components/MainModal';
import ToastSuccess from '../../../../components/ToastSuccess';
import TransferableRow from './transfer-table-row';
import { permissions, usePermission } from '../../../../constants';
import TransferForm from '../transfer-form';
import { useGetTransferOrders } from '../../../../services/inventory/transfer-order/query';
import TransferOrderApiEndpoints from '../../../../services/inventory/transfer-order/api';

const TransferList = () => {
  const queryClient = useQueryClient();
  const settings = useSettingsContext();
  const { t } = useTranslation();
  const [open, setOpen] = useState({
    open: false,
    id: null,
    rowData: null,
  });
  const { haveAccess } = usePermission();
  const hasCreateAccess = haveAccess(permissions.transfer.create);
  const hasUpdateAccess = haveAccess(permissions.transfer.update);
  const hasDeleteAccess = haveAccess(permissions.transfer.delete);

  const TABLE_HEAD = [
    { id: 'nameEn ', label: t('inventory.transfer.table.refNumber'), width: 140 },
    { id: 'refNumber ', label: t('inventory.transfer.table.source'), width: 120 },
    { id: 'destination', label: t('inventory.transfer.table.destination'), width: 120 },
    { id: 'phone', label: t('inventory.transfer.table.type'), width: 120 },
    { id: 'type', label: t('inventory.transfer.table.date'), width: 120 },
    { id: 'date', label: t('inventory.transfer.table.status'), width: 120 },
    { id: '', label: t('shard.action'), width: 88 },
  ];

  const { dense, page, rowsPerPage, onChangePage, onChangeDense, onChangeRowsPerPage } =
    useTable({ defaultOrderBy: 'orderNumber' });

  const { data: transferOrders, isLoading } = useGetTransferOrders({
    paginate: 1,
    page: Number(page + 1),
    per_page: rowsPerPage,
  });

  const handleDeleteRow = async id => {
    if (!id) return;
    try {
      await TransferOrderApiEndpoints.editTransferOrder(id, { _method: 'delete' });
      ToastSuccess(t('inventory.transfer.deleteToast'));

      queryClient.invalidateQueries({ queryKey: ['transfer-orders'] });
    } catch (error) {
      toast.error(error?.response?.data?.message || t('validation.toastError'));
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
              onClick={() => setOpen(prev => ({ ...prev, open: true }))}
              disabled={!hasCreateAccess}
            >
              {t('inventory.transfer.addTransfer')}
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
                  rowCount={transferOrders?.data?.length}
                />

                <TableBody>
                  {isLoading && [1, 2, 3, 4].map(el => <TableSkeleton key={el} />)}
                  {transferOrders?.data &&
                    transferOrders?.data?.length > 0 &&
                    transferOrders?.data?.map(row => (
                      <TransferableRow
                        hasUpdateAccess={hasUpdateAccess}
                        hasDeleteAccess={hasDeleteAccess}
                        t={t}
                        key={row.id}
                        row={row}
                        onDeleteRow={() => handleDeleteRow(row?.id)}
                        onEditRow={() =>
                          setOpen(prev => ({
                            ...prev,
                            open: true,
                            id: row?.id,
                            rowData: row,
                          }))
                        }
                      />
                    ))}

                  <TableNoData
                    tableName={t('inventory.transfer.empData')}
                    notFound={transferOrders?.data?.length < 1}
                  />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={
              transferOrders?.pagination?.meta?.page?.total ||
              transferOrders?.data?.length
            }
            page={+page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            backIconButtonProps={{
              disabled: !transferOrders?.pagination?.meta?.page?.isPrevious,
            }}
            nextIconButtonProps={{
              disabled: !transferOrders?.pagination?.meta?.page?.isNext,
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
            ? t('inventory.transfer.editTransfer')
            : t('inventory.transfer.newTransfer')
        }
      >
        <TransferForm rowData={open?.rowData} id={open?.id} setOpen={setOpen} />
      </MainModal>
    </Box>
  );
};

export default TransferList;
