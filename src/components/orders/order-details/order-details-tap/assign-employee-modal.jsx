import React, { useMemo } from 'react';
import { Typography, Autocomplete, TextField, Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { LoadingButton } from '@mui/lab';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router';
import MainModal from '../../../MainModal';
import { useGetEmployees } from '../../../../services/employees/query';
import OrdersApiEndpoints from '../../../../services/orders/api';
import ToastSuccess from '../../../ToastSuccess';
import ToastError from '../../../ToastError';

const AssignEmployeeModal = ({
  open,
  handleClose,
  t,
  selectedEmployee,
  setSelectedEmployee,
}) => {
  const queryClient = useQueryClient();
  const { orderId } = useParams();
  const { data: employeesData } = useGetEmployees();
  const employeeOptions = useMemo(() => {
    return (
      employeesData?.data?.map(emp => ({
        id: emp.id,
        name: `${emp.first_name} ${emp.last_name}`,
      })) || []
    );
  }, [employeesData]);

  const handleAssign = () => {
    if (!selectedEmployee?.employee || !selectedEmployee?.service) {
      ToastError(t('validation.toastError'));
      return;
    }
    const data = {
      order_id: orderId,
      service_id: selectedEmployee?.service.id,
      position_id: selectedEmployee?.position.id,
      employee_id: selectedEmployee?.employee.id,
    };
    OrdersApiEndpoints.updateEmployee(data)
      .then(res => {
        ToastSuccess(t('order.payment.create.toastSuccess'));
        queryClient.invalidateQueries({ queryKey: ['order_id'] });
        handleClose();
      })
      .catch(error => {
        ToastError(error?.response?.data?.message || t('validation.toastError'));
      });
  };

  return (
    <MainModal
      open={open}
      setOpen={() => handleClose()}
      title={t('orders.details.orderTap.assignEmp')}
    >
      <Typography fontWeight='bold' gutterBottom>
        {t('orders.details.orderTap.employee')}
      </Typography>
      <Autocomplete
        options={employeeOptions}
        getOptionLabel={option => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(event, newValue) =>
          setSelectedEmployee({
            employee: newValue,
            service: selectedEmployee?.service,
            position: selectedEmployee?.position,
          })
        }
        value={selectedEmployee?.employee}
        renderInput={params => (
          <TextField
            {...params}
            placeholder={t('orders.details.orderTap.placeEmp')}
            fullWidth
            variant='outlined'
          />
        )}
      />

      {/* Action Buttons */}
      <Stack direction='row' sx={{ justifyContent: 'space-between', pt: 4 }} spacing={2}>
        <LoadingButton
          onClick={handleAssign}
          variant='primary'
          startIcon={<AddIcon />}
          sx={{
            width: '100%',
          }}
        >
          {t('orders.details.orderTap.add')}
        </LoadingButton>
        <Button
          onClick={handleClose}
          variant='black'
          sx={{
            width: '100%',
          }}
        >
          {t('shard.cancel')}
        </Button>
      </Stack>
    </MainModal>
  );
};

export default AssignEmployeeModal;
