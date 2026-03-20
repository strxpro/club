import { useState, useEffect } from 'react';
import { LanguageProvider } from './LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import GigiRivaMemorial from './components/GigiRivaMemorial';
import History from './components/History';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CagliariStats from './components/CagliariStats';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  if (currentPath === '/cagliari' || currentPath === '/cagliari/') {
    return (
      <LanguageProvider>
         <CagliariStats />
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen">
        <Navbar />
        <Hero />
        <GigiRivaMemorial />
        <History />
        <Gallery />
        <Contact />
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;
