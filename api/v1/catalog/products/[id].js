import { getSupabaseAdmin } from '../../../../_lib/supabase-admin.js';
import { sendJson, withCors } from '../../../../_lib/voice-api.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    withCors(res);
    return res.status(204).end();
  }
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'method_not_allowed' });

  try {
    const productId = String(req.query?.id || '').trim();
    if (!productId) return sendJson(res, 400, { error: 'product_id_required' });

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('voice_catalog_snapshot')
      .select('payload')
      .eq('id', 'current')
      .maybeSingle();
    if (error) return sendJson(res, 500, { error: 'catalog_read_failed', detail: error.message });

    const products = Array.isArray(data?.payload?.products) ? data.payload.products : [];
    const product = products.find((p) => String(p?.id || '') === productId);
    if (!product) return sendJson(res, 404, { error: 'product_not_found' });

    return sendJson(res, 200, product);
  } catch (error) {
    return sendJson(res, 500, { error: 'internal_error', detail: String(error?.message || error) });
  }
}
