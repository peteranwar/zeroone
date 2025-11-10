import HttpHelpers from '../../helpers';

const SuppliersApiEndpoints = {
  addSupplier: data => {
    return HttpHelpers.authenticatedAxios
      .post('supplier', data)
      .then(response => response.data);
  },
  editSupplier: (id, data) => {
    return HttpHelpers.authenticatedAxios
      .post(`supplier/${id}`, data)
      .then(response => response.data);
  },
  getSuppliers: params => {
    return HttpHelpers.authenticatedAxios
      .get('supplier', { params })
      .then(response => response.data);
  },
  getSupplierById: id => {
    return HttpHelpers.authenticatedAxios
      .get(`supplier/${id}`)
      .then(response => response.data);
  },
};

export default SuppliersApiEndpoints;
