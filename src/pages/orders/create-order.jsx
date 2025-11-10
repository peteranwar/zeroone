/* eslint-disable react/jsx-no-bind */
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Box, Button, Container, FormControl, FormLabel, Stack, TextField, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import SignatureCanvas from 'react-signature-canvas';

import { clientInfoIcon } from '../../assets/icons';
import ClientForm from '../../components/orders/create-order/client-form';
import ServiceForm from '../../components/orders/create-order/service-form';
import UploadImages from '../../components/orders/order-details/images-tap/upload-images';
import PaymentsTable from '../../components/orders/order-details/order-details-tap/payment-table';
import { useSettingsContext } from '../../components/settings';
import ToastError from '../../components/ToastError';
import ToastSuccess from '../../components/ToastSuccess';
import { useGetEmployees } from '../../services/employees/query';
import OrdersApiEndpoints from '../../services/orders/api';
import { useGetOrderById } from '../../services/orders/query';

const CreateOrder = () => {
  const settings = useSettingsContext();
  const [noteVale, setNoteValue] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const { t } = useTranslation();
  const { orderId } = useParams();
  const navigate = useNavigate();

  const sigCanvas = useRef(null);



  const { data } = useGetOrderById(orderId);

  const { data: employeesData } = useGetEmployees();


  const submitOrder = () => {
    const signatureImage = sigCanvas ? sigCanvas.current
      ?.getTrimmedCanvas()
      .toDataURL('image/png') : null;

    const data = {
      '_method': 'put',
      images: uploadedImages,
      note: noteVale,
      end_date: deliveryDate ? format(deliveryDate, 'yyyy-MM-dd') : null,
      referral_employee_id: employeeId,
      signature: signatureImage,
    };
    setIsLoading(true);

    OrdersApiEndpoints.updateOrder(orderId, data)
      .then(() => {
        ToastSuccess(t('order.create.toastSuccess'));
        setIsLoading(false);
        navigate('/orders');
      })
      .catch(err => {
        ToastError(err?.response?.data?.message || t('validation.toastError'));
        setIsLoading(false);
      });
  };


  const employeeOptions = useMemo(() => {
    return (
      employeesData?.data?.map(emp => ({
        id: emp.id,
        name: `${emp.first_name} ${emp.last_name}`,
      })) || []
    );
  }, [employeesData]);



  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <ClientForm
        orderId={orderId}
        clientData={{
          ...data?.data?.client,
          clientCar: data?.data?.client_car,
        }}
      />
      {orderId && (
        <>
          <ServiceForm
            summary={data?.data?.summary}
            orderId={orderId}
            servicesData={data?.data?.services}
            typeOrder={data?.data?.type}
          />

          <Stack
            spacing={2}
            p={3}
            mt={4}
            sx={{ borderRadius: '20px', backgroundColor: 'white' }}
          >
            <UploadImages
              title={t('orders.create.carImage')}
              t={t}
              type='before'
              setUploadedImages={setUploadedImages}
              uploadedImages={uploadedImages}
            />
          </Stack>
          {/* payments */}
          <Stack
            spacing={2}
            p={3}
            mt={4}
            sx={{ borderRadius: '20px', backgroundColor: 'white' }}
          >
            {/* {data?.data?.services?.length > 0 && ( */}
            <PaymentsTable
              summary={data?.data?.summary}
              paymentsData={data?.data?.payments}
              clientname={data?.data?.client?.name}
              t={t}
            />
            {/* )} */}
          </Stack>
          {/* note and delivery date section */}
          <Stack
            spacing={2}
            p={3}
            mt={4}
            sx={{ borderRadius: '20px', backgroundColor: 'white' }}
          >
            <Typography
              variant='h5'
              textTransform='uppercase'
              display='flex'
              alignItems='center'
              gap={1}
            >
              {clientInfoIcon} {t('orders.details.orderTap.deliveryDate')}
            </Typography>
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} width='100%'>
              <Stack spacing={3} sx={{ flex: 1 }}>
                {/* Delivery Date */}
                <Box>
                  <Typography variant='subtitle2' color='text.secondary' mb={1}>
                    {t('orders.details.orderTap.deliveryDate')}
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={deliveryDate}
                      onChange={newValue => setDeliveryDate(newValue)}
                      minDate={new Date()}
                      renderInput={({ inputRef, inputProps, InputProps }) => (
                        <Box
                          ref={inputRef}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#F3F6F9',
                            borderRadius: '12px',
                            p: '4px 12px',
                          }}
                        >
                          <CalendarMonthIcon sx={{ color: '#878CBD', mr: 1 }} />
                          <input
                            {...inputProps}
                            style={{
                              border: 'none',
                              outline: 'none',
                              width: '100%',
                              backgroundColor: 'transparent',
                              color: '#878CBD',
                            }}
                          />
                          {InputProps?.endAdornment}
                        </Box>
                      )}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          border: 'none',
                          '& fieldset': {
                            border: 'none',
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Box>

                {/* Note Field */}
                <TextField
                  multiline
                  minRows={2}
                  fullWidth
                  variant='outlined'
                  placeholder={t('orders.create.placeNote')}
                  onChange={e => {
                    setNoteValue(e.target.value);
                  }}
                  sx={{
                    backgroundColor: '#F3F6F9',
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-root': {
                      border: 'none',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& textarea': {
                      padding: '12px',
                    },
                  }}
                />
              </Stack>

              <Stack spacing={3} sx={{ flex: 1, width: { xs: '100%', lg: '50%' } }}>
                <FormControl fullWidth >
                  {/* Label */}
                  <FormLabel
                    sx={{
                      marginBottom: '10px',
                      fontWeight: '600',
                      color: '#0A0A0A',
                      fontSize: '12px',
                    }}
                  >
                    {t('orders.create.labelEmp')}
                  </FormLabel>

                  <Autocomplete

                    options={employeeOptions || []}
                    getOptionLabel={option => option?.name || ''}
                    isOptionEqualToValue={(option, value) => option?.id === value}
                    onChange={(_, newValue) => {
                      setEmployeeId(newValue?.id || '');
                    }}
                    value={employeeOptions.find(option => option.id === employeeId) || null}
                    renderInput={params => (
                      <TextField
                        {...params}
                        placeholder={t('orders.create.placeEmp')}
                        variant='outlined'
                        sx={{
                          background: '#F3F6F9',
                          borderRadius: '12px',
                          height: '50px',

                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'transparent',
                          },
                          '& .Mui-disabled': { borderColor: 'transparent' },
                        }}
                      />
                    )}
                  />
                </FormControl>

                <Stack >
                  <FormLabel
                    sx={{
                      marginBottom: '10px',
                      fontWeight: '600',
                      color: '#0A0A0A',
                      fontSize: '12px',
                    }}
                  >
                    Signature *
                  </FormLabel>
                  <Stack
                    // width="100%"
                    maxWidth={500}

                    height={200}
                    sx={{
                      bgcolor: '#F3F6F9',
                      borderRadius: '12px',
                      position: 'relative',
                    }}
                  >

                    <SignatureCanvas
                      ref={sigCanvas}
                      canvasProps={{
                        width: 500,
                        height: 200,
                        style: {
                          width: '100%',
                          height: '100%',
                          borderRadius: '12px',
                        },
                      }}
                    />
                  </Stack>
                  <Box display='flex' justifyContent='end'>
                    <Button variant='contained' color='error' size='small' sx={{ width: 'fit-content', mt: '6px' }}
                      onClick={() => sigCanvas.current?.clear()}
                    >
                      Clear
                    </Button>
                  </Box>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Stack
            spacing={2}
            p={3}
            mt={4}
            sx={{ backgroundColor: 'white', borderRadius: '20px' }}
          >
            <Stack direction='row' justifyContent='flex-end' mt={3}>
              <LoadingButton
                sx={{ px: '3rem' }}
                variant='contained'
                color='primary'
                type='button'
                onClick={submitOrder}
                loading={isLoading}
                disabled={
                  uploadedImages.length < 5 ||
                  data?.data?.services?.length <= 0 ||
                  data?.data?.payments?.length <= 0 ||
                  !deliveryDate || sigCanvas?.current?.isEmpty()
                }
              >
                {t('orders.create.createOrder')}
              </LoadingButton>
            </Stack>
          </Stack>
        </>
      )
      }
    </Container >
  );
};

export default CreateOrder;
