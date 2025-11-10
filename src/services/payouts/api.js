import HttpHelpers from '../helpers';

const PayoutApiEndpoints = {
  getPayout: (params) => {
    return HttpHelpers.authenticatedAxios
      .get('merchant/payouts',{params})
      .then(response => response.data);
  },
};

export default PayoutApiEndpoints;
