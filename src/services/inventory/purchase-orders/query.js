import { useQuery } from 'react-query';
import PurchaseApiEndpoints from './api';

export const useGetPurchases = params => {
  return useQuery({
    queryKey: ['purchases', params],
    queryFn: () => PurchaseApiEndpoints.getPurchases(params),
  });
};

export const useGetPurchasesId = id => {
  return useQuery({
    queryKey: ['purchase-id', id],
    queryFn: () => PurchaseApiEndpoints.getPurchaseById(id),
    enabled: !!id,
  });
};

export const useGetShowItem = params => {
  return useQuery({
    queryKey: ['purchase-item', params],
    queryFn: () => PurchaseApiEndpoints.showItem(params),
    enabled: !!params?.purchase_id && !!params?.item_id,
  });
};
