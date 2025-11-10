import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { IconButton, MenuItem, Stack } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CustomPopover, { usePopover } from '../../../components/custom-popover';
import { deleteIconAction, editIconAction } from '../../../assets/icons';
import { useBoolean } from '../../../hooks/use-boolean';
import ConfirmDelete from '../../../components/shared/ConfirmDelete';
import Label from '../../../components/label';

// ----------------------------------------------------------------------

export default function BranchTableRow({
  row,
  selected,
  onDeleteRow,
  onEditRow,
  t,
  hasUpdateAccess,
  hasDeleteAccess,
}) {
  const { name, city, district, status } = row;
  const popover = usePopover();
  const confirm = useBoolean();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align='center'>{name?.en}</TableCell>

        <TableCell align='center'>{name?.ar}</TableCell>

        <TableCell align='center'>{`${city?.name} - ${district?.name}`}</TableCell>

        <TableCell sx={{ maxWidth: '300px' }} align='center'>
          <Stack direction='row' justifyContent='center' spacing={1}>
            <Label
              variant='soft'
              color={status === 'inactive' ? '#EA0234' : '#4AB58E'}
              sx={{ py: '1rem', width: '6rem', display: 'flex' }}
            >
              {status}
            </Label>
          </Stack>
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
