const Radio = (theme) => {
  return {
    MuiRadio: {
      styleOverrides: {
        root: {
          marginInline: 2, // Spacing between radio buttons
          '&.Mui-checked': {
            color: theme.palette.secondary.main, // Use theme secondary color when checked
          },
          // Custom checked state
          '[data-testid="RadioButtonCheckedIcon"]': {
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: `1px solid ${theme.palette.secondary.main}`, // Outer border
            backgroundColor: 'white', // Inner circle remains white
          },
          // Custom unchecked state
          '[data-testid="RadioButtonUncheckedIcon"]': {
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: `2px solid ${theme.palette.grey[400]}`, // Light gray outline
            backgroundColor: 'transparent',
          },
          '&.custom-secondary': {
            '&.Mui-checked': {
              color: theme.palette.secondary.main, // Keep checked color same
            },
            '[data-testid="RadioButtonCheckedIcon"]': {
              width: 20,
              height: 20,
              borderRadius: '50%',
              border: `9px solid ${theme.palette.secondary.main}`,
              backgroundColor: theme.palette.secondary.main, // Match checked color
            },
            '[data-testid="RadioButtonUncheckedIcon"]': {
              color: theme.palette.grey[400], // Keep unchecked color gray
            },
          },
        },
      },
    },
  };
};

export default Radio;
