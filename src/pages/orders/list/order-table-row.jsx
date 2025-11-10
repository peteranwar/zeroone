/* eslint-disable camelcase */
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  renderStatuesColor,
  renderStatuesText,
} from '../../../components/orders/columns';
import { permissions, usePermission } from '../../../constants';

// ----------------------------------------------------------------------

export default function OrderTableRow({ row, selected, t }) {
  const { id, client, order_date, delivery_date, status } = row;
  const navigate = useNavigate();
  const { haveAccess } = usePermission();
  const hasOrderAccess = haveAccess(permissions.order.read);

  return (
    <TableRow hover selected={selected}>
      <TableCell align='center'> {id} </TableCell>
      <TableCell align='center'> {client?.name} </TableCell>

      <TableCell align='center'> {client?.phone} </TableCell>

      <TableCell align='center'> {order_date || '----'} </TableCell>

      <TableCell align='center'> {delivery_date || '----'} </TableCell>

      <TableCell align='center'>
        <Box
          display='flex'
          alignItems='center'
          justifyContent='center'
          sx={{
            ...renderStatuesColor(status?.toLowerCase()),
            minWidth: '90px',
            minHeight: '34px',
            borderRadius: '10px',
            fontWeight: '600',
          }}
        >
          {renderStatuesText(status?.toLowerCase(), t)}
        </Box>
      </TableCell>

      <TableCell align='center'>
        <IconButton
          disabled={!hasOrderAccess}
          onClick={() =>
            navigate(status === 'draft' ? `/orders/new/${id}` : `/orders/details/${id}`)
          }
        >
          <VisibilityIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
