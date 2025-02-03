import React from 'react'
import { Route, Routes } from 'react-router-dom'

const MainLayout = React.lazy(() => import('../components/layout/MainLayout.jsx'));
const AdminDashboard = React.lazy(() => import('../pages/admin/AdminDashboard.jsx'));
const UserManagement = React.lazy(() => import('../pages/admin/UserManagement.jsx'));

const RoutesAdmin = () => {
  return (
    <Routes>
    <Route element={<MainLayout />}>
      <Route index element={<AdminDashboard />} />
      <Route path="users" element={<UserManagement />} />
     
    {/* 
      <Route path="*" element={<NotFound />} /> */}
    </Route>
  </Routes>
  )
}

export default RoutesAdmin
