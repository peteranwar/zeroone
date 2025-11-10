/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-bind */
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
import { useGetPositions } from '../../../services/shard/query';
import SettingsApiEndpoints from '../../../services/settings/api';
import PositionForm from './positionForm';
import PositionTableRow from './table/position-table-row';
import { permissions, usePermission } from '../../../constants';

const PositionsInfo = () => {
  const { t } = useTranslation();
  const { haveAccess } = usePermission();
  const hasCreateAccess = haveAccess(permissions.position.create);
  const hasUpdateAccess = haveAccess(permissions.position.update);
  const hasDeleteAccess = haveAccess(permissions.position.delete);

  const TABLE_HEAD = [
    { id: 'carNameEn ', label: t('setting.positionsInfo.table.positionEn'), width: 140 },
    { id: 'carNameAr ', label: t('setting.positionsInfo.table.positionAr'), width: 140 },
    { id: '', label: t('shard.action'), width: 88 },
  ];

  const queryClient = useQueryClient();
  const [open, setOpen] = useState({
    open: false,
    id: null,
  });

  const { dense, page, rowsPerPage, onChangePage, onChangeDense, onChangeRowsPerPage } =
    useTable({ defaultOrderBy: 'orderNumber' });

  const { data: positionsData, isLoading } = useGetPositions({
    page: Number(page + 1),
    per_page: rowsPerPage,
  });

  const handleDeleteRow = async id => {
    if (!id) return;
    try {
      await SettingsApiEndpoints.editPosition(id, { _method: 'delete' });
      ToastSuccess(t('setting.positionsInfo.deleteToast'));

      queryClient.invalidateQueries({ queryKey: ['positions'] });
    } catch (error) {
      ToastError(error || t('validation.toastError'));
    }
  };

  return (
    <Box>
      <Stack
        direction='row'
        alignItems='center'
        justifyContent='space-between'
        spacing={2}
      >
        <Typography variant='h5' sx={{ textTransform: 'uppercase' }}>
          {t('setting.labelPositions')}
        </Typography>
        <Button
          variant='primary'
          sx={{ px: 4 }}
          onClick={() => setOpen(prev => ({ ...prev, open: true }))}
          disabled={!hasCreateAccess}
        >
          {t('setting.positionsInfo.addPosition')}
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
          <Table>
            <TableHeadCustom
              headLabel={TABLE_HEAD}
              rowCount={positionsData?.data?.length}
              bg
            />

            <TableBody>
              {isLoading && [1, 2, 3, 4].map(el => <TableSkeleton key={el} />)}
              {positionsData?.data &&
                positionsData?.data?.length > 0 &&
                positionsData?.data?.map(row => (
                  <PositionTableRow
                    t={t}
                    hasUpdateAccess={hasUpdateAccess}
                    hasDeleteAccess={hasDeleteAccess}
                    key={row.id}
                    row={row}
                    onDeleteRow={() => handleDeleteRow(row?.id)}
                    onEditRow={() =>
                      setOpen(prev => ({ ...prev, open: true, id: row?.id }))
                    }
                  />
                ))}

              <TableNoData
                tableName={t('setting.positionsInfo.empData')}
                notFound={positionsData?.data?.length < 1}
              />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={
          positionsData?.pagination?.meta?.page?.total || positionsData?.data?.length
        }
        page={+page}
        rowsPerPage={rowsPerPage}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        backIconButtonProps={{
          disabled: !positionsData?.pagination?.meta?.page?.isPrevious,
        }}
        nextIconButtonProps={{
          disabled: !positionsData?.pagination?.meta?.page?.isNext,
        }}
        dense={dense}
        onChangeDense={onChangeDense}
      />

      <MainModal
        open={open.open}
        setOpen={() => setOpen(prev => ({ ...prev, open: false, id: null }))}
        title={
          open.id
            ? t('setting.positionsInfo.editPosition')
            : t('setting.positionsInfo.newPosition')
        }
      >
        <PositionForm id={open?.id} setOpen={setOpen} />
      </MainModal>
    </Box>
  );
};

export default PositionsInfo;
