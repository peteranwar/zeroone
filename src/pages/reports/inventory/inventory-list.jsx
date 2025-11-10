import { Box, Container, Stack, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsContext } from '../../../components/settings';
import StockList from './stock/stoke-list';
import InventoryHistoryList from './inventory-history/inventory-history-list';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={{ xs: 0, sm: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const InventoryList = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const settings = useSettingsContext();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }} mt={{ xs: 1, sm: 4 }}>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack spacing={2} sx={{ borderRadius: '12px', backgroundColor: 'white' }} py={3}>
          <Box sx={{ width: '100%' }}>
            <Box px={3}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label='tabs'
                indicatorColor='secondary'
                textColor='secondary'
              >
                <Tab label={t('reports.inventory.stockTap')} {...a11yProps(0)} />
                {/* <Tab
                  disabled
                  label={t('reports.inventory.historyTap')}
                  {...a11yProps(1)}
                /> */}
              </Tabs>

              <CustomTabPanel value={value} index={0}>
                <StockList />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <InventoryHistoryList />
              </CustomTabPanel>
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default InventoryList;
