/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useCallback } from 'react';
import Chart from 'react-apexcharts';
import {
  Stack,
  Typography,
  MenuItem,
  Select,
  FormControl,
  Box,
  Button,
  Drawer,
  FormLabel,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import { format, isValid } from 'date-fns';

import FilterListIcon from '@mui/icons-material/FilterList';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import BranchesApiEndpoints from '../../services/branches/api';
import { useGetIncomeSummary } from '../../services/home/query';
import MultiDatepicker from '../orders/multi-date-picker';

const IncomeChart = () => {
  const { t, i18n } = useTranslation();

  const [open, setOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    branch: null,
    startDate: null,
    endDate: null,
  });
  const [filters, setFilters] = useState({
    branch: null,
    startDate: null,
    endDate: null,
  });

  const onDateChange = useCallback(newDates => {
    if (newDates?.length > 1) {
      const startDate = newDates[0]?.toDate();
      const endDate = newDates[1]?.toDate();

      if (isValid(startDate) && isValid(endDate)) {
        setTempFilters(prev => ({
          ...prev,
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
        }));
      }
    }
  }, []);

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

  const { data: IncomeChartData } = useGetIncomeSummary({
    branch_id: filters.branch === 'All' ? null : filters.branch,
    start_date: filters.startDate,
    end_date: filters.endDate,
  });

  const graphData = IncomeChartData?.data?.data || [];
  const categories = graphData.map(item => item.date);
  const totalOrders = graphData.map(item => item.total_orders);
  const totalAmount = graphData.map(item => parseFloat(item.total_amount));
  const formattedCategories = categories.map(date => dayjs(date).format('D MMM'));

  const options = useMemo(
    () => ({
      chart: { type: 'line', toolbar: { show: false } },
      xaxis: {
        categories: formattedCategories,
        labels: { rotate: -45 },
        tickAmount: 12,
      },
      yaxis: {
        labels: {
          style: { fontSize: '12px' },
          formatter: value => {
            if (value >= 100000) return `${Math.round(value / 100000)}K`;
            if (value >= 1000) return `${Math.round(value / 1000)}K`;
            return `${value.toString()} K`;
          },
        },
        tickAmount: 4,
      },
      stroke: { curve: 'straight', width: 3 },
      markers: { size: 5 },
      colors: ['#4379EE', '#4AB58E'],
      legend: { show: false },
      tooltip: { shared: true, intersect: false },
    }),
    [formattedCategories]
  );

  const series = [
    { name: t('home.incomeChart.totalOrders'), data: totalOrders },
    { name: t('home.incomeChart.totalAmount'), data: totalAmount },
  ];

  const handleApply = () => {
    setFilters(tempFilters);
    setOpen(false);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      branch: 'All',
      startDate: null,
      endDate: null,
    };
    setTempFilters(defaultFilters);
    setFilters(defaultFilters);
    setOpen(false);
  };

  return (
    <Stack sx={{ background: 'white', p: 3, borderRadius: '16px' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent='space-between'
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        mb={2}
        spacing={1}
      >
        <Typography variant='h5' fontWeight={600}>
          {t('home.incomeChart.title')}
        </Typography>

        <Stack direction='row' spacing={2} alignItems='center'>
          <Box display='flex' alignItems='center'>
            <Box
              sx={{
                width: 14,
                height: 12,
                bgcolor: '#4379EE',
                borderRadius: '4px',
                mr: 1,
              }}
            />
            <Typography variant='body2' fontWeight={500}>
              {t('home.incomeChart.totalOrders')}
            </Typography>
          </Box>
          <Box display='flex' alignItems='center'>
            <Box
              sx={{
                width: 14,
                height: 12,
                bgcolor: '#4AB58E',
                borderRadius: '4px',
                mr: 1,
              }}
            />
            <Typography variant='body2' fontWeight={500}>
              {t('home.incomeChart.totalAmount')}
            </Typography>
          </Box>
        </Stack>

        <Button
          variant='white'
          startIcon={<FilterListIcon />}
          onClick={() => setOpen(true)}
          sx={{ alignSelf: { xs: 'end', sm: '' } }}
        >
          {t('home.incomeChart.sortBy')}
        </Button>
      </Stack>

      <Chart options={options} series={series} type='line' height={350} />

      <Drawer anchor='right' open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 300, p: 3 }}>
          <Typography variant='h4' mb={3}>
            {t('home.incomeChart.filter')}
          </Typography>

          <FormControl size='small' fullWidth sx={{ mb: 3 }}>
            <FormLabel sx={{ mb: 1.5 }}>{t('home.incomeChart.labelBranch')}</FormLabel>
            <Select
              id='branch'
              value={tempFilters.branch ?? 'All'}
              onChange={e =>
                setTempFilters(prev => ({
                  ...prev,
                  branch: e.target.value,
                }))
              }
              sx={{ py: 0.7 }}
            >
              {branchesData?.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.branchNameEnglish}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1.5 }}>{t('home.incomeChart.labelDate')}</FormLabel>
            <Box
              sx={{
                position: 'relative',
                zIndex: 100,
                '& .rmdp-container': { display: 'flex !important' },
              }}
            >
              <MultiDatepicker
                values={[
                  tempFilters.startDate ? new Date(tempFilters.startDate) : null,
                  tempFilters.endDate ? new Date(tempFilters.endDate) : null,
                ]}
                setValues={onDateChange}
                placeholder={t('home.incomeChart.placeDate')}
                months={1}
              />
              <CalendarMonthIcon
                sx={{
                  position: 'absolute',
                  top: '.9rem',
                  left: '.5rem',
                  color: '#878CBD',
                  zIndex: 2,
                }}
              />
            </Box>
          </FormControl>

          <Button
            variant='contained'
            color='primary'
            fullWidth
            sx={{ mt: 3 }}
            onClick={handleApply}
          >
            {t('home.incomeChart.btnFilter')}
          </Button>
          <Button
            variant='white'
            color='secondary'
            fullWidth
            sx={{ mt: 1 }}
            onClick={handleClearFilters}
          >
            {t('home.incomeChart.clearFilters')}
          </Button>
        </Box>
      </Drawer>
    </Stack>
  );
};

export default IncomeChart;
