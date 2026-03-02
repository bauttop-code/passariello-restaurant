# Voice Agent API

API para que un agente de voz consulte el menú/opciones del sitio y envíe pedidos.

## 1) Ejecutar API

```bash
npm run api:dev
```

Servidor local por defecto: `http://localhost:8787`

Variables opcionales:

- `VOICE_API_PORT` (default `8787`)
- `VOICE_API_KEY` (si la defines, los `POST/PATCH` requieren header `x-api-key`)

## 2) Sincronizar catálogo del sitio web

La app web ya incluye sync automático al montar `App` si defines:

```bash
VITE_VOICE_API_URL=http://localhost:8787
VITE_VOICE_API_KEY=tu_api_key_opcional
```

Con esto, la web envía todos los productos + `customizationOptions` al endpoint:

`POST /v1/catalog/sync`

## 3) Endpoints

### Health
- `GET /health`

### Catalog
- `POST /v1/catalog/sync` (protegido por API key si aplica)
- `GET /v1/catalog`
- `GET /v1/catalog?includeOptions=0`
- `GET /v1/catalog/categories`
- `GET /v1/catalog/products/:id`
- `GET /v1/catalog/search?q=...&category=...`

### Voice Orders
- `POST /v1/voice-orders` (crea pedido desde agente)
- `GET /v1/voice-orders?status=pending&limit=50`
- `PATCH /v1/voice-orders/:id` con body `{ "status": "accepted|rejected|sent_to_pos|completed|pending" }`

## 4) Ejemplo rápido

```bash
curl -X POST http://localhost:8787/v1/voice-orders \
  -H "Content-Type: application/json" \
  -d '{
    "source": "voice-agent",
    "customer": { "name": "John Doe", "phone": "+1-856-555-0101" },
    "items": [
      {
        "productId": "cyo-napoletana",
        "quantity": 1,
        "selections": [
          { "groupId": "cyo-napoletana-special-instructions", "optionId": "half-white" }
        ]
      }
    ],
    "notes": "Pickup asap"
  }'
```

## 5) Persistencia

Los datos se guardan en:

- `api/.data/catalog.json`
- `api/.data/voice-orders.json`

