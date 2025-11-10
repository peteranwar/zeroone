/* eslint-disable camelcase */
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Box, IconButton, MenuItem } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { deleteIconAction, editIconAction } from '../../../assets/icons';
import CustomPopover, { usePopover } from '../../../components/custom-popover';
import {
  renderStatuesColor,
  renderStatuesText,
} from '../../../components/orders/columns';
import ConfirmDelete from '../../../components/shared/ConfirmDelete';
import { useBoolean } from '../../../hooks/use-boolean';

// ----------------------------------------------------------------------

export default function ServiceTableRow({
  row,
  selected,
  onDeleteRow,
  onEditRow,
  t,
  hasUpdateAccess,
  hasDeleteAccess,
}) {
  const { name, storage_unit, status, ingredient_unit, code } = row;
  const popover = usePopover();
  const confirm = useBoolean();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align='center'>{code}</TableCell>
        <TableCell align='center'>{name?.en}</TableCell>
        <TableCell align='center'>{name?.ar}</TableCell>

        <TableCell align='center'>{storage_unit}</TableCell>
        <TableCell align='center'>{ingredient_unit}</TableCell>

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
          sx={{ color: '#00B69B' }}
          disabled={!hasUpdateAccess}
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
