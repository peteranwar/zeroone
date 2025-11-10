import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { serviceHeadTHStyle } from '../style';
import MainImg from '../../../MainImg';
import { permissions, usePermission } from '../../../../constants';

const ServicesTable = ({ setSelectedEmployee, setOpen, t, serviceData, status }) => {
  const { haveAccess } = usePermission();
  const hasChangeEmployeeAccess = haveAccess(permissions.order.changeEmployee);
console.log(status, "status")
  return (
    <Box pb={2} mt={4}>
      <Typography variant='h5' fontWeight='bold' color='primary' mb={3}>
        {t('orders.details.orderTap.services')}
      </Typography>

      {/* Table Container */}
      <TableContainer component={Paper} sx={{ border: 'none', boxShadow: 'none' }}>
        <Table>
          {/* Table Head */}
          <TableHead sx={{ borderRadius: '12px' }}>
            <TableRow
              sx={{
                backgroundColor: '#F3F6F9',
                borderRadius: '12px',
                fontWeight: 'bold',
              }}
            >
              <TableCell sx={serviceHeadTHStyle}>
                {t('orders.details.orderTap.servicesName')}
              </TableCell>
              <TableCell sx={serviceHeadTHStyle}>
                {t('orders.details.orderTap.position')}
              </TableCell>
              <TableCell sx={serviceHeadTHStyle}>
                {t('orders.details.orderTap.employee')}
              </TableCell>
              <TableCell sx={serviceHeadTHStyle}>
                {t('orders.details.orderTap.price')}
              </TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {serviceData?.map(row => (
              <TableRow key={row.id}>
                <TableCell sx={{ border: 'none' }}>{row.service?.name}</TableCell>
                <TableCell sx={{ border: 'none' }}>{row.position?.name}</TableCell>
                <TableCell sx={{ border: 'none' }}>
                  {row.employee ? (
                    <>
                      {row.employee?.name}
                      {(status === 'in-progress' ||status === 'ready')
                       && (
                          <IconButton
                            disabled={!hasChangeEmployeeAccess}
                            onClick={() => {
                              setOpen(true);
                              setSelectedEmployee({
                                employee: row.employee,
                                position: row?.position,
                                service: row.service,
                              });
                            }}
                            size='small'
                            color='success'
                          >
                            <EditIcon fontSize='small' />
                          </IconButton>
                        )}
                    </>
                  ) : (
                    <Typography
                      onClick={() => {
                        setOpen(true);
                        setSelectedEmployee({
                          employee: row.employee,
                          position: row?.position,
                          service: row.service,
                        });
                      }}
                      sx={{ fontSize: '12px', cursor: 'pointer' }}
                      color='error'
                      fontWeight='600'
                    >
                      {t('orders.details.orderTap.assignEmployee')}
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', border: 'none' }}>
                  <MainImg
                    sx={{ marginInlineEnd: '.2rem' }}
                    name='money-grey.png'
                    width={12}
                    alt='money'
                  />
                  {row?.price}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ServicesTable;
