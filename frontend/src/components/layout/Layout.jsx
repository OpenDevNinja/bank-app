import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import MobileNavigation from './MobileNavigation';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Layout = ({ darkMode, toggleDarkMode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-dark-bg">
      {/* Header fixe */}
      <Header 
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-0 w-full z-50"
      />

      <div className="flex h-full pt-16">
        {/* Sidebar fixe */}
        <div className="flex-shrink-0"> {/* Conteneur pour fixer la Sidebar */}
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
        </div>
        
        {/* Main content scrollable */}
        <main className="flex-1 overflow-auto relative">
          <div className="min-h-full py-6">
            <Outlet />
          </div>

          {/* Footer */}
          <Footer />
        </main>
      </div>

      {/* Navigation mobile en bas */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <MobileNavigation userRole={user?.role} />
      </div>
    </div>
  );
};

export default Layout;