/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Box, IconButton, MenuItem, Tooltip } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CustomPopover, { usePopover } from '../../../components/custom-popover';
import { deleteIconAction, editIconAction } from '../../../assets/icons';
import { useBoolean } from '../../../hooks/use-boolean';
import ConfirmDelete from '../../../components/shared/ConfirmDelete';

export default function RoleTableRow({
  row,
  selected,
  onDeleteRow,
  onEditRow,
  t,
  hasUpdateAccess,
  hasDeleteAccess,
}) {
  const { name, permissions } = row;
  const popover = usePopover();
  const confirm = useBoolean();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align='center'>{name}</TableCell>
        <TableCell align='center'>
          <Tooltip title={permissions?.map(p => p.name).join(' / ')}>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 1,
                overflow: 'hidden',
              }}
            >
              {permissions?.slice(0, 4).map((permission, idx) => (
                <Box
                  key={idx}
                  sx={{
                    backgroundColor: '#4AB58E1A',
                    borderRadius: '4px',
                    padding: '2px 5px',
                    fontSize: '12px',
                    color: '#4AB58E',
                    whiteSpace: 'nowrap',
                    fontWeight: 600,
                  }}
                >
                  {permission.name}
                </Box>
              ))}
              {permissions?.length > 4 && (
                <Box
                  sx={{
                    backgroundColor: '#A4B58E1A',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    color: '#4A5B5E',
                    whiteSpace: 'nowrap',
                  }}
                >
                  +{permissions.length - 4} {t('roles.more')}
                </Box>
              )}
            </Box>
          </Tooltip>
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
