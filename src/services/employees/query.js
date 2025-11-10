import { useQuery } from 'react-query';
import EmployeesApiEndpoints from './api';

export const useGetEmployees = params => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: () => EmployeesApiEndpoints.getEmployees(params),
  });
};

export const useGetEmployeeId = id => {
  return useQuery({
    queryKey: ['item-id', id],
    queryFn: () => EmployeesApiEndpoints.showEmployee(id),
    enabled: !!id,
  });
};
