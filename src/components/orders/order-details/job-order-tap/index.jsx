import React from 'react';
import OrderShortInfo from '../order-details-tap/order-short-info';
import JopTable from './jop-table';

const JobOrderTap = ({ t, orderData }) => {
  return (
    <div>
      <OrderShortInfo t={t} orderData={orderData} />
      <JopTable orderData={orderData} t={t} />
    </div>
  );
};

export default JobOrderTap;
