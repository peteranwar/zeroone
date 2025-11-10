
const DialogActions = (theme) => {
  return {
    MuiDialogActions: {
      styleOverrides: {
        root: {
          paddingBottom: 48,
          [theme.breakpoints.down('tablet')]: {
            paddingInline: 16,
          },
          [theme.breakpoints.up('tablet')]: {
            paddingInline: 62,
          },
        },
      },
    },
  };
};

export default DialogActions;
