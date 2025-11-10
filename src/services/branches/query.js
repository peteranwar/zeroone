import { useQuery } from 'react-query';
import BranchesApiEndpoints from './api';

export const useGetBranches = (params, language) => {
  return useQuery({
    queryKey: ['branches', language],
    queryFn: () => BranchesApiEndpoints.getBranches(params),
  });
};

export const useGetBranchId = id => {
  return useQuery({
    queryKey: ['branch-id', id],
    queryFn: () => BranchesApiEndpoints.getBranchById(id),
    enabled: !!id,
  });
};
