import { createBrowserRouter, Navigate } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { DashboardPage } from '../pages/Dashboard'
import { OrdersPage } from '../pages/Orders'
import { ProductsPage } from '../pages/Products'
import { StockPage } from '../pages/Stock'
import { MarketplacePage } from '../pages/Marketplace'
import { ReportsPage } from '../pages/Reports'
import { SettingsPage } from '../pages/Settings'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'orders',
        element: <OrdersPage />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
      {
        path: 'stock',
        element: <StockPage />,
      },
      {
        path: 'marketplace',
        element: <MarketplacePage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
])
