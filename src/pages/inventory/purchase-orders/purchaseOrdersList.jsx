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
import { useNavigate } from 'react-router';
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
import { permissions, usePermission } from '../../../constants';
import PurchaseForm from './purchaseForm';
import PurchaseTableRow from './table/purchase-table-row';
import { useGetPurchases } from '../../../services/inventory/purchase-orders/query';

const PurchaseOrdersList = () => {
  const navigate = useNavigate();
  const settings = useSettingsContext();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { haveAccess } = usePermission();
  const hasCreateAccess = haveAccess(permissions.item.create);
  const hasUpdateAccess = haveAccess(permissions.item.update);
  const hasDeleteAccess = haveAccess(permissions.item.delete);

  const TABLE_HEAD = [
    {
      id: 'reference-number ',
      label: t('inventory.purchase.table.refNumber'),
      width: 120,
    },
    { id: 'supplier', label: t('inventory.purchase.table.supplier'), width: 120 },
    { id: 'destination', label: t('inventory.purchase.table.destination'), width: 120 },
    { id: 'delivery-date', label: t('inventory.purchase.table.date'), width: 120 },
    { id: 'status', label: t('shard.status'), width: 100 },
    { id: '', label: t('shard.action'), width: 88 },
  ];

  const { dense, page, rowsPerPage, onChangePage, onChangeDense, onChangeRowsPerPage } =
    useTable({ defaultOrderBy: 'orderNumber' });

  const { data: purchasesData, isLoading } = useGetPurchases({
    paginate: 1,
    page: Number(page + 1),
    per_page: rowsPerPage,
  });

   const externalPurchasesData = {
    ...purchasesData,
    data: purchasesData?.data
      ? purchasesData.data.filter(item => item?.type === 'external')
      : [],
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
                borderColor: '#E2E8F0',
                gap: '10px',
              }}
              onClick={() => setOpen(true)}
              disabled={!hasCreateAccess}
            >
              {t('inventory.purchase.add')}
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
                  rowCount={externalPurchasesData?.data?.length}
                />

                <TableBody>
                  {isLoading && [1, 2, 3, 4].map(el => <TableSkeleton key={el} />)}
                  {externalPurchasesData?.data &&
                    externalPurchasesData?.data?.length > 0 &&
                    externalPurchasesData?.data?.map(row => (
                      <PurchaseTableRow
                        hasUpdateAccess={hasUpdateAccess}
                        hasDeleteAccess={hasDeleteAccess}
                        t={t}
                        key={row.id}
                        row={row}
                        onViewRow={() =>
                          navigate(`/inventory/purchase-details/${row.id}`)
                        }
                      />
                    ))}

                  <TableNoData
                    tableName={t('inventory.purchase.empData')}
                    notFound={externalPurchasesData?.data?.length < 1}
                  />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={
              externalPurchasesData?.pagination?.meta?.page?.total || externalPurchasesData?.data?.length
            }
            page={+page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            backIconButtonProps={{
              disabled: !externalPurchasesData?.pagination?.meta?.page?.isPrevious,
            }}
            nextIconButtonProps={{
              disabled: !externalPurchasesData?.pagination?.meta?.page?.isNext,
            }}
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Stack>
      </Container>

      <MainModal
        open={open}
        setOpen={() => setOpen(false)}
        title={t('inventory.purchase.addNewPurchase')}
      >
        <PurchaseForm setOpen={setOpen} />
      </MainModal>
    </Box>
  );
};

export default PurchaseOrdersList;
