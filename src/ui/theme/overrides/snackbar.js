const Snackbar = () => {
  return {
    MuiSnackbar: {
      defaultProps: {
        anchorOrigin: { vertical: 'top', horizontal: 'left' },
        autoHideDuration: 5000,
      },
    },
  };
};
export default Snackbar;
