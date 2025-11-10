import { useTranslation } from 'react-i18next';
import DatePicker from 'react-multi-date-picker';

function MultiDatepicker({ values, setValues, style, placeholder, months }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <DatePicker
      value={values}
      onChange={setValues}
      range
      numberOfMonths={months || 2}
      showOtherDays
      calendarPosition='top-bottom'
      placeholder={placeholder || t('orders.placeDate')}
      shouldCloseOnSelect={false}
      inline={false}
      rangeHover
      style={{
        background: '#F3F6F9',
        border: '0px solid #bfc7ce',
        padding: isArabic ? '6px 40px 6px 13px' : '6px 13px 6px 40px',
        height: '55px',
        color: '#878CBD !important',
        width: '100%',
        borderRadius: '12px',
        ...style,
      }}
    />
  );
}

export default MultiDatepicker;
