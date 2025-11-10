import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import UploadIcon from '@mui/icons-material/Upload';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Tooltip } from '@mui/material';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useTranslation } from 'react-i18next';
import { deleteIconAction, editIconAction } from '../../assets/icons';

export default function Actions({
  btnBdf,
  edit,
  disable,
  del,
  view,
  actionEdit,
  actionDisable,
  actionDel,
  actionView,
  actionActivate,
  activate,
  actionDeactivate,
  deactivate,
}) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const { t } = useTranslation();

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Stack direction='row' spacing={2} alignItems='center'>
      {btnBdf ? (
        <Button
          ref={anchorRef}
          id='composition-button'
          aria-controls={open ? 'composition-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup='true'
          onClick={handleToggle}
          startIcon={<UploadIcon />}
          endIcon={<ExpandMoreIcon />}
          variant='outlined'
          sx={{
            border: 'none',
            boxShadow: '0px 20px 50px 0px #3745570F',
            borderRadius: '16px',
            px: '2rem',
            color: '#737791',
            '&:hover': { border: 'none' },
          }}
        >
          {t('popupActions.export')}
        </Button>
      ) : (
        <Stack direction='row' spacing={2}>
          {view && (
            <Box onClick={(handleClose, actionView)} sx={{ cursor: 'pointer' }}>
              <Tooltip title={t('popupActions.view')}>
                <VisibilityOutlinedIcon sx={{ color: '#737791', fontSize: '23px' }} />
              </Tooltip>
            </Box>
          )}
          {edit && (
            <Box
              onClick={(handleClose, actionEdit)}
              sx={{ color: '#00B69B', cursor: 'pointer' }}
            >
              <Tooltip title={t('popupActions.edit')}>{editIconAction}</Tooltip>
            </Box>
          )}

          {activate && (
            <Box
              onClick={(handleClose, actionActivate)}
              sx={{ color: 'black', cursor: 'pointer' }}
            >
              <Tooltip title={t('popupActions.activate')}>
                <Box>
                  <VisibilityOutlinedIcon fontSize='small' sx={{ color: 'black' }} />
                </Box>
              </Tooltip>
            </Box>
          )}
          {deactivate && (
            <Box
              onClick={(handleClose, actionDeactivate)}
              sx={{ color: 'black', cursor: 'pointer' }}
            >
              <Tooltip title={t('popupActions.deactivate')}>
                <Box>
                  <VisibilityOffOutlinedIcon fontSize='small' sx={{ color: 'black' }} />
                </Box>
              </Tooltip>
            </Box>
          )}
          {disable && (
            <Box
              onClick={(handleClose, actionDisable)}
              sx={{ color: 'black', cursor: 'pointer' }}
            >
              <Tooltip title={t('popupActions.disable')}>
                <Box>
                  <VisibilityOffOutlinedIcon fontSize='small' sx={{ color: 'black' }} />
                </Box>
              </Tooltip>
            </Box>
          )}

          {del && (
            <Box
              onClick={(handleClose, actionDel)}
              sx={{ color: '#EA0234', cursor: 'pointer' }}
            >
              <Tooltip title={t('popupActions.del')}>{deleteIconAction}</Tooltip>
            </Box>
          )}
        </Stack>
      )}
    </Stack>
  );
}
