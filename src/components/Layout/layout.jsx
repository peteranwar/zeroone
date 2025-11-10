import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import { useBoolean } from '../../hooks/use-boolean';
import { useResponsive } from '../../hooks/use-responsive';

import { useSettingsContext } from '../settings';

import Main from './main';
import Header from './header';
import NavMini from './nav-mini';
import NavVertical from './nav-vertical';
import Footer from './common/footer';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  const settings = useSettingsContext();

  const lgUp = useResponsive('up', 'lg');

  const nav = useBoolean();

  const isMini = settings.themeLayout === 'mini';

  const renderNavMini = <NavMini />;

  const renderNavVertical = <NavVertical openNav={nav.value} onCloseNav={nav.onFalse} />;

  if (isMini) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        <Box
          sx={{
            minHeight: 1,
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
          }}
        >
          {lgUp ? renderNavMini : renderNavVertical}

          <Main>
            {children}
            <Footer />
          </Main>
        </Box>
      </>
    );
  }

  return (
    <>
      <Header onOpenNav={nav.onTrue} />
      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        {renderNavVertical}

        <Main>
          {children}
          <Footer />
        </Main>
      </Box>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
