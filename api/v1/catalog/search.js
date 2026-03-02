import { getSupabaseAdmin } from '../../../_lib/supabase-admin.js';
import { sendJson, withCors } from '../../../_lib/voice-api.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    withCors(res);
    return res.status(204).end();
  }
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'method_not_allowed' });

  try {
    const q = String(req.query?.q || '').trim().toLowerCase();
    const category = String(req.query?.category || '').trim().toLowerCase();
    const limit = Math.max(1, Math.min(Number(req.query?.limit || 200), 500));

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('voice_catalog_snapshot')
      .select('payload')
      .eq('id', 'current')
      .maybeSingle();
    if (error) return sendJson(res, 500, { error: 'catalog_read_failed', detail: error.message });

    let products = Array.isArray(data?.payload?.products) ? data.payload.products : [];
    if (category) {
      products = products.filter((p) => String(p?.category || '').toLowerCase() === category);
    }
    if (q) {
      products = products.filter((p) =>
        `${String(p?.name || '')} ${String(p?.description || '')}`.toLowerCase().includes(q),
      );
    }

    return sendJson(res, 200, { count: products.length, products: products.slice(0, limit) });
  } catch (error) {
    return sendJson(res, 500, { error: 'internal_error', detail: String(error?.message || error) });
  }
}
