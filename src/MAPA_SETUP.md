# 🗺️ MapLibre GL JS - Setup y Uso

## ✅ SOLUCIÓN IMPLEMENTADA

**Mapa interactivo REAL** con **MapLibre GL JS** + tiles de OpenStreetMap.

---

## 📦 INSTALACIÓN (Solo para referencia - Ya está disponible)

En este entorno de Figma Make, MapLibre ya está disponible. Si lo necesitas en otro proyecto:

```bash
npm install maplibre-gl
```

---

## 🎯 CARACTERÍSTICAS IMPLEMENTADAS

✅ **Mapa JS real** integrado en el DOM (no iframe)  
✅ **Markers nativos** con API de MapLibre (no overlay CSS)  
✅ **Proyección correcta** - Los pines están perfectamente alineados  
✅ **FitBounds automático** - Muestra las 3 ubicaciones al cargar  
✅ **Popups nativos** - Click en markers para ver información  
✅ **Responsive** - Funciona en mobile y desktop  
✅ **Sin API key** - Usa tiles públicos de OpenStreetMap  
✅ **Interactivo** - Zoom, pan, todos los gestos funcionan  
✅ **Sincronizado** - Los markers se mueven con el mapa correctamente  

---

## 📍 COORDENADAS REALES (Verificadas)

```typescript
// Hardcoded en el componente principal
const locations = [
  {
    name: 'Haddonfield',
    lat: 39.8914,
    lng: -75.0368,
  },
  {
    name: 'Moorestown',
    lat: 39.9688,
    lng: -74.9488,
  },
  {
    name: 'Voorhees',
    lat: 39.8431,
    lng: -74.9560,
  },
];
```

---

## 🚀 USO

El componente ya está integrado en `/components/LocationSelector.tsx`:

```tsx
import { LocationsMap } from './LocationsMap';

<LocationsMap 
  locations={filteredLocations} 
  className="h-[811px] w-full" 
/>
```

---

## 🔧 CÓMO FUNCIONA

### 1. Inicialización del mapa
```typescript
const map = new maplibregl.Map({
  container: mapContainerRef.current,
  style: {
    // Configuración de tiles OSM raster
    sources: { osm: { type: 'raster', tiles: [...] } },
    layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
  },
});
```

### 2. Creación de markers nativos
```typescript
const marker = new maplibregl.Marker({
  element: customHTMLElement, // Pin personalizado
  anchor: 'bottom',
})
  .setLngLat([lng, lat])
  .setPopup(popup)
  .addTo(map);
```

### 3. FitBounds automático
```typescript
const bounds = new maplibregl.LngLatBounds();
locations.forEach(loc => bounds.extend([loc.lng, loc.lat]));
map.fitBounds(bounds, { padding: 80, maxZoom: 12 });
```

---

## 🆚 COMPARACIÓN CON IFRAME + OVERLAY

| Aspecto | Iframe + Overlay CSS | MapLibre GL JS |
|---------|---------------------|----------------|
| Alineación de pins | ❌ Desalineados con zoom/resize | ✅ Perfecta sincronización |
| Proyección | ❌ Cálculo lineal incorrecto | ✅ Proyección Mercator nativa |
| Interactividad | ❌ Pines estáticos en DOM | ✅ Markers integrados al mapa |
| Responsive | ❌ Se rompe con resize | ✅ Responsive nativo |
| Popups | ❌ DIVs superpuestos manuales | ✅ Popups nativos de MapLibre |
| Rendimiento | ⚠️ Dos capas separadas | ✅ Todo en un canvas |
| Control | ❌ Sin acceso al motor interno | ✅ Control total via API |

---

## 🎨 PERSONALIZACIÓN

### Cambiar color de pines
```typescript
// Línea 88 en LocationsMap.tsx
fill="#A72020"  // Cambia este valor
```

### Ajustar zoom inicial
```typescript
// Línea 134 en LocationsMap.tsx
maxZoom: 12  // Valores más altos = más zoom
```

### Cambiar estilo del mapa
Puedes usar diferentes tile providers:

