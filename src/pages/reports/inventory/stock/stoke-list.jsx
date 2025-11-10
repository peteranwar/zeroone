import {
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import UploadIcon from '@mui/icons-material/Upload';
import { useGetStock } from '../../../../services/reports/query';
import Scrollbar from '../../../../components/scrollbar';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  useTable,
} from '../../../../components/table';
import StockTableRow from './table/stock-table-row';
import CustomSelect from '../../../../components/controls/CustomSelect';
import { useGetBranches } from '../../../../services/branches/query';
import { useGetWarehouse } from '../../../../services/inventory/warehouse/query';
import { useGetItems } from '../../../../services/items/query';
import ReportsApiEndpoints from '../../../../services/reports/api';
import ToastError from '../../../../components/ToastError';

const StockList = () => {
  const { t, i18n } = useTranslation();
  const [filters, setFilters] = useState({});

  const { data: itemsData } = useGetItems({ parent: 1 });

  // Branches Data
  const { data: rawBranchesData } = useGetBranches();
  const branchesData =
    rawBranchesData?.data?.map(branch => ({
      id: branch.id,
      name: branch.name[i18n.language],
    })) || [];

  // WarehouseData
  const { data: rawWarehouseData } = useGetWarehouse();
  const warehouseData =
    rawWarehouseData?.data?.map(item => ({
      id: item.id,
      name: item.name[i18n.language],
    })) || [];

  const ServicesData = useMemo(() => {
    return (
      itemsData?.data?.map(service => ({
        id: service.id,
        name: i18n.language === 'ar' ? service.name.ar : service.name.en,
      })) || []
    );
  }, [i18n.language, itemsData]);

  const { dense, page, rowsPerPage, onChangePage, onChangeDense, onChangeRowsPerPage } =
    useTable({ defaultOrderBy: 'orderNumber' });

  const { data: stock, isLoading } = useGetStock({
    per_page: rowsPerPage,
    page: Number(page + 1),
    ...filters,
  });
  const stockData = stock?.data;

  const TABLE_HEAD = [
    {
      id: 'id',
      label: t('reports.inventory.stock.id'),
      width: 100,
    },
    { id: 'nameItem', label: t('reports.inventory.stock.name'), width: 100 },
    { id: 'stock', label: t('reports.inventory.stock.stock'), width: 100 },
    { id: 'cost', label: t('reports.inventory.stock.cost'), width: 100 },
    { id: 'unit_cost', label: t('reports.inventory.stock.unitCost'), width: 100 },
    { id: 'destination', label: t('reports.inventory.stock.destination'), width: 100 },
  ];

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'all',
  });

  const destinationType = useWatch({
    control,
    name: 'destination_type',
  });

  const onSubmit = handleSubmit(async data => {
    setFilters(data);
  });

  const handleExportExcel = async () => {
    await ReportsApiEndpoints.getStock({
      per_page: rowsPerPage,
      page: Number(page + 1),
      ...filters,
      exported: 1,
    })
      .then(res => {
        const fileUrl = res?.data?.file_url;
        if (fileUrl) {
          window.open(fileUrl);
        } else {
          ToastError(t('validation.toastError'));
        }
      })
      .catch(error => {
        ToastError(error || t('validation.toastError'));
      });
  };

  return (
    <Box sx={{ width: '100%' }} mt={{ xs: 3, sm: 2 }}>
      <Stack>
        <Box component='form' noValidate onSubmit={onSubmit}>
          <Stack alignItems='end' sx={{ display: { xs: 'flex', sm: 'none' } }}>
            <Button
              onClick={handleExportExcel}
              disabled={stockData?.length === 0}
              variant='success'
              startIcon={<UploadIcon sx={{ width: { xs: '14px', sm: '20px' } }} />}
            >
              {t('popupActions.exportExcel')}
            </Button>
          </Stack>
          <Grid
            container
            spacing={2}
            alignItems='center'
            justifyContent={{ xs: 'center', sm: 'start' }}
          >
            <Grid item xs={12} sm={6}>
              <FormLabel
                sx={{
                  fontWeight: '600',
                  color: '#0A0A0A',
                  fontSize: '12px',
                }}
              >
                {t('inventory.purchase.labelDestinationType')}
              </FormLabel>
              <Controller
                name='destination_type'
                control={control}
                defaultValue='branch'
                render={({ field }) => (
                  <RadioGroup row {...field}>
                    <FormControlLabel
                      value='branch'
                      control={<Radio />}
                      label={t('inventory.purchase.Branches')}
                    />
                    <FormControlLabel
                      value='warehouse'
                      control={<Radio />}
                      label={t('inventory.purchase.Warehouse')}
                    />
                  </RadioGroup>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: { xs: 'none', sm: 'grid' } }}>
              <Stack alignItems='end'>
                <Button
                  onClick={handleExportExcel}
                  disabled={stockData?.length === 0}
                  variant='success'
                  startIcon={<UploadIcon sx={{ width: '20px' }} />}
                >
                  {t('popupActions.exportExcel')}
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <CustomSelect
                label={t('inventory.purchase.labelDestination')}
                placeholder={t('inventory.purchase.placeDestination')}
                name='destination_id'
                control={control}
                errors={errors}
                options={
                  destinationType === 'warehouse' ? warehouseData : branchesData || []
                }
              />
            </Grid>

            <Grid item xs={12} sm={4} md={3}>
              <CustomSelect
                label={t('reports.inventory.stock.items')}
                placeholder={t('reports.inventory.stock.selectItem')}
                name='item_id'
                control={control}
                errors={errors}
                options={ServicesData}
              />
            </Grid>

            <Grid item xs={6} sm={2} mt={{ xs: 0, sm: 3 }}>
              <LoadingButton
                type='submit'
                loading={isLoading}
                variant='primary'
                fullWidth
              >
                {t('shard.search')}
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>
        <TableContainer
          sx={{
            position: 'relative',
            overflow: 'unset',
            pt: 2,
          }}
        >
          <Scrollbar>
            <Table sx={{ minWidth: 960 }}>
              <TableHeadCustom headLabel={TABLE_HEAD} rowCount={stockData?.length} />

              <TableBody>
                {isLoading && [1, 2, 3, 4].map(el => <TableSkeleton key={el} />)}
                {stockData &&
                  stockData?.length > 0 &&
                  stockData?.map(row => <StockTableRow key={row.id} row={row} />)}

                <TableNoData
                  tableName={t('reports.daily.empData')}
                  notFound={stockData?.length < 1}
                />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={stock?.pagination?.meta?.page?.total || stock?.data?.length}
          page={+page}
          rowsPerPage={rowsPerPage}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
          backIconButtonProps={{
            disabled: !stock?.pagination?.meta?.page?.isPrevious,
          }}
          nextIconButtonProps={{
            disabled: !stock?.pagination?.meta?.page?.isNext,
          }}
          dense={dense}
          onChangeDense={onChangeDense}
        />
      </Stack>
    </Box>
  );
};

export default StockList;
