import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Navigation } from './components/Navigation';
import { ThemeSelector } from './components/ThemeSelector';
import { AccessibilityToggle } from './components/AccessibilityToggle';
import { CursorSparkles } from './components/CursorSparkles';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Links } from './pages/Links';
import { Gallery } from './pages/Gallery';
import { BuildYourOwn } from './pages/BuildYourOwn';
import { themes, applyTheme } from './themes';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentTheme, setCurrentTheme] = useState(themes.twinkleFairyDream);
  const [accessibleFonts, setAccessibleFonts] = useState(() => {
    const saved = localStorage.getItem('accessibleFonts');
    return saved === 'true';
  });

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem('accessibleFonts', accessibleFonts);
    if (accessibleFonts) {
      document.body.classList.add('accessible-fonts');
    } else {
      document.body.classList.remove('accessible-fonts');
    }
  }, [accessibleFonts]);

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <Home key="home" currentTheme={currentTheme} />;
      case 'shop':
        return <Shop key="shop" currentTheme={currentTheme} />;
      case 'links':
        return <Links key="links" currentTheme={currentTheme} />;
      case 'gallery':
        return <Gallery key="gallery" currentTheme={currentTheme} />;
      case 'build':
        return <BuildYourOwn key="build" currentTheme={currentTheme} />;
      default:
        return <Home key="home" currentTheme={currentTheme} />;
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <AnimatedBackground themeEmojis={currentTheme.emojis} />
      <CursorSparkles currentTheme={currentTheme} />

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} currentTheme={currentTheme} />

      <main className="lg:ml-20 min-h-screen flex items-center justify-center">
        <AnimatePresence mode="wait">
          {renderPage()}
        </AnimatePresence>
      </main>

      <ThemeSelector
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        accessibleFonts={accessibleFonts}
        activeTab={activeTab}
      />

      <AccessibilityToggle
        accessibleFonts={accessibleFonts}
        onToggle={() => setAccessibleFonts(!accessibleFonts)}
      />
    </div>
  );
}

export default App;
