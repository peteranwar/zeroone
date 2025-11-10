import { useQuery } from 'react-query';
import ClientsApiEndpoints from './api';

export const useGetClients = params => {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => ClientsApiEndpoints.getClients(params),
  });
};

export const useGetClientById = id => {
  return useQuery({
    queryKey: ['client-id', id],
    queryFn: () => ClientsApiEndpoints.showClient(id),
    enabled: !!id,
  });
};

export const useGetClientOrders = params => {
  return useQuery({
    queryKey: ['client-orders'],
    queryFn: () => ClientsApiEndpoints.getClientOrders(params),
    enabled: !!params?.client_id,
  });
};

export const useGetClientInvoices = params => {
  return useQuery({
    queryKey: ['client-invoices'],
    queryFn: () => ClientsApiEndpoints.getClientInvoices(params),
    enabled: !!params?.client_id,
  });
};
