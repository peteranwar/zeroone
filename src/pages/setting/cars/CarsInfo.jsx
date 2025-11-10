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
import MainModal from '../../../components/MainModal';
import Scrollbar from '../../../components/scrollbar';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  useTable,
} from '../../../components/table';
import ToastError from '../../../components/ToastError';
import ToastSuccess from '../../../components/ToastSuccess';
import { permissions, usePermission } from '../../../constants';
import SettingsApiEndpoints from '../../../services/settings/api';
import { useGetCars } from '../../../services/shard/query';
import CarForm from './carForm';
import CarTableRow from './table/car-table-row';

const CarsInfo = () => {
  const { t } = useTranslation();
  const { haveAccess } = usePermission();
  const hasCreateAccess = haveAccess(permissions.car.create);
  const hasUpdateAccess = haveAccess(permissions.car.update);
  const hasDeleteAccess = haveAccess(permissions.car.delete);

  const TABLE_HEAD = [
    { id: 'carNameEn ', label: t('setting.carInfo.table.carEn'), width: 120 },
    { id: 'carNameAr ', label: t('setting.carInfo.table.carAr'), width: 120 },
    { id: 'model', label: t('setting.carInfo.table.model'), width: 120 },
    { id: '', label: t('shard.action'), width: 88 },
  ];

  const queryClient = useQueryClient();
  const [open, setOpen] = useState({
    open: false,
    id: null,
  });

  const { dense, page, rowsPerPage, onChangePage, onChangeDense, onChangeRowsPerPage } =
    useTable({ defaultOrderBy: 'orderNumber' });

  const { data: carsData, isLoading } = useGetCars({
    page: Number(page + 1),
    per_page: rowsPerPage,
  });

  const handleDeleteRow = async id => {
    if (!id) return;
    try {
      await SettingsApiEndpoints.editCars(id, { _method: 'delete' });
      ToastSuccess(t('setting.carInfo.deleteToast'));

      queryClient.invalidateQueries({ queryKey: ['cars'] });
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
          {t('setting.labelCars')}
        </Typography>
        <Button
          variant='primary'
          sx={{ px: 4 }}
          onClick={() => setOpen(prev => ({ ...prev, open: true }))}
          disabled={!hasCreateAccess}
        >
          {t('setting.carInfo.addCar')}
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
              rowCount={carsData?.data?.length}
              bg
            />

            <TableBody>
              {isLoading && [1, 2, 3, 4].map(el => <TableSkeleton key={el} />)}
              {carsData?.data &&
                carsData?.data?.length > 0 &&
                carsData?.data?.map(row => (
                  <CarTableRow
                    t={t}
                    key={row.id}
                    row={row}
                    hasUpdateAccess={hasUpdateAccess}
                    hasDeleteAccess={hasDeleteAccess}
                    onDeleteRow={() => handleDeleteRow(row?.id)}
                    onEditRow={() =>
                      setOpen(prev => ({ ...prev, open: true, id: row?.id }))
                    }
                  />
                ))}

              <TableNoData
                tableName={t('setting.carInfo.empData')}
                notFound={carsData?.data?.length < 1}
              />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={carsData?.pagination?.meta?.page?.total || carsData?.data?.length}
        page={+page}
        rowsPerPage={rowsPerPage}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        backIconButtonProps={{
          disabled: !carsData?.pagination?.meta?.page?.isPrevious,
        }}
        nextIconButtonProps={{
          disabled: !carsData?.pagination?.meta?.page?.isNext,
        }}
        dense={dense}
        onChangeDense={onChangeDense}
      />

      <MainModal
        open={open.open}
        setOpen={() => setOpen(prev => ({ ...prev, open: false, id: null }))}
        title={open.id ? t('setting.carInfo.editCar') : t('setting.carInfo.newCar')}
      >
        <CarForm id={open?.id} setOpen={setOpen} />
      </MainModal>
    </Box>
  );
};

export default CarsInfo;
