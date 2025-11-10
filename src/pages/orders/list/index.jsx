/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Select,
  Stack,
  Tab,
  Table,
  TableBody,
  TableContainer,
  Tabs,
} from '@mui/material';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import UploadIcon from '@mui/icons-material/Upload';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import InputSearch from '../../../components/controls/InputSearch';
import MultiDatepicker from '../../../components/orders/multi-date-picker';
import Scrollbar from '../../../components/scrollbar';
import { useSettingsContext } from '../../../components/settings';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  useTable,
} from '../../../components/table';
import ToastError from '../../../components/ToastError';
import { permissions, usePermission } from '../../../constants';
import { useResponsive } from '../../../hooks/use-responsive';
import BranchesApiEndpoints from '../../../services/branches/api';
import OrdersApiEndpoints from '../../../services/orders/api';
import { useGetOrders } from '../../../services/orders/query';
import OrderTableRow from './order-table-row';

const OrdersList = () => {
  const sm = useResponsive('down', 'sm');
  const { status: rawStatus } = useParams();
  const status = rawStatus === 'prepare' ? 'in-progress' : rawStatus;
  const settings = useSettingsContext();
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({
    delivery_date_from: null,
    delivery_date_to: null,
    branch_id: 'All',
  });
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedDates, setSelectedDates] = useState([]);
  const [type, setType] = useState('normal');

  const { haveAccess } = usePermission();
  const hasCreateAccess = haveAccess(permissions.order.create);

  const { data: branchesData } = useQuery(
    ['branches-data'],
    () => BranchesApiEndpoints.getBranches(),
    {
      select: data => [
        { id: 'All', branchNameEnglish: t('home.allBranches') },
        ...data.data.map(branch => ({
          id: branch.id,
          branchNameEnglish: branch.name?.[i18n.language],
        })),
      ],
    }
  );

  const ORDER_TABLE_HEAD = useMemo(
    () => [
      { id: 'orderId', label: t('orders.table.orderId'), width: 120 },
      { id: 'client', label: t('orders.table.client'), width: 120 },
      { id: 'phone', label: t('orders.table.phone'), width: 120 },
      { id: 'startDate', label: t('orders.table.startDate'), width: 120 },
      { id: 'deliveryDate', label: t('orders.table.deliveryDate'), width: 120 },
      { id: 'status', label: t('shard.status'), width: 140 },
      { id: 'action', label: t('shard.action'), width: 88 },
    ],
    [t]
  );

  const debouncedSetSearch = useCallback(
    debounce(value => setDebouncedSearch(value), 1000),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchQuery);
  }, [searchQuery, debouncedSetSearch]);

  const { dense, page, rowsPerPage, onChangePage, onChangeDense, onChangeRowsPerPage } =
    useTable({ defaultOrderBy: 'orderNumber' });

  const { data: ordersData, isLoading } = useGetOrders({
    per_page: rowsPerPage,
    page: Number(page + 1),
    type,
    status,
    branch_id: filters.branch_id !== 'All' ? filters.branch_id : undefined,
    delivery_date_from: filters.delivery_date_from,
    delivery_date_to: filters.delivery_date_to,
    search: debouncedSearch,
  });

  const handleApplyFilters = () => {
    const [from, to] = Array.isArray(selectedDates) ? selectedDates : [];
    setFilters({
      delivery_date_from: from ? dayjs(from).format('YYYY-MM-DD') : null,
      delivery_date_to: to ? dayjs(to).format('YYYY-MM-DD') : null,
      branch_id: selectedBranch,
    });
  };

  const isFilterDisabled =
    selectedBranch === 'All' && (!selectedDates?.[0] || !selectedDates?.[1]);

  const handleExportExcel = async () => {
    await OrdersApiEndpoints.getOrders({
      per_page: rowsPerPage,
      page: Number(page + 1),
      type,
      status,
      branch_id: filters.branch_id !== 'All' ? filters.branch_id : undefined,
      delivery_date_from: filters.delivery_date_from,
      delivery_date_to: filters.delivery_date_to,
      search: debouncedSearch,
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
          p={3}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 3 }}>
            <InputSearch
              placeholder={t('orders.table.search')}
              onChange={e => setSearchQuery(e.target.value)}
              value={searchQuery}
              type='search'
            />
            <Button
              component={Link}
              to='/orders/new'
              variant='primary'
              sx={{ textWrap: 'nowrap', px: '2.4rem' }}
              disabled={!hasCreateAccess}
            >
              {t('orders.table.create')}
            </Button>
          </Stack>

          <Grid container spacing={2} alignItems='center' py={2}>
            <Grid item xs={12} sm={3.5} md={3}>
              <Select
                value={selectedBranch}
                onChange={e => setSelectedBranch(e.target.value)}
                sx={{ py: 0.1 }}
                fullWidth
              >
                {branchesData?.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.branchNameEnglish}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} sm={3.5} md={3}>
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 100,
                  '& .rmdp-container': { display: 'flex !important' },
                }}
              >
                <MultiDatepicker
                  values={selectedDates}
                  setValues={setSelectedDates}
                  placeholder={t('home.incomeChart.placeDate')}
                  months={sm ? 1 : 2}
                />
                <CalendarMonthIcon
                  sx={{
                    position: 'absolute',
                    top: '.9rem',
                    [i18n.language === 'ar' ? 'right' : 'left']: '0.5rem',
                    color: '#878CBD',
                    zIndex: 2,
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={6} sm={2.3} md={3}>
              <Button
                variant='contained'
                sx={{ py: 1.6 }}
                color='primary'
                disabled={isFilterDisabled}
                onClick={handleApplyFilters}
              >
                {t('home.incomeChart.btnFilter')}
              </Button>
            </Grid>

            <Grid item xs={6} sm={2.7} md={3}>
              <Stack alignItems='end'>
                <Button
                  onClick={handleExportExcel}
                  disabled={ordersData?.data?.length === 0}
                  variant='success'
                  startIcon={<UploadIcon sx={{ width: '20px' }} />}
                >
                  {t('popupActions.exportExcel')}
                </Button>
              </Stack>
            </Grid>
          </Grid>

          <Tabs
            value={type}
            onChange={(e, newValue) => setType(newValue)}
            indicatorColor='secondary'
            textColor='secondary'
          >
            <Tab label={t('orders.table.normal')} value='normal' />
            <Tab label={t('orders.table.gift')} value='gift' />
            <Tab label={t('orders.table.warranty')} value='warranty' />
          </Tabs>

          <TableContainer sx={{ position: 'relative', overflow: 'unset', pt: 1 }}>
            <Scrollbar>
              <Table sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  headLabel={ORDER_TABLE_HEAD}
                  rowCount={ordersData?.data?.length}
                />
                <TableBody>
                  {isLoading ? (
                    [1, 2, 3, 4].map(el => <TableSkeleton key={el} />)
                  ) : ordersData?.data?.length > 0 ? (
                    ordersData.data.map(row => (
                      <OrderTableRow t={t} key={row.id} row={row} />
                    ))
                  ) : (
                    <TableNoData tableName={t('orders.table.empData')} notFound />
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={ordersData?.pagination?.meta?.page?.total || ordersData?.data?.length}
            page={+page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            backIconButtonProps={{
              disabled: !ordersData?.pagination?.meta?.page?.isPrevious,
            }}
            nextIconButtonProps={{
              disabled: !ordersData?.pagination?.meta?.page?.isNext,
            }}
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Stack>
      </Container>
    </Box>
  );
};

export default OrdersList;
