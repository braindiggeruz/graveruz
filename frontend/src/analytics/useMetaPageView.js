import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function useMetaPageView() {
  const location = useLocation();
  const isFirst = useRef(true);

  useEffect(() => {
    // первый PageView уже отправляет базовый пиксель из index.html при загрузке
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (!window.fbq) return;
    window.fbq('track', 'PageView');
  }, [location.pathname, location.search]);
}
