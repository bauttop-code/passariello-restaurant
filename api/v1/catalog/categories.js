import { getSupabaseAdmin } from '../../../_lib/supabase-admin.js';
import { sendJson, withCors } from '../../../_lib/voice-api.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    withCors(res);
    return res.status(204).end();
  }
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'method_not_allowed' });

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('voice_catalog_snapshot')
      .select('payload')
      .eq('id', 'current')
      .maybeSingle();
    if (error) return sendJson(res, 500, { error: 'catalog_read_failed', detail: error.message });

    const products = Array.isArray(data?.payload?.products) ? data.payload.products : [];
    const map = new Map();
    for (const p of products) {
      const category = String(p?.category || 'uncategorized');
      map.set(category, (map.get(category) || 0) + 1);
    }

    const categories = [...map.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([category, count]) => ({ category, count }));

    return sendJson(res, 200, { totalCategories: categories.length, categories });
  } catch (error) {
    return sendJson(res, 500, { error: 'internal_error', detail: String(error?.message || error) });
  }
}
