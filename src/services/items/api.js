import HttpHelpers from '../helpers';

const ItemsApiEndpoints = {
  addItem: data => {
    return HttpHelpers.authenticatedAxios
      .post('item', data)
      .then(response => response.data);
  },
  editItem: (id, data) => {
    return HttpHelpers.authenticatedAxios
      .post(`item/${id}`, data)
      .then(response => response.data);
  },
  getItems: params => {
    return HttpHelpers.authenticatedAxios
      .get('item', { params })
      .then(response => response.data);
  },
  getItemById: id => {
    return HttpHelpers.authenticatedAxios
      .get(`item/${id}`)
      .then(response => response.data);
  },
};

export default ItemsApiEndpoints;
