import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-purple-950">
      <Navbar />
      <main className="flex-grow mt-20">
        <div key={location.pathname} className="page-transition">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};
