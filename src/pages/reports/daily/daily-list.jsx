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
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';
import { useSettingsContext } from '../../../components/settings';
import FilterSearch from '../../../components/shared/filter-search';
import { useGetPaymentDaily, useGetSummeryDaily } from '../../../services/reports/query';
import Scrollbar from '../../../components/scrollbar';
import { TableHeadCustom, TableNoData, TableSkeleton } from '../../../components/table';
import DailyTableRow from './table/daily-table-row';
import MainImg from '../../../components/MainImg';
import { sarIcon } from '../../../assets/icons';
import { useGetBranches } from '../../../services/branches/query';

const DailyList = () => {
  const { t, i18n } = useTranslation();
  const settings = useSettingsContext();
  const [filters, setFilters] = useState({});
  const [branchId, setBranchId] = useState(null);

  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  // Branches Data
  const { data: rawBranchesData } = useGetBranches();
  const branchesData = [
    {
      id: 'All',
      name: t('home.allBranches'),
    },
    ...(rawBranchesData?.data?.map(branch => ({
      id: branch.id,
      name: branch.name[i18n.language],
    })) || []),
  ];

  const { data: summeryDaily } = useGetSummeryDaily({
    filter: filters?.range,
    from: filters?.start,
    to: filters?.end,
    branch_id: filters?.branch_id,
  });
  const { data: paymentDaily, isLoading } = useGetPaymentDaily({
    filter: filters?.range,
    from: filters?.start,
    to: filters?.end,
    branch_id: filters?.branch_id,
  });
  const paymentData = paymentDaily?.methods;

  const cardSummery = [
    {
      id: 1,
      title: t('reports.daily.totalSales'),
      count: summeryDaily?.total_detail_sales,
    },
    { id: 2, title: t('reports.daily.totalIncome'), count: summeryDaily?.total_income },
    { id: 3, title: t('reports.daily.totalPieces'), count: summeryDaily?.total_pieces },
  ];

  const TABLE_HEAD = [
    {
      id: 'income',
      label: t('reports.daily.incomeType'),
    },
    { id: 'count', label: t('reports.daily.count') },
    { id: 'total', label: t('reports.daily.total') },
  ];

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
          <Typography variant='h5' color='text.secondary'>
            {t('reports.daily.title')}
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems='center'
            spacing={1}
            my={3}
          >
            <FormControl
              size='small'
              sx={{ mb: 3, width: 'fit-content', minWidth: '18rem' }}
            >
              <Select
                id='branch'
                value={branchId || 'All'}
                placeholder={t('home.incomeChart.labelBranch')}
                onChange={e => setBranchId(e.target.value)}
                sx={{ py: 0.7 }}
              >
                {branchesData?.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FilterSearch branchId={branchId} setFilters={setFilters} />
          </Stack>

          <Stack alignItems='end' mb={2}>
            <Button
              variant='contained'
              color='error'
              sx={{ width: 'fit-content' }}
              onClick={reactToPrintFn}
              disabled={Number(paymentDaily?.total_income) === 0}
            >
              {t('orders.details.print')}
            </Button>
          </Stack>

          <div ref={contentRef} className='print-area'>
            <MainImg
              name='logo.png'
              alt='zerOne-it logo'
              width={110}
              height={30}
              className='print-logo'
              sx={{ display: 'none' }}
            />

            <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ width: '100%' }}>
              {cardSummery?.map(item => (
                <Grid item xs={12} sm={4} key={item?.id}>
                  <Stack
                    sx={{
                      backgroundColor: 'white',
                      px: 2,
                      py: { xs: 1.5, sm: 3 },
                      borderRadius: '16px',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                    }}
                    spacing={1.5}
                    color='white'
                  >
                    <Typography
                      variant='body1'
                      sx={{
                        color: theme => theme.palette.text.secondary,
                        fontWeight: 600,
                      }}
                    >
                      {item?.title}
                    </Typography>
                    <Typography variant='h4' color='initial'>
                      {item?.count} {item?.id !== 3 && sarIcon}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>

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
                    rowCount={paymentData?.length}
                  />

                  <TableBody>
                    {isLoading && [1, 2, 3, 4].map(el => <TableSkeleton key={el} />)}
                    {paymentData &&
                      paymentData?.length > 0 &&
                      paymentData?.map(row => <DailyTableRow key={row.id} row={row} />)}

                    <TableNoData
                      tableName={t('reports.daily.empData')}
                      notFound={paymentData?.length < 1}
                    />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <Stack direction='row' alignItems='center' spacing={2} pt={2}>
              <Typography
                variant='h6'
                fontWeight={600}
                color='text.secondary'
                textAlign='end'
              >
                {t('reports.daily.totalIncome')} :
              </Typography>
              <Typography variant='h6' fontWeight={600} color='error' textAlign='end'>
                {paymentDaily?.total_income} {sarIcon}
              </Typography>
            </Stack>
          </div>
        </Stack>
      </Container>
    </Box>
  );
};

export default DailyList;
