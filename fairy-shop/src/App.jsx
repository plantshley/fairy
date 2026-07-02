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
import { PixelHome } from './pages/pixel/PixelHome';
import { PixelShop } from './pages/pixel/PixelShop';
import { PixelLinks } from './pages/pixel/PixelLinks';
import { PixelGallery } from './pages/pixel/PixelGallery';
import { themes, applyTheme } from './themes';
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

  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedId = localStorage.getItem('fairy-theme');
    return (savedId && themes[savedId]) || themes.twinkleFairyDream;
  });
  const a11y = useAccessibilitySettings();
  const [a11yMenuOpen, setA11yMenuOpen] = useState(false);
  const sessionStartRef = useRef(null);
  const pageStartRef = useRef(null);
  const previousTabRef = useRef(null);

  useEffect(() => {
    applyTheme(currentTheme);
    localStorage.setItem('fairy-theme', currentTheme.id);
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


  // Alternate-skin themes render their own in-page nav + background, so the
  // standard left rail and AnimatedBackground are suppressed. CursorSparkles is
  // kept on pixel pages. See src/themes.js (layout flag) and src/styles/pixel.css.
  const pixel = currentTheme.layout === 'pixel';
  const openAccessibility = () => setA11yMenuOpen(true);
  const pixelPageProps = {
    currentTheme,
    activeTab,
    onTabChange: setActiveTab,
    onOpenAccessibility: openAccessibility,
  };

  return (
    <MotionConfig reducedMotion={a11y.reduceMotion ? 'always' : 'never'}>
    <div className="min-h-dvh overflow-hidden">
      {!pixel && <AnimatedBackground themeEmojis={currentTheme.emojis} reduceMotion={a11y.reduceMotion} />}
      {activeTab !== 'build' && !a11y.reduceMotion && <CursorSparkles currentTheme={currentTheme} />}

      {!pixel && <Navigation activeTab={activeTab} onTabChange={setActiveTab} currentTheme={currentTheme} />}

      <main className={`min-h-dvh ${pixel ? 'w-full' : `${activeTab === 'build' ? '' : 'lg:ml-20'} flex items-center justify-center`}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={pixel ? <PixelHome {...pixelPageProps} onThemeChange={setCurrentTheme} /> : <Home currentTheme={currentTheme} />} />
            <Route path="/shop" element={pixel ? <PixelShop {...pixelPageProps} /> : <Shop currentTheme={currentTheme} />} />
            <Route path="/links" element={pixel ? <PixelLinks {...pixelPageProps} /> : <Links currentTheme={currentTheme} />} />
            <Route path="/gallery" element={pixel ? <PixelGallery {...pixelPageProps} /> : <Gallery currentTheme={currentTheme} />} />
            <Route path="/build" element={<BuildYourOwnV2 currentTheme={currentTheme} activeTab={activeTab} onTabChange={setActiveTab} onOpenAccessibility={openAccessibility} />} />
          </Routes>
        </AnimatePresence>
      </main>

      <ThemeSelector
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        activeTab={activeTab}
        reduceMotion={a11y.reduceMotion}
      />

      {/* Mobile navigation menu - only show on build. Under the pixel theme the
          desktop build page uses the in-page pixel NavBar instead, so the
          hamburger is hidden on large screens there. */}
      {activeTab === 'build' && (
        <div className={pixel ? 'lg:hidden' : undefined}>
          <MobileNavigationMenu
            activeTab={activeTab}
            onTabChange={setActiveTab}
            currentTheme={currentTheme}
            onOpenAccessibility={() => setA11yMenuOpen(true)}
          />
        </div>
      )}

      {/* Background music control. Hidden under the pixel theme, where the
          in-page "now playing" widget on PixelHome controls the same audio. */}
      {!pixel && <BackgroundMusic />}

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
