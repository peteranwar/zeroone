/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
import React, { useCallback, useState, useMemo } from 'react';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { format, isValid } from 'date-fns';
import { statusArrayOrders } from './columns';
import MultiDatepicker from './multi-date-picker';
import { useGetBranches } from '../../services/branches/query';

const FilterModel = ({ filterData, setFilterData, closeModal, t }) => {
  const statusArray = useMemo(() => statusArrayOrders(t), [t]);

  const { data: branchesData, isFetching, isLoading } = useGetBranches();

  // Initialize state with existing controller values
  const [filters, setFilters] = useState(() => ({
    status: filterData?.status ?? null,
    branch: filterData?.branch ?? null,
    startDate: filterData?.startDate ?? null,
    endDate: filterData?.endDate ?? null,
  }));

  // Date Picker Change Handler
  const onDateChange = useCallback(newDates => {
    if (newDates?.length > 1) {
      const startDate = newDates[0]?.toDate();
      const endDate = newDates[1]?.toDate();

      if (isValid(startDate) && isValid(endDate)) {
        setFilters(prev => {
          if (
            prev.startDate === format(startDate, 'yyyy-MM-dd') &&
            prev.endDate === format(endDate, 'yyyy-MM-dd')
          ) {
            return prev; // Avoid unnecessary updates
          }
          return {
            ...prev,
            startDate: format(startDate, 'yyyy-MM-dd'),
            endDate: format(endDate, 'yyyy-MM-dd'),
          };
        });
      }
    }
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => (prev[key] === value ? prev : { ...prev, [key]: value }));
  }, []);

  // Apply filters and update controller state
  const onConfirm = useCallback(() => {
    setFilterData(prev => ({
      ...prev,
      ...filters,
      rowsPerPage: 10,
      hasNext: false,
      hasPrev: false,
      cursor: null,
    }));
    closeModal();
  }, [filters, setFilterData, closeModal]);

  // Reset filters to initial state
  const onReset = useCallback(() => {
    setFilters({
      status: null,
      branch: null,
      startDate: null,
      endDate: null,
    });

    setFilterData({
      status: null,
      branch: null,
      startDate: null,
      endDate: null,
    });

    closeModal();
  }, [setFilterData, closeModal]);

  return (
    <Stack spacing={2} className='orders'>
      {/* Branch Selection */}
      <FormControl>
        <FormLabel sx={{ marginBottom: '12px' }}>
          {t('orders.orderDetails.customer.branchName')}
        </FormLabel>
        <Select
          id='branch'
          value={filters.branch ?? ''}
          onChange={e => handleFilterChange('branch', e.target.value)}
        >
          {branchesData?.data?.map(item => (
            <MenuItem key={item.id} value={item.id}>
              <Box>{item.branchNameEnglish}</Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Status Selection */}
      <FormControl>
        <FormLabel sx={{ marginBottom: '12px' }}>{t('orders.labelStatus')}</FormLabel>
        <Select
          value={filters.status ?? ''}
          onChange={e => handleFilterChange('status', e.target.value)}
        >
          {statusArray.map(item => (
            <MenuItem key={item.id} value={item.value}>
              <Box sx={{ display: 'flex' }} alignItems='center'>
                <Box px={1} mb='-.4rem' sx={{ color: '#878CBD' }}>
                  {item.icon}
                </Box>
                <Box>{item.status}</Box>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Date Picker */}
      <FormControl>
        <FormLabel sx={{ marginBottom: '12px' }}>{t('orders.labelDate')}</FormLabel>
        <Box sx={{ position: 'relative', zIndex: 100 }}>
          <MultiDatepicker
            values={[
              filters.startDate ? new Date(filters.startDate) : null,
              filters.endDate ? new Date(filters.endDate) : null,
            ]}
            setValues={onDateChange}
          />
          <CalendarMonthIcon
            sx={{
              position: 'absolute',
              top: '.9rem',
              left: '.5rem',
              color: '#878CBD',
              zIndex: -1,
            }}
          />
        </Box>
      </FormControl>

      {/* Action Buttons */}
      <Stack direction='row' spacing={2} pt={3}>
        <Button
          disabled={
            !filters.branch && !filters.endDate && !filters.startDate && !filters.status
          }
          sx={{
            px: '2rem',
            borderColor: '#E2E8F0',
            width: '100%',
            borderRadius: '20px',
          }}
          variant='contained'
          onClick={onConfirm}
        >
          {t('orders.confirm')}
        </Button>
        <Button
          disabled={
            !filters.branch && !filters.endDate && !filters.startDate && !filters.status
          }
          sx={{
            px: '2rem',
            borderColor: '#E2E8F0',
            width: '100%',
            color: theme => theme.palette.text.secondary,
          }}
          variant='text'
          onClick={onReset}
        >
          {t('orders.reset')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default React.memo(FilterModel);
