/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-extraneous-dependencies */
import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { CssBaseline } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTranslation } from 'react-i18next';
import { QueryClientProvider } from 'react-query';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { SettingsProvider } from './components/settings';
import LoadingScreen from './components/shared/loading-screen';
import { permissions } from './constants';
import { queryClient } from './libs/react-query';
import localStorageProvider from './localStorageProvider';
import TransferList from './pages/inventory/transfer-orders/table/transfer-list';
import TransferDetails from './pages/inventory/transfer-orders/transfer-details';
import PrivateRoute from './private-Route/Private-Route';
import HttpHelpers from './services/helpers';
import ThemeConfig from './ui/theme/theme-config';


const Home = lazy(() => import('./pages/Home'));
const Roles = lazy(() => import('./pages/roles/RolesList'));
const EmployeesList = lazy(() => import('./pages/Employees/EmployeesList'));
// Orders
const Orders = lazy(() => import('./pages/orders/list'));
const CreateOrder = lazy(() => import('./pages/orders/create-order'));
const OrderDetails = lazy(() => import('./pages/orders/order-details'));

const Clients = lazy(() => import('./pages/clients/clients-list'));
const ClientsDetails = lazy(() => import('./pages/clients/client-details'));

const LogIn = lazy(() => import('./pages/auth/login'));
const ForgetPassword = lazy(() => import('./pages/auth/forget-password'));
const OTPVerification = lazy(() => import('./pages/auth/otp-verification'));
const NewPassword = lazy(() => import('./pages/auth/new-password'));

const Profile = lazy(() => import('./pages/profile/profile-info'));
const Settings = lazy(() => import('./pages/setting/Setting'));

const Branches = lazy(() => import('./pages/branches/branchesList'));
const Items = lazy(() => import('./pages/items/servicesList'));
const EmployeeForm = lazy(() => import('./pages/Employees/employeeForm'));

// Inventory
const Warehouse = lazy(() => import('./pages/inventory/warehouse/warehouseList'));
const Suppliers = lazy(() => import('./pages/inventory/suppliers/suppliersList'));
const PurchaseOrders = lazy(() =>
  import('./pages/inventory/purchase-orders/purchaseOrdersList')
);
const PurchaseDetails = lazy(() =>
  import('./pages/inventory/purchase-orders/purchaseDetails')
);

const InternalPurchaseOrders = lazy(() =>
  import('./pages/inventory/internal-purchase-orders/purchaseOrdersList')
);

const InternalPurchaseDetails = lazy(() =>
  import('./pages/inventory/internal-purchase-orders/purchaseDetails')
);

// Reports
const SalesList = lazy(() => import('./pages/reports/sales/sales-list'));
const DailyList = lazy(() => import('./pages/reports/daily/daily-list'));
const InventoryList = lazy(() => import('./pages/reports/inventory/inventory-list'));
const OrderTransactions = lazy(() =>
  import('./pages/reports/order-transaction/order-transaction-list')
);

HttpHelpers.setBaseUrl(import.meta.env.VITE_API_KEY);

