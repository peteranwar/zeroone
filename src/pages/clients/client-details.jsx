/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Box, Container, Divider, Grid, Stack, Tab, Tabs } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useSettingsContext } from '../../components/settings';
import OrdersTap from './orders-tap';
import InvoicesTap from './invoices-tap';
import MainImg from '../../components/MainImg';
import { useGetClientById } from '../../services/clients/query';
import CarsTap from './cars-tap';

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ClientDetails = () => {
  const { t } = useTranslation();
  const settings = useSettingsContext();
  const [value, setValue] = useState(0);
  const { client_id } = useParams();
  const { data } = useGetClientById(client_id);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }} mt={{ xs: 1, sm: 4 }}>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Stack
              sx={{
                height: '100%',
                width: '100%',
                borderRadius: '12px',
                position: 'relative',
                backgroundColor: 'white',
              }}
              spacing={2}
              p={3}
            >
              <Stack spacing={3}>
                <Typography
                  variant='body1'
                  sx={{ textTransform: 'uppercase', fontWeight: 600 }}
                >
                  {t('client.details.title')}
                </Typography>
                <Stack direction='row' alignItems='center' spacing={2}>
                  <MainImg name='client-name.png' alt='icon-client' height='2.5rem' />
                  <Typography variant='body1' color='initial'>
                    {data?.data?.name}
                  </Typography>
                </Stack>

                <Divider sx={{ borderColor: '#E5E5EF', pt: 0.5 }} />
                <Stack spacing={1}>
                  <Typography variant='body1' fontWeight={600}>
                    {t('client.table.phone')}
                  </Typography>
                  <Typography
                    variant='body1'
                    sx={{ color: theme => theme.palette.text.secondary }}
                  >
                    {data?.data?.phone}
                  </Typography>
                </Stack>
                <Stack spacing={1}>
                  <Typography variant='body1' fontWeight={600}>
                    {t('client.details.email')}
                  </Typography>
                  <Typography
                    variant='body1'
                    sx={{ color: theme => theme.palette.text.secondary }}
                  >
                    {data?.data?.email}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={8}>
            <Stack
              sx={{
                height: '100%',
                width: '100%',
                borderRadius: '12px',
                position: 'relative',
                backgroundColor: 'white',
              }}
              spacing={2}
              p={3}
            >
              <Stack>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label='basic tabs example'
                  indicatorColor='secondary'
                  textColor='secondary'
                >
                  <Tab label={t('client.details.ordersTap')} {...a11yProps(0)} />
                  <Tab label={t('client.details.InvoicesTap')} {...a11yProps(1)} />
                  <Tab label={t('client.details.carsTap')} {...a11yProps(1)} />
                </Tabs>

                <CustomTabPanel value={value} index={0}>
                  <OrdersTap />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                  <InvoicesTap />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                  <CarsTap cars={data?.data?.cars} />
                </CustomTabPanel>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ClientDetails;
