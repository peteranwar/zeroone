/* eslint-disable prettier/prettier */
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';


// import { hideScroll } from 'src/theme/css';

import { NavSectionMini } from './nav-section';

import { NAV } from './config-layout';
import NavToggleButton from './common/nav-toggle-button';
import MainImg from '../MainImg';
import Logout from './common/logout'
import { useNavData } from './NavData';

// ----------------------------------------------------------------------

export default function NavMini() {
  const navData = useNavData();

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
      }}
    >
      <NavToggleButton
        sx={{
          left: NAV.W_MINI - 10,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_MINI,
          borderRight: 'solid 1px #E8E8E8',
          background: 'white'
        }}
      >
   
        <Box
          sx={{
            mx: 'auto', mt: 3, mb:2
          }}
        >
          <Link to='/'>
            <MainImg
              name='logo.png'
              alt='zerOne-it logo'
              width={65}
              height={20}
            />
          </Link>
        </Box>

        <NavSectionMini data={navData} />

        <Box
          sx={{
            border: "1px solid",
            borderImageSource: "linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.52%, rgba(224, 225, 226, 0.15625) 99.04%)",
            borderImageSlice: 1,
            mt: 1,
            mb: 1.5
          }}
        />

        <Logout />
      </Stack>
    </Box>
  );
}
