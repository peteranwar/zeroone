import HttpHelpers from '../helpers';

const HomeApiEndpoints = {
  getIncomeSummary: params => {
    return HttpHelpers.authenticatedAxios
      .get('income-summary', { params })
      .then(response => response.data);
  },
  getOverview: params => {
    return HttpHelpers.authenticatedAxios
      .get('dashboard/overview', { params })
      .then(response => response.data);
  },
};

export default HomeApiEndpoints;
