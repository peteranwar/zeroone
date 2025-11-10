/* eslint-disable camelcase */
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useBoolean } from '../../../../hooks/use-boolean';
import ConfirmDelete from '../../../../components/shared/ConfirmDelete';
import {
  renderStatuesColor,
  renderStatuesText,
} from '../../../../components/orders/columns';
import { permissions, usePermission } from '../../../../constants';

// ----------------------------------------------------------------------

export default function TransferableRow({ row, selected, onDeleteRow, t }) {
  const { id, transfer_no, source, destination, type, status, date } = row;
  const confirm = useBoolean();
  const navigate = useNavigate();
  const { haveAccess } = usePermission();
  const hasOTransferAccess = haveAccess(permissions.transfer.read);

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align='center'>{transfer_no}</TableCell>
        <TableCell align='center'>{source?.name}</TableCell>

        <TableCell align='center'>{destination?.name}</TableCell>
        <TableCell align='center'>{type}</TableCell>
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
            disabled={!hasOTransferAccess}
            onClick={() => navigate(`/inventory/transferOrder/${id}`)}
          >
            <VisibilityIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <ConfirmDelete
        open={confirm.value}
        onClose={confirm.onFalse}
        onSubmitClicked={onDeleteRow}
      />
    </>
  );
}
