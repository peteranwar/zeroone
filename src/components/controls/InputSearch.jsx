import { Typography } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import React from 'react';
import { searchIcon } from '../../assets/icons';

const Search = styled('div')(({ theme }) => ({
  height: 'fit-content',
  position: 'relative',
  color: '#737791',
  borderRadius: '12px',
  backgroundColor: '#F9F9F9',
  '&:hover': {
    backgroundColor: '#F9FAFB',
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: '100%',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.primary.main,
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(2, 2, 2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}));

const InputSearch = ({ placeholder, label, onChange, value }) => {
  return (
    <>
      {label && <Typography gutterBottom>{label}</Typography>}
      <Search>
        <SearchIconWrapper>{searchIcon}</SearchIconWrapper>
        <StyledInputBase
          placeholder={placeholder || 'Search…'}
          inputProps={{ 'aria-label': 'search' }}
          onChange={e => {
            if (onChange) {
              onChange(e);
            }
          }}
          value={value || ''}
          type='search'
        />
      </Search>
    </>
  );
};

export default InputSearch;
