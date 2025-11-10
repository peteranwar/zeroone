/* eslint-disable import/order */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './i18n';
import LocalStorageProvider from './localStorageProvider';
import StorageService from './services/storage-service';
import localeService from './services/locale-service';
import LocaleResolver from './localeResolver';
import { Provider } from 'react-redux';
import store from './store';

StorageService.setStorageProvider(LocalStorageProvider);
localeService.setLocaleResolver(LocaleResolver);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