function App() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('userPermissions');
    navigate('/login');
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    const loginTime = localStorage.getItem('loginTime');

    if (token && loginTime) {
      // Calculate the elapsed time since login
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - parseInt(loginTime, 10);

      // Set a timer for the remaining time until 6 hours
      const remainingTime = 6 * 60 * 60 * 1000 - elapsedTime;
      const logoutTimer = setTimeout(() => {
        // Perform logout actions here
        logoutUser();
      }, remainingTime);

      // Save the timer ID in localStorage
      localStorage.setItem('logoutTimer', logoutTimer);
    }

    // Cleanup function to clear the timer if the component unmounts
    return () => {
      const logoutTimer = localStorage.getItem('logoutTimer');
      clearTimeout(logoutTimer);
      localStorage.removeItem('logoutTimer');
    };
  }, []);

  useEffect(() => {
    localStorageProvider.get('locale').then(lng => {
      let locale;
      if (!lng) {
        locale = 'ar';
      } else {
        locale = lng;
      }
      if (!lng) localStorageProvider.set('locale', locale);
      i18n.changeLanguage(locale);
      document.querySelector('html').dir = i18n.dir();
      document.querySelector('html').lang = locale;
    });
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <QueryClientProvider client={queryClient}>
        <DndProvider backend={HTML5Backend}>
          <ToastContainer
            autoClose={4000}
            transition={Slide}
            rtl={i18n.language === 'ar'}
            position={i18n.language === 'ar' ? 'top-left' : 'top-right'}
            theme='colored'
            hideProgressBar
            style={{ width: '400px', height: 'fit-content' }}
          />
          <SettingsProvider
            defaultSettings={{
              themeMode: 'light', // 'light' | 'dark'
              themeDirection: 'ltr', //  'rtl' | 'ltr'
              themeContrast: 'default', // 'default' | 'bold'
              themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
              themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
              themeStretch: false,
            }}
          >
            <ThemeConfig>
              <CssBaseline />
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  <Route path='/login' element={<LogIn />} />
                  <Route path='/forget-password' element={<ForgetPassword />} />
                  <Route path='/otp-verification' element={<OTPVerification />} />
                  <Route path='/new-password' element={<NewPassword />} />
                  <Route
                    path='/'
                    permission={permissions.dashboard.read}
                    element={
                      <PrivateRoute>
                        <Home />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path='/employees/list'
                    element={
                      <PrivateRoute permission={permissions.employee.list}>
                        <EmployeesList />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path='/employees/add'
                    element={
                      <PrivateRoute permission={permissions.employee.create}>
                        <EmployeeForm />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path='/employees/edit/:employee_id'
                    element={
                      <PrivateRoute permission={permissions.employee.update}>
                        <EmployeeForm />
                      </PrivateRoute>
                    }
                  />
                  {/* Orders */}
                  <Route
                    path='/orders'
                    element={
                      <PrivateRoute permission={permissions.order.list}>
                        <Orders />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path='/orders/:status'
                    element={
                      <PrivateRoute permission={permissions.order.list}>
                        <Orders />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path='/orders/details/:orderId'
                    element={
                      <PrivateRoute permission={permissions.order.read}>
                        <OrderDetails />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path='/orders/new'
                    element={
                      <PrivateRoute permission={permissions.order.create}>
                        <CreateOrder />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path='/orders/new/:orderId'
                    element={
                      <PrivateRoute permission={permissions.order.update}>
                        <CreateOrder />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path='/clients'
                    element={
                      <PrivateRoute permission={permissions.client.read}>
                        <Clients />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path='/clients/details/:client_id'
                    element={
                      <PrivateRoute permission={permissions.client.read}>
                        <ClientsDetails />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path='/profile'
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path='/roles'
                    element={
                      <PrivateRoute permission={permissions.role.list}>
                        <Roles />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path='/settings'
                    element={
                      <PrivateRoute permission={permissions.setting.read}>
                        <Settings />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path='/branches'
                    element={
                      <PrivateRoute permission={permissions.branch.list}>
                        <Branches />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path='/items'
                    element={
                      <PrivateRoute permission={permissions.item.list}>
                        <Items />
                      </PrivateRoute>
                    }
                  />

                  {/* Inventory */}
                  <Route
                    path='inventory'
                    element={
                      <PrivateRoute permission={permissions.item.list}>
                        <Warehouse />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path='inventory/suppliers'
                    element={
                      <PrivateRoute permission={permissions.item.list}>
                        <Suppliers />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path='inventory/purchase-orders'
                    element={
                      <PrivateRoute permission={permissions.item.list}>
                        <PurchaseOrders />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path='inventory/purchase-details/:id'
                    element={
                      <PrivateRoute permission={permissions.item.list}>
                        <PurchaseDetails />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path='inventory/internal-purchase-orders'
                    element={
                      <PrivateRoute permission={permissions.internalPurchase.list}>
                        <InternalPurchaseOrders />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path='inventory/internal-purchase-details/:id'
                    element={
                      <PrivateRoute permission={permissions.internalPurchase.list}>
                        <InternalPurchaseDetails />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path='inventory/transferOrders'
                    element={
                      <PrivateRoute permission={permissions.transfer.list}>
                        <TransferList />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path='inventory/transferOrder/:id'
                    element={
                      <PrivateRoute permission={permissions.transfer.read}>
                        <TransferDetails />
                      </PrivateRoute>
                    }
                  />

                  {/* Reports */}
                  <Route
                    path='reports'
                    element={
                      <PrivateRoute permission={permissions.reports.list}>
                        <SalesList />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path='reports/daily-report'
                    element={
                      <PrivateRoute permission={permissions.reports.list}>
                        <DailyList />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path='reports/inventory-report'
                    element={
                      <PrivateRoute permission={permissions.reports.list}>
                        <InventoryList />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path='reports/order-transactions'
                    element={
                      <PrivateRoute permission={permissions.reports.list}>
                        <OrderTransactions />
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </Suspense>
            </ThemeConfig>
          </SettingsProvider>
        </DndProvider>
      </QueryClientProvider>
    </LocalizationProvider>
  );
}

export default App;
