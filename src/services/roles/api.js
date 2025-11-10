import HttpHelpers from '../helpers';

const RolesApiEndpoints = {
  getRoles: params => {
    return HttpHelpers.authenticatedAxios
      .get('role', { params })
      .then(response => response.data);
  },
  getPermissions: () => {
    return HttpHelpers.authenticatedAxios
      .get('permissions')
      .then(response => response.data);
  },

  editRole: (id, data) => {
    return HttpHelpers.authenticatedAxios
      .post(`role/${id}`, data)
      .then(response => response.data);
  },
  showRole: id => {
    return HttpHelpers.authenticatedAxios
      .get(`role/${id}`)
      .then(response => response.data);
  },
  addRole: data => {
    return HttpHelpers.authenticatedAxios
      .post('role', data)
      .then(response => response.data);
  },
};

export default RolesApiEndpoints;
