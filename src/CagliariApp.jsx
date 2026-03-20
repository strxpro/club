import React from 'react';
import { LanguageProvider } from './LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CagliariStats from './components/CagliariStats';

function CagliariApp() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-navy-dark text-white font-sans overflow-x-hidden">
        <Navbar isCagliariPage={true} />
        <main className="pt-32 md:pt-48 lg:pt-56 pb-20">
          <CagliariStats />
        </main>
        <Footer isCagliariPage={true} />
      </div>
    </LanguageProvider>
  );
}

export default CagliariApp;
