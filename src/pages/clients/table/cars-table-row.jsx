/* eslint-disable camelcase */
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Box, IconButton, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { editIconAction } from '../../../assets/icons';
import CustomPopover, { usePopover } from '../../../components/custom-popover';
import AddCarModal from '../../../components/orders/add-order/add-car-modal';
import { useBoolean } from '../../../hooks/use-boolean';

// ----------------------------------------------------------------------

export default function CarsTableRow({ row, selected }) {
  const { t, i18n } = useTranslation();
  const { id, name, model, model_year, color, plate_number } = row;
  const popover = usePopover();
  const open = useBoolean();
  const { client_id } = useParams();

  return (
    <TableRow hover selected={selected}>
      <TableCell align='center'>{id}</TableCell>
      <TableCell align='center'>{name}</TableCell>
      <TableCell align='center'>{model}</TableCell>
      <TableCell align='center'>{model_year}</TableCell>
      <TableCell align='center'>
        <Box
          sx={{
            width: '100%',
            height: '1.5rem',
            background: color,
            borderRadius: '8px',
          }}
        />
      </TableCell>
      <TableCell align='center'>{plate_number}</TableCell>
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
      </CustomPopover>

      <AddCarModal
        open={open.value}
        handleClose={open.onFalse}
        t={t}
        i18n={i18n}
        clientId={client_id}
        carData={row}
      />
    </TableRow>
  );
}
