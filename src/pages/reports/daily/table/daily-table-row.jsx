/* eslint-disable camelcase */
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { sarIcon } from '../../../../assets/icons';

// ----------------------------------------------------------------------

export default function DailyTableRow({ row, selected }) {
  const { method, count, total } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell align='center'>{method}</TableCell>
      <TableCell align='center'>{count}</TableCell>
      <TableCell align='center'>
        {total} {sarIcon}
      </TableCell>
    </TableRow>
  );
}
