/* eslint-disable camelcase */
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  renderStatuesColor,
  renderStatuesText,
} from '../../../../../components/orders/columns';

// ----------------------------------------------------------------------

export default function InventoryHistoryTableRow({ row, selected }) {
  const {
    reference_no,
    order_code,
    status,
    type,
    destination,
    customer,
    total,
    paid,
    remain,
    qty,
  } = row;

  const { t } = useTranslation();

  return (
    <TableRow hover selected={selected}>
      <TableCell align='center'>{reference_no}</TableCell>
      <TableCell align='center'>{order_code}</TableCell>
      <TableCell align='center'>{remain}</TableCell>
      <TableCell align='center'>{type}</TableCell>
      <TableCell align='center'>{destination?.name}</TableCell>
      <TableCell align='center'>{customer?.name}</TableCell>
      <TableCell align='center'>{paid}</TableCell>
      <TableCell align='center'>{qty}</TableCell>
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
      <TableCell align='center'>{total}</TableCell>
    </TableRow>
  );
}
