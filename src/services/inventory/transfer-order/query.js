import { useQuery } from 'react-query';
import TransferOrderApiEndpoints from './api';

export const useGetTransferOrders = params => {
  return useQuery({
    queryKey: ['transfer-orders', params],
    queryFn: () => TransferOrderApiEndpoints.getTransferOrders(params),
  });
};

export const useGetTransferOrderId = id => {
  return useQuery({
    queryKey: ['transfer-id', id],
    queryFn: () => TransferOrderApiEndpoints.getTransferOrderById(id),
    enabled: !!id,
  });
};

export const useGetShowItem = params => {
  return useQuery({
    queryKey: ['transfer-item', params],
    queryFn: () => TransferOrderApiEndpoints.showItem(params),
    enabled: !!params?.transfer_id && !!params?.item_id,
  });
};
