import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Navigation } from './components/Navigation';
import { MobileNavigationMenu } from './components/MobileNavigationMenu';
import { ThemeSelector } from './components/ThemeSelector';
import { AccessibilityMenu } from './components/AccessibilityMenu';
import { CursorSparkles } from './components/CursorSparkles';
import BackgroundMusic from './components/BackgroundMusic';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Links } from './pages/Links';
import { Gallery } from './pages/Gallery';
import { BuildYourOwn } from './pages/BuildYourOwn';
import { BuildYourOwnV2 } from './pages/BuildYourOwnV2';
import { themes, applyTheme } from './themes';
import { getAssetPath } from './utils/assetPath';
import { trackPageView, trackTiming } from './utils/analytics';
import { useAccessibilitySettings } from './hooks/useAccessibilitySettings';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Derive activeTab from current URL path
  const pathToTab = {
    '/': 'home',
    '/shop': 'shop',
    '/links': 'links',
    '/gallery': 'gallery',
    '/build': 'build',
  };
  const activeTab = pathToTab[location.pathname] || 'home';

  // Navigation function that updates the URL
  const setActiveTab = (tab) => {
    const tabToPath = {
      'home': '/',
      'shop': '/shop',
      'links': '/links',
      'gallery': '/gallery',
      'build': '/build',
    };
    navigate(tabToPath[tab] || '/');
  };

  const [currentTheme, setCurrentTheme] = useState(themes.twinkleFairyDream);
  const a11y = useAccessibilitySettings();
  const [a11yMenuOpen, setA11yMenuOpen] = useState(false);
  const sessionStartRef = useRef(null);
  const pageStartRef = useRef(null);
  const previousTabRef = useRef(null);

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

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


  return (
    <MotionConfig reducedMotion={a11y.reduceMotion ? 'always' : 'never'}>
    <div className="min-h-screen overflow-hidden">
      <AnimatedBackground themeEmojis={currentTheme.emojis} reduceMotion={a11y.reduceMotion} />
      {activeTab !== 'build' && !a11y.reduceMotion && <CursorSparkles currentTheme={currentTheme} />}

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} currentTheme={currentTheme} />

      <main className={`${activeTab === 'build' ? '' : 'lg:ml-20'} min-h-screen flex items-center justify-center`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home currentTheme={currentTheme} />} />
            <Route path="/shop" element={<Shop currentTheme={currentTheme} />} />
            <Route path="/links" element={<Links currentTheme={currentTheme} />} />
            <Route path="/gallery" element={<Gallery currentTheme={currentTheme} />} />
            <Route path="/build" element={<BuildYourOwnV2 currentTheme={currentTheme} />} />
          </Routes>
        </AnimatePresence>
      </main>

      <ThemeSelector
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        activeTab={activeTab}
        reduceMotion={a11y.reduceMotion}
      />

      {/* Mobile navigation menu - only show on build */}
      {activeTab === 'build' && (
        <MobileNavigationMenu
          activeTab={activeTab}
          onTabChange={setActiveTab}
          currentTheme={currentTheme}
          onOpenAccessibility={() => setA11yMenuOpen(true)}
        />
      )}

      {/* Background music control (place after theme selector so it appears above other UI) */}
      <BackgroundMusic src={getAssetPath('/audio/background-music.mp3')} />

      <AccessibilityMenu
        currentTheme={currentTheme}
        activeTab={activeTab}
        isOpen={a11yMenuOpen}
        onOpenChange={setA11yMenuOpen}
        fontScale={a11y.fontScale}
        readableFonts={a11y.readableFonts}
        highContrast={a11y.highContrast}
        reduceMotion={a11y.reduceMotion}
        setFontScale={a11y.setFontScale}
        toggleReadableFonts={a11y.toggleReadableFonts}
        toggleHighContrast={a11y.toggleHighContrast}
        toggleReduceMotion={a11y.toggleReduceMotion}
        reset={a11y.reset}
      />
    </div>
    </MotionConfig>
  );
}

export default App;