```typescript
// Mapbox Streets style (requiere API key)
tiles: ['https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=YOUR_KEY']

// OpenTopoMap (topográfico)
tiles: ['https://a.tile.opentopomap.org/{z}/{x}/{y}.png']

// CartoDB Positron (minimalista)
tiles: ['https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png']
```

---

## 📱 RESPONSIVE

El mapa es responsive por defecto:
- **Desktop (≥1024px)**: Visible en columna derecha
- **Mobile (<1024px)**: Oculto (solo se ve la lista)

Configurado en `/components/LocationSelector.tsx`:
```tsx
<div className="hidden lg:block">
  <LocationsMap ... />
</div>
```

---

## 🐛 TROUBLESHOOTING

### "Cannot read property 'style' of undefined"
**Solución**: El contenedor debe estar montado antes de inicializar el mapa. El componente usa `useEffect` para esperar al montaje.

### Los tiles no cargan
**Solución**: Verifica tu conexión a internet. Los tiles de OSM son públicos pero requieren conexión.

### El mapa aparece en blanco
**Solución**: Asegúrate de que `locations` no esté vacío y tenga coordenadas válidas.

### CSS del mapa no se aplica
**Solución**: Verifica que `import 'maplibre-gl/dist/maplibre-gl.css'` esté presente en el componente.

---

## 🔬 DEBUGGING

Para verificar que el mapa funciona:

```javascript
// En la consola del navegador
console.log(mapRef.current); // Debe mostrar el objeto Map
console.log(markersRef.current); // Debe mostrar array de 3 markers
```

---

## ✨ VENTAJAS DE MAPLIBRE GL JS

1. **Open Source** - Completamente gratuito y sin restricciones
2. **Sin API Key** - No requiere registro ni configuración externa
3. **Moderno** - Usa WebGL para rendering performante
4. **Compatible** - Fork mantenido de Mapbox GL JS v1
5. **Flexible** - Soporta múltiples tile providers
6. **Ligero** - ~200KB minified + gzipped
7. **TypeScript** - Tipado completo incluido

---

## 📊 ARQUITECTURA

```
LocationsMap.tsx
  │
  ├── useEffect (mount)
  │     ├── new maplibregl.Map() → Inicializa mapa
  │     ├── map.on('load') → Espera carga de tiles
  │     │     ├── locations.forEach() → Crea markers
  │     │     │     ├── Custom HTML element (SVG pin)
  │     │     │     ├── new maplibregl.Popup() → Popup con info
  │     │     │     ├── new maplibregl.Marker() → Marker nativo
  │     │     │     └── bounds.extend() → Agrega al bbox
  │     │     └── map.fitBounds() → Ajusta vista
  │     └── return cleanup → Limpia markers y mapa
  │
  └── return JSX
        ├── <style> → Estilos de popups
        └── <div ref> → Contenedor del mapa
```

---

## 🚀 PRÓXIMOS PASOS (Opcional)

Si quieres mejorar el mapa:

1. **Clustering** - Agrupar markers cercanos con `supercluster`
2. **Geolocalización** - Detectar ubicación del usuario
3. **Rutas** - Integrar con routing API (OSRM, Mapbox Directions)
4. **Heatmaps** - Visualizar densidad de pedidos
5. **Zonas de delivery** - Dibujar polígonos con `map.addLayer()`
6. **Animaciones** - Animar markers con `flyTo()` y transitions
7. **Offline** - Cachear tiles con Service Workers

---

## 📚 RECURSOS

- **MapLibre GL JS**: https://maplibre.org/maplibre-gl-js-docs/
- **OpenStreetMap Tiles**: https://wiki.openstreetmap.org/wiki/Tile_servers
- **Ejemplos**: https://maplibre.org/maplibre-gl-js-docs/example/
- **GitHub**: https://github.com/maplibre/maplibre-gl-js

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [x] Mapa se renderiza correctamente
- [x] 3 pines visibles en posiciones correctas
- [x] Pines permanecen alineados con zoom/pan
- [x] Popups se abren al hacer clic
- [x] Botón "Get Directions" funciona
- [x] FitBounds muestra las 3 ubicaciones
- [x] Responsive (oculto en mobile)
- [x] Sin errores en consola
- [x] No requiere API key

---

**¡Mapa 100% funcional con markers nativos perfectamente sincronizados! 🎉**
