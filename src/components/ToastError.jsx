import React from 'react';
import { toast } from 'react-toastify';
import { deleteIcon } from '../assets/icons';
import CloseToastIcon from './shared/CloseToastIcon';

const ToastError = error => {
  return toast.error(error?.response?.data?.message, {
    icon: deleteIcon,
    closeButton: <CloseToastIcon />,

    style: {
      backgroundColor: '#E92929',
      color: 'white',
      fontWeight: 'bold',
      borderRadius: '16px',
      height: '35px',
    },
  });
};

export default ToastError;
