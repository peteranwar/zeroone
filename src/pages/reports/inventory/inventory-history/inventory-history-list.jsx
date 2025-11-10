import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetOrderTransaction } from '../../../../services/reports/query';
import Scrollbar from '../../../../components/scrollbar';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  useTable,
} from '../../../../components/table';
import { useGetBranches } from '../../../../services/branches/query';
import FilterSearch from '../../../../components/shared/filter-search';
import InventoryHistoryTableRow from './table/inventory-history-table-row';

const InventoryHistoryList = () => {
  const { t, i18n } = useTranslation();
  const [branchId, setBranchId] = useState(null);
  const [filters, setFilters] = useState({});

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

  const { data: stock, isLoading } = useGetOrderTransaction({
    per_page: rowsPerPage,
    page: Number(page + 1),
    filter: filters?.range,
    from: filters?.start,
    to: filters?.end,
    branch_id: filters?.branch_id,
  });
  const stockData = stock?.data;

  const TABLE_HEAD = [
    { id: 'reference_no', label: t('reports.inventory.order.reference'), width: 100 },
    { id: 'order_code', label: t('reports.inventory.order.orderCode'), width: 100 },
    { id: 'remain', label: t('reports.inventory.order.remain'), width: 100 },
    { id: 'type', label: t('reports.inventory.order.type'), width: 100 },
    { id: 'destination', label: t('reports.inventory.order.destination'), width: 100 },
    { id: 'customer', label: t('reports.inventory.order.customer'), width: 100 },
    { id: 'paid', label: t('reports.inventory.order.paid'), width: 100 },
    { id: 'qty', label: t('reports.inventory.order.qty'), width: 100 },
    { id: 'status', label: t('reports.inventory.order.status'), width: 100 },
    { id: 'total', label: t('reports.inventory.order.total'), width: 100 },
  ];

  return (
    <Box sx={{ width: '100%' }} mt={{ xs: 3, sm: 2 }}>
      <Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems='center' spacing={1}>
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
                  stockData?.map(row => (
                    <InventoryHistoryTableRow key={row.id} row={row} />
                  ))}

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

export default InventoryHistoryList;
