import React, { useEffect, useMemo, useState } from 'react';
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useParams } from 'react-router';
import { useQueryClient } from 'react-query';
import BeforeImages from './before-images';
import UploadImages from './upload-images';
import OrdersApiEndpoints from '../../../../services/orders/api';
import ToastSuccess from '../../../ToastSuccess';
import ToastError from '../../../ToastError';
import { permissions, usePermission } from '../../../../constants';

const ImagesTap = ({ status, OrderImages, t }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { orderId } = useParams();
  const { haveAccess } = usePermission();
  const beforeImages = useMemo(
    () =>
      OrderImages.filter(img => img.type === 'before').map(img => ({
        ...img,
        source: 'assigned',
      })),
    [OrderImages]
  );

  const afterImages = useMemo(
    () =>
      OrderImages.filter(img => img.type === 'after').map(img => ({
        ...img,
        source: 'assigned',
      })),
    [OrderImages]
  );

  useEffect(() => {
    if (afterImages && afterImages.length > 0) setUploadedImages(afterImages);
  }, [afterImages]);
  const updateImages = () => {
    const data = {
      '_method': 'put',
      images: [...uploadedImages, ...beforeImages],
    };
    setIsLoading(true);

    OrdersApiEndpoints.updateOrder(orderId, data)
      .then(() => {
        ToastSuccess(t('orders.details.imageTap.updateSuccess'));
        queryClient.invalidateQueries({ queryKey: ['order_id'] });
        setIsLoading(false);
      })
      .catch(err => {
        ToastError(err?.response?.data?.message || t('validation.toastError'));
        setIsLoading(false);
      });
  };
  const hasUpdateImageAccess = haveAccess(permissions.order.updateImage);

  return (
    <>
      <BeforeImages OrderImages={beforeImages} t={t} />
      {status === 'in-progress' || status === 'ready' ? (
        <UploadImages
          t={t}
          type='after'
          setUploadedImages={setUploadedImages}
          uploadedImages={uploadedImages}
        />
      ) : (
        <BeforeImages type='after' OrderImages={afterImages} t={t} />
      )}
      {status === 'in-progress' || status === 'ready' ? (
        <Stack direction='row' justifyContent='flex-end' mt={3}>
          <LoadingButton
            onClick={updateImages}
            disabled={!hasUpdateImageAccess || uploadedImages?.length === 0}
            loading={isLoading}
            variant='contained'
            color='primary'
            type='submit'
          >
            {t('orders.details.imageTap.updateBefore')}
          </LoadingButton>
        </Stack>
      ) : (
        ''
      )}
    </>
  );
};

export default ImagesTap;
