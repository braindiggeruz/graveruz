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

    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
    (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1415140489470568');

    if (window.__pendingPageViews && window.__pendingPageViews.length > 0) {
      window.__pendingPageViews.forEach(function (pv) {
        gtag('event', 'page_view', pv.ga4);
        if (window.fbq) {
          fbq('track', 'PageView');
        }
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
