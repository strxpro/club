import { LanguageProvider } from './LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import GigiRivaMemorial from './components/GigiRivaMemorial';
import History from './components/History';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
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
