# Despliegue completo API de Voz + Web

Este proyecto ya incluye las funciones API en:

- `api/health.js`
- `api/v1/catalog/*`
- `api/v1/voice-orders/*`

## 1) Configurar Supabase

1. Abre tu proyecto en Supabase.
2. Ve a `SQL Editor`.
3. Copia y ejecuta el contenido de `api/supabase.sql`.

## 2) Variables en Vercel

En tu proyecto de Vercel, agrega estas variables (`Settings -> Environment Variables`):

- `VOICE_API_KEY` = clave secreta para el agente
- `SUPABASE_URL` = URL de tu proyecto Supabase
- `SUPABASE_SERVICE_ROLE_KEY` = service role key de Supabase
- `VITE_VOICE_API_URL` = `https://passariello-restaurant.vercel.app/api`
- `VITE_VOICE_API_KEY` = misma clave de `VOICE_API_KEY`

## 3) Publicar

```bash
git add .
git commit -m "Add Vercel voice API + Supabase persistence"
git push origin main
```

Vercel redeploya automáticamente.

## 4) Verificación rápida

1. Salud API:
   - `GET https://passariello-restaurant.vercel.app/api/health`
2. Catálogo:
   - `GET https://passariello-restaurant.vercel.app/api/v1/catalog`
3. Crear orden de voz:
   - `POST https://passariello-restaurant.vercel.app/api/v1/voice-orders`
   - Header: `x-api-key: <VOICE_API_KEY>`

## 5) Ejemplo de orden (cURL)

```bash
curl -X POST "https://passariello-restaurant.vercel.app/api/v1/voice-orders" \
  -H "Content-Type: application/json" \
  -H "x-api-key: TU_CLAVE" \
  -d '{
    "source": "voice-agent",
    "customer": { "name": "Cliente", "phone": "+1-856-555-0101" },
    "items": [
      {
        "productId": "cyo-napoletana",
        "quantity": 1,
        "selections": [
          { "groupId": "cyo-napoletana-special-instructions", "optionId": "half-white" }
        ]
      }
    ],
    "notes": "Pickup ASAP"
  }'
```

