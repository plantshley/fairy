// Google Analytics event tracking utility
export const trackEvent = (eventName, eventParams = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

export const trackPageView = (pageName) => {
  trackEvent('page_view', {
    page_name: pageName,
    page_location: window.location.href,
    page_path: window.location.pathname,
  });
};

export const trackTiming = (name, value, category = 'engagement') => {
  trackEvent('timing_complete', {
    name: name,
    value: value,
    event_category: category,
  });
};
