/* eslint-disable no-console */
import { useMutation, useQueryClient } from 'react-query';
import EmployeesApiEndpoints from './api';

export function useCreateEmployee(failedMethod, successMethod) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: data => EmployeesApiEndpoints.addEmployee(data),
    onMutate: () => {
      console.log('mutate');
    },

    onError: () => {
      console.log('error');
    },

    onSuccess: () => {
      successMethod();
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        failedMethod(error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ['employees'] });
      }
    },
  });
}

export function useEditEmployee(failedMethod, successMethod, id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: data => EmployeesApiEndpoints.editEmployee(id, data),
    onMutate: () => {
      console.log('mutate');
    },

    onError: () => {
      console.log('error');
    },

    onSuccess: () => {
      successMethod();
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        failedMethod(error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ['employees'] });
      }
    },
  });
}

export function useDeleteEmployee(failedMethod, successMethod) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: id => EmployeesApiEndpoints.deleteEmployee(id),
    onMutate: () => {
      console.log('mutate');
    },

    onError: () => {
      console.log('error');
    },

    onSuccess: () => {
      successMethod();
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        failedMethod(error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ['employees'] });
      }
    },
  });
}
