import { useQuery } from 'react-query';
import SettingsApiEndpoints from './api';

export const useGetSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => SettingsApiEndpoints.getSettings(),
  });
};

export const useGetShowCar = id => {
  return useQuery({
    queryKey: ['show-car', id],
    queryFn: () => SettingsApiEndpoints.showCar(id),
    enabled: !!id,
  });
};

export const useGetShowPosition = id => {
  return useQuery({
    queryKey: ['show-position', id],
    queryFn: () => SettingsApiEndpoints.showPosition(id),
    enabled: !!id,
  });
};

export const useGetShowReferral = id => {
  return useQuery({
    queryKey: ['show-referral', id],
    queryFn: () => SettingsApiEndpoints.showReferral(id),
    enabled: !!id,
  });
};
