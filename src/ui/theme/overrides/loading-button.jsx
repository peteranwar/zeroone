import CircularProgress from '@mui/material/CircularProgress';

const LoadingButton = theme => {
  return {
    MuiLoadingButton: {
      defaultProps: {
        loadingIndicator: (
          <CircularProgress
            sx={{ color: '#fff', width: '18px !important', height: '18px !important' }}
          />
        ),
      },
      styleOverrides: {
        root: {
          '&.MuiLoadingButton-loading': {
            backgroundColor: theme.palette.primary.main,
          },
        },
        loadingIndicator: {
          color: theme.palette.common.white,
        },
      },
    },
  };
};
export default LoadingButton;
