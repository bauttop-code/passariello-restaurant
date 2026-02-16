# OpenStreetMap Pickup Location Selector

## Overview
Sistema de selección de ubicación de pickup implementado con **OpenStreetMap** y **Leaflet/react-leaflet**, diseñado para Passariello's Pizzeria.

## Archivos Creados

### 1. `/components/PickupOpenStreetMap.tsx`
Componente principal que muestra:
- **Columna izquierda**: Lista de las 3 ubicaciones de pickup con búsqueda
- **Columna derecha**: Mapa interactivo de OpenStreetMap con marcadores

### 2. `/components/PickupMapDemo.tsx`
Componente de demostración que muestra cómo integrar el selector en tu aplicación.

### 3. Estilos en `/styles/globals.css`
Se agregaron estilos CSS para:
- Contenedor de Leaflet
- Marcadores personalizados
- Popups del mapa

## Características

### ✅ Layout de Dos Columnas
- **Left**: Lista scrollable de ubicaciones con búsqueda
- **Right**: Mapa interactivo full-height

### ✅ Sincronización Bidireccional
- Click en lista → centra y hace zoom en el marcador
- Click en marcador → selecciona en la lista

### ✅ Búsqueda Inteligente
- Filtra por ciudad, dirección, o código postal
- Siempre muestra las 3 ubicaciones (nunca las oculta)

### ✅ Marcadores Personalizados
- Color rojo #A72020 (color de marca Passariello's)
- Marcador seleccionado tiene punto central rojo
- Marcador no seleccionado es semi-transparente

### ✅ OpenStreetMap
- Tiles estándar de OSM
- Atribución requerida incluida
- No requiere API key

### ✅ Funcionalidades Adicionales
- Botón "Directions" abre Google Maps con direcciones
- Click en teléfono inicia llamada
- Responsive design

## Uso

### Opción 1: Usar el Demo
```tsx
import { PickupMapDemo } from './components/PickupMapDemo';

function App() {
  return <PickupMapDemo />;
}
```

### Opción 2: Integración Personalizada
```tsx
import { PickupOpenStreetMap } from './components/PickupOpenStreetMap';
import { useState } from 'react';

function MyCheckoutPage() {
  const [selectedStoreId, setSelectedStoreId] = useState<string>();
  
  const stores = [
    {
      id: '1',
      name: 'Haddonfield',
      address: '119 Kings Hwy E',
      city: 'Haddonfield',
      state: 'NJ',
      zip: '08033',
      lat: 39.8914,
      lng: -75.0368,
      hours: 'Mon-Sun: 9:00 AM - 9:00 PM',
      phone: '(856) 616-1010',
    },
    // ... más ubicaciones
  ];

  const handleSelectStore = (storeId: string) => {
    setSelectedStoreId(storeId);
    // Actualizar contexto/estado de orden
    // Guardar en localStorage si es necesario
  };

  return (
    <PickupOpenStreetMap
      stores={stores}
      onSelectStore={handleSelectStore}
      selectedStoreId={selectedStoreId}
    />
  );
}
```

## Props

### `PickupOpenStreetMap`

| Prop | Tipo | Descripción |
|------|------|-------------|
| `stores` | `Store[]` | Array de ubicaciones de pickup |
| `onSelectStore` | `(storeId: string) => void` | Callback cuando se selecciona una ubicación |
| `selectedStoreId` | `string?` | ID de la ubicación actualmente seleccionada |

### Tipo `Store`

```typescript
interface Store {
  id: string;           // ID único de la ubicación
  name: string;         // Nombre (ej: "Haddonfield")
  address: string;      // Dirección (ej: "119 Kings Hwy E")
  city: string;         // Ciudad
  state: string;        // Estado
  zip: string;          // Código postal
  lat: number;          // Latitud
  lng: number;          // Longitud
  hours?: string;       // Horarios (opcional)
  phone?: string;       // Teléfono (opcional)
}
```

## Dependencias

Las siguientes librerías se importan automáticamente:

- `leaflet` - Librería base de mapas
- `react-leaflet` - Componentes React para Leaflet

No es necesario instalar nada manualmente.

## Colores de Marca

El componente usa los colores oficiales de Passariello's:

- **Primary Red**: `#A72020`
- **Dark Red (hover)**: `#8B1A1A`
- **Marker (unselected)**: `#8B4545`

## Integración con Flujo de Orden

### En CheckoutPage
```tsx
// 1. Guardar la ubicación seleccionada en el estado
const [pickupLocation, setPickupLocation] = useState<string>();

// 2. Pasar al PickupOpenStreetMap
<PickupOpenStreetMap
  stores={stores}
  onSelectStore={(id) => {
    setPickupLocation(id);
    // Opcional: navegar al siguiente paso
    goToNextStep();
  }}
  selectedStoreId={pickupLocation}
/>

// 3. Usar en la confirmación de orden
const selectedStore = stores.find(s => s.id === pickupLocation);
console.log('Order pickup at:', selectedStore?.name);
```

## Notas Técnicas

### Leaflet CSS Fix
El componente incluye un fix para los iconos por defecto de Leaflet que no cargan correctamente en algunos builds. Los marcadores personalizados usan SVG inline.

### Auto-fit Bounds
Cuando no hay ubicación seleccionada, el mapa automáticamente hace zoom para mostrar las 3 ubicaciones.

### Animación de Vuelo
Cuando se selecciona una ubicación, el mapa hace un "flyTo" animado (1.5s) hacia esa ubicación con zoom 15.

## Comparación: Google Maps vs OpenStreetMap

| Feature | Google Maps (iframe) | OpenStreetMap (Leaflet) |
|---------|---------------------|------------------------|
| API Key | ✅ Requerido | ❌ No requerido |
| Costo | 💰 Puede tener costos | 🆓 Gratis |
| Interactividad | ⚠️ Limitada (iframe) | ✅ Total control |
| Marcadores custom | ⚠️ Limitado | ✅ Completo |
| Sincronización | ❌ Difícil | ✅ Fácil |
| Estilo | ❌ Estilo Google | ✅ Personalizable |

## Troubleshooting

### El mapa no se muestra
- Verificar que los estilos de Leaflet estén importados en `globals.css`
- Verificar que el contenedor tenga altura definida

### Marcadores no aparecen
- Verificar que las coordenadas lat/lng sean válidas
- Verificar que los stores tengan IDs únicos

### Popup no se ve bien
- Los estilos de popup están en `globals.css`
- Verificar que no haya conflictos con otros CSS

## Próximos Pasos

Para integrar completamente en tu aplicación:

1. ✅ Componente creado: `PickupOpenStreetMap.tsx`
2. ✅ Estilos agregados: `globals.css`
3. ✅ Demo creado: `PickupMapDemo.tsx`
4. ⏭️ Integrar en tu flujo de checkout
5. ⏭️ Conectar con tu contexto de orden
6. ⏭️ Agregar validación de distancia (5 millas)
7. ⏭️ Persistir selección en localStorage

## Referencias

- [OpenStreetMap](https://www.openstreetmap.org/)
- [Leaflet Documentation](https://leafletjs.com/)
- [React Leaflet](https://react-leaflet.js.org/)
