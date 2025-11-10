/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';

const variants = ['5rem', '3rem', '3rem', '3rem', '3rem', '3rem'];

function TypographyDemo() {
  return (
    <div>
      {variants.map(variant => (
        <Typography component='div' key={variant} height={variant} sx={{ mb: '-.5rem' }}>
          <Skeleton height='100%' />
        </Typography>
      ))}
    </div>
  );
}

const LoadingTable = () => {
  return (
    <Grid container spacing={0}>
      <Grid item xs={12}>
        <TypographyDemo loading />
      </Grid>
    </Grid>
  );
};

export default LoadingTable;
