
const Alert = (theme) => {
  return {
    MuiAlert: {
      styleOverrides: {
        root: {
          [theme.breakpoints.down('tablet')]: {
            width: '100vw',
          },
          [theme.breakpoints.up('tablet')]: {
            width: '40vw',
          },
        },

        filledSuccess: {
          backgroundColor: theme.palette.toast.success,
        },
        filledInfo: {
          backgroundColor: theme.palette.toast.info,
        },
        outlinedError: {
          backgroundColor: theme.palette.toast.error,
        },
        standardSuccess: {
          backgroundColor: theme.palette.primary.main,
        },
      },
    },
  };
};
export default Alert;
