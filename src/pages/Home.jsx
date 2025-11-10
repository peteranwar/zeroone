/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-useless-fragment */
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  completeOrdersIcon,
  incomeIcon,
  progressOrdersIcon,
  totalClientsIcon,
} from '../assets/icons';
import CardHome from '../components/Home/card-home';
import IncomeChart from '../components/Home/income-chart';
import Scrollbar from '../components/scrollbar';
import { useSettingsContext } from '../components/settings';
import { TableHeadCustom, TableNoData, TableSkeleton } from '../components/table';
import { permissions, usePermission } from '../constants';
import { useGetOverview } from '../services/home/query';
import { useGetOrders } from '../services/orders/query';
import OrderTableRow from './orders/list/order-table-row';

const Home = () => {
  const navigate = useNavigate();
  const settings = useSettingsContext();
  const { t } = useTranslation();
  const [filter, setFilter] = useState('month');


  const { haveAccess } = usePermission();
  const hasDashboardAccess = haveAccess(permissions.dashboard.read);

  console.log('hasDashboardAccesshasDashboardAccess', hasDashboardAccess)

  if (!hasDashboardAccess) {
    return <Box display='flex' alignItems='center' justifyContent='center' pt={6}>
      <Typography variant='h2'>  No data available</Typography>
    </Box>
  }

  const filterData = [
    { id: 'day', label: t('home.day') },
    { id: 'week', label: t('home.week') },
    { id: 'month', label: t('home.month') },
    { id: 'year', label: t('home.year') },
  ];

  const { data: ordersData, isLoading } = useGetOrders({
    per_page: '5',
  });

  const { data: overviewData } = useGetOverview({
    filter,
  });

  const ORDER_TABLE_HEAD = [
    { id: 'orderId ', label: t('orders.table.orderId'), width: 120 },
    { id: 'client', label: t('orders.table.client'), width: 120 },
    { id: 'phone', label: t('orders.table.phone'), width: 120 },
    { id: 'startDate', label: t('orders.table.startDate'), width: 120 },
    { id: 'deliveryDate', label: t('orders.table.deliveryDate'), width: 120 },
    { id: 'status', label: t('shard.status'), width: 140 },
    { id: 'action', label: t('shard.action'), width: 88 },
  ];

  return (
    <Box sx={{ width: '100%' }} className='home-page' mt={{ xs: 1, sm: 4 }}>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <IncomeChart />
          </Grid>
          <Grid item xs={12}>
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='space-between'
              spacing={2}
            >
              <Typography variant='h5' color='initial'>
                {t('home.overview')}
              </Typography>

              <FormControl size='small' sx={{ mb: 3, width: '10rem' }}>
                <Select
                  id='filter'
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  sx={{
                    py: 0.5,
                    backgroundColor: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                    '&.MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent',
                      },
                    },
                  }}
                >
                  {filterData?.map(item => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
            <CardHome
              title={t('home.totalIncome')}
              data={overviewData?.data?.total_income}
              icon={incomeIcon}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
            <CardHome
              title={t('home.progressOrders')}
              data={overviewData?.data?.in_progress_orders}
              icon={progressOrdersIcon}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
            <CardHome
              title={t('home.completedOrders')}
              data={overviewData?.data?.completed_orders}
              icon={completeOrdersIcon}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
            <CardHome
              title={t('home.clients')}
              data={overviewData?.data?.clients}
              icon={totalClientsIcon}
            />
          </Grid>

          <Grid item xs={12}>
            <Stack
              sx={{
                background: 'white',
                p: 3,
                borderRadius: '16px',
              }}
              spacing={2}
            >
              <Box
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                mb={3}
              >
                <Typography variant='h5'>{t('home.Latest')}</Typography>
                <Button
                  variant='outlined'
                  sx={{
                    py: 1,
                    px: 2,
                    borderColor: '#E2E8F0',
                    ':hover': { borderColor: '#E2E8F0' },
                  }}
                  onClick={() => navigate('/orders')}
                >
                  {t('home.allOrder')}
                </Button>
              </Box>
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
                      headLabel={ORDER_TABLE_HEAD}
                      rowCount={ordersData?.data?.length}
                    />

                    <TableBody>
                      {isLoading && [1, 2, 3, 4].map(el => <TableSkeleton key={el} />)}
                      {ordersData?.data &&
                        ordersData?.data?.length > 0 &&
                        ordersData?.data?.map(row => (
                          <OrderTableRow t={t} key={row.id} row={row} />
                        ))}

                      <TableNoData
                        tableName={t('home.emptyMessage')}
                        notFound={ordersData?.data?.length < 1}
                      />
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
