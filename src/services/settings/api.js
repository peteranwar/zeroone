import HttpHelpers from '../helpers';

const SettingsApiEndpoints = {
  // General Settings
  getSettings: () => {
    return HttpHelpers.authenticatedAxios.get('setting').then(response => response.data);
  },
  addSetting: data => {
    return HttpHelpers.authenticatedAxios
      .post('setting', data)
      .then(response => response.data);
  },

  // Cars
  editCars: (id, data) => {
    return HttpHelpers.authenticatedAxios
      .post(`cars/${id}`, data)
      .then(response => response.data);
  },
  showCar: id => {
    return HttpHelpers.authenticatedAxios
      .get(`cars/${id}`)
      .then(response => response.data);
  },
  addCar: data => {
    return HttpHelpers.authenticatedAxios
      .post('cars', data)
      .then(response => response.data);
  },

  // Positions
  editPosition: (id, data) => {
    return HttpHelpers.authenticatedAxios
      .post(`positions/${id}`, data)
      .then(response => response.data);
  },
  showPosition: id => {
    return HttpHelpers.authenticatedAxios
      .get(`positions/${id}`)
      .then(response => response.data);
  },
  addPosition: data => {
    return HttpHelpers.authenticatedAxios
      .post('positions', data)
      .then(response => response.data);
  },

  // Referrals
  editReferral: (id, data) => {
    return HttpHelpers.authenticatedAxios
      .post(`referral/${id}`, data)
      .then(response => response.data);
  },
  showReferral: id => {
    return HttpHelpers.authenticatedAxios
      .get(`referral/${id}`)
      .then(response => response.data);
  },
  addReferral: data => {
    return HttpHelpers.authenticatedAxios
      .post('referral', data)
      .then(response => response.data);
  },
};

export default SettingsApiEndpoints;
