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
import InvoicesTableRow from './table/invoices-table-row';
import { useGetClientInvoices } from '../../services/clients/query';

const InvoicesTap = () => {
  const { t } = useTranslation();
  const TABLE_HEAD = [
    { id: 'paymentId ', label: t('client.details.Invoices.paymentId'), width: 120 },
    { id: 'date ', label: t('client.details.orders.date'), width: 120 },
    {
      id: 'paymentMethod',
      label: t('client.details.Invoices.paymentMethod'),
      width: 160,
    },
    { id: 'amount', label: t('client.details.Invoices.amount'), width: 120 },
    { id: '', label: t('shard.action'), width: 88 },
  ];
  const { client_id } = useParams();
  const [controller, setController] = useState({
    rowsPerPage: 20,
    hasNext: false,
    hasPrev: false,
    cursor: null,
    order_type: null,
  });
  const { data: invoicesData, isLoading } = useGetClientInvoices({
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

  return (
    <Stack>
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={dense ? 'small' : 'medium'}>
            <TableHeadCustom
              headLabel={TABLE_HEAD}
              rowCount={invoicesData?.data?.length}
            />

            <TableBody>
              {isLoading && [1, 2, 3, 4].map(el => <TableSkeleton key={el} />)}
              {invoicesData?.data &&
                invoicesData?.data?.length > 0 &&
                invoicesData?.data?.map(row => (
                  <InvoicesTableRow
                    t={t}
                    key={row.id}
                    row={row}
                    onDownloadRow={() => console.log('download')}
                  />
                ))}

              <TableNoData
                tableName={t('client.table.empData')}
                notFound={invoicesData?.data?.length < 1}
              />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={invoicesData?.pagination?.meta?.page?.total || 0}
        page={+page}
        rowsPerPage={rowsPerPage}
        onPageChange={onChangePage}
        // //

        backIconButtonProps={{
          disabled: !invoicesData?.pagination?.links?.previous,
        }}
        nextIconButtonProps={{
          disabled: !invoicesData?.pagination?.links?.next,
        }}
        dense={dense}
        onChangeDense={onChangeDense}
      />
    </Stack>
  );
};

export default InvoicesTap;
