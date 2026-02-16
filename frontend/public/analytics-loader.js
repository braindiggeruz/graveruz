(function () {
  var analyticsLoaded = false;
  window.__pendingPageViews = window.__pendingPageViews || [];

  function loadAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;

    var ga = document.createElement('script');
    ga.async = true;
    ga.src = 'https://www.googletagmanager.com/gtag/js?id=G-Z7V0FSGE4Y';
    document.head.appendChild(ga);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-Z7V0FSGE4Y', { send_page_view: false });

    if (window.__pendingPageViews && window.__pendingPageViews.length > 0) {
      window.__pendingPageViews.forEach(function (pv) {
        gtag('event', 'page_view', pv.ga4);
      });
      window.__pendingPageViews = [];
    }
  }

  ['click', 'scroll', 'touchstart', 'keydown'].forEach(function (evt) {
    document.addEventListener(evt, loadAnalytics, { once: true, passive: true });
  });

  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadAnalytics, { timeout: 3000 });
  } else {
    setTimeout(loadAnalytics, 3000);
  }
})();
