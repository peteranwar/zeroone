import { useQuery } from 'react-query';
import SuppliersApiEndpoints from './api';

export const useGetSuppliers = params => {
  return useQuery({
    queryKey: ['suppliers', params],
    queryFn: () => SuppliersApiEndpoints.getSuppliers(params),
  });
};

export const useGetSupplierId = id => {
  return useQuery({
    queryKey: ['supplier-id', id],
    queryFn: () => SuppliersApiEndpoints.getSupplierById(id),
    enabled: !!id,
  });
};
