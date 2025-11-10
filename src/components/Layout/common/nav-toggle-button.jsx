import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import { useResponsive } from '../../../hooks/use-responsive';

import { useSettingsContext } from '../../settings';

import { NAV } from '../config-layout';
import { bgBlur } from '../../../ui/theme/css';

// ----------------------------------------------------------------------

export default function NavToggleButton({ sx, ...other }) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const lgUp = useResponsive('up', 'lg');

  if (!lgUp) {
    return null;
  }

  return (
    <IconButton
      size='small'
      onClick={() =>
        settings.onUpdate(
          'themeLayout',
          settings.themeLayout === 'vertical' ? 'mini' : 'vertical'
        )
      }
      sx={{
        p: 0,
        top: 32,
        position: 'fixed',
        left: NAV.W_VERTICAL - 12,
        zIndex: theme.zIndex.appBar + 1,
        border: `dashed 1px ${theme.palette.divider}`,
        ...bgBlur({ opacity: 0.48, color: theme.palette.background.default }),
        '&:hover': {
          bgcolor: 'background.default',
        },
        ...sx,
      }}
      {...other}
    >
      {settings.themeLayout === 'vertical' ? (
        <KeyboardArrowLeftIcon />
      ) : (
        <KeyboardArrowRightIcon />
      )}
    </IconButton>
  );
}
