import { Step, StepLabel, Stepper, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Steps = ({ trackingData }) => {
  const { t } = useTranslation();

  // تعريف الخطوات وترجمتها
  const stepMapping = [
    { key: 'send', label: 'sendOrder' },
    { key: 'payment', label: 'paymentSuccess' },
    { key: 'pickup', label: 'pickup' },
  ];

  const orderSteps = stepMapping.map(step => {
    const stepData = trackingData?.[step.key];
    return {
      label: step.label,
      date: stepData || '',
      active: !!stepData,
    };
  });

  const iconStyle = {
    backgroundColor: '#1A202C',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    display: 'flex',
  };

  const inactiveIconStyle = {
    backgroundColor: '#D7D7D7',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  };

  return (
    <Stepper
      activeStep={-1}
      orientation='vertical'
      sx={{
        '.MuiStepConnector-root': {
          ml: '4px',
          mt: '-30px',
          mb: '-5px',
        },
        '.MuiStepConnector-line': {
          borderLeft: '1px dashed #23282E33',
          minHeight: '50px',
        },
        '.MuiStepLabel-root': {
          p: 0,
          alignItems: 'baseline',
        },
        '.MuiStepLabel-iconContainer': {
          pr: 2,
        },
      }}
    >
      {orderSteps.map(step => (
        <Step key={step.label}>
          <StepLabel icon={<span style={step.active ? iconStyle : inactiveIconStyle} />}>
            <Typography variant='h6' sx={{ color: '#1A202C', mb: '.3rem' }}>
              {t(`orders.trackingAndCustomer.${step.label}`)}
            </Typography>
            <Typography variant='body2' sx={{ color: '#7986A6F5' }}>
              {step.date}
            </Typography>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default Steps;
