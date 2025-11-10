
const Backdrop = (theme) => {
  return {
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.backdrop.blurBackgroundColor,
          backdropFilter: 'blur(10px)',
        },
        invisible: {
          backgroundColor: 'transparent',
          backdropFilter: 'none',
        },
      },
    },
  };
};
export default Backdrop;
