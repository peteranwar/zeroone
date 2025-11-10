/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable react/no-array-index-key */
import AddIcon from '@mui/icons-material/Add';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import Chip from '@mui/material/Chip';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router';
import { permissions, usePermission } from '../../../../constants';
import { useBoolean } from '../../../../hooks/use-boolean';
import OrdersApiEndpoints from '../../../../services/orders/api';
import { useGetJobOrderById } from '../../../../services/orders/query';
import MainModal from '../../../MainModal';
import ToastSuccess from '../../../ToastSuccess';
import { serviceHeadTHStyle } from '../style';
import AddService from './add-service';
import ConfirmDelete from '../../../shared/ConfirmDelete';
import ClearIcon from '@mui/icons-material/Clear';

const JopTable = ({ orderData, t }) => {
  const { orderId } = useParams();
  const queryClient = useQueryClient();
  const { haveAccess } = usePermission();
  const { data: jobOrderData } = useGetJobOrderById(orderId);

  const [editingCell, setEditingCell] = useState({ rowIndex: null, key: null });
  const [inputValue, setInputValue] = useState('');

  const [addServiceModal, setAddServiceModal] = useState({ open: false });

  const [expandedRows, setExpandedRows] = useState([]);

  const [selectedDeleteService, setSelectedDeleteService] = useState(null);
  const confirm = useBoolean();

  // Fake update API hook (replace with actual mutation)
  const updateJobOrder = async data => {
    OrdersApiEndpoints.updateJobOrderById(data)
      .then(() => {
        ToastSuccess(t('orders.details.jopTap.updateSuccess'));
        queryClient.invalidateQueries({ queryKey: ['job_order_id'] });
      })
      .catch(error => {
        ToastError(error?.response?.data?.message || t('validation.toastError'));
      });
  };

  const handleCellClick = (rowIndex, key, value) => {
    if (orderData?.status !== 'cancel' && hasUpdateJobOrderAccess) {
      setEditingCell({ rowIndex, key });
      setInputValue(value);
    }
  };

  const handleBlur = async (row, key) => {
    if (inputValue && Number(inputValue) > 0 && row.metres[key] !== inputValue) {
      await updateJobOrder({
        order_id: orderId,
        item_id: row?.id,
        dimensions: {
          [key]: inputValue,
        },
      });
    }
    setEditingCell({ rowIndex: null, key: null });
  };
  const hasUpdateJobOrderAccess = haveAccess(permissions.order.updateJobOrder);

  const toggleRow = id => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleDeleteJobOrderAdditionalItem = () => {
    OrdersApiEndpoints.deleteJobOrderAdditionalItem({
      additional_service_id: selectedDeleteService,
    })
      .then(() => {
        ToastSuccess(t('orders.details.jopTap.deleteAdditionalItem'));
        queryClient.invalidateQueries({ queryKey: ['job_order_id'] });
        confirm.onFalse();
      })
      .catch(error => {
        ToastError(error || t('validation.toastError'));
      });
  };
  return (
    <TableContainer
      component={Paper}
      sx={{ borderRadius: '10px', overflow: 'auto', border: 'none', boxShadow: 'none' }}
    >
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
            <TableCell rowSpan={2} sx={serviceHeadTHStyle} align='center'>
              {t('orders.details.jopTap.description')}
            </TableCell>
            <TableCell colSpan={4} align='center' sx={serviceHeadTHStyle}>
              {t('orders.details.jopTap.theMeters')}
            </TableCell>

            <TableCell rowSpan={2} sx={serviceHeadTHStyle} align='center'>
              {t('orders.details.jopTap.worker')}
            </TableCell>
          </TableRow>

          {/* Second Header Row (Sub-columns) */}
          <TableRow sx={{ backgroundColor: '#f4f5f7' }}>
            <TableCell align='center' sx={serviceHeadTHStyle}>
              W
            </TableCell>
            <TableCell align='center' sx={serviceHeadTHStyle}>
              L
            </TableCell>
            <TableCell align='center' sx={serviceHeadTHStyle}>
              PIC
            </TableCell>
            <TableCell align='center' sx={serviceHeadTHStyle}>
              TOT
            </TableCell>
          </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>
          {jobOrderData?.data?.length > 0 &&
            jobOrderData?.data.map((row, index) => (
              <React.Fragment key={row.id}>
                <TableRow>
                  <TableCell sx={serviceHeadTHStyle}>
                    <Tooltip title='Show Services' sx={{ marginInlineEnd: 5 }}>
                      <IconButton onClick={() => toggleRow(row.id)}>
                        {expandedRows.includes(row.id) ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                    {row?.service?.name} - {row?.position?.name}{' '}
                    <Tooltip title='Add Service'>
                      <IconButton
                        onClick={() =>
                          setAddServiceModal({
                            open: true,
                            id: row.id,
                          })
                        }
                        aria-label='Add Service'
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>

                  {/* W - Editable */}
                  <TableCell
                    sx={serviceHeadTHStyle}
                    align='center'
                    onClick={() => handleCellClick(index, 'w', row?.metres?.w)}
                  >
                    {editingCell.rowIndex === index && editingCell.key === 'w' ? (
                      <input
                        type='number'
                        value={inputValue}
                        autoFocus
                        onChange={e => setInputValue(e.target.value)}
                        onBlur={() => handleBlur(row, 'w')}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleBlur(row, 'w');
                        }}
                        style={{ width: '50px' }}
                      />
                    ) : (
                      row?.metres?.w || '---'
                    )}
                  </TableCell>

                  {/* L - Editable */}
                  <TableCell
                    sx={{ ...serviceHeadTHStyle, width: '60px' }}
                    align='center'
                    onClick={() => handleCellClick(index, 'l', row?.metres?.l)}
                  >
                    {editingCell.rowIndex === index && editingCell.key === 'l' ? (
                      <input
                        type='number'
                        autoFocus
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onBlur={() => handleBlur(row, 'l')}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleBlur(row, 'l');
                        }}
                        style={{ width: '50px' }}
                      />
                    ) : (
                      row?.metres?.l || '---'
                    )}
                  </TableCell>
                  {/* L - Editable */}
                  <TableCell
                    sx={{ ...serviceHeadTHStyle, width: '60px' }}
                    align='center'
                    onClick={() => handleCellClick(index, 'pic', row?.metres?.pic)}
                  >
                    {editingCell.rowIndex === index && editingCell.key === 'pic' ? (
                      <input
                        type='number'
                        autoFocus
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onBlur={() => handleBlur(row, 'pic')}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleBlur(row, 'pic');
                        }}
                        style={{ width: '50px' }}
                      />
                    ) : (
                      row?.metres?.pic || '---'
                    )}
                  </TableCell>

                  {/* Rest of the fields (not editable) */}

                  <TableCell sx={serviceHeadTHStyle} align='center'>
                    {row?.metres?.tot || '---'}
                  </TableCell>

                  <TableCell sx={serviceHeadTHStyle} align='center'>
                    {row?.employee?.name}
                  </TableCell>
                  <TableCell sx={serviceHeadTHStyle} align='center'>
                    {row.group}
                  </TableCell>
                </TableRow>
                {expandedRows.includes(row.id) && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      {row.additional_services?.length > 0 ? (
                        row.additional_services.map((service, sIndex) => (
                          /** New code */
                          <Box
                            key={sIndex}
                            display='inline-flex'
                            alignItems='center'
                            gap='5px'
                            sx={{
                              px: '20px',
                            }}
                          >
                            {service.name} - {service.length}
                            <Button
                              variant='text'
                              onClick={() => {
                                setSelectedDeleteService(service.id);
                                confirm.onTrue();
                              }}
                              title='Delete'
                              sx={{
                                px: 0,
                                minWidth: 0,
                                '& svg': {
                                  color: 'grey.600',
                                  transition: 'color 0.2s ease',
                                },
                                '&:hover svg': {
                                  color: 'grey.800', // darker on hover
                                },
                                '&:hover': {
                                  backgroundColor: 'transparent', // prevent button bg
                                },
                                m: 0.5,
                                p: 0.5,
                                height: 'auto',
                                '& .MuiChip-label': {
                                  display: 'block',
                                  whiteSpace: 'normal',
                                },
                              }}
                            >
                              <ClearIcon fontSize='small' />
                            </Button>
                          </Box>

                          /** Old Code */
                          // <Chip
                          //   key={sIndex}
                          //   label={`${service.name} - ${service.length}`}
                          //   onDelete={() => {
                          //     setSelectedDeleteService(service.id);
                          //     confirm.onTrue();
                          //   }}
                          //   // onDelete={() => handleDeleteJobOrderAdditionalItem(service.id)}

                          //   sx={{
                          //     m: 0.5,
                          //     p: 0.5,
                          //     height: 'auto',
                          //     '& .MuiChip-label': {
                          //       display: 'block',
                          //       whiteSpace: 'normal',
                          //     },
                          //   }}
                          // />
                        ))
                      ) : (
                        <Typography variant='body2' color='textSecondary'>
                          {t('orders.details.jopTap.noServices')}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
        </TableBody>
      </Table>

      {/* ADD SERVICE MODAL */}
      <MainModal
        open={addServiceModal.open}
        setOpen={() => setAddServiceModal({ open: false, id: null })}
        title='Add Service'
      >
        <AddService
          itemId={addServiceModal.id}
          orderId={orderId}
          handleCloseModal={() => setAddServiceModal({ open: false, id: null })}
        />
      </MainModal>

      <ConfirmDelete
        open={confirm.value}
        onClose={confirm.onFalse}
        onSubmitClicked={handleDeleteJobOrderAdditionalItem}
      />
    </TableContainer>
  );
};

export default JopTable;
