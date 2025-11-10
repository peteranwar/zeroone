import HttpHelpers from '../helpers';

const SharedApiEndpoints = {
  getCities: params => {
    return HttpHelpers.authenticatedAxios
      .get('city', { params })
      .then(response => response.data);
  },
  getCars: () => {
    return HttpHelpers.authenticatedAxios.get('cars').then(response => response.data);
  },

  getPositions: params => {
    return HttpHelpers.authenticatedAxios
      .get('positions', { params })
      .then(response => response.data);
  },
  getReferral: params => {
    return HttpHelpers.authenticatedAxios
      .get('referral', { params })
      .then(response => response.data);
  },
  uploadImage: (data, params) => {
    return HttpHelpers.authenticatedAxios
      .post('upload-image', data, { params })
      .then(response => response.data);
  },
  deleteImage: (data, params) => {
    return HttpHelpers.authenticatedAxios
      .post('delete-image', data, { params })
      .then(response => response.data);
  },


  
  getReferralCategory: params => {
    return HttpHelpers.authenticatedAxios
      .get('referral-category', { params })
      .then(response => response.data);
  },
};

export default SharedApiEndpoints;
