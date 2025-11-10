import React, { useState, useCallback, useMemo } from 'react';
import { Typography, Box, Grid, Card, CardMedia } from '@mui/material';
import CustomImageViewer from '../../../shared/custom-image-viewer';
import EmptyState from './empty-state';

// Image Data

const BeforeImages = ({ t, type, OrderImages }) => {
  const [currentImage, setCurrentImage] = useState(null);

  const openImageViewer = useCallback(index => {
    setCurrentImage(index);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(null);
  };
  const imagesUrls = useMemo(() => OrderImages?.map(img => img?.url), [OrderImages]);

  return (
    <Box sx={{ padding: 2 }}>
      {type === 'after' ? (
        <Typography variant='h5' fontWeight='bold' pb={3}>
          {t('orders.details.imageTap.afterWork')}
        </Typography>
      ) : (
        <Typography variant='h5' fontWeight='bold' pb={3}>
          {t('orders.details.imageTap.beforeWork')}
        </Typography>
      )}
      <Grid container spacing={2}>
        {/* Controls spacing between images */}
        {OrderImages?.length > 0 ? (
          OrderImages?.map((img, index) => (
            <Grid item xs={12} sm={6} md={4} key={img}>
              <Card sx={{ cursor: 'pointer' }} onClick={() => openImageViewer(index)}>
                <CardMedia
                  component='img'
                  height='180'
                  image={img?.url}
                  alt={`Before work ${img + 1}`}
                  sx={{ borderRadius: 2 }}
                />
              </Card>
            </Grid>
          ))
        ) : (
          <Box justifyContent='center' alignItems='center' display='flex' width='100%'>
            <EmptyState message={t('orders.details.imageTap.noImages')} />
          </Box>
        )}
      </Grid>

      {/* Reusable Image Viewer Component */}
      <CustomImageViewer
        images={imagesUrls}
        currentIndex={currentImage}
        onClose={closeImageViewer}
      />
    </Box>
  );
};

export default BeforeImages;
