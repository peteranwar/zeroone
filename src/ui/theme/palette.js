import { alpha } from '@mui/material';

const GREY = mode =>
  mode === 'light'
    ? {
        0: '#FFFFFF',
        10: '#E9ECEF',
        20: '#DEE2E6',
        30: '#BFC7CE',
        40: '#9EA6AE',
        50: '#808589',
        60: '#525457',
        70: '#343A40',
        80: '#212529',
        90: '#070708',
        100: '#F9FAFB',
        200: '#F4F6F8',
        300: '#DFE3E8',
        400: '#C4CDD5',
        500: '#919EAB',
        600: '#637381',
        700: '#454F5B',
        800: '#212B36',
        900: '#161C24',
        500_8: alpha('#919EAB', 0.08),
        500_12: alpha('#919EAB', 0.12),
        500_16: alpha('#919EAB', 0.16),
        500_24: alpha('#919EAB', 0.24),
        500_32: alpha('#919EAB', 0.32),
        500_48: alpha('#919EAB', 0.48),
        500_56: alpha('#919EAB', 0.56),
        500_80: alpha('#919EAB', 0.8),
      }
    : {
        0: '#FFFFFF',
        10: '#E9ECEF',
        20: '#DEE2E6',
        30: '#BFC7CE',
        40: '#9EA6AE',
        50: '#808589',
        60: '#525457',
        70: '#343A40',
        80: '#212529',
        90: '#070708',
        100: '#1e1e1e',
        200: '#2f3031',
        300: '#2a2c2f',
        400: '#323436',
        500: '#484e54',
        600: '#505e6b',
        700: '#707f90',
        800: '#708cab',
        900: '#86a9d8',
        500_8: alpha('#484e54', 0.08),
        500_12: alpha('#484e54', 0.12),
        500_16: alpha('#484e54', 0.16),
        500_24: alpha('#484e54', 0.24),
        500_32: alpha('#484e54', 0.32),
        500_48: alpha('#484e54', 0.48),
        500_56: alpha('#484e54', 0.56),
        500_80: alpha('#484e54', 0.8),
      };

export const paletteGenerator = mode => ({
  mode,
  layout: {
    bgSecondary: '#FEFEFE',
    backgroundColor: '#F8F8F8',
    bgPosterCard: '#FDFDFD',
    posterCardInfoColor: alpha('#181818', 0.6),
    posterDotColor: '#5B5F67',
  },
  backdrop: {
    blurBackgroundColor: 'rgba(0, 0, 0, 0.4)',
    dimmedBackgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  common: {
    black: '#070708',
    white: '#FFFFFF',
    primary: '#EC1D23',
    light: '#778399',
  },
  primary: {
    main: '#19191B', //  change the priority when implementing dynamic engine support
    light: '#F3DEF7',
    black: '#0000',
  },
  secondary: {
    main: '#EC1D23',
  },
  text: {
    primary: '#19191B',
    secondary: '#737791',
  },
  info: {
    main: '#0288d1',
  },
  success: {
    main: '#4AB58E',
  },
  warning: {
    main: '#FFA300',
  },
  error: {
    main: '#E14851',
  },
  primaryLight: {
    main: '#964ca2',
  },
  primaryMedium: {
    main: '#772583',
  },
  darkGrey: {
    main: '#E5E5E5',
  },
  lightGrey: {
    main: '#F1F2F5',
  },
  toast: {
    success: '#009A44',
    info: '#8C2C9B',
    error: '#E14851',
  },
  link: {
    main: '#04C3DC',
  },
  supporting: {
    navy: '#004B87',
  },
  grey: GREY(mode),
  background: {
    default: '#fafafa',
    paper: '#FFFFFF',
  },
  tonalOffset: 0.2,
  contrastThreshold: 3,
  typography: {
    color: {
      muted: GREY(mode)[50],
      secondary: '#04C3DC',
      primary: '#EF4130',
    },
    font: {
      // light: 'co-head-line-corp-Light',
      // regular: 'co-head-line-corp-regular',
      // bold: 'co-head-line-corp-bold',
    },
  },
  buttonAction: {
    active: '#EF4130',
    hover: '#19191bcf',
    borderRadius: '20px !important',
  },
  // linkAction: {
  //   active: '#61136D',
  //   hover: '#772583',
  // },
  action: {
    active: GREY(mode)[600],
    hover: GREY(mode)[500_24],
    selected: GREY(mode)[500_16],
    disabled: GREY(mode)[500_80],
    disabledBackground: GREY(mode)[30],
    focus: GREY(mode)[500_24],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
});
