import { getSupabaseAdmin } from '../../_lib/supabase-admin.js';
import {
  newVoiceOrderId,
  readJsonBody,
  requireApiKey,
  sendJson,
  validateVoiceOrderItems,
  withCors,
} from '../../_lib/voice-api.js';

async function getCatalogProducts(supabase) {
  const { data, error } = await supabase
    .from('voice_catalog_snapshot')
    .select('payload')
    .eq('id', 'current')
    .maybeSingle();
  if (error) throw new Error(`catalog_read_failed:${error.message}`);
  return Array.isArray(data?.payload?.products) ? data.payload.products : [];
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    withCors(res);
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    try {
      const supabase = getSupabaseAdmin();
      const status = String(req.query?.status || '').trim().toLowerCase();
      const limit = Math.max(1, Math.min(Number(req.query?.limit || 50), 200));

      let query = supabase
        .from('voice_orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (status) query = query.eq('status', status);

      const { data, error } = await query;
      if (error) return sendJson(res, 500, { error: 'orders_read_failed', detail: error.message });
      return sendJson(res, 200, { count: data?.length || 0, orders: data || [] });
    } catch (error) {
      return sendJson(res, 500, { error: 'internal_error', detail: String(error?.message || error) });
    }
  }

  if (req.method === 'POST') {
    if (!requireApiKey(req, res)) return;

    try {
      const body = await readJsonBody(req);
      const supabase = getSupabaseAdmin();
      const products = await getCatalogProducts(supabase);
      const validation = validateVoiceOrderItems(body?.items, products);
      if (!validation.ok) return sendJson(res, 400, { error: validation.error });

      const now = new Date().toISOString();
      const order = {
        id: newVoiceOrderId(),
        created_at: now,
        updated_at: now,
        status: 'pending',
        source: String(body?.source || 'voice-agent'),
        external_ref: body?.externalRef || null,
        customer: body?.customer || null,
        notes: String(body?.notes || ''),
        items: body.items,
      };

      const { data, error } = await supabase.from('voice_orders').insert(order).select('*').single();
      if (error) return sendJson(res, 500, { error: 'order_create_failed', detail: error.message });
      return sendJson(res, 201, data);
    } catch (error) {
      return sendJson(res, 400, { error: 'invalid_request', detail: String(error?.message || error) });
    }
  }

  return sendJson(res, 405, { error: 'method_not_allowed' });
}
