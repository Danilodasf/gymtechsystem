
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '../hooks/use-mobile';
import Layout from './Layout';
import MobileNavigation from './MobileNavigation';

const ResponsiveLayout: React.FC = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <MobileNavigation />
        <main className="px-2 py-2 pb-16">
          <div className="animate-fade-in max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    );
  }

  return <Layout />;
};

export default ResponsiveLayout;
