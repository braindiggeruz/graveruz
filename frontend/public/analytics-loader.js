(function () {
  var analyticsLoaded = false;
  window.__pendingPageViews = window.__pendingPageViews || [];

  function loadAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;

    // Load Google Tag Manager
    var gtmScript = document.createElement('script');
    gtmScript.async = true;
    gtmScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-Z7V0FSGE4Y';
    document.head.appendChild(gtmScript);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-Z7V0FSGE4Y', { send_page_view: false });

    // Send pending page views
    if (window.__pendingPageViews && window.__pendingPageViews.length > 0) {
      window.__pendingPageViews.forEach(function (pv) {
        gtag('event', 'page_view', pv.ga4);
      });
      window.__pendingPageViews = [];
    }
  }

  // Load analytics on user interaction
  ['click', 'scroll', 'touchstart', 'keydown'].forEach(function (evt) {
    document.addEventListener(evt, loadAnalytics, { once: true, passive: true });
  });

  // Load analytics after idle time
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadAnalytics, { timeout: 3000 });
  } else {
    setTimeout(loadAnalytics, 3000);
  }
})();
