
const DialogContent = (theme) => {
  return {
    MuiDialogContent: {
      styleOverrides: {
        root: {
          paddingInline: 16,
          [theme.breakpoints.up('tablet')]: {
            paddingInline: 62,
          },
        },
      },
    },
  };
};

export default DialogContent;
