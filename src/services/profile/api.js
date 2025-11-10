import HttpHelpers from '../helpers';

const ProfileApiEndpoints = {
  getUser: data => {
    return HttpHelpers.authenticatedAxios
      .get('profile', data)
      .then(response => response.data);
  },

  updateUserInfo: data => {
    return HttpHelpers.authenticatedAxios
      .post('profile/update', data)
      .then(response => response.data);
  },
  updateUserPassword: data => {
    return HttpHelpers.authenticatedAxios
      .post('profile/update-password', data)
      .then(response => response.data);
  },
  updateUserImage: (data, params) => {
    return HttpHelpers.authenticatedAxios
      .post('profile/upload-image', data, { params })
      .then(response => response.data);
  },
};

export default ProfileApiEndpoints;
