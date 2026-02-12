export function initSWHardBlock() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

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
      return Promise.resolve({ scope: window.location.origin + '/' });
    };
  }

  sw.getRegistrations()
    .then(function(regs) {
      regs.forEach(function(reg) {
        reg.unregister();
      });
    })
    .catch(function() {});

  if ('caches' in window) {
    caches.keys()
      .then(function(keys) {
        keys.forEach(function(key) {
          caches.delete(key);
        });
      })
      .catch(function() {});
  }

  if (forceKill) {
    sw.getRegistrations()
      .then(function(regs) {
        regs.forEach(function(reg) {
          reg.unregister();
        });
      })
      .catch(function() {});
  }
}
