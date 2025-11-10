
const Dialog = (theme) => {
  return {
    MuiDialog: {
      styleOverrides: {
        paper: {
          width: '528px',
          [theme.breakpoints.down('tablet')]: {
            width: '100%',
          },
        },
      },
    },
  };
};

export default Dialog;
