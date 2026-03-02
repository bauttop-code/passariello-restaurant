import { getSupabaseAdmin } from '../../../_lib/supabase-admin.js';
import {
  normalizeProduct,
  readJsonBody,
  requireApiKey,
  sendJson,
  withCors,
} from '../../../_lib/voice-api.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    withCors(res);
    return res.status(204).end();
  }
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'method_not_allowed' });
  if (!requireApiKey(req, res)) return;

  try {
    const body = await readJsonBody(req);
    const incoming = Array.isArray(body?.products) ? body.products : [];
    const products = incoming.map(normalizeProduct).filter((p) => p.id && p.name);
    const version = String(body?.version || Date.now());
    const source = String(body?.source || 'website');

    const supabase = getSupabaseAdmin();
    const payload = {
      id: 'current',
      synced_at: new Date().toISOString(),
      source,
      version,
      payload: { products },
    };

    const { error } = await supabase.from('voice_catalog_snapshot').upsert(payload);
    if (error) return sendJson(res, 500, { error: 'catalog_sync_failed', detail: error.message });

    return sendJson(res, 200, {
      ok: true,
      syncedAt: payload.synced_at,
      source,
      version,
      totalProducts: products.length,
    });
  } catch (error) {
    return sendJson(res, 400, { error: 'invalid_request', detail: String(error?.message || error) });
  }
}
