
const Menu = (theme) => {
  return {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow:'4px 4px 26px 0px rgba(102, 127, 168, 0.05)',
          border: '1px solid #E2E8F0',
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          // padding: '1rem',
        },
      },
    },
  };
};
export default Menu;
