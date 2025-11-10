import { styled } from '@mui/material';

export const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

export const boxAvater = {
  flexDirection: { xs: 'column', sm: 'row' },
  justifyContent: { xs: 'auto', sm: 'space-between' },
  alignItems: { xs: 'auto', sm: 'center' },
};

export const buttonProfile = {
  backgroundColor: 'white',
  color: 'black',
  border: '2px solid black',
  transition: 'all 400ms ease',
  height: { xs: '30px', md: '50px' },
  minHeight: '45px',
  width: { xs: '155px', md: '175px' },
  borderRadius: '20px',
  fontSize: { xs: '12px', md: '14px' },
  '&:hover': {
    backgroundColor: 'white',
    transition: 'all 400ms ease',
    transform: 'translateY(-5px)',
  },
};

export const closePopup = {
  color: 'red',
  fontSize: '22px',
  mt: '-1rem',
  cursor: 'pointer',
  fontWeight: '600',
};

export const popupBoxNumber = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  position: 'absolute',
  top: '3.55rem',
  left: '1rem',
  transform: 'translateY(-50%)',
};

export const popupBoxNumberDivider = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  position: 'absolute',
  top: '50%',
  left: '2rem',
  transform: 'translateY(-50%)',
  height: '1.5rem',
  paddingLeft: '.5rem',
};

export const popupBoxButton = {
  backgroundColor: 'black',
  mt: '1.5rem',
  color: 'white',
  border: '2px solid black',
  transition: 'all 400ms ease',
  height: '45px',
  width: '160px',
  borderRadius: '16px',
  fontSize: { xs: '12px', md: '16px' },
  '&:hover': {
    backgroundColor: 'white',
    color: 'black',
    transition: 'all 400ms ease',
  },
};

export const BoxModal = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

export const inputPassword = {
  color: '#737791',
  fontSize: '20px',
  position: 'absolute',
  top: '2.6rem',
  right: '1rem',
  cursor: 'pointer',
};
