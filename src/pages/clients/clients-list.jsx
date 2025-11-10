/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-bind */
import { Box, Container, Stack, Table, TableBody, TableContainer } from '@mui/material';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import InputSearch from '../../components/controls/InputSearch';
import Scrollbar from '../../components/scrollbar';
import { useSettingsContext } from '../../components/settings';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  useTable,
} from '../../components/table';
import { useRouter } from '../../hooks';
import { useGetClients } from '../../services/clients/query';
import ClientTableRow from './table/client-table-row';

const ClientsList = () => {
  const settings = useSettingsContext();
  const router = useRouter();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');


  const debouncedSetSearch = useCallback(
    debounce(value => setDebouncedSearch(value), 1000),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchQuery);
  }, [searchQuery, debouncedSetSearch]);

  const { dense, page, rowsPerPage, onChangePage, onChangeDense, onChangeRowsPerPage } =
    useTable({ defaultOrderBy: 'orderNumber' });

  const TABLE_HEAD = [
    { id: 'client ', label: t('client.table.client'), width: 120 },
    { id: 'phone ', label: t('client.table.phone'), width: 120 },
    { id: 'email ', label: t('client.details.email'), width: 120 },
    { id: 'lastVisit', label: t('client.table.lastVisit'), width: 100 },
    { id: '', label: t('shard.action'), width: 88 },
  ];

  const { data: clientsData, isLoading } = useGetClients({
    paginate: 1,
    per_page: rowsPerPage,
    page: Number(page + 1),
    search: debouncedSearch,
  });

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
          spacing={2}
          p={3}
        >
          <Stack mb={{ xs: 3, md: 4 }}>
            <InputSearch
              placeholder={t('client.table.search')}
              onChange={e => setSearchQuery(e.target.value)}
              value={searchQuery}
              type='search'
            />
          </Stack>
          <TableContainer sx={{ position: 'relative', overflow: 'unset', pt: 1 }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  headLabel={TABLE_HEAD}
                  rowCount={clientsData?.data?.length}
                />
                <TableBody>
                  {isLoading && [1, 2, 3, 4].map(el => <TableSkeleton key={el} />)}
                  {clientsData?.data &&
                    clientsData?.data?.length > 0 &&
                    clientsData?.data?.map(row => (
                      <ClientTableRow
                        t={t}
                        key={row.id}
                        row={row}
                        onEditRow={() => router.push(`details/${row.id}`)}
                      />
                    ))}

                  <TableNoData
                    tableName={t('client.table.empData')}
                    notFound={clientsData?.data?.length < 1}
                  />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={
              clientsData?.pagination?.meta?.page?.total || clientsData?.data?.length
            }
            page={+page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            backIconButtonProps={{
              disabled: !clientsData?.pagination?.meta?.page?.isPrevious,
            }}
            nextIconButtonProps={{
              disabled: !clientsData?.pagination?.meta?.page?.isNext,
            }}
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Stack>
      </Container>
    </Box>
  );
};

export default ClientsList;
