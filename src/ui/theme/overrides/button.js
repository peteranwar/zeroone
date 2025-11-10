const Button = theme => {
  return {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: '14px',
          minHeight: '45px',
          padding: '0 1.5rem',
          fontFamily: theme.typography.fontFamily,
          fontWeight: theme.typography.fontWeightBold,
          transition: 'all 0.3s ease-in-out',
          textTransform: 'none',
        },
      },
      variants: [
        {
          props: {
            variant: 'primary',
          },
          style: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
            border: `1px solid ${theme.palette.primary.main}`,
            '&:hover': {
              backgroundColor: 'transparent',
              color: theme.palette.primary.main,
              border: `1px solid ${theme.palette.primary.main}`,
            },
            '&:active': {
              backgroundColor: theme.palette.common.white,
              color: theme.palette.text.primary,
            },
          },
        },
        {
          props: {
            variant: 'success',
          },
          style: {
            backgroundColor: theme.palette.success.main,
            color: theme.palette.common.white,
            '&:hover': {
              backgroundColor: theme.palette.success.dark,
            },
            '&.Mui-disabled': {
              backgroundColor: theme.palette.success.main,
              color: theme.palette.common.white,
              opacity: 0.6,
            },
          },
        },
        {
          props: {
            variant: 'danger',
          },
          style: {
            backgroundColor: 'transparent',
            color: theme.palette.secondary.main,
            border: `2px solid ${theme.palette.secondary.main}`,

            '&:hover': {
              backgroundColor: theme.palette.error.main,
              color: theme.palette.common.white,
            },
          },
        },
        {
          props: {
            variant: 'black',
          },
          style: {
            backgroundColor: 'transparent',
            color: theme.palette.common.black,
            border: `2px solid ${theme.palette.common.black}`,

            '&:hover': {
              border: `2px solid transparent`,
            },
          },
        },
      ],
    },
  };
};

export default Button;
