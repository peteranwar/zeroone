import HttpHelpers from '../helpers';

const ReportsApiEndpoints = {
  // Sales
  getTopProduct: params => {
    return HttpHelpers.authenticatedAxios
      .get('top-items', { params })
      .then(response => response.data);
  },
  getChart: params => {
    return HttpHelpers.authenticatedAxios
      .get('sales-report', { params })
      .then(response => response.data);
  },
  // Daily
  getSummery: params => {
    return HttpHelpers.authenticatedAxios
      .get('reports/summary', { params })
      .then(response => response.data);
  },
  getPayment: params => {
    return HttpHelpers.authenticatedAxios
      .get('reports/payment-breakdown', { params })
      .then(response => response.data);
  },
  // Inventory
  getStock: params => {
    return HttpHelpers.authenticatedAxios
      .get('reports/inventory', { params })
      .then(response => response.data);
  },
  getOrderTransaction: params => {
    return HttpHelpers.authenticatedAxios
      .get('reports/inventory/order-transaction', { params })
      .then(response => response.data);
  },
};

export default ReportsApiEndpoints;
