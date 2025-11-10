import React, { useState, useRef } from 'react';
import { Box, MenuItem, Menu, Button, Stack, Typography } from '@mui/material';
import DatePicker from 'react-multi-date-picker';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '../../hooks/use-responsive';

const FilterSearch = ({ setFilters, widthLg, branchId }) => {
  const sm = useResponsive('down', 'sm');
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [rangeSelected, setRangeSelected] = useState('');
  const [tempDates, setTempDates] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  const handleMenuClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelect = value => {
    setRangeSelected(value);
    setAnchorEl(null);

    if (value === 'custom') {
      setTempDates([]);
      setShowCalendar(true);
      setTimeout(() => {
        calendarRef.current?.openCalendar();
      }, 0);
    } else {
      setShowCalendar(false);
    }
  };

  const getLabel = () => {
    const labelMap = {
      day: t('shard.day'),
      week: t('shard.week'),
      month: t('shard.month'),
      year: t('shard.year'),
      custom: t('shard.custom'),
    };

    if (rangeSelected === 'custom' && tempDates.length === 2) {
      const from = dayjs(tempDates[0]).format('YYYY-MM-DD');
      const to = dayjs(tempDates[1]).format('YYYY-MM-DD');
      return `${labelMap[rangeSelected]} - ${from} ~ ${to}`;
    }

    return labelMap[rangeSelected] || t('shard.selectRange');
  };

  const handleSearch = () => {
    let finalFilters = { range: rangeSelected };

    if (rangeSelected === 'custom' && tempDates.length === 2) {
      finalFilters = {
        ...finalFilters,
        start: dayjs(tempDates[0]).format('YYYY-MM-DD'),
        end: dayjs(tempDates[1]).format('YYYY-MM-DD'),
      };
    }

    if (branchId) {
      finalFilters.branch_id = branchId;
    } else {
      delete finalFilters.branch_id;
    }

    setFilters(finalFilters);
  };

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems='center'
        sx={{ position: 'relative', gap: 1 }}
      >
        <Box sx={{ position: 'relative' }}>
          {/* Input */}
          <Box
            onClick={handleMenuClick}
            sx={{
              borderRadius: '12px',
              px: 2,
              py: 1,
              minWidth: { xs: 300, sm: 290, md: widthLg || 300 },
              height: 46,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontWeight: 600,
              backgroundColor: '#F3F6F9',
            }}
          >
            <Typography>{getLabel()}</Typography>
          </Box>

          {/* Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => handleSelect('day')}>{t('shard.day')}</MenuItem>
            <MenuItem onClick={() => handleSelect('week')}>{t('shard.week')}</MenuItem>
            <MenuItem onClick={() => handleSelect('month')}>{t('shard.month')}</MenuItem>
            <MenuItem onClick={() => handleSelect('year')}>{t('shard.year')}</MenuItem>
            <MenuItem onClick={() => handleSelect('custom')}>
              {t('shard.custom')}
            </MenuItem>
          </Menu>

          {/* Calendar */}
          {showCalendar && (
            <Box
              sx={{
                position: 'absolute',
                top: '60%',
                right: '50%',
                zIndex: 1500,
                mt: 1,
              }}
            >
              <DatePicker
                ref={calendarRef}
                range
                rangeHover
                calendarPosition='bottom'
                value={tempDates}
                onChange={val => {
                  setTempDates(val);
                  if (val.length === 2) {
                    setShowCalendar(false);
                  }
                }}
                format='YYYY-MM-DD'
                numberOfMonths={sm ? 1 : 2}
                style={{ display: 'none' }}
              />
            </Box>
          )}
        </Box>

        <Button
          disabled={
            !branchId &&
            (!rangeSelected || (rangeSelected === 'custom' && tempDates.length < 2))
          }
          variant='contained'
          onClick={handleSearch}
        >
          {t('shard.search')}
        </Button>
      </Stack>
    </Box>
  );
};

export default FilterSearch;
