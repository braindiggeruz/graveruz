export function initSWHardBlock() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.__SW_HARD_BLOCK__ = 'SW_HARD_BLOCK_V1';

  var host = window.location.hostname;
  var isProdHost = host === 'graver-studio.uz' || host === 'www.graver-studio.uz';
  var forceKill = window.location.search.indexOf('sw-kill=1') !== -1;

  if (!isProdHost && !forceKill) {
    return;
  }

  if (!window.__swHardBlockLogged) {
    window.__swHardBlockLogged = true;
    console.info('[SW] Hard block enabled');
  }

  var sw = navigator.serviceWorker;
  if (sw && typeof sw.register === 'function') {
    sw.register = function() {
      if (!window.__swHardBlockRegisterLogged) {
        window.__swHardBlockRegisterLogged = true;
        console.info('[SW] Registration blocked');
      }
      return Promise.reject(new Error('Service Worker disabled on production.'));
    };
  }

  sw.getRegistrations()
    .then(function(regs) {
      regs.forEach(function(reg) {
        reg.unregister();
      });
    })
    .catch(function() {});

  if (forceKill) {
    if ('caches' in window) {
      caches.keys()
        .then(function(keys) {
          keys.forEach(function(key) {
            caches.delete(key);
          });
        })
        .catch(function() {});
    }

    sw.getRegistrations()
      .then(function(regs) {
        regs.forEach(function(reg) {
          reg.unregister();
        });
      })
      .catch(function() {});

    try {
      var url = new URL(window.location.href);
      url.searchParams.delete('sw-kill');
      window.location.replace(url.toString());
    } catch (error) {
      // Ignore URL parsing errors.
    }
  }
}
