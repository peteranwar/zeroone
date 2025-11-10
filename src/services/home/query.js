import { useQuery } from 'react-query';
import HomeApiEndpoints from './api';

export const useGetIncomeSummary = params => {
  return useQuery({
    queryKey: ['income-summary', params],
    queryFn: () => HomeApiEndpoints.getIncomeSummary(params),
  });
};

export const useGetOverview = params => {
  return useQuery({
    queryKey: ['overview', params],
    queryFn: () => HomeApiEndpoints.getOverview(params),
  });
};
