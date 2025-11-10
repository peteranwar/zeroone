import { Divider } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ServicesTable from './servise-table';
import PaymentDetails from './payment-details';
import PaymentsTable from './payment-table';
import OrderShortInfo from './order-short-info';
import AssignEmployeeModal from './assign-employee-modal';

const OrderDetailsTap = ({ orderData }) => {
  const { t } = useTranslation();
  const [openEmployeeModal, setOpenEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  return (
    <>
      <OrderShortInfo t={t} orderData={orderData} />
      <Divider sx={{ borderColor: '#F1F1F2' }} />
      <ServicesTable
        serviceData={orderData?.services}
        open={openEmployeeModal}
        setOpen={setOpenEmployeeModal}
        setSelectedEmployee={setSelectedEmployee}
        status={orderData?.status}
        t={t}
      />
      <Divider sx={{ borderColor: '#F1F1F2' }} />
      <PaymentDetails summaryData={orderData?.summary} t={t} />
      <Divider sx={{ borderColor: '#F1F1F2' }} />
      <PaymentsTable
        paymentsData={orderData?.payments}
        status={orderData?.status}
        summary={orderData?.summary}
        detailsPage
        t={t}
      />

      <AssignEmployeeModal
        open={openEmployeeModal}
        handleClose={() => setOpenEmployeeModal(false)}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
        t={t}
      />
    </>
  );
};

export default OrderDetailsTap;
