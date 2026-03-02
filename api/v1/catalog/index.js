import { getSupabaseAdmin } from '../../_lib/supabase-admin.js';
import { sendJson, withCors } from '../../_lib/voice-api.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    withCors(res);
    return res.status(204).end();
  }
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'method_not_allowed' });

  try {
    const includeOptions = String(req.query?.includeOptions || '1') !== '0';
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('voice_catalog_snapshot')
      .select('*')
      .eq('id', 'current')
      .maybeSingle();

    if (error) return sendJson(res, 500, { error: 'catalog_read_failed', detail: error.message });
    if (!data) return sendJson(res, 200, { syncedAt: null, source: null, version: null, totalProducts: 0, products: [] });

    const rawProducts = Array.isArray(data?.payload?.products) ? data.payload.products : [];
    const products = includeOptions
      ? rawProducts
      : rawProducts.map((p) => ({ ...p, customizationOptions: [] }));

    return sendJson(res, 200, {
      syncedAt: data.synced_at,
      source: data.source,
      version: data.version,
      totalProducts: products.length,
      products,
    });
  } catch (error) {
    return sendJson(res, 500, { error: 'internal_error', detail: String(error?.message || error) });
  }
}
