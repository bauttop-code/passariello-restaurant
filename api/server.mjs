import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.VOICE_API_PORT || 8787);
const API_KEY = process.env.VOICE_API_KEY || '';
const DATA_DIR = path.join(__dirname, '.data');
const CATALOG_FILE = path.join(DATA_DIR, 'catalog.json');
const ORDERS_FILE = path.join(DATA_DIR, 'voice-orders.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJson(filePath, fallback) {
  ensureDataDir();
  if (!fs.existsSync(filePath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(filePath, payload) {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');
}

function send(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,PATCH,OPTIONS',
    'access-control-allow-headers': 'content-type,x-api-key',
  });
  res.end(body);
}

function notFound(res) {
  send(res, 404, { error: 'not_found' });
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 10_000_000) {
        reject(new Error('payload_too_large'));
      }
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('invalid_json'));
      }
    });
    req.on('error', reject);
  });
}

function requireApiKey(req, res) {
  if (!API_KEY) return true;
  const incoming = req.headers['x-api-key'];
  if (incoming === API_KEY) return true;
  send(res, 401, { error: 'unauthorized' });
  return false;
}

function normalizeProduct(product) {
  return {
    id: product?.id ?? '',
    name: product?.name ?? '',
    description: product?.description ?? '',
    category: product?.category ?? 'uncategorized',
    image: product?.image ?? '',
    price: product?.price ?? '',
    priceRange: product?.priceRange ?? '',
    customizationOptions: Array.isArray(product?.customizationOptions)
      ? product.customizationOptions
      : [],
  };
}

function getCatalog() {
  return readJson(CATALOG_FILE, {
    syncedAt: null,
    source: 'unknown',
    version: '0',
    products: [],
  });
}

function saveCatalog(catalog) {
  writeJson(CATALOG_FILE, catalog);
}

function getOrders() {
  return readJson(ORDERS_FILE, []);
}

function saveOrders(orders) {
  writeJson(ORDERS_FILE, orders);
}

function buildCatalogIndex(products) {
  const productById = new Map();
  const optionByProduct = new Map();
  for (const product of products) {
    productById.set(product.id, product);
    const map = new Map();
    for (const group of product.customizationOptions || []) {
      for (const option of group.options || []) {
        map.set(`${group.id}:${option.id}`, { group, option });
      }
    }
    optionByProduct.set(product.id, map);
  }
  return { productById, optionByProduct };
}

function validateVoiceOrderItems(items, products) {
  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, message: 'items_required' };
  }
  const { productById, optionByProduct } = buildCatalogIndex(products);

  for (const item of items) {
    const product = productById.get(item?.productId);
    if (!product) return { ok: false, message: `unknown_product:${item?.productId ?? ''}` };

    if (!Number.isFinite(item?.quantity) || item.quantity <= 0) {
      return { ok: false, message: `invalid_quantity:${item?.productId}` };
    }

    const selections = Array.isArray(item?.selections) ? item.selections : [];
    const optionIndex = optionByProduct.get(item.productId) || new Map();
    for (const sel of selections) {
      if (!sel?.groupId || !sel?.optionId) continue;
      const key = `${sel.groupId}:${sel.optionId}`;
      if (!optionIndex.has(key)) {
        return {
          ok: false,
          message: `unknown_option:${item.productId}:${sel.groupId}:${sel.optionId}`,
        };
      }
    }
  }

  return { ok: true };
}

