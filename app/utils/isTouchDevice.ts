export const isTouchDevice = () => {
    if (typeof window === 'undefined') return false; // SSR için
    return (('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      // @ts-ignore
      (navigator.msMaxTouchPoints > 0));
  };