import { lazy } from 'react';

// Home
export const Home = lazy(() => import('./Home'));

// Orders
export const Orders = lazy(() => import('./orders/ordersList'));

// Employees
export const EmployeesList = lazy(() => import('./Employees/EmployeesList'));

// Menu
export const Menu = lazy(() => import('./menu/menusList'));
export const Categories = lazy(() => import('./menu/categories'));
export const AddItem = lazy(() => import('./menu/addItem'));
export const AddOns = lazy(() => import('./menu/addOns'));
export const AddOnsGroups = lazy(() => import('./menu/addOnsGroups'));
export const AddGroup = lazy(() => import('./menu/addOnsGroups/add-group'));



