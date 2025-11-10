/* eslint-disable camelcase */
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { IconButton, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CustomPopover, { usePopover } from '../../../components/custom-popover';
import { useBoolean } from '../../../hooks/use-boolean';
import MainModal from '../../../components/MainModal';
import ClientForm from '../client-form';
import { editIconAction } from '../../../assets/icons';

// ----------------------------------------------------------------------

export default function ClientTableRow({ row, selected, onEditRow, t }) {
  const { name, phone, email, last_visit } = row;
  const popover = usePopover();
  const open = useBoolean();
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align='center'>{name}</TableCell>
        <TableCell align='center'>{phone}</TableCell>
        <TableCell align='center'>{email}</TableCell>
        <TableCell align='center'>{last_visit}</TableCell>

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
            open.onToggle();
            popover.onClose();
          }}
          sx={{ color: '#00B69B' }}
        >
          {editIconAction}
          {t('shard.edit')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
          sx={{ color: 'black' }}
        >
          <RemoveRedEyeIcon />
          {t('shard.view')}
        </MenuItem>
      </CustomPopover>

      <MainModal
        open={open.value}
        setOpen={open.setValue}
        title={t('client.editForm.title')}
      >
        <ClientForm clientData={row} setOpen={open.setValue} />
      </MainModal>
    </>
  );
}
