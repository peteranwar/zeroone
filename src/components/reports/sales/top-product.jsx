import React from 'react';
import Typography from '@mui/material/Typography';
import { Box, Stack, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { sarIcon } from '../../../assets/icons';

const TopProduct = ({ topProduct }) => {
  const { t } = useTranslation();

  const productData = topProduct?.top_items;

  return (
    <Stack
      sx={{
        background: 'white',
        p: 3,
        borderRadius: '16px',
      }}
      spacing={2}
    >
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <Typography variant='h5' color='initial'>
          {t('reports.sales.topProduct')}
        </Typography>
      </Stack>
      <Stack spacing={3} pt={1}>
        {productData?.map(item => (
          <Stack key={item.id} direction='row' alignItems='stretch' spacing={1.5}>
            <Stack
              spacing={0.5}
              justifyContent='space-between'
              alignItems='center'
              direction='row'
              width='100%'
            >
              <Stack spacing={2}>
                <Tooltip title={item?.item_name} arrow>
                  <Typography
                    fontWeight={600}
                    variant='h6'
                    color='initial'
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: '1',
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {item?.item_name}
                  </Typography>
                </Tooltip>
                <Typography variant='body1' sx={{ color: '#979797' }}>
                  {t('reports.sales.sold')}: {item?.sold_count}
                </Typography>
              </Stack>
              <Box
                sx={{
                  height: 'fit-content',
                  py: 0.3,
                  px: 1,
                  borderRadius: '8px',
                }}
              >
                <Typography variant='body1' fontWeight={600}>
                  {t('reports.sales.total')}
                </Typography>
                <Typography variant='body1' fontWeight={600} sx={{ color: '#00B69B' }}>
                  {item.total_revenue} {sarIcon}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default TopProduct;
