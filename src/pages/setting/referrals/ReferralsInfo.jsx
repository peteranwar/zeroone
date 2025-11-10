/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-bind */
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import MainModal from '../../../components/MainModal';
import Scrollbar from '../../../components/scrollbar';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  useTable,
} from '../../../components/table';
import ToastError from '../../../components/ToastError';
import ToastSuccess from '../../../components/ToastSuccess';
import { permissions, usePermission } from '../../../constants';
import SettingsApiEndpoints from '../../../services/settings/api';
import { useGetReferrals } from '../../../services/shard/query';
import ReferralForm from './ReferralForm';
import ReferralTableRow from './table/referral-table-row';

const ReferralsInfo = () => {
  const { t } = useTranslation();
  const { haveAccess } = usePermission();
  const hasCreateAccess = haveAccess(permissions.referral.create);
  const hasUpdateAccess = haveAccess(permissions.referral.update);
  const hasDeleteAccess = haveAccess(permissions.referral.delete);

  const TABLE_HEAD = [
    { id: 'carNameEn ', label: t('setting.referralsInfo.table.referralEn'), width: 140 },
    { id: 'carNameAr ', label: t('setting.referralsInfo.table.referralAr'), width: 140 },
    { id: '', label: t('shard.action'), width: 88 },
  ];

  const queryClient = useQueryClient();
  const [open, setOpen] = useState({
    open: false,
    id: null,
  });

  const { dense, page, rowsPerPage, onChangePage, onChangeDense, onChangeRowsPerPage } =
    useTable({ defaultOrderBy: 'orderNumber' });

  const { data: referralsData, isLoading } = useGetReferrals({
    page: Number(page + 1),
    per_page: rowsPerPage,
  });


  const handleDeleteRow = async id => {
    if (!id) return;
    try {
      await SettingsApiEndpoints.editReferral(id, { _method: 'delete' });
      ToastSuccess(t('setting.referralsInfo.deleteToast'));

      queryClient.invalidateQueries({ queryKey: ['referrals'] });
    } catch (error) {
      ToastError(error || t('validation.toastError'));
    }
  };

  return (
    <Box>
      <Stack
        direction='row'
        alignItems='center'
        justifyContent='space-between'
        spacing={2}
      >
        <Typography variant='h5' sx={{ textTransform: 'uppercase' }}>
          {t('setting.labelReferrals')}
        </Typography>
        <Button
          variant='primary'
          sx={{ px: 4 }}
          onClick={() => setOpen(prev => ({ ...prev, open: true }))}
          disabled={!hasCreateAccess}
        >
          {t('setting.referralsInfo.addReferral')}
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
          <Table>
            <TableHeadCustom
              headLabel={TABLE_HEAD}
              rowCount={referralsData?.data?.length}
              bg
            />

            <TableBody>
              {isLoading && [1, 2, 3, 4].map(el => <TableSkeleton key={el} />)}
              {referralsData?.data &&
                referralsData?.data?.length > 0 &&
                referralsData?.data?.map(row => (
                  <ReferralTableRow
                    t={t}
                    hasUpdateAccess={hasUpdateAccess}
                    hasDeleteAccess={hasDeleteAccess}
                    key={row.id}
                    row={row}
                    onDeleteRow={() => handleDeleteRow(row?.id)}
                    onEditRow={() =>
                      setOpen(prev => ({ ...prev, open: true, id: row?.id }))
                    }
                  />
                ))}

              <TableNoData
                tableName={t('setting.referralsInfo.empData')}
                notFound={referralsData?.data?.length < 1}
              />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={
          referralsData?.pagination?.meta?.page?.total || referralsData?.data?.length
        }
        page={+page}
        rowsPerPage={rowsPerPage}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        backIconButtonProps={{
          disabled: !referralsData?.pagination?.meta?.page?.isPrevious,
        }}
        nextIconButtonProps={{
          disabled: !referralsData?.pagination?.meta?.page?.isNext,
        }}
        dense={dense}
        onChangeDense={onChangeDense}
      />

      <MainModal
        open={open.open}
        setOpen={() => setOpen(prev => ({ ...prev, open: false, id: null }))}
        title={
          open.id
            ? t('setting.referralsInfo.editReferral')
            : t('setting.referralsInfo.newReferral')
        }
      >
        <ReferralForm id={open?.id} setOpen={setOpen} />
      </MainModal>
    </Box>
  );
};

export default ReferralsInfo;
