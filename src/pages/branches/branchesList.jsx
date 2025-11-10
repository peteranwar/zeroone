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
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import MainModal from '../../components/MainModal';
import ToastError from '../../components/ToastError';
import ToastSuccess from '../../components/ToastSuccess';
import Scrollbar from '../../components/scrollbar';
import { useSettingsContext } from '../../components/settings';
import { TableHeadCustom, TableNoData, TableSkeleton } from '../../components/table';
import { permissions, usePermission } from '../../constants';
import BranchesApiEndpoints from '../../services/branches/api';
import { useGetBranches } from '../../services/branches/query';
import BranchForm from './branchForm';
import BranchTableRow from './table/branch-table-row';

const BranchesList = () => {
  const queryClient = useQueryClient();
  const settings = useSettingsContext();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState({
    open: false,
    id: null,
  });
  const { haveAccess } = usePermission();
  const hasCreateAccess = haveAccess(permissions.branch.create);
  const hasUpdateAccess = haveAccess(permissions.branch.update);
  const hasDeleteAccess = haveAccess(permissions.branch.delete);

  const TABLE_HEAD = [
    {
      id: 'BranchNameEN',
      label: t('branches.table.branchNameEn'),
      width: 120,
    },
    {
      id: 'BranchNameAr',
      label: t('branches.table.branchNameAr'),
      width: 120,
    },
    { id: 'Address', label: t('branches.table.address'), width: 120 },
    { id: 'Status', label: t('shard.status'), width: 100 },
    { id: '', label: t('shard.action'), width: 88 },
  ];

  const { data: branchesData, isLoading } = useGetBranches(null,i18n.language);

  const handleDeleteRow = async id => {
    if (!id) return;
    try {
      await BranchesApiEndpoints.editBranch(id, { _method: 'delete' });
      ToastSuccess(t('branches.toastSuccessDelete'));

      queryClient.invalidateQueries({ queryKey: ['branches'] });
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
          <Stack alignItems='end'>
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
              {t('branches.btnAdd')}
            </Button>
          </Stack>

          <TableContainer
            sx={{
              position: 'relative',
              overflow: 'unset',
              pt: 1,
              '& .MuiTableRow-root:nth-last-child(-n+2) td, & .MuiTableRow-root:nth-last-child(-n+2) th':
                {
                  borderBottom: 'none',
                },
            }}
          >
            <Scrollbar>
              <Table sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  headLabel={TABLE_HEAD}
                  rowCount={branchesData?.data?.length}
                />

                <TableBody>
                  {isLoading && [1, 2, 3, 4].map(el => <TableSkeleton key={el} />)}
                  {branchesData?.data &&
                    branchesData?.data?.length > 0 &&
                    branchesData?.data?.map(row => (
                      <BranchTableRow
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
                    tableName={t('branches.table.empData')}
                    notFound={branchesData?.data?.length < 1}
                  />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        </Stack>
      </Container>

      <MainModal
        open={open.open}
        setOpen={() => setOpen(prev => ({ ...prev, open: false, id: null }))}
        title={
          open.id ? t('branches.addBranch.titleEdit') : t('branches.addBranch.titleAdd')
        }
      >
        <BranchForm id={open?.id} setOpen={setOpen} />
      </MainModal>
    </Box>
  );
};

export default BranchesList;