function makeId(prefix = 'vo') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const server = http.createServer(async (req, res) => {
  if (!req.url || !req.method) return notFound(res);
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const method = req.method.toUpperCase();
  const pathname = url.pathname;

  if (method === 'OPTIONS') {
    return send(res, 204, { ok: true });
  }

  if (method === 'GET' && pathname === '/health') {
    return send(res, 200, { ok: true, service: 'voice-order-api' });
  }

  if (method === 'POST' && pathname === '/v1/catalog/sync') {
    if (!requireApiKey(req, res)) return;
    try {
      const body = await parseBody(req);
      const incoming = Array.isArray(body?.products) ? body.products : [];
      const products = incoming.map(normalizeProduct).filter((p) => p.id && p.name);
      const payload = {
        syncedAt: new Date().toISOString(),
        source: body?.source || 'website',
        version: String(body?.version || Date.now()),
        products,
      };
      saveCatalog(payload);
      return send(res, 200, { ok: true, count: products.length, syncedAt: payload.syncedAt });
    } catch (error) {
      return send(res, 400, { error: String(error?.message || 'bad_request') });
    }
  }

  if (method === 'GET' && pathname === '/v1/catalog') {
    const catalog = getCatalog();
    const includeOptions = url.searchParams.get('includeOptions') !== '0';
    const products = includeOptions
      ? catalog.products
      : catalog.products.map((p) => ({ ...p, customizationOptions: [] }));
    return send(res, 200, {
      syncedAt: catalog.syncedAt,
      source: catalog.source,
      version: catalog.version,
      totalProducts: products.length,
      products,
    });
  }

  if (method === 'GET' && pathname === '/v1/catalog/categories') {
    const catalog = getCatalog();
    const counts = new Map();
    for (const p of catalog.products) {
      counts.set(p.category, (counts.get(p.category) || 0) + 1);
    }
    const categories = [...counts.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([category, count]) => ({ category, count }));
    return send(res, 200, { totalCategories: categories.length, categories });
  }

  if (method === 'GET' && pathname.startsWith('/v1/catalog/products/')) {
    const productId = decodeURIComponent(pathname.replace('/v1/catalog/products/', ''));
    const catalog = getCatalog();
    const product = catalog.products.find((p) => p.id === productId);
    if (!product) return send(res, 404, { error: 'product_not_found' });
    return send(res, 200, product);
  }

  if (method === 'GET' && pathname === '/v1/catalog/search') {
    const q = (url.searchParams.get('q') || '').toLowerCase().trim();
    const category = (url.searchParams.get('category') || '').toLowerCase().trim();
    const catalog = getCatalog();
    let rows = catalog.products;
    if (category) rows = rows.filter((p) => (p.category || '').toLowerCase() === category);
    if (q) rows = rows.filter((p) => `${p.name} ${p.description}`.toLowerCase().includes(q));
    return send(res, 200, { count: rows.length, products: rows.slice(0, 200) });
  }

  if (method === 'POST' && pathname === '/v1/voice-orders') {
    if (!requireApiKey(req, res)) return;
    try {
      const body = await parseBody(req);
      const catalog = getCatalog();
      const validation = validateVoiceOrderItems(body?.items, catalog.products);
      if (!validation.ok) return send(res, 400, { error: validation.message });

      const order = {
        id: makeId('voice'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'pending',
        source: body?.source || 'voice-agent',
        externalRef: body?.externalRef || null,
        customer: body?.customer || null,
        notes: body?.notes || '',
        items: body.items,
      };

      const orders = getOrders();
      orders.unshift(order);
      saveOrders(orders);
      return send(res, 201, order);
    } catch (error) {
      return send(res, 400, { error: String(error?.message || 'bad_request') });
    }
  }

  if (method === 'GET' && pathname === '/v1/voice-orders') {
    const status = (url.searchParams.get('status') || '').toLowerCase();
    const limit = Math.max(1, Math.min(Number(url.searchParams.get('limit') || 50), 200));
    let orders = getOrders();
    if (status) orders = orders.filter((o) => String(o.status).toLowerCase() === status);
    return send(res, 200, { count: orders.length, orders: orders.slice(0, limit) });
  }

  if (method === 'PATCH' && pathname.startsWith('/v1/voice-orders/')) {
    if (!requireApiKey(req, res)) return;
    const id = decodeURIComponent(pathname.replace('/v1/voice-orders/', ''));
    try {
      const body = await parseBody(req);
      const nextStatus = String(body?.status || '').trim().toLowerCase();
      if (!['pending', 'accepted', 'rejected', 'sent_to_pos', 'completed'].includes(nextStatus)) {
        return send(res, 400, { error: 'invalid_status' });
      }
      const orders = getOrders();
      const idx = orders.findIndex((o) => o.id === id);
      if (idx === -1) return send(res, 404, { error: 'order_not_found' });
      orders[idx] = { ...orders[idx], status: nextStatus, updatedAt: new Date().toISOString() };
      saveOrders(orders);
      return send(res, 200, orders[idx]);
    } catch (error) {
      return send(res, 400, { error: String(error?.message || 'bad_request') });
    }
  }

  return notFound(res);
});

server.listen(PORT, () => {
  console.log(`[voice-api] running on http://localhost:${PORT}`);
  console.log(`[voice-api] health: http://localhost:${PORT}/health`);
});
