import {
  Box,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import IncomeChart from '../../../components/reports/sales/income-chart';
import TopProduct from '../../../components/reports/sales/top-product';
import FilterSearch from '../../../components/shared/filter-search';
import { useSettingsContext } from '../../../components/settings';
import { useGetChart, useGetTopProduct } from '../../../services/reports/query';
import { useGetBranches } from '../../../services/branches/query';

const SalesList = () => {
  const { t, i18n } = useTranslation();
  const settings = useSettingsContext();
  const [filters, setFilters] = useState({});
  const [branchId, setBranchId] = useState(null);
  const { data: chart } = useGetChart({
    filter: filters?.range,
    from: filters?.start,
    to: filters?.end,
    branch_id: filters?.branch_id,
  });
  const { data: topProduct } = useGetTopProduct({
    filter: filters?.range,
    from: filters?.start,
    to: filters?.end,
    branch_id: filters?.branch_id,
  });

  // Branches Data
  const { data: rawBranchesData } = useGetBranches();
  const branchesData = [
    {
      id: 'All',
      name: t('home.allBranches'),
    },
    ...(rawBranchesData?.data?.map(branch => ({
      id: branch.id,
      name: branch.name[i18n.language],
    })) || []),
  ];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack mt={{ xs: 1, sm: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <Box sx={{ bgcolor: 'white', borderRadius: 3, p: 3 }}>
              <Typography variant='h6' fontWeight={600} mb={2}>
                {t('home.incomeChart.sortBy')}
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems='center'
                spacing={1}
              >
                <FormControl
                  size='small'
                  sx={{ mb: 3, width: 'fit-content', minWidth: '18rem' }}
                >
                  <Select
                    id='branch'
                    value={branchId || 'All'}
                    placeholder={t('home.incomeChart.labelBranch')}
                    onChange={e => setBranchId(e.target.value)}
                    sx={{ py: 0.7 }}
                  >
                    {branchesData?.map(item => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FilterSearch branchId={branchId} setFilters={setFilters} />
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} sm={8.5}>
            <IncomeChart chart={chart} setFilters={setFilters} />
          </Grid>
          <Grid item xs={12} sm={3.5}>
            <TopProduct topProduct={topProduct} />
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
};

export default SalesList;
