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
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default CareersLayout;