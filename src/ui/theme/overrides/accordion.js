
const Accordion = (theme) => {
  return {
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderRadius: '12px',
          backdropFilter: '27px',
          backgroundColor: 'transparent',
          '&::before': {
            display: 'none',
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.lightGrey.main,
          borderRadius: '12px',
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
  };
};
export default Accordion;
