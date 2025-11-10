import { useQuery } from 'react-query';
import OrdersApiEndpoints from './api';

export const useGetOrders = params => {
  return useQuery({
    queryKey: ['app-orders', params],
    queryFn: () => OrdersApiEndpoints.getOrders(params),
  });
};

export const useGetClientByPhone = params => {
  return useQuery({
    queryKey: ['client', params],
    queryFn: () => OrdersApiEndpoints.getClientByPhone(params),
    enabled: false,
  });
};

export const useGetOrderById = id => {
  return useQuery({
    queryKey: ['order_id', id],
    queryFn: () => OrdersApiEndpoints.getOrderById(id),
    enabled: !!id,
  });
};


export const useGetJobOrderById = id => {
  return useQuery({
    queryKey  : ['job_order_id', id],
    queryFn: () => OrdersApiEndpoints.getJobOrderById(id),
    enabled: !!id,
  });
};
export const useGetCarsByClientId = (params, options = {}) => {
  return useQuery({
    queryKey: ['client_cars', params],
    queryFn: () => OrdersApiEndpoints.getCarsByClientId(params),
    enabled: !!params?.client_id,
    ...options,
  });
};

export const useGetServiceDependOnPosition = params => {
  return useQuery({
    queryKey: ['service_depend_position', params],
    queryFn: () => OrdersApiEndpoints.getServiceDependOnPosition(params),
    enabled: !!params?.position_id,
  });
};
