// src/components/layout/CareersLayout.tsx
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface CareersLayoutProps {
  children: React.ReactNode;
}

const CareersLayout: React.FC<CareersLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16 md:pt-20">
        {/* pt-16 md:pt-20 is to offset the fixed Header height */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default CareersLayout;