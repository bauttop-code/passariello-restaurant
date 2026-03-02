import { sendJson, withCors } from './_lib/voice-api.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    withCors(res);
    return res.status(204).end();
  }
  return sendJson(res, 200, { ok: true, service: 'voice-order-api', env: 'vercel' });
}

