import HttpHelpers from '../helpers';

const BranchesApiEndpoints = {
  addBranch: data => {
    return HttpHelpers.authenticatedAxios
      .post('branches', data)
      .then(response => response.data);
  },
  editBranch: (id, data) => {
    return HttpHelpers.authenticatedAxios
      .post(`branches/${id}`, data)
      .then(response => response.data);
  },
  getBranches: params => {
    return HttpHelpers.authenticatedAxios
      .get('branches', { params })
      .then(response => response.data);
  },
  getBranchById: id => {
    return HttpHelpers.authenticatedAxios
      .get(`branches/${id}`)
      .then(response => response.data);
  },
};

export default BranchesApiEndpoints;
