/* eslint-disable camelcase */
import { Stack, Table, TableBody, TableContainer } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import Scrollbar from '../../components/scrollbar';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  useTable,
} from '../../components/table';
import { useRouter } from '../../hooks';
import OrdersTableRow from './table/orders-table-row';
import { useGetClientOrders } from '../../services/clients/query';

const OrdersTap = () => {
  const { t } = useTranslation();
  const { client_id } = useParams();
  const router = useRouter();

  const [controller, setController] = useState({
    rowsPerPage: 20,
    hasNext: false,
    hasPrev: false,
    cursor: null,
    order_type: null,
  });
  const { data: ordersData, isLoading } = useGetClientOrders({
    cursor: controller.cursor,
    per_page: controller.rowsPerPage,
    client_id,
  });

  const { dense, page, rowsPerPage, onChangePage, onChangeDense } = useTable({
    rowsPerPage: 20,
    hasNext: false,
    hasPrev: false,
    cursor: null,
  });

  const TABLE_HEAD = [
    { id: 'orderId ', label: t('client.details.orders.orderId'), width: 120 },
    { id: 'date ', label: t('client.details.orders.date'), width: 120 },
    { id: 'service', label: t('client.details.orders.service'), width: 120 },
    { id: 'total', label: t('client.details.orders.total'), width: 100 },
    { id: '', label: t('shard.action'), width: 88 },
  ];

  return (
    <Stack>
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={dense ? 'small' : 'medium'}>
            <TableHeadCustom headLabel={TABLE_HEAD} rowCount={ordersData?.data?.length} />

            <TableBody>
              {isLoading && [1, 2, 3, 4].map(el => <TableSkeleton key={el} />)}
              {ordersData?.data &&
                ordersData?.data?.length > 0 &&
                ordersData?.data?.map(row => (
                  <OrdersTableRow
                    t={t}
                    key={row.id}
                    row={row}
                    onEditRow={() => router.push(`/orders/details/${row.id}`)}
                  />
                ))}

              <TableNoData
                tableName={t('client.table.empData')}
                notFound={ordersData?.data?.length < 1}
              />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={ordersData?.pagination?.meta?.page?.total || 0}
        page={+page}
        rowsPerPage={rowsPerPage}
        onPageChange={onChangePage}
        // //

        backIconButtonProps={{
          disabled: !ordersData?.pagination?.links?.previous,
        }}
        nextIconButtonProps={{
          disabled: !ordersData?.pagination?.links?.next,
        }}
        dense={dense}
        onChangeDense={onChangeDense}
      />
    </Stack>
  );
};

export default OrdersTap;
