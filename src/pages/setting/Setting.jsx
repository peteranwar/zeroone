/* eslint-disable react/jsx-no-useless-fragment */
import {
  Box,
  Container,
  Grid,
  Stack,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  carsIcon,
  positionsIconSetting,
  referralsIcon,
  settingGeneralIcon,
} from '../../assets/icons';
import { useSettingsContext } from '../../components/settings';
import GeneralSettingsInfo from './GeneralSettingsInfo';
import CarsInfo from './cars/CarsInfo';
import PositionsInfo from './positions/PositionsInfo';
import ReferralsInfo from './referrals/ReferralsInfo';
import { permissions, usePermission } from '../../constants';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ marginTop: '0' }}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

const Settings = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const settings = useSettingsContext();
  const { haveAccess } = usePermission();
  const hasCarAccess = haveAccess(permissions.car.list);
  const hasPositionsAccess = haveAccess(permissions.position.list);
  const hasReferralAccess = haveAccess(permissions.referral.list);

  const [value, setValue] = useState(0);
  const { t } = useTranslation();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }} mt={{ xs: 1, sm: 4 }}>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Grid container spacing={2} sx={{ '& .MuiGrid-item': { height: 'fit-content' } }}>
          <Grid item xs={12} sm={4}>
            <Stack
              sx={{
                width: '100%',
                borderRadius: '12px',
                backgroundColor: 'white',
                p: { xs: 1.5, sm: 3 },
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant='fullWidth'
                orientation={isSmallScreen ? 'horizontal' : 'vertical'}
                sx={{
                  display: 'flex',
                  flexDirection: isSmallScreen ? 'row' : 'column',
                  alignItems: 'stretch',
                  '& .MuiTabs-flexContainer': {
                    alignItems: isSmallScreen ? 'baseline' : 'inherit',
                  },
                  '& .MuiButtonBase-root': {
                    justifyContent: isSmallScreen ? 'center' : 'flex-start',
                    textTransform: 'none',
                    fontWeight: '600',
                    borderRadius: '12px',
                    color: 'black',
                    py: isSmallScreen ? 1 : 1.5,
                    my: 0.5,
                    flexDirection: isSmallScreen ? 'column' : 'row',
                    gap: isSmallScreen ? 1 : 2,
                    fontSize: { xs: '10px', sm: '14px' },
                  },
                  '& .MuiButtonBase-root.Mui-selected': {
                    backgroundColor: '#23282E14',
                  },
                  '& .MuiTabs-indicator': {
                    display: 'none',
                  },
                  '& .MuiTab-iconWrapper': {
                    mb: '0 !important',
                  },
                }}
              >
                <Tab
                  icon={settingGeneralIcon}
                  iconPosition='top'
                  label={t('setting.labelSettings')}
                />
                <Tab
                  icon={carsIcon}
                  disabled={!hasCarAccess}
                  iconPosition='top'
                  label={t('setting.labelCars')}
                />
                <Tab
                  icon={positionsIconSetting}
                  iconPosition='top'
                  label={t('setting.labelPositions')}
                  disabled={!hasPositionsAccess}
                />
                <Tab
                  icon={referralsIcon}
                  iconPosition='top'
                  label={t('setting.labelReferrals')}
                  disabled={!hasReferralAccess}
                />
              </Tabs>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Stack
              sx={{
                borderRadius: '12px',
                backgroundColor: 'white',
              }}
              spacing={2}
              p={{ xs: 2.5, sm: 5 }}
            >
              <CustomTabPanel value={value} index={0}>
                <GeneralSettingsInfo />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <CarsInfo />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                <PositionsInfo />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={3}>
                <ReferralsInfo />
              </CustomTabPanel>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Settings;
