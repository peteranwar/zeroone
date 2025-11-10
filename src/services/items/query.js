import { useQuery } from 'react-query';
import ItemsApiEndpoints from './api';

export const useGetItems = params => {
  return useQuery({
    queryKey: ['items', params],
    queryFn: () => ItemsApiEndpoints.getItems(params),
  });
};

export const useGetItemId = id => {
  return useQuery({
    queryKey: ['item-id', id],
    queryFn: () => ItemsApiEndpoints.getItemById(id),
    enabled: !!id,
  });
};
