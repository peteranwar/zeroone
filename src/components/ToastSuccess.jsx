import React from 'react';
import { toast } from 'react-toastify';
import { successIcon } from '../assets/icons';
import CloseToastIcon from './shared/CloseToastIcon';

const ToastSuccess = text => {
  return toast.success(text, {
    icon: successIcon,
    closeButton: <CloseToastIcon />,
    style: {
      backgroundColor: '#00B69B',
      color: 'white',
      fontWeight: 'bold',
      borderRadius: '16px',
      height: '35px',
    },
  });
};

export default ToastSuccess;
