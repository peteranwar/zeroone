import { useQuery } from 'react-query';
import SharedApiEndpoints from './shared.api';

export const useGetCities = (params, language) => {
  return useQuery({
    queryKey: ['cities', language],
    queryFn: () => SharedApiEndpoints.getCities(params),
  });
};

export const useGetPositions = params => {
  return useQuery({
    queryKey: ['positions', params],
    queryFn: () => SharedApiEndpoints.getPositions(params),
  });
};

export const useGetReferrals = params => {
  return useQuery({
    queryKey: ['referrals', params],
    queryFn: () => SharedApiEndpoints.getReferral(params),
  });
};

export const useGetCars = () => {
  return useQuery({
    queryKey: ['cars'],
    queryFn: () => SharedApiEndpoints.getCars(),
  });
};


export const useGetReferralCategory = params => {
  return useQuery({
    queryKey: ['referral-category', params],
    queryFn: () => SharedApiEndpoints.getReferralCategory(params),
  });
};