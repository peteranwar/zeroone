
const Chip = (theme) => {
  return {
    MuiChip: {
      variants: [
        {
          props: { variant: 'selected' },
          style: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
            '&:hover': {
              backgroundColor: theme.palette.primary.main,
              filter: 'brightness(0.85)',
            },
          },
        },
        {
          props: { variant: 'not-selected' },
          style: {
            backgroundColor: 'transparent',
            color: theme.palette.grey[80],
            '&:hover': {
              backgroundColor: 'transparent',
              filter: 'brightness(0.85)',
            },
          },
        },
      ],
    },
  };
};
export default Chip;
