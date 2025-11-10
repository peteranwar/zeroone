import HttpHelpers from './helpers';

const AuthApiEndpoints = {
  login: data => {
    return HttpHelpers.unAuthenticatedAxios
      .post('login', data)
      .then(response => response.data);
  },

  forgetPassword: data => {
    return HttpHelpers.unAuthenticatedAxios
      .post('forget-password', data)
      .then(response => response.data);
  },

  confirmOtp: data => {
    return HttpHelpers.unAuthenticatedAxios
      .post('verify-otp', data)
      .then(response => response.data);
  },
  resetPassword: data => {
    return HttpHelpers.unAuthenticatedAxios
      .post('reset-password', data)
      .then(response => response.data);
  },
};

export default AuthApiEndpoints;
