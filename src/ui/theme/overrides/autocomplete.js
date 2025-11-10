
const Autocomplete = (theme) => {
  return {
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          boxShadow: theme.shadows[2],
        },
      },
    },
  };
};
export default Autocomplete;
