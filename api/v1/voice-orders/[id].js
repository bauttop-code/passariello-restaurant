import { getSupabaseAdmin } from '../../_lib/supabase-admin.js';
import { readJsonBody, requireApiKey, sendJson, withCors } from '../../_lib/voice-api.js';

const ALLOWED_STATUS = ['pending', 'accepted', 'rejected', 'sent_to_pos', 'completed'];

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    withCors(res);
    return res.status(204).end();
  }
  if (req.method !== 'PATCH') return sendJson(res, 405, { error: 'method_not_allowed' });
  if (!requireApiKey(req, res)) return;

  try {
    const id = String(req.query?.id || '').trim();
    if (!id) return sendJson(res, 400, { error: 'order_id_required' });

    const body = await readJsonBody(req);
    const status = String(body?.status || '').trim().toLowerCase();
    if (!ALLOWED_STATUS.includes(status)) return sendJson(res, 400, { error: 'invalid_status' });

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('voice_orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) return sendJson(res, 500, { error: 'order_update_failed', detail: error.message });
    return sendJson(res, 200, data);
  } catch (error) {
    return sendJson(res, 400, { error: 'invalid_request', detail: String(error?.message || error) });
  }
}
