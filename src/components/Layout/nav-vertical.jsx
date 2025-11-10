/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';

import { usePathname } from '../../hooks';
import { useResponsive } from '../../hooks/use-responsive';


import Scrollbar from '../scrollbar';
import { NavSectionVertical } from './nav-section';

import MainImg from '../MainImg';
import Logout from './common/logout';
import NavToggleButton from './common/nav-toggle-button';
import { NAV } from './config-layout';
import { useNavData } from './NavData';

// ----------------------------------------------------------------------

export default function NavVertical({ openNav, onCloseNav }) {
  const pathname = usePathname();
  const lgUp = useResponsive('up', 'lg');
  const navData = useNavData();

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box
        sx={{
          my: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Link to='/'
        >
          <MainImg
            name='logo.png'
            alt='skip-it logo'
            width={120}
            height={30}
          />
        </Link>
      </Box>

      <NavSectionVertical data={navData} />

      <Box
        sx={{
          border: "1px solid",
          borderImageSource: "linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.52%, rgba(224, 225, 226, 0.15625) 99.04%)",
          borderImageSlice: 1,
          my: 1,
        }}
      />

      <Logout />

    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
      }}
    >
      <NavToggleButton />

      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.W_VERTICAL,
            borderRight: 'solid 1px #E8E8E8',
            background: 'white'
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.W_VERTICAL,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

NavVertical.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};
