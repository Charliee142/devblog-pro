/**
 * MainLayout
 *
 * TEACHING NOTE: Layout Components
 * Layout components wrap page content with shared UI like Navbar and Footer.
 * <Outlet /> is where the matched page component renders.
 *
 * This avoids duplicating <Navbar /> and <Footer /> in every page.
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const MainLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
