import {
  Box,
  Button,
  Container,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import UploadIcon from '@mui/icons-material/Upload';
import { useGetOrderTransaction } from '../../../services/reports/query';
import Scrollbar from '../../../components/scrollbar';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  useTable,
} from '../../../components/table';
import { useGetBranches } from '../../../services/branches/query';
import OrderTransactionTableRow from './table/order-transaction-table-row';
import FilterSearch from '../../../components/shared/filter-search';
import { useSettingsContext } from '../../../components/settings';
import ReportsApiEndpoints from '../../../services/reports/api';
import ToastError from '../../../components/ToastError';

const OrderTransactionList = () => {
  const { t, i18n } = useTranslation();
  const [branchId, setBranchId] = useState(null);
  const [filters, setFilters] = useState({});
  const settings = useSettingsContext();

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

  const { dense, page, rowsPerPage, onChangePage, onChangeDense, onChangeRowsPerPage } =
    useTable({ defaultOrderBy: 'orderNumber' });

  const { data: orderTransactions, isLoading } = useGetOrderTransaction({
    per_page: rowsPerPage,
    page: Number(page + 1),
    filter: filters?.range,
    from: filters?.start,
    to: filters?.end,
    branch_id: filters?.branch_id === 'All' ? '' : filters?.branch_id,
  });
  const orderTransactionsData = orderTransactions?.data;

  const TABLE_HEAD = [
    { id: 'reference_no', label: t('reports.orderTrans.reference'), width: 100 },
    { id: 'order_code', label: t('reports.orderTrans.orderCode'), width: 100 },
    { id: 'remain', label: t('reports.orderTrans.remain'), width: 100 },
    { id: 'type', label: t('reports.orderTrans.type'), width: 100 },
    { id: 'destination', label: t('reports.orderTrans.destination'), width: 100 },
    { id: 'customer', label: t('reports.orderTrans.customer'), width: 100 },
    { id: 'paid', label: t('reports.orderTrans.paid'), width: 100 },
    { id: 'qty', label: t('reports.orderTrans.qty'), width: 100 },
    { id: 'status', label: t('reports.orderTrans.status'), width: 100 },
    { id: 'total', label: t('reports.orderTrans.total'), width: 100 },
  ];

  const handleExportExcel = async () => {
    await ReportsApiEndpoints.getOrderTransaction({
      per_page: rowsPerPage,
      page: Number(page + 1),
      filter: filters?.range,
      from: filters?.start,
      to: filters?.end,
      branch_id: filters?.branch_id,
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
          <Typography variant='h5' color='text.secondary'>
            {t('reports.orderTrans.title')}
          </Typography>
          <Stack alignItems='end' mt={1}>
            <Button
              onClick={handleExportExcel}
              disabled={orderTransactionsData?.length === 0}
              variant='success'
              startIcon={<UploadIcon sx={{ width: '20px' }} />}
            >
              {t('popupActions.exportExcel')}
            </Button>
          </Stack>
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
          <TableContainer
            sx={{
              position: 'relative',
              overflow: 'unset',
            }}
          >
            <Scrollbar>
              <Table sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  headLabel={TABLE_HEAD}
                  rowCount={orderTransactionsData?.length}
                />

                <TableBody>
                  {isLoading && [1, 2, 3, 4].map(el => <TableSkeleton key={el} />)}
                  {orderTransactionsData &&
                    orderTransactionsData?.length > 0 &&
                    orderTransactionsData?.map(row => (
                      <OrderTransactionTableRow key={row.id} row={row} />
                    ))}

                  <TableNoData
                    tableName={t('reports.daily.empData')}
                    notFound={orderTransactionsData?.length < 1}
                  />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={
              orderTransactions?.pagination?.meta?.page?.total ||
              orderTransactions?.data?.length
            }
            page={+page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            backIconButtonProps={{
              disabled: !orderTransactions?.pagination?.meta?.page?.isPrevious,
            }}
            nextIconButtonProps={{
              disabled: !orderTransactions?.pagination?.meta?.page?.isNext,
            }}
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Stack>
      </Container>
    </Box>
  );
};

export default OrderTransactionList;
