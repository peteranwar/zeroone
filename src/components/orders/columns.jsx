import { format } from 'date-fns';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import ChecklistIcon from '@mui/icons-material/Checklist';
import CancelIcon from '@mui/icons-material/Cancel';
import SwipeLeftIcon from '@mui/icons-material/SwipeLeft';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import MainImg from '../MainImg';

export const statusArrayOrders = t => [
  {
    id: 1,
    status: t('home.table.statusColor.complete'),
    icon: <ChecklistIcon />,
    value: 'complete',
  },
  {
    id: 2,
    status: t('home.table.statusColor.prepare'),
    icon: <HourglassBottomIcon />,
    value: 'prepare',
  },
  {
    id: 3,
    status: t('home.table.statusColor.timeOut'),
    icon: <AlarmOnIcon />,
    value: 'time_out',
  },
  {
    id: 4,
    status: t('home.table.statusColor.reject'),
    icon: <SwipeLeftIcon />,
    value: 'reject',
  },
  {
    id: 5,
    status: t('home.table.statusColor.cancel'),
    icon: <CancelIcon />,
    value: 'cancel',
  },
];

export const renderStatuesColor = status => {
  switch (status) {
    case 'complete':
    case 'active':
      return {
        backgroundColor: 'rgba(0, 180, 100, 0.1)',
        color: '#00B464',
      };
    case 'in-progress':
      return {
        backgroundColor: 'rgba(255, 153, 0, 0.1)',
        color: '#FF9900',
      };
    case 'approve':
      return {
        backgroundColor: 'rgba(34, 139, 230, 0.1)',
        color: '#228BE6',
      };
    case 'pending':
      return {
        backgroundColor: 'rgba(255, 204, 0, 0.15)',
        color: '#FFCC00',
      };
    case 'cancel':
    case 'inactive':
    case 'reject':
    case 'close':
      return {
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        color: '#DC3545',
      };
    case 'draft':
      return {
        backgroundColor: 'rgba(108, 117, 125, 0.1)',
        color: '#6C757D',
      };
    case 'ready':
      return {
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        color: '#007BFF',
      };
    default:
      return null;
  }
};

export const renderStatuesText = (status, t) => {
  switch (status) {
    case 'complete':
      return t('home.table.statusColor.complete');
    case 'active':
      return t('home.table.statusColor.active');
    case 'inactive':
      return t('home.table.statusColor.inactive');
    case 'pending':
      return t('home.table.statusColor.pending');
    case 'approve':
      return t('home.table.statusColor.approve');
    case 'in-progress':
      return t('home.table.statusColor.prepare');
    case 'cancel':
      return t('home.table.statusColor.cancel');
    case 'close':
      return t('home.table.statusColor.close');
    case 'reject':
      return t('home.table.statusColor.reject');
    case 'ready':
      return t('home.table.statusColor.ready');
    case 'draft':
      return t('home.table.statusColor.draft');
    default:
      return null;
  }
};

export const columnsOrders = t => {
  return [
    {
      field: 'id',
      headerName: t('home.table.id'),
      headerAlign: 'center',
      width: 200,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'created_date',
      headerName: t('home.table.date'),
      headerAlign: 'center',
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: params => format(new Date(params?.formattedValue), 'dd/MM/yyyy'),
    },
    {
      field: 'customer_name',
      headerName: t('home.table.name'),
      headerAlign: 'center',
      width: 200,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'status',
      headerName: t('home.table.status'),
      width: 180,
      renderCell: params => (
        <Box
          display='flex'
          alignItems='center'
          justifyContent='center'
          sx={{
            ...renderStatuesColor(params?.formattedValue?.toLowerCase()),
            minWidth: '90px',
            minHeight: '34px',
            borderRadius: '10px',
            fontWeight: '500',
          }}
        >
          {renderStatuesText(params?.formattedValue?.toLowerCase(), t)}
        </Box>
      ),
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'payment_method',
      headerName: t('home.table.paymentMethod'),
      headerAlign: 'center',
      width: 200,
      sortable: false,
      disableColumnMenu: true,
      renderCell: params => (
        <MainImg src={params?.formattedValue} alt='payment_method' height='1.2rem' />
      ),
    },
    {
      field: 'amount',
      headerName: t('home.table.amount'),
      width: 150,
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      renderCell: params => (
        <Box
          sx={{ direction: 'rtl' }}
          display='flex'
          alignItems='center'
          justifyContent='center'
          gap={1}
        >
          <MainImg name='money.png' width={15} alt='money' />
          {params?.formattedValue}
        </Box>
      ),
    },
    {
      field: 'action',
      headerName: t('home.table.action'),
      sortable: false,
      disableColumnMenu: true,
      width: 150,
      headerAlign: 'center',
      renderCell: params => (
        <Box
          to={`/orders/details/${params.id}`}
          component={Link}
          display='flex'
          alignItems='center'
          sx={{ textDecoration: 'none' }}
        >
          <RemoveRedEyeOutlinedIcon sx={{ fontSize: 22, color: '#737791' }} />
        </Box>
      ),
    },
  ];
};
