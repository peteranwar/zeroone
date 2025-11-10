/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import { Stack, Typography, Card, Box } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { profitIcon, sarIcon, totalOrdersIcon } from '../../../assets/icons';

const IncomeChart = ({ chart }) => {
  const { t } = useTranslation();
  const ordersData = chart?.charts?.orders || {};
  const profitData = chart?.charts?.profit || {};
  const totalProfit = chart?.total_profit || 0;
  const totalOrders = chart?.total_orders || 0;

  const [selectedMetric, setSelectedMetric] = useState('orders');
  const dates = Object.keys(ordersData).sort();

  const formattedCategories = dates.map(date => dayjs(date).format('D MMM'));
  const totalOrdersSeries = dates.map(date => ordersData[date]?.value || 0);
  const totalProfitSeries = dates.map(date => parseFloat(profitData[date]?.value || 0));

  const bgColors = {
    orders: '#17d999',
    profit: '#73cae5',
  };

  const options = useMemo(
    () => ({
      chart: {
        type: 'line',
        toolbar: { show: false },
      },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      xaxis: {
        categories: formattedCategories,
        labels: { rotate: -45 },
        tickAmount: 8,
      },
      yaxis: {
        labels: {
          style: { fontSize: '12px' },
          formatter: value => {
            if (value >= 100000) return `${Math.round(value / 100000)}K`;
            if (value >= 1000) return `${Math.round(value / 1000)}K`;
            return `${value}`;
          },
        },
        tickAmount: 4,
      },
      markers: { size: 0 },
      colors: [bgColors[selectedMetric]],
      tooltip: { shared: true, intersect: false },
      legend: { show: false },
    }),
    [formattedCategories, selectedMetric]
  );

  const series = useMemo(() => {
    if (selectedMetric === 'orders') {
      return [{ name: 'Total Orders', data: totalOrdersSeries }];
    }
    return [{ name: 'Total Sales', data: totalProfitSeries }];
  }, [selectedMetric, totalOrdersSeries, totalProfitSeries]);

  return (
    <Stack sx={{ background: 'white', p: 3, borderRadius: '16px' }} spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent='space-between'
        alignItems='center'
        spacing={2}
      >
        <Typography variant='h5' fontWeight={600}>
          {t('reports.sales.overview')}
        </Typography>
      </Stack>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{ background: '#f5f5f5', p: 2, borderRadius: 4 }}
        spacing={2}
      >
        {/* Orders Card */}
        <Card
          onClick={() => setSelectedMetric('orders')}
          sx={{
            flex: 1,
            cursor: 'pointer',
            bgcolor: selectedMetric === 'orders' ? 'white' : 'transparent',
            border: 'none',
            boxShadow: 0,
            borderRadius: 3,
            height: 'fit-content',
          }}
        >
          <Stack direction='row' justifyContent='space-between' spacing={2} py={4} px={2}>
            <Stack spacing={1}>
              <Typography variant='h6' sx={{ color: '#737373' }} fontWeight={600} my={2}>
                {t('reports.sales.totalOrders')}
              </Typography>
              <Typography variant='h4'>
                {totalOrders} {sarIcon}
              </Typography>
            </Stack>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#5eeabc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
              }}
            >
              {totalOrdersIcon}
            </Box>
          </Stack>
        </Card>

        {/* Profit Card */}
        <Card
          onClick={() => setSelectedMetric('profit')}
          sx={{
            flex: 1,
            cursor: 'pointer',
            bgcolor: selectedMetric === 'profit' ? 'white' : 'transparent',
            border: 'none',
            boxShadow: 0,
            borderRadius: 3,
            height: 'fit-content',
          }}
        >
          <Stack direction='row' justifyContent='space-between' spacing={2} py={4} px={2}>
            <Stack spacing={1}>
              <Typography variant='h6' sx={{ color: '#737373' }} fontWeight={600} my={2}>
                {t('reports.sales.totalProfit')}
              </Typography>
              <Typography variant='h4'>
                {totalProfit} {sarIcon}
              </Typography>
            </Stack>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#b7e4f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
              }}
            >
              {profitIcon}
            </Box>
          </Stack>
        </Card>
      </Stack>

      {/* Chart */}
      <Chart options={options} series={series} type='line' height={350} />
    </Stack>
  );
};

export default IncomeChart;
