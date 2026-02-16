(function () {
  var initialPageTracked = false;

  function trackPage() {
    var path = window.location.pathname;
    var fullUrl = window.location.href;
    var title = document.title;

    var ga4Data = {
      page_path: path,
      page_location: fullUrl,
      page_title: title,
      send_to: 'G-Z7V0FSGE4Y'
    };

    if (!window.gtag) {
      window.__pendingPageViews = window.__pendingPageViews || [];
      window.__pendingPageViews.push({ path: path, ga4: ga4Data });
      return;
    }

    window.gtag('event', 'page_view', ga4Data);
  }

  setTimeout(function () {
    if (!initialPageTracked) {
      initialPageTracked = true;
      trackPage();
    }
  }, 150);

  var pushState = history.pushState;
  var replaceState = history.replaceState;

  history.pushState = function () {
    pushState.apply(history, arguments);
    setTimeout(trackPage, 0);
  };

  history.replaceState = function () {
    replaceState.apply(history, arguments);
    setTimeout(trackPage, 0);
  };

  window.addEventListener('popstate', function () {
    setTimeout(trackPage, 0);
  });

  var params = new URLSearchParams(window.location.search);
  var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var utm = {};
  keys.forEach(function (key) {
    var value = params.get(key);
    if (value) utm[key] = value;
  });
  if (Object.keys(utm).length) {
    try {
      localStorage.setItem('utm', JSON.stringify(utm));
    } catch (e) {}
  }

  function fillHidden(form) {
    try {
      var saved = JSON.parse(localStorage.getItem('utm') || '{}');
      Object.keys(saved).forEach(function (key) {
        var input = form.querySelector('input[name="' + key + '"]');
        if (input && !input.value) input.value = saved[key];
      });
    } catch (e) {}
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a');
    if (!link) return;
    var trackType = link.getAttribute('data-track');
    if (!trackType) return;

    var eventName = trackType === 'tel' ? 'click_tel' : 'click_telegram';
    if (window.gtag) {
      window.gtag('event', eventName, {
        link_url: link.href,
        transport_type: 'beacon'
      });
    }
  });

  window.__trackLeadSuccess = function () {
    if (window.gtag) {
      window.gtag('event', 'form_submit', {
        form_id: 'leadForm',
        transport_type: 'beacon'
      });
    }
  };

  window.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('leadForm');
    if (form) {
      fillHidden(form);
    }
  });

  var fillAttempts = 0;
  var maxFillAttempts = 20;
  var fillIntervalId = setInterval(function () {
    var form = document.getElementById('leadForm');
    if (form && !form.dataset.utmFilled) {
      fillHidden(form);
      form.dataset.utmFilled = 'true';
    }
    fillAttempts += 1;
    if ((form && form.dataset.utmFilled === 'true') || fillAttempts >= maxFillAttempts) {
      clearInterval(fillIntervalId);
    }
  }, 1500);
})();
