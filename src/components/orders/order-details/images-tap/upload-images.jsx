/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardMedia,
  Grid,
  IconButton,
  Stack,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import ClearIcon from '@mui/icons-material/Clear';
import CustomImageViewer from '../../../shared/custom-image-viewer';
import EmptyState from './empty-state';
import { carImagesIcon } from '../../../../assets/icons';
import SharedApiEndpoints from '../../../../services/shard/shared.api';
import { permissions, usePermission } from '../../../../constants';

const UploadImages = ({ title, t, type, setUploadedImages, uploadedImages }) => {
  const [loadingImages, setLoadingImages] = useState([]);
  const [rejectedImages, setRejectedImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const { haveAccess } = usePermission();

  const handleImageUpload = async event => {
    const { files } = event.target;
    if (!files) return;

    const acceptedFiles = Array.from(files);
    const previewUrls = acceptedFiles.map(file => ({
      url: URL.createObjectURL(file),
    }));

    setLoadingImages(prev => [...prev, ...previewUrls]);

    const uploadPromises = acceptedFiles.map(async file => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', 'order');
      formData.append('type', 'order');

      const res = await SharedApiEndpoints.uploadImage(formData);
      return {
        file,
        data: res.data,
      };
    });

    const results = await Promise.allSettled(uploadPromises);
    event.target.value = null;
    const fulfilled = results
      .filter(res => res.status === 'fulfilled')
      .map(res => ({
        id: res.value.data.id,
        url: res.value.data.image || res.value.data.url,
        fileName: res.value.data.file_name,
        type,
        source: 'new',
      }));

    const rejected = results
      .filter(res => res.status === 'rejected')
      .map((res, i) => ({
        file: acceptedFiles[i],
        errors: ['Upload failed. Please try again.'],
      }));

    setUploadedImages(prev => [...prev, ...fulfilled]);
    setRejectedImages(prev => [...prev, ...rejected]);
    setLoadingImages([]);
  };

  const handleDeleteImage = id => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const handleDeleteRejected = fileName => {
    setRejectedImages(prev => prev.filter(img => img.file.name !== fileName));
  };

  const handleRetryUpload = async file => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'order');

    // Remove from rejected images and add to loading images
    setRejectedImages(prev => prev.filter(img => img.file.name !== file.name));
    setLoadingImages(prev => [...prev, file.name]);

    try {
      const res = await SharedApiEndpoints.uploadImage(formData);
      const newUploaded = {
        id: res.data.id,
        url: res.data.url,
        fileName: res.data.file_name,
        source: 'new',
        type,
      };

      setUploadedImages(prev => [...prev, newUploaded]);
    } catch (error) {
      // Add back to rejected images if upload fails
      setRejectedImages(prev => [
        ...prev,
        {
          file,
          errors: ['Retry failed. Please try again.'],
        },
      ]);
    } finally {
      // Remove from loading images regardless of success or failure
      setLoadingImages(prev => prev.filter(name => name !== file.name));
    }
  };

  const openImageViewer = index => setCurrentImage(index);
  const closeImageViewer = () => setCurrentImage(null);

  const hasUpdateImageAccess = haveAccess(permissions.order.updateImage);
  return (
    <Box>
      {/* Header */}
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        my={title ? 0 : 3}
        mb={title && 3}
      >
        {title ? (
          <Stack direction='row' spacing={1} alignItems='center'>
            {carImagesIcon}
            <Typography
              variant='h5'
              fontWeight='bold'
              display='flex'
              alignItems='center'
              gap={0.5}
            >
              {title}
              <Typography variant='body2' color='text.secondary'>
                ({t('shard.infoImg')})
              </Typography>
            </Typography>
          </Stack>
        ) : (
          <Typography
            variant='h5'
            fontWeight='bold'
            display='flex'
            alignItems='center'
            gap={0.5}
          >
            {t('orders.details.imageTap.afterWork')}
            <Typography variant='body2' color='text.secondary'>
              ({t('shard.infoImg')})
            </Typography>
          </Typography>
        )}
        <Box>
          <input
            type='file'
            accept='image/*'
            multiple
            style={{ display: 'none' }}
            id='upload-button'
            onChange={handleImageUpload}
          />
          <label htmlFor='upload-button'>
            <Button
              disabled={!hasUpdateImageAccess}
              variant='outlined'
              component='span'
              startIcon={<UploadIcon />}
            >
              {t('orders.details.imageTap.upload')}
            </Button>
          </label>
        </Box>
      </Stack>

      {/* Grid */}
      <Grid container spacing={2}>
        {/* Rejected Images */}
        {rejectedImages.map(img => {
          const imageUrl = URL.createObjectURL(img.file);
          return (
            <Grid item xs={12} sm={6} md={4} key={img.file.name}>
              <Card sx={{ position: 'relative', border: '1px solid red' }}>
                <CardMedia component='img' height='180' image={imageUrl} />
                <Box p={1}>
                  {img.errors.map((err, i) => (
                    <Alert key={i} severity='error' sx={{ mb: 0.5 }}>
                      {err}
                    </Alert>
                  ))}
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    display: 'flex',
                    gap: 1,
                    backgroundColor: '#fff',
                    borderRadius: '4px',
                    px: 0.5,
                    py: 0.25,
                  }}
                >
                  <Button
                    onClick={() => handleRetryUpload(img.file)}
                    size='small'
                    variant='text'
                    sx={{
                      fontSize: 10,
                      minWidth: 0,
                      p: 0.5,
                      '&:hover': { background: 'transparent', color: 'text.secondary' },
                    }}
                  >
                    Retry
                  </Button>
                  <IconButton
                    onClick={() => handleDeleteRejected(img.file.name)}
                    size='small'
                    sx={{ p: 0.5 }}
                  >
                    <ClearIcon sx={{ fontSize: 16, color: 'red' }} />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          );
        })}

        {/* Uploaded Images */}
        {uploadedImages.map((img, index) => (
          <Grid item xs={12} sm={6} md={4} key={img.id}>
            <Card onClick={() => openImageViewer(index)} sx={{ position: 'relative' }}>
              <IconButton
                onClick={e => {
                  e.stopPropagation();
                  handleDeleteImage(img.id);
                }}
                sx={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                }}
              >
                <ClearIcon sx={{ color: 'red' }} />
              </IconButton>
              <CardMedia
                component='img'
                height='180'
                image={img.url}
                sx={{ borderRadius: 2 }}
              />
            </Card>
          </Grid>
        ))}

        {/* Loading Images */}
        {loadingImages.map((img, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card sx={{ position: 'relative' }}>
              <CardMedia
                component='img'
                height='180'
                image={img.url}
                sx={{ filter: 'blur(3px)', opacity: 0.6 }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <CircularProgress />
              </Box>
            </Card>
          </Grid>
        ))}

        {/* Empty State */}
        {uploadedImages.length === 0 &&
          loadingImages.length === 0 &&
          rejectedImages.length === 0 && (
            <Grid item xs={12}>
              <EmptyState />
            </Grid>
          )}
      </Grid>

      {/* Image Viewer */}
      <CustomImageViewer
        images={uploadedImages.map(img => img.url)}
        currentIndex={currentImage}
        onClose={closeImageViewer}
      />
    </Box>
  );
};

export default UploadImages;
