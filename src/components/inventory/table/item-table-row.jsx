/* eslint-disable camelcase */
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { IconButton, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { deleteIconAction, editIconAction } from '../../../assets/icons';
import { useBoolean } from '../../../hooks/use-boolean';
import CustomPopover, { usePopover } from '../../custom-popover';
import ConfirmDelete from '../../shared/ConfirmDelete';

// ----------------------------------------------------------------------

export default function ItemTableRow({
  row,
  selected,
  onDeleteRow,
  onEditRow,
  t,
  hasDeleteAccess,
  hasUpdateAccess,
  status,
}) {
  const { item, qty, cost } = row;
  const popover = usePopover();
  const confirm = useBoolean();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align='center'>{item?.name}</TableCell>
        <TableCell align='center'>{Number(qty)}</TableCell>
        <TableCell align='center'>{Number(cost)}</TableCell>

        <TableCell align='center'>
          <IconButton
            disabled={status}
            onClick={popover.onOpen}
            sx={{
              border: '1px solid #F1F1F2',
              borderRadius: '10px',
              p: '2px 5px',
            }}
          >
            <MoreHorizIcon sx={{ color: 'black' }} />
          </IconButton>
        </TableCell>
      </TableRow>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow='right-top'
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
          disabled={!hasUpdateAccess}
          sx={{ color: '#00B69B' }}
        >
          {editIconAction}
          {t('shard.edit')}
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
          disabled={!hasDeleteAccess}
        >
          {deleteIconAction}
          {t('shard.delete')}
        </MenuItem>
      </CustomPopover>

      <ConfirmDelete
        open={confirm.value}
        onClose={confirm.onFalse}
        onSubmitClicked={onDeleteRow}
      />
    </>
  );
}
