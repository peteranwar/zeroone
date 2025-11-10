const Input = theme => {
  return {
    MuiFormControl: {
      defaultProps: {
        fullWidth: true,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.MuiInputBase-root': {
            borderRadius: '12px',
            backgroundColor: '#F3F6F9',
            p: '14px',
          },
          '&.Mui-disabled': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.action.disabledBackground,
            },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: '1px solid transparent',
            borderRadius: '12px',
          },
        },
        notchedOutline: {
          borderColor: theme.palette.action.disabledBackground,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
      },
    },
  };
};
export default Input;
