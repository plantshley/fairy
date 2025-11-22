import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Navigation } from './components/Navigation';
import { ThemeSelector } from './components/ThemeSelector';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Links } from './pages/Links';
import { Gallery } from './pages/Gallery';
import { BuildYourOwn } from './pages/BuildYourOwn';
import { themes, applyTheme } from './themes';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentTheme, setCurrentTheme] = useState(themes.twinkleFairyDream);

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <Home key="home" />;
      case 'shop':
        return <Shop key="shop" />;
      case 'links':
        return <Links key="links" />;
      case 'gallery':
        return <Gallery key="gallery" />;
      case 'build':
        return <BuildYourOwn key="build" />;
      default:
        return <Home key="home" />;
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <AnimatedBackground />

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="ml-24 min-h-screen flex items-center justify-center">
        <AnimatePresence mode="wait">
          {renderPage()}
        </AnimatePresence>
      </main>

      <ThemeSelector
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
      />
    </div>
  );
}

export default App;
