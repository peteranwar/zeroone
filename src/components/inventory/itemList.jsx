/* eslint-disable camelcase */
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router';
import { downloadIcon, inventoryIcon } from '../../assets/icons';
import { permissions, usePermission } from '../../constants';
import PurchaseApiEndpoints from '../../services/inventory/purchase-orders/api';
import MainModal from '../MainModal';
import Scrollbar from '../scrollbar';
import { TableHeadCustom, TableNoData } from '../table';
import ToastError from '../ToastError';
import ToastSuccess from '../ToastSuccess';
import ItemForm from './itemForm';
import ItemTableRow from './table/item-table-row';

const ItemList = ({ itemData, status }) => {
  const { id: purchase_id } = useParams();
  const { t } = useTranslation();
  const { haveAccess } = usePermission();
  const hasCreateAccess = haveAccess(permissions.internalPurchase.create);
  const hasUpdateAccess = haveAccess(permissions.internalPurchase.update);
  const hasDeleteAccess = haveAccess(permissions.internalPurchase.delete);

  const TABLE_HEAD = [
    { id: 'name ', label: t('inventory.purchase.details.items.name'), width: 120 },
    {
      id: 'quantity ',
      label: t('inventory.purchase.details.items.Quantity'),
      width: 120,
    },
    { id: 'cost', label: t('inventory.purchase.details.items.totalCost'), width: 120 },
    { id: '', label: t('shard.action'), width: 88 },
  ];

  const queryClient = useQueryClient();
  const [open, setOpen] = useState({
    open: false,
    id: null,
  });

  const handleDeleteRow = async id => {
    if (!id) return;
    try {
      await PurchaseApiEndpoints.deleteItem({ purchase_id, item_id: id });
      ToastSuccess(t('inventory.purchase.details.items.deleteToast'));

      queryClient.invalidateQueries({ queryKey: ['purchase-id'] });
    } catch (error) {
      ToastError(error || t('validation.toastError'));
    }
  };

  return (
    <Box
      sx={{
        borderRadius: '12px',
        backgroundColor: 'white',
      }}
      p={{ xs: 2, sm: 5 }}
      mt={4}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'start', sm: 'center' }}
        justifyContent='space-between'
        spacing={2}
      >
        <Box display='flex' direction='row' alignItems='center' gap='.5rem'>
          {inventoryIcon}
          <Typography variant='h5' color='initial' sx={{ textTransform: 'uppercase' }}>
            {t('inventory.purchase.details.items.items')}
          </Typography>
        </Box>
        {(status === 'draft' || status === 'pending') && (
          <Stack direction='row' alignItems='center' spacing={2}>
            <Button
              variant='primary'
              onClick={() => setOpen(prev => ({ ...prev, open: true }))}
              disabled={!hasCreateAccess}
            >
              {t('inventory.purchase.details.items.add')}
            </Button>

            <Button variant='outlined' startIcon={downloadIcon}>
              {t('inventory.purchase.details.items.import')}
            </Button>
          </Stack>
        )}
      </Stack>

      <TableContainer
        sx={{
          position: 'relative',
          overflow: 'unset',
          pt: 2,
          '& .MuiTableRow-root:nth-last-child(-n+2) td, & .MuiTableRow-root:nth-last-child(-n+2) th':
            {
              borderBottom: 'none',
            },
        }}
      >
        <Scrollbar>
          <Table>
            <TableHeadCustom headLabel={TABLE_HEAD} rowCount={itemData?.length} />

            <TableBody>
              {itemData &&
                itemData?.length > 0 &&
                itemData?.map(row => (
                  <ItemTableRow
                    t={t}
                    key={row.id}
                    row={row}
                    status={
                      status === 'approve' || status === 'complete' || status === 'reject'
                    }
                    hasUpdateAccess={hasUpdateAccess}
                    hasDeleteAccess={hasDeleteAccess}
                    onDeleteRow={() => handleDeleteRow(row?.item?.id)}
                    onEditRow={() =>
                      setOpen(prev => ({ ...prev, open: true, id: row?.item?.id }))
                    }
                  />
                ))}

              <TableNoData
                tableName={t('inventory.purchase.details.items.empData')}
                notFound={itemData?.length < 1}
              />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <MainModal
        open={open.open}
        setOpen={() => setOpen(prev => ({ ...prev, open: false, id: null }))}
        title={
          open.id
            ? t('inventory.purchase.details.items.editItem')
            : t('inventory.purchase.details.items.addItem')
        }
      >
        <ItemForm id={open?.id} setOpen={setOpen} />
      </MainModal>
    </Box>
  );
};

export default ItemList;
