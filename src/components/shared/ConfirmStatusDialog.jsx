import {
  Dialog,
  DialogActions,
  Typography,
  Box,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { overviewIcon } from '../../assets/icons';

const ConfirmStatusDialog = ({
  open,
  onClose,
  onConfirm,
  loading = false,
  statusName = 'Confirmed',
}) => {
  const { t } = useTranslation();

  const theme = useTheme();
  const mobileView = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      component={Dialog}
      display='flex'
      mx='auto'
      sx={{
        '& .MuiPaper-root': {
          borderRadius: mobileView ? '12px' : '22px',
          width: mobileView ? '75vw' : '38vw',
          p: 4,
        },
      }}
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      textAlign='center'
      open={open}
      onClose={onClose}
    >
      <Box
        sx={{
          color: '#112B3C',
          cursor: 'pointer',
          fontWeight: '600',
          borderRadius: '16px',
          ml: 'auto',
          border: '1px solid #E8E9F3',
          p: 1.3,
          lineHeight: 0,
        }}
        onClick={onClose}
      >
        <CloseIcon sx={{ fontSize: '18px' }} />
      </Box>

      <Box
        mx='auto'
        mt={3}
        sx={{ 'svg': { width: '40px', height: { xs: '30px', sm: '40px' } } }}
      >
        {overviewIcon}
      </Box>

      {/* Title */}
      <Typography
        sx={{
          width: { xs: '100%', md: '80%' },
          marginInline: 'auto',
          pt: 3,
          pb: { xs: 2, sm: 7 },
        }}
        variant='h5'
      >
        {t('shard.titlePopupStatus')} {t(`home.table.statusColor.${statusName}`)} ?
      </Typography>

      {/* Actions */}
      <Box
        component={DialogActions}
        display='flex'
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent='center'
        alignItems='center'
        p={0}
      >
        <Box
          component={LoadingButton}
          loading={loading}
          onClick={onConfirm}
          variant='contained'
          width='100%'
        >
          {t('shard.confirm')}
        </Box>
        <Typography
          onClick={onClose}
          color='text.secondary'
          variant='h6'
          width='100%'
          component={Button}
        >
          {t('shard.cancel')}
        </Typography>
      </Box>
    </Box>
  );
};

export default ConfirmStatusDialog;
