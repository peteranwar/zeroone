import {
  Box,
  Button,
  Container,
  Stack,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import Scrollbar from '../../components/scrollbar';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  useTable,
} from '../../components/table';
import MainModal from '../../components/MainModal';
import ToastSuccess from '../../components/ToastSuccess';
import ToastError from '../../components/ToastError';
import RoleTableRow from './table/role-table-row';
import RoleForm from './roleForm';
import { useSettingsContext } from '../../components/settings';
import { useGetRoles } from '../../services/roles/query';
import RolesApiEndpoints from '../../services/roles/api';
import { permissions, usePermission } from '../../constants';

const RolesList = () => {
  const settings = useSettingsContext();
  const { t } = useTranslation();
  const { haveAccess } = usePermission();
  const hasCreateAccess = haveAccess(permissions.role.create);
  const hasUpdateAccess = haveAccess(permissions.role.update);
  const hasDeleteAccess = haveAccess(permissions.role.delete);
  const TABLE_HEAD = [
    { id: 'roleName ', label: t('roles.table.roleName'), width: 100 },
    { id: 'permission ', label: t('roles.table.permission'), width: 300 },
    { id: '', label: t('shard.action'), width: 88 },
  ];

  const queryClient = useQueryClient();
  const [open, setOpen] = useState({
    open: false,
    id: null,
  });

  const { dense, page, rowsPerPage, onChangePage, onChangeDense, onChangeRowsPerPage } =
    useTable({ defaultOrderBy: 'orderNumber' });

  const { data: rolesData, isLoading } = useGetRoles({
    page: Number(page + 1),
    per_page: rowsPerPage,
  });

  const handleDeleteRow = async id => {
    if (!id) return;
    try {
      await RolesApiEndpoints.editRole(id, { _method: 'delete' });
      ToastSuccess(t('roles.deleteToast'));

      queryClient.invalidateQueries({ queryKey: ['roles'] });
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
          <Stack direction='row' alignItems='center' justifyContent='end' spacing={2}>
            <Button
              variant='primary'
              sx={{ px: 4 }}
              disabled={!hasCreateAccess}
              onClick={() => setOpen(prev => ({ ...prev, open: true }))}
            >
              {t('roles.addRole')}
            </Button>
          </Stack>
          <TableContainer
            sx={{
              position: 'relative',
              overflow: 'unset',
              pt: 3,
            }}
          >
            <Scrollbar>
              <Table sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  headLabel={TABLE_HEAD}
                  rowCount={rolesData?.data?.length}
                />

                <TableBody>
                  {isLoading && [1, 2, 3, 4].map(el => <TableSkeleton key={el} />)}
                  {rolesData?.data &&
                    rolesData?.data?.length > 0 &&
                    rolesData?.data?.map(row => (
                      <RoleTableRow
                        t={t}
                        key={row.id}
                        hasUpdateAccess={hasUpdateAccess}
                        hasDeleteAccess={hasDeleteAccess}
                        row={row}
                        onDeleteRow={() => handleDeleteRow(row?.id)}
                        onEditRow={() =>
                          setOpen(prev => ({ ...prev, open: true, id: row?.id }))
                        }
                      />
                    ))}

                  <TableNoData
                    tableName={t('roles.empData')}
                    notFound={rolesData?.data?.length < 1}
                  />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
          <TablePaginationCustom
            count={rolesData?.pagination?.meta?.page?.total || rolesData?.data?.length}
            page={+page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            backIconButtonProps={{
              disabled: !rolesData?.pagination?.meta?.page?.isPrevious,
            }}
            nextIconButtonProps={{
              disabled: !rolesData?.pagination?.meta?.page?.isNext,
            }}
            dense={dense}
            onChangeDense={onChangeDense}
          />
          <MainModal
            open={open.open}
            setOpen={() => setOpen(prev => ({ ...prev, open: false, id: null }))}
            title={open.id ? t('roles.editRole') : t('roles.newRole')}
          >
            <RoleForm id={open?.id} setOpen={setOpen} />
          </MainModal>
        </Stack>
      </Container>
    </Box>
  );
};

export default RolesList;
