import { useEffect } from 'react';

/**
 * Global hook to monitor and fix body scroll lock issues
 * This should be used once in the root component
 */
export function useBodyScrollLockFix() {
  useEffect(() => {
    // Function to check and fix body scroll
    const checkAndFixBodyScroll = () => {
      // ✅ Si ProductDetailPage pidió lock intencional, NO intervenir
      if (document.body.dataset.scrollLock === 'product-detail') {
        return;
      }

      // Check if there are any open dialogs or menus
      const hasOpenDialog = document.querySelector('[data-state="open"][role="dialog"]');
      const hasOpenMenu = document.querySelector('[data-state="open"][role="menu"]');
      
      // If no open overlays, ensure body is scrollable
      if (!hasOpenDialog && !hasOpenMenu) {
        if (document.body.style.overflow === 'hidden') {
          console.log('Fixing stuck body scroll...');
          document.body.style.overflow = '';
          document.body.style.pointerEvents = '';
          document.body.style.paddingRight = '';
        }
      }
    };

    // Run check periodically
    const interval = setInterval(checkAndFixBodyScroll, 500);

    // Also check on various events
    const events = ['click', 'keydown', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, checkAndFixBodyScroll);
    });

    // Cleanup
    return () => {
      clearInterval(interval);
      events.forEach(event => {
        document.removeEventListener(event, checkAndFixBodyScroll);
      });
    };
  }, []);
}
