import { useEffect } from 'react';

/**
 * Hook to fix the dialog scroll lock issue
 * Ensures body overflow is reset when dialog is closed
 */
export function useDialogFix(open: boolean) {
  useEffect(() => {
    if (!open) {
      // Small delay to ensure Radix has finished its cleanup
      const timer = setTimeout(() => {
        // Force reset body styles
        document.body.style.overflow = '';
        document.body.style.pointerEvents = '';
        document.body.style.paddingRight = '';
        
        // Remove any data attributes that might be left
        document.body.removeAttribute('data-scroll-locked');
        
        // Force reflow
        document.body.offsetHeight;
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [open]);

  // Also cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.body.style.pointerEvents = '';
      document.body.style.paddingRight = '';
    };
  }, []);
}