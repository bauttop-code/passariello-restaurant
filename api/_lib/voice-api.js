const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,x-api-key',
};

export function withCors(res) {
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
}

export function sendJson(res, status, payload) {
  withCors(res);
  res.status(status).json(payload);
}

export async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string' && req.body.trim()) return JSON.parse(req.body);
  return {};
}

export function getApiKey(req) {
  const header = req.headers['x-api-key'];
  if (Array.isArray(header)) return header[0] || '';
  return String(header || '');
}

export function requireApiKey(req, res) {
  const expected = process.env.VOICE_API_KEY || '';
  if (!expected) return true;
  const incoming = getApiKey(req);
  if (incoming === expected) return true;
  sendJson(res, 401, { error: 'unauthorized' });
  return false;
}

export function normalizeProduct(product) {
  return {
    id: product?.id ?? '',
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price ?? '',
    priceRange: product?.priceRange ?? '',
    image: product?.image ?? '',
    category: product?.category ?? 'uncategorized',
    customizationOptions: Array.isArray(product?.customizationOptions)
      ? product.customizationOptions
      : [],
  };
}

export function buildCatalogIndex(products) {
  const productById = new Map();
  const optionByProduct = new Map();

  for (const product of products || []) {
    productById.set(product.id, product);
    const options = new Map();

    for (const group of product.customizationOptions || []) {
      for (const option of group.options || []) {
        options.set(`${group.id}:${option.id}`, { groupId: group.id, optionId: option.id });
      }
    }

    optionByProduct.set(product.id, options);
  }

  return { productById, optionByProduct };
}

export function validateVoiceOrderItems(items, products) {
  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, error: 'items_required' };
  }

  const { productById, optionByProduct } = buildCatalogIndex(products || []);

  for (const item of items) {
    const productId = String(item?.productId || '');
    const quantity = Number(item?.quantity);

    if (!productById.has(productId)) {
      return { ok: false, error: `unknown_product:${productId}` };
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      return { ok: false, error: `invalid_quantity:${productId}` };
    }

    const selections = Array.isArray(item?.selections) ? item.selections : [];
    const knownOptions = optionByProduct.get(productId) || new Map();

    for (const sel of selections) {
      const groupId = String(sel?.groupId || '');
      const optionId = String(sel?.optionId || '');
      if (!groupId || !optionId) continue;
      if (!knownOptions.has(`${groupId}:${optionId}`)) {
        return { ok: false, error: `unknown_option:${productId}:${groupId}:${optionId}` };
      }
    }
  }

  return { ok: true };
}

export function newVoiceOrderId() {
  return `voice_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

