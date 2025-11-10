import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  buildingsIcon,
  clientsIcon,
  dashboardIcon,
  inventoryIcon,
  ordersIcon,
  reportIcon,
  rolesIcon,
  servicesIcon,
  settingIcon,
  usersIcon,
} from '../../assets/icons';
import { permissions } from '../../constants';

export function useNavData() {
  const { t } = useTranslation();

  const data = useMemo(
    () => [
      {
        subheader: t('nav.subheaderOne'),
        
        items: [
          {
            permission: permissions.dashboard.read,
            title: t('nav.dashboard'),
            icon: dashboardIcon,
            path: '/',
          },
          {
            title: t('nav.orders'),
            icon: ordersIcon,
            path: '/orders',
            permission: permissions.order.list,
            children: [
              { title: t('nav.all'), path: '/orders' },
              { title: t('nav.draft'), path: '/orders/draft' },
              { title: t('nav.prepare'), path: '/orders/prepare' },
              { title: t('nav.ready'), path: '/orders/ready' },
              { title: t('nav.complete'), path: '/orders/complete' },
            ],
          },
        ],
      },
      {
        subheader: t('nav.subheaderTwo'),
        items: [
          {
            title: t('nav.items'),
            icon: servicesIcon,
            path: '/items',
            permission: permissions.item.list,
          },
          {
            title: t('nav.inventory'),
            icon: inventoryIcon,
            path: '/inventory',
            children: [
              {
                title: t('nav.warehouse'),
                path: '/inventory',
              },
              {
                title: t('nav.suppliers'),
                path: '/inventory/suppliers',
              },
              {
                title: t('nav.purchaseOrders'),
                path: '/inventory/purchase-orders',
              },
              {
                title: t('nav.internalPurchaseOrders'),
                path: '/inventory/internal-purchase-orders',
              },
              {
                title: t('nav.transferOrders'),
                path: '/inventory/transferOrders',
              },
            ],
          },
          {
            title: t('nav.branches'),
            icon: buildingsIcon,
            path: '/branches',
            permission: permissions.branch.list,
          },
          {
            title: t('nav.clients'),
            icon: clientsIcon,
            path: '/clients',
            permission: permissions.client.list,
          },
          {
            title: t('nav.employees'),
            icon: usersIcon,
            path: '/employees/list',
            permission: permissions.employee.list,
          },
          {
            title: t('nav.roles'),
            icon: rolesIcon,
            path: '/roles',
            permission: permissions.role.list,
          },
          {
            title: t('nav.reports'),
            icon: reportIcon,
            path: '/reports',
            permission: permissions.reports.list,
            children: [
              {
                title: t('nav.salesReport'),
                path: '/reports',
              },
              {
                title: t('nav.dailyReport'),
                path: '/reports/daily-report',
              },
              {
                title: t('nav.inventoryReport'),
                path: '/reports/inventory-report',
              },
              {
                title: t('nav.orderTrans'),
                path: '/reports/order-transactions',
              },
            ],
          },
        ],
      },
      {
        subheader: t('nav.subheaderThree'),
        items: [
          {
            title: t('nav.settings'),
            icon: settingIcon,
            path: '/settings',
            permission: permissions.setting.read,
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
