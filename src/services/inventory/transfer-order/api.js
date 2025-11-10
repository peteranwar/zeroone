import HttpHelpers from '../../helpers';

const TransferOrderApiEndpoints = {
  getTransferOrders: params => {
    return HttpHelpers.authenticatedAxios
      .get('transfer', { params })
      .then(response => response.data);
  },
  getTransferOrderById: id => {
    return HttpHelpers.authenticatedAxios
      .get(`transfer/${id}`)
      .then(response => response.data);
  },

  addTransferOrder: data => {
    return HttpHelpers.authenticatedAxios
      .post('transfer', data)
      .then(response => response.data);
  },
  editTransferOrder: (id, data) => {
    return HttpHelpers.authenticatedAxios
      .post(`transfer/${id}`, data)
      .then(response => response.data);
  },

  // Items
  addItem: data => {
    return HttpHelpers.authenticatedAxios
      .post('transfer-item', data)
      .then(response => response.data);
  },
  updateItem: data => {
    return HttpHelpers.authenticatedAxios
      .post('transfer-item-update', data)
      .then(response => response.data);
  },
  deleteItem: data => {
    return HttpHelpers.authenticatedAxios
      .post('transfer-item-delete', data)
      .then(response => response.data);
  },
  showItem: params => {
    return HttpHelpers.authenticatedAxios
      .get('transfer-item', { params })
      .then(response => response.data);
  },

  // Status
  updateStatus: data => {
    return HttpHelpers.authenticatedAxios
      .post('update-transfer-status', data)
      .then(response => response.data);
  },
};

export default TransferOrderApiEndpoints;
