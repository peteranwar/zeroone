
const IconButton = (theme) => {
  return {
    MuiIconButton: {
      variants: [
        {
          props: { color: `${theme.palette.grey[50]} !important` },
          style: {
            '&:hover': { backgroundColor: theme.palette.action.hover },
          },
        },
        {
          props: { color: `${theme.palette.grey[50]} !important` },
          style: {
            '&:hover': { backgroundColor: theme.palette.action.hover },
          },
        },
      ],

      styleOverrides: {
        root: {
          color: `${theme.palette.grey[50]} !important`,
        },
      },
    },
  };
};
export default IconButton;
