import { useEffect } from 'react';

export function GridReplacer() {
  useEffect(() => {
    // Este componente ejecutará el reemplazo cuando se monte
    async function replaceGrids() {
      try {
        const response = await fetch('/api/replace-grids', {
          method: 'POST',
        });
        const data = await response.json();
        console.log('Reemplazos completados:', data);
      } catch (error) {
        console.error('Error al reemplazar grids:', error);
      }
    }
    
    replaceGrids();
  }, []);
  
  return null;
}
