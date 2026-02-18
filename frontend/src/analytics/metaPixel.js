export const track = (eventName, params = {}, options = {}) => {
  if (!window.fbq) return;
  if (options.eventID) window.fbq('track', eventName, params, { eventID: options.eventID });
  else window.fbq('track', eventName, params);
};

export const trackCustom = (eventName, params = {}, options = {}) => {
  if (!window.fbq) return;
  if (options.eventID) window.fbq('trackCustom', eventName, params, { eventID: options.eventID });
  else window.fbq('trackCustom', eventName, params);
};