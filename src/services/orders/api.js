import HttpHelpers from '../helpers';

const OrdersApiEndpoints = {
  getOrders: params => {
    return HttpHelpers.authenticatedAxios
      .get('order', { params })
      .then(response => response.data);
  },
  updateOrder: (id, data) => {
    return HttpHelpers.authenticatedAxios
      .post(`order/${id}`, data)
      .then(response => response.data);
  },
  addClient: data => {
    return HttpHelpers.authenticatedAxios
      .post('client', data)
      .then(response => response.data);
  },
  addCar: data => {
    return HttpHelpers.authenticatedAxios
      .post('client-car', data)
      .then(response => response.data);
  },
  getOrderById: id => {
    return HttpHelpers.authenticatedAxios
      .get(`order/${id}`)
      .then(response => response.data);
  },
  getJobOrderById: id => {
    return HttpHelpers.authenticatedAxios
      .get(`job-order?order_id=${id}`)
      .then(response => response.data);
  },
  updateJobOrderById: data => {
    return HttpHelpers.authenticatedAxios
      .post(`job-order`, data)
      .then(response => response.data);
  },
  // Clients
  getClientByPhone: params => {
    return HttpHelpers.authenticatedAxios
      .get('clients/get-by-phone', { params })
      .then(response => response.data);
  },
  getCarsByClientId: params => {
    return HttpHelpers.authenticatedAxios
      .get('client-car', { params })
      .then(response => response.data);
  },
  // Services
  getServiceDependOnPosition: params => {
    return HttpHelpers.authenticatedAxios
      .get('get-service-depend-on-position', { params })
      .then(response => response.data);
  },
  addServices: data => {
    return HttpHelpers.authenticatedAxios
      .post('update-order-by-service', data)
      .then(response => response.data);
  },
  // Payments
  addPayment: data => {
    return HttpHelpers.authenticatedAxios
      .post('update-order-by-payment', data)
      .then(response => response.data);
  },
  removePayments: data => {
    return HttpHelpers.authenticatedAxios
      .post('delete-order-payment', data)
      .then(response => response.data);
  },

  // employee
  updateEmployee: data => {
    return HttpHelpers.authenticatedAxios
      .post('update-order-service-employee', data)
      .then(response => response.data);
  },

  updateOrderStatus: data => {
    return HttpHelpers.authenticatedAxios
      .post('update-order-status', data)
      .then(response => response.data);
  },

  deleteJobOrderAdditionalItem: data => {
    return HttpHelpers.authenticatedAxios
      .post('job-order-delete-additional-item', data)
      .then(response => response.data);
  },

};

export default OrdersApiEndpoints;
