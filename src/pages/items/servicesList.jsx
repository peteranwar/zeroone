/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-bind */
import {
  Box,
  Button,
  Container,
  Stack,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';

import InputSearch from '../../components/controls/InputSearch';
import MainModal from '../../components/MainModal';
import Scrollbar from '../../components/scrollbar';
import { useSettingsContext } from '../../components/settings';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  useTable,
} from '../../components/table';
import ToastError from '../../components/ToastError';
import ToastSuccess from '../../components/ToastSuccess';
import { permissions, usePermission } from '../../constants';
import ItemsApiEndpoints from '../../services/items/api';
import { useGetItems } from '../../services/items/query';
import ServiceForm from './serviceForm';
import ServiceTableRow from './table/service-table-row';

const ServicesList = () => {
  const queryClient = useQueryClient();
  const settings = useSettingsContext();
  const { t } = useTranslation();
  const [open, setOpen] = useState({
    open: false,
    id: null,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { haveAccess } = usePermission();
  const hasCreateAccess = haveAccess(permissions.item.create);
  const hasUpdateAccess = haveAccess(permissions.item.update);
  const hasDeleteAccess = haveAccess(permissions.item.delete);

  const TABLE_HEAD = [
    { id: 'code ', label: t('services.table.code'), width: 100 },
    { id: 'serviceNameEn ', label: t('services.table.serviceNameEn'), width: 120 },
    { id: 'serviceNameAr ', label: t('services.table.serviceNameAr'), width: 120 },
    { id: 'storageUnit', label: t('services.addService.labelStorage'), width: 120 },
    { id: 'ingredientUnit', label: t('services.addService.labelIngredient'), width: 120 },
    { id: 'availability', label: t('services.table.availability'), width: 100 },
    { id: '', label: t('shard.action'), width: 88 },
  ];

  const debouncedSetSearch = useCallback(
    debounce(value => setDebouncedSearch(value), 1000),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchQuery);
  }, [searchQuery, debouncedSetSearch]);


  const { dense, page, rowsPerPage, onChangePage, onChangeDense, onChangeRowsPerPage } =
    useTable({ defaultOrderBy: 'orderNumber' });

  const { data: itemsData, isLoading } = useGetItems({
    paginate: 1,
    per_page: rowsPerPage,
    page: Number(page + 1),
    search: debouncedSearch,

  });

  const handleDeleteRow = async id => {
    if (!id) return;
    try {
      await ItemsApiEndpoints.editItem(id, { _method: 'delete' });
      ToastSuccess(t('services.toastSuccessDelete'));

      queryClient.invalidateQueries({ queryKey: ['items'] });
    } catch (error) {
      ToastError(error || t('validation.toastError'));
    }
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
          spacing={2}
          p={3}
        >

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 3 }}>
            <InputSearch
              placeholder={t('services.table.search')}
              onChange={e => setSearchQuery(e.target.value)}
              value={searchQuery}
              type='search'
            />
            <Button
              variant='contained'
              sx={{
                width: { xs: '100%', sm: '12rem' },
                borderColor: '#E2E8F0',
                gap: '10px',
              }}
              onClick={() => setOpen(prev => ({ ...prev, open: true }))}
              disabled={!hasCreateAccess}
            >
              {t('services.btnAdd')}
            </Button>
          </Stack>

          <TableContainer
            sx={{
              position: 'relative',
              overflow: 'unset',
              pt: 1,
            }}
          >
            <Scrollbar>
              <Table sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  headLabel={TABLE_HEAD}
                  rowCount={itemsData?.data?.length}
                />

                <TableBody>
                  {isLoading && [1, 2, 3, 4].map(el => <TableSkeleton key={el} />)}
                  {itemsData?.data &&
                    itemsData?.data?.length > 0 &&
                    itemsData?.data?.map(row => (
                      <ServiceTableRow
                        hasUpdateAccess={hasUpdateAccess}
                        hasDeleteAccess={hasDeleteAccess}
                        t={t}
                        key={row.id}
                        row={row}
                        onDeleteRow={() => handleDeleteRow(row?.id)}
                        onEditRow={() =>
                          setOpen(prev => ({ ...prev, open: true, id: row?.id }))
                        }
                      />
                    ))}

                  <TableNoData
                    tableName={t('services.table.empData')}
                    notFound={itemsData?.data?.length < 1}
                  />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={itemsData?.pagination?.meta?.page?.total || itemsData?.data?.length}
            page={+page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            backIconButtonProps={{
              disabled: !itemsData?.pagination?.meta?.page?.isPrevious,
            }}
            nextIconButtonProps={{
              disabled: !itemsData?.pagination?.meta?.page?.isNext,
            }}
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Stack>
      </Container>

      <MainModal
        open={open.open}
        setOpen={() => setOpen(prev => ({ ...prev, open: false, id: null }))}
        title={
          open.id ? t('services.addService.titleEdit') : t('services.addService.titleAdd')
        }
      >
        <ServiceForm id={open?.id} setOpen={setOpen} services={itemsData?.data} />
      </MainModal>
    </Box>
  );
};

export default ServicesList;
