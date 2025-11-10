import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { IconButton } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
// ----------------------------------------------------------------------

export default function InvoicesTableRow({ row, selected, onDownloadRow, t }) {
  const { id, date, method, total } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell align='center'>{id}</TableCell>

      <TableCell align='center'>{date}</TableCell>

      <TableCell align='center'>{method}</TableCell>

      <TableCell align='center'>{total}</TableCell>

      <TableCell>
        <IconButton
          onClick={() => {
            onDownloadRow();
          }}
          sx={{
            fontSize: '12px',
            color: '#4AB58E',
            gap: 0.5,
            ':hover': { background: 'transparent' },
          }}
        >
          <FileDownloadOutlinedIcon color='#4AB58E' sx={{ fontSize: '20px' }} />
          {t('shard.download')}
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
