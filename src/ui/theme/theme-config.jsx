import React, { useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import createCache from '@emotion/cache';
import { CssBaseline, createTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { typography } from './typography';
import { paletteGenerator } from './palette';
import { breakpoints } from './breakpoints';
import componentsOverride from './overrides';

function ThemeConfig({ children }) {
  const { i18n } = useTranslation();

  const themeOptions = useMemo(
    () => ({
      palette: paletteGenerator('light'),
      typography,
      breakpoints,
      direction: i18n.dir(),
    }),
    [i18n.dir()]
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
  });
  return (
    <ThemeProvider theme={theme}>
      {i18n.dir() === 'rtl' ? (
        <CacheProvider value={cacheRtl}>
          <CssBaseline />
          {children}
        </CacheProvider>
      ) : (
        <>
          <CssBaseline />
          {children}
        </>
      )}
    </ThemeProvider>
  );
}

export default ThemeConfig;
