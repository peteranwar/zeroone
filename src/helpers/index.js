/* eslint-disable no-restricted-syntax */
import localStorageProvider from '../localStorageProvider';

const getLocale = () => {
  let lang = 'en';
  localStorageProvider.get('locale').then(lng => {
    lang = lng;
  });
  return lang;
};

export const setServerErrors = (responseErrors, setError) => {
  for (const key of Object.keys(responseErrors)) {
    const messages = responseErrors[key];
    if (Array.isArray(messages)) {
      messages.forEach(message => {
        setError(key, { message, type: 'manual' });
      });
    }
  }
};

/* Google map styles and options */
export const mapContainerStyle = { width: '100%', height: '240px', borderRadius: '14px' };

export const mapOptions = {
  strokeColor: '#2a32ff',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#2a32ff',
  fillOpacity: 0.2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 300,
  zIndex: 1,
};

export const timeOptions = (() => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 30]) {
      if (hour === 23 && minute === 30) {
        options.push({ id: '23:59:00', label: '11:59 PM' });
      } else {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        const period = hour < 12 ? 'AM' : 'PM';
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        options.push({
          id: `${formattedHour}:${formattedMinute}:00`,
          label: `${displayHour}:${formattedMinute} ${period}`,
        });
      }
    }
  }
  return options;
})();

export const months = t => [
  { id: 1, name: t('month.january') },
  { id: 2, name: t('month.february') },
  { id: 3, name: t('month.march') },
  { id: 4, name: t('month.april') },
  { id: 5, name: t('month.may') },
  { id: 6, name: t('month.june') },
  { id: 7, name: t('month.july') },
  { id: 8, name: t('month.august') },
  { id: 9, name: t('month.september') },
  { id: 10, name: t('month.october') },
  { id: 11, name: t('month.november') },
  { id: 12, name: t('month.december') },
];
