import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Navigation } from './components/Navigation';
import { ThemeSelector } from './components/ThemeSelector';
import { AccessibilityToggle } from './components/AccessibilityToggle';
import { CursorSparkles } from './components/CursorSparkles';
import BackgroundMusic from './components/BackgroundMusic';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Links } from './pages/Links';
import { Gallery } from './pages/Gallery';
import { BuildYourOwn } from './pages/BuildYourOwn';
import { themes, applyTheme } from './themes';
import { getAssetPath } from './utils/assetPath';
import { trackPageView, trackTiming } from './utils/analytics';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentTheme, setCurrentTheme] = useState(themes.twinkleFairyDream);
  const [accessibleFonts, setAccessibleFonts] = useState(() => {
    const saved = localStorage.getItem('accessibleFonts');
    return saved === 'true';
  });
  const sessionStartRef = useRef(null);
  const pageStartRef = useRef(null);
  const previousTabRef = useRef(null);

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

  // Track session start time on mount
  useEffect(() => {
    sessionStartRef.current = Date.now();
    pageStartRef.current = Date.now();

    // Track total session duration on unmount/page close
    const handleBeforeUnload = () => {
      if (sessionStartRef.current) {
        const sessionDuration = Math.round((Date.now() - sessionStartRef.current) / 1000);
        trackTiming('session_duration', sessionDuration, 'engagement');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload(); // Also track on component unmount
    };
  }, []);

  // Track page changes with time on page
  useEffect(() => {
    // Track time on previous page
    if (previousTabRef.current && pageStartRef.current) {
      const timeOnPage = Math.round((Date.now() - pageStartRef.current) / 1000);
      trackTiming(`${previousTabRef.current}_page_time`, timeOnPage, 'page_engagement');
    }

    // Track new page view
    trackPageView(activeTab);

    // Reset page timer
    pageStartRef.current = Date.now();
    previousTabRef.current = activeTab;
  }, [activeTab]);

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
      {activeTab !== 'build' && <CursorSparkles currentTheme={currentTheme} />}

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

      {/* Background music control (place after theme selector so it appears above other UI) */}
      <BackgroundMusic src={getAssetPath('/audio/background-music.mp3')} />

      <AccessibilityToggle
        accessibleFonts={accessibleFonts}
        onToggle={() => setAccessibleFonts(!accessibleFonts)}
      />
    </div>
  );
}

export default App;
