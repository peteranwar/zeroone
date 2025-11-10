import HttpHelpers from '../../helpers';

const WarehouseApiEndpoints = {
  addWarehouse: data => {
    return HttpHelpers.authenticatedAxios
      .post('warehouse', data)
      .then(response => response.data);
  },
  editWarehouse: (id, data) => {
    return HttpHelpers.authenticatedAxios
      .post(`warehouse/${id}`, data)
      .then(response => response.data);
  },
  getWarehouse: params => {
    return HttpHelpers.authenticatedAxios
      .get('warehouse', { params })
      .then(response => response.data);
  },
  getWarehouseById: id => {
    return HttpHelpers.authenticatedAxios
      .get(`warehouse/${id}`)
      .then(response => response.data);
  },
};

export default WarehouseApiEndpoints;
