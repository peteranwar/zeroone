import { useQuery } from 'react-query';
import ProfileApiEndpoints from './api';

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => ProfileApiEndpoints.getUser(),
  });
};
