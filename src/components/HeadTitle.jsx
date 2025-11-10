import { Box, Breadcrumbs, Stack, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import MainImg from './MainImg';

const HeadTitle = ({ bgColor, links, image, title }) => {
  const lastElement = links[links.length - 1];
  return (
    <Box
      my='2rem'
      sx={{
        backgroundColor: bgColor,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: {xs: '10px' , md: '22px'},
        pr: { xs: '0', sm: '3rem' },
      }}
    >
      <Stack spacing={1} p={{ xs: '.75rem', md: '1.5rem' }}>
        <Typography variant='h4' color='initial'>
          {title}
        </Typography>
        <Breadcrumbs separator='•' aria-label='breadcrumb' sx={{ fontSize: '20px' }}>
          {links.slice(0, -1).map(link => (
            <Link
              underline='hover'
              style={{ fontSize: '12px' }}
              color='inherit'
              to={link.url}
              key={link.id}
            >
              {link.name}
            </Link>
          ))}
          <Typography color='inherit' sx={{ fontSize: '12px' }}>
            {lastElement.name}
          </Typography>
        </Breadcrumbs>
      </Stack>
      <Box p={{ xs: '.5rem', md: '1rem' }} sx={{ width: { xs: "5rem", sm: "7rem" }, height: { xs: "5rem", sm: "7rem" } }}>
        <MainImg name={image} alt='image' style={{ width: '100%', height: "100%" }} />
      </Box>
    </Box>
  );
};

export default HeadTitle;
