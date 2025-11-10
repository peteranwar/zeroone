/* eslint-disable camelcase */
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

export default function StockTableRow({ row, selected }) {
  const { item, stock, cost, unit_cost, destination } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell align='center'>{item?.id}</TableCell>
      <TableCell align='center'>{item?.name}</TableCell>
      <TableCell align='center'>{stock}</TableCell>
      <TableCell align='center'>{cost}</TableCell>
      <TableCell align='center'>{unit_cost}</TableCell>
      <TableCell align='center'>{destination?.name}</TableCell>
    </TableRow>
  );
}
