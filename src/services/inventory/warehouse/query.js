import { useQuery } from 'react-query';
import WarehouseApiEndpoints from './api';

export const useGetWarehouse = params => {
  return useQuery({
    queryKey: ['warehouse'],
    queryFn: () => WarehouseApiEndpoints.getWarehouse(params),
  });
};

export const useGetWarehouseId = id => {
  return useQuery({
    queryKey: ['warehouse-id', id],
    queryFn: () => WarehouseApiEndpoints.getWarehouseById(id),
    enabled: !!id,
  });
};
