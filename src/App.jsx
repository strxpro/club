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
  const [currentPath, setCurrentPath] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setCurrentPath(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const isCagliari = currentPath === '#cagliari';

  // Smooth scroll routing adjustment for hashtag anchor links on main page
  useEffect(() => {
     if (!isCagliari && currentPath && currentPath !== '#') {
         setTimeout(() => {
             const id = currentPath.substring(1);
             document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
         }, 100);
     }
  }, [currentPath, isCagliari]);
  return (
    <LanguageProvider>
      <div className="min-h-screen">
        <Navbar currentPath={currentPath} />
        {isCagliari ? (
          <CagliariStats />
        ) : (
          <>
            <Hero />
            <GigiRivaMemorial />
            <History />
            <Gallery />
            <Contact />
          </>
        )}
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;
