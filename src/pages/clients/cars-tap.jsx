/* eslint-disable camelcase */
import { Stack, Table, TableBody, TableContainer } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Scrollbar from '../../components/scrollbar';
import { TableHeadCustom, TableNoData } from '../../components/table';
import CarsTableRow from './table/cars-table-row';

const CarsTap = ({ cars }) => {
  const { t } = useTranslation();
  const TABLE_HEAD = [
    { id: 'carId', label: t('client.details.cars.carId'), width: 80 },
    { id: 'name', label: t('client.details.cars.brand'), width: 120 },
    { id: 'model', label: t('client.details.cars.model'), width: 120 },
    { id: 'model_year', label: t('client.details.cars.modelYear'), width: 140 },
    { id: 'color', label: t('client.details.cars.color'), width: 120 },
    { id: 'plate_number', label: t('client.details.cars.plate'), width: 150 },
    { id: '', label: t('shard.action'), width: 70 },
  ];

  return (
    <Stack>
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table>
            <TableHeadCustom headLabel={TABLE_HEAD} rowCount={cars?.length} />

            <TableBody>
              {cars &&
                cars?.length > 0 &&
                cars?.map(row => <CarsTableRow t={t} key={row.id} row={row} />)}

              <TableNoData
                tableName={t('client.table.empData')}
                notFound={cars?.length < 1}
              />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Stack>
  );
};

export default CarsTap;
