/* eslint-disable camelcase */
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { IconButton, MenuItem, Tooltip } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useTranslation } from 'react-i18next';
import CustomPopover, { usePopover } from '../../../../components/custom-popover';
import { deleteIconAction, editIconAction } from '../../../../assets/icons';
import { useBoolean } from '../../../../hooks/use-boolean';
import ConfirmDelete from '../../../../components/shared/ConfirmDelete';

// ----------------------------------------------------------------------

export default function CarTableRow({
  row,
  selected,
  onDeleteRow,
  onEditRow,
  t,
  hasDeleteAccess,
  hasUpdateAccess,
}) {
  const { translator_name, models } = row;
  const popover = usePopover();
  const confirm = useBoolean();
  const { i18n } = useTranslation();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align='center'>{translator_name?.en}</TableCell>
        <TableCell align='center'>{translator_name?.ar}</TableCell>

        <Tooltip
          title={models?.map(item => item?.translator_name?.[i18n.language]).join(' / ')}
        >
          <TableCell
            align='center'
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 200,
            }}
          >
            {models?.map(item => item?.translator_name?.[i18n.language]).join(' / ')}
          </TableCell>
        </Tooltip>

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
