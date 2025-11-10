export const cssBaseline = theme => ({
  MuiCssBaseline: {
    styleOverrides: {
      '@font-face': {
        fontFamily: 'Poppins-Regular',
        fontDisplay: 'swap',
        fontStyle: 'normal',
        src: `local('Poppins-Regular'),
            url( '/fonts/SFArabic/SFArabic/SFArabic-Regular.ttf') format('truetype')`,
      },
      fallbacks: [
        {
          '@font-face': {
            fontFamily: 'PoppinsLight',
            fontDisplay: 'swap',
            fontStyle: 'normal',
            src: `local(Poppins-Light'),
          url( '/fonts/SFArabic/SFArabic/SFArabicRounded-Regular.ttf') format('truetype')`,
          },
        },
        {
          '@font-face': {
            fontFamily: 'Poppins-bold',
            fontDisplay: 'swap',
            fontStyle: 'normal',
            src: `local('Poppins-bold'),
          url( '/fonts/SFArabic/SFArabic/SFArabicRounded-Regular.ttf') format('truetype')`,
          },
        },
      ],
      '*': {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
      },

      html: {
        width: '100%',
        height: '100%',
        fontSize: '11px',
        [theme.breakpoints.up('md')]: {
          fontSize: '12px',
        },
        [theme.breakpoints.up('lg')]: {
          fontSize: '13px',
        },
        [theme.breakpoints.up('xl')]: {
          fontSize: '16px',
        },
      },
      body: {
        width: '100%',
        height: '100%',
      },
      '#root': {
        // width: '100%',
        // height: '100%',
        overflow: 'hidden',
        caretColor: theme.palette.primary.main,
      },
      input: {
        '&[type=number]': {
          MozAppearance: 'textfield',
          '&::-webkit-outer-spin-button': {
            margin: 0,
            WebkitAppearance: 'none',
          },
          '&::-webkit-inner-spin-button': {
            margin: 0,
            WebkitAppearance: 'none',
          },
        },
      },
      textarea: {
        '&::-webkit-input-placeholder': {
          color: theme.palette.text.disabled,
        },
        '&::-moz-placeholder': {
          opacity: 1,
          color: theme.palette.text.disabled,
        },
        '&:-ms-input-placeholder': {
          color: theme.palette.text.disabled,
        },
        '&::placeholder': {
          color: theme.palette.text.disabled,
        },
      },
      // linear NProgress
      '#nprogress': {
        /* Make clicks pass-through */
        pointerEvents: 'none',
        '& .bar': {
          background: theme.palette.secondary.main,
          position: 'fixed',
          zIndex: 1502,
          top: 0,
          left: 0,
          width: '100%',
          height: '2px',
        },
        /* Fancy blur effect */
        '& .peg': {
          display: 'block',
          position: 'absolute',
          right: 0,
          width: '100px',
          height: '100%',
          opacity: 1,
          '-webkit-transform': 'rotate(3deg) translate(0px, -4px)',
          '-ms-transform': 'rotate(3deg) translate(0px, -4px)',
          transform: 'rotate(3deg) translate(0px, -4px)',
        },
        /* Remove these to get rid of the spinner */
        '& .spinner': {
          display: 'block',
          position: 'fixed',
          zIndex: 1101,
          top: '15px',
          right: '15px',
        },
        '&. spinner-icon': {
          width: '18px',
          height: '18px',
          boxSizing: 'border-box',
          border: 'solid 2px transparent',
          borderTopColor: theme.palette.secondary.main,
          borderLeftColor: theme.palette.secondary.main,
          borderRadius: '50%',
          '-webkit-animation': 'nprogress-spinner 400ms linear infinite',
          animation: 'nprogress-spinner 400ms linear infinite',
        },
      },
      '& .nprogress-custom-parent': {
        overflow: 'hidden',
        position: 'relative',
        '#nprogress': {
          '& .spinner': {
            position: 'absolute',
          },
          '& .bar': {
            position: 'absolute',
          },
        },
      },
      '@media (min-width: 640px)': {
        '#nprogress': {
          '& .bar': {
            height: '0.25rem',
          },
        },
      },
      '@-webkit-keyframes nprogress-spinner': {
        '0%': {
          '-webkit-transform': 'rotate(0deg)',
        },
        '100%': {
          '-webkit-transform': 'rotate(360deg)',
        },
      },
      '@keyframes nprogress-spinner': {
        '0%': {
          transform: 'rotate(0deg)',
        },
        '100%': {
          transform: 'rotate(360deg)',
        },
      },
    },
  },
});
