
const checkbox = (theme) => {
  return {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: theme.palette.grey[30],
          '& .MuiSvgIcon-root': {
            borderRadius: 6,
            fontWeight: 900,
          },
        },
      },
    },
  };
};

export default checkbox;
