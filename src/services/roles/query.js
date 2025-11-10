import { useQuery } from 'react-query';
import RolesApiEndpoints from './api';

export const useGetRoles = params => {
  return useQuery({
    queryKey: ['roles', params],
    queryFn: () => RolesApiEndpoints.getRoles(params),
  });
};

export const useGetPermissions = () => {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: () => RolesApiEndpoints.getPermissions(),
  });
};

export const useGetShowRole = id => {
  return useQuery({
    queryKey: ['show-role', id],
    queryFn: () => RolesApiEndpoints.showRole(id),
    enabled: !!id,
  });
};
