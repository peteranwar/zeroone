import HttpHelpers from '../../helpers';

const PurchaseApiEndpoints = {
  addPurchase: data => {
    return HttpHelpers.authenticatedAxios
      .post('purchase', data)
      .then(response => response.data);
  },
  editPurchase: (id, data) => {
    return HttpHelpers.authenticatedAxios
      .post(`purchase/${id}`, data)
      .then(response => response.data);
  },
  getPurchases: params => {
    return HttpHelpers.authenticatedAxios
      .get('purchase', { params })
      .then(response => response.data);
  },
  getPurchaseById: id => {
    return HttpHelpers.authenticatedAxios
      .get(`purchase/${id}`)
      .then(response => response.data);
  },

  // Items
  addItem: data => {
    return HttpHelpers.authenticatedAxios
      .post('purchase-item', data)
      .then(response => response.data);
  },
  updateItem: data => {
    return HttpHelpers.authenticatedAxios
      .post('purchase-item-update', data)
      .then(response => response.data);
  },
  deleteItem: data => {
    return HttpHelpers.authenticatedAxios
      .post('purchase-item-delete', data)
      .then(response => response.data);
  },
  showItem: params => {
    return HttpHelpers.authenticatedAxios
      .get('purchase-item', { params })
      .then(response => response.data);
  },

  // Status
  updateStatus: data => {
    return HttpHelpers.authenticatedAxios
      .post('update-purchase-status', data)
      .then(response => response.data);
  },
};

export default PurchaseApiEndpoints;
