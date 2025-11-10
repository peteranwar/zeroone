import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Skeleton from '@mui/material/Skeleton';
import { Grid } from '@mui/material';

function Media() {
  return (
    <Card>
      <CardHeader
        avatar={<Skeleton animation='wave' variant='circular' width={40} height={40} />}
        action={<Skeleton animation='wave' width={30} height={15} />}
        title={
          <Skeleton
            animation='wave'
            height={10}
            width='80%'
            style={{ marginBottom: 6 }}
          />
        }
        subheader={<Skeleton animation='wave' height={10} width='40%' />}
      />
      {/* <Skeleton sx={{ height: 190 }} animation='wave' variant='rectangular' /> */}
    </Card>
  );
}

export default function LoadingCard() {
  return (
    <Grid
      container
      spacing={4}
      my='1rem'
      sx={{
        borderRadius: '14px',
        boxShadow: ' 0px 20px 50px 0px rgba(55, 69, 87, 0.10)',
        paddingRight:'2rem',
      }}
    >
      <Grid item xs={3} sx={{pt:"0 !important"}}>
        <Skeleton animation='wave'  width={60} height={100} />
      </Grid>
      <Grid item xs={6}>
        <Skeleton animation='wave' height={15} width='100%' style={{ marginBottom: 6 }} />
        <Skeleton animation='wave' height={15} width='70%' />
      </Grid>
      <Grid item xs={3} sx={{ display: 'flex', flexDirection: 'column',alignItems:"flex-end" }}>
        <Skeleton animation='wave' height={10} width='60%' />
        <Skeleton animation='wave' height={50} width={30} />
      </Grid>
    </Grid>
  );
}
