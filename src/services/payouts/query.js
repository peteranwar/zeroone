import { useQuery } from 'react-query';
import PayoutApiEndpoints from './api';

export const useGetPayouts = params => {
  return useQuery({
    queryKey: ['app-payouts'],
    queryFn: () => PayoutApiEndpoints.getPayout(params),
  });
};
