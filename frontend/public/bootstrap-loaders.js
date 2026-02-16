(function () {
  var userAgent = (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent : '';
  var isReactSnap = !!window.__REACT_SNAP__ || /ReactSnap/i.test(userAgent) || (window.location && window.location.hostname === 'localhost' && window.location.port === '45678');
  if (isReactSnap) {
    return;
  }

  function appendScript(src, dataAttribute) {
    if (dataAttribute && document.querySelector('script[' + dataAttribute + '="true"]')) {
      return;
    }
    var script = document.createElement('script');
    script.src = src;
    script.defer = true;
    if (dataAttribute) {
      script.setAttribute(dataAttribute, 'true');
    }
    (document.head || document.documentElement).appendChild(script);
  }

  function loadAnalyticsBootstrap() {
    appendScript('/analytics-loader.js', 'data-analytics-loader');
  }

  function loadTrackingBootstrap() {
    appendScript('/tracking-bootstrap.js', 'data-tracking-bootstrap');
  }

  function loadEmergentBadge() {
    appendScript('https://assets.emergent.sh/scripts/emergent-main.js');
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadAnalyticsBootstrap, { timeout: 1500 });
    requestIdleCallback(loadTrackingBootstrap, { timeout: 2500 });
  } else {
    window.addEventListener('load', loadAnalyticsBootstrap, { once: true });
    window.addEventListener('load', loadTrackingBootstrap, { once: true });
  }

  window.addEventListener('load', loadEmergentBadge, { once: true });
})();
