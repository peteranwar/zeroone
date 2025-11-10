/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { IconButton, Stack } from '@mui/material';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
// ----------------------------------------------------------------------

export default function OrdersTableRow({ row, selected, onEditRow }) {
  const { id, order_date, summary, services } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell align='center'>{id}</TableCell>
      <TableCell align='center'>{order_date}</TableCell>
      <TableCell align='center'>
        {services?.map((item, index) => (
          <Stack key={index}>
            {`${item?.service?.name} - ${item?.position?.name}`}
            <br />
          </Stack>
        ))}
      </TableCell>
      <TableCell align='center'>{Number(summary?.total)}</TableCell>

      <TableCell align='center'>
        <IconButton
          onClick={() => {
            onEditRow();
          }}
        >
          <RemoveRedEyeOutlinedIcon color='#737791' />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
