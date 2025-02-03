import React from 'react'
import { Route, Routes } from 'react-router-dom'

const MainLayout = React.lazy(() => import('../components/layout/MainLayout.jsx'));
const ClientDashboard = React.lazy(() => import('../pages/client/ClientDashboard.jsx'));
const AccountList = React.lazy(() => import('../components/accounts/AccountList.jsx'));
const TransactionList = React.lazy(() => import('../components/transactions/TransactionList.jsx'));

const RoutesClient = () => {
  return (
    <Routes>
    <Route element={<MainLayout />}>
      <Route index element={<ClientDashboard />} />
      <Route path="home" element={<ClientDashboard />} />
      <Route path="accounts" element={<AccountList />} />
      <Route path="transactions/:accountId" element={<TransactionList />} />
    {/* 
      <Route path="*" element={<NotFound />} /> */}
    </Route>
  </Routes>
  )
}

export default RoutesClient
