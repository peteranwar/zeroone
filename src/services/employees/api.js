import HttpHelpers from '../helpers';

const EmployeesApiEndpoints = {
  getEmployees: params => {
    return HttpHelpers.authenticatedAxios
      .get('employee', { params })
      .then(response => response.data);
  },
  addEmployee: data => {
    return HttpHelpers.authenticatedAxios
      .post('employee', data)
      .then(response => response.data);
  },
  showEmployee: id => {
    return HttpHelpers.authenticatedAxios
      .get(`employee/${id}`)
      .then(response => response.data);
  },
  editEmployee: (id, data) => {
    return HttpHelpers.authenticatedAxios
      .post(`employee/${id}`, data)
      .then(response => response.data);
  },
};

export default EmployeesApiEndpoints;
