import { useQuery } from 'react-query';
import ReportsApiEndpoints from './api';

export const useGetTopProduct = params => {
  return useQuery({
    queryKey: ['top-product', params],
    queryFn: () => ReportsApiEndpoints.getTopProduct(params),
  });
};

export const useGetChart = params => {
  return useQuery({
    queryKey: ['sales-report', params],
    queryFn: () => ReportsApiEndpoints.getChart(params),
  });
};

export const useGetSummeryDaily = params => {
  return useQuery({
    queryKey: ['summery-daily', params],
    queryFn: () => ReportsApiEndpoints.getSummery(params),
  });
};

export const useGetPaymentDaily = params => {
  return useQuery({
    queryKey: ['payment-daily', params],
    queryFn: () => ReportsApiEndpoints.getPayment(params),
  });
};

export const useGetStock = params => {
  return useQuery({
    queryKey: ['stock', params],
    queryFn: () => ReportsApiEndpoints.getStock(params),
  });
};

export const useGetOrderTransaction = params => {
  return useQuery({
    queryKey: ['order-transaction', params],
    queryFn: () => ReportsApiEndpoints.getOrderTransaction(params),
  });
};
