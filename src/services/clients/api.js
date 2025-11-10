import HttpHelpers from '../helpers';

const ClientsApiEndpoints = {
  getClients: params => {
    return HttpHelpers.authenticatedAxios
      .get('client', { params })
      .then(response => response.data);
  },
  showClient: id => {
    return HttpHelpers.authenticatedAxios
      .get(`client/${id}`)
      .then(response => response.data);
  },
  getClientOrders: params => {
    return HttpHelpers.authenticatedAxios
      .get('clients/get-orders', { params })
      .then(response => response.data);
  },
  getClientInvoices: params => {
    return HttpHelpers.authenticatedAxios
      .get('clients/get-invoices', { params })
      .then(response => response.data);
  },
  updateClient: (id, data) => {
    return HttpHelpers.authenticatedAxios
      .post(`client/${id}`, data)
      .then(response => response.data);
  },
  updateCar: (id, data) => {
    return HttpHelpers.authenticatedAxios
      .post(`client-car/${id}`, data)
      .then(response => response.data);
  },
};

export default ClientsApiEndpoints;
