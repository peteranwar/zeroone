/* eslint-disable camelcase */
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  renderStatuesColor,
  renderStatuesText,
} from '../../../../components/orders/columns';

// ----------------------------------------------------------------------

export default function PurchaseTableRow({ row, selected, t, hasUpdateAccess }) {
  const { id, purchase_no, source, destination, date, status } = row;
  const navigate = useNavigate();

  return (
    <TableRow hover selected={selected}>
      <TableCell align='center'>{purchase_no}</TableCell>
      <TableCell align='center'>{source?.name}</TableCell>

      <TableCell align='center'>{destination?.type}</TableCell>
      <TableCell align='center'>{date}</TableCell>
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
          disabled={!hasUpdateAccess}
          onClick={() => navigate(`/inventory/internal-purchase-details/${id}`)}
        >
          <VisibilityIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
