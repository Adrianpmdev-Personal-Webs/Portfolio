import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Proxy serverless para registrar eventos del portfolio.
 */

const ALLOWED_ORIGINS = ['https://adrianpmdev-portfolio.vercel.app'];

const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT;
}

type LogEventType = 'desktop' | 'cv' | 'linkedin';

const EVENT_CONFIG: Record<LogEventType, { title: string; color: number; envVar: string }> = {
  desktop: {
    title: '🖥️ Nuevo acceso al escritorio',
    color: 0x5865f2,
    envVar: 'DISCORD_WEBHOOK_URL',
  },
  cv: {
    title: '📄 CV descargado',
    color: 0x57f287,
    envVar: 'DISCORD_WEBHOOK_CV_URL',
  },
  linkedin: {
    title: '🔗 Clic en LinkedIn',
    color: 0x0a66c2,
    envVar: 'DISCORD_WEBHOOK_LINKEDIN_URL',
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const origin = req.headers.origin ?? '';
    if (!ALLOWED_ORIGINS.includes(origin)) {
      res.status(403).json({ error: 'Origin not allowed' });
      return;
    }

    const forwardedFor = req.headers['x-forwarded-for'];
    const ip =
      (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)?.split(',')[0]?.trim() ??
      'unknown';
    if (isRateLimited(ip)) {
      res.status(429).json({ error: 'Too many requests' });
      return;
    }

    const { event, userName, device, platform, lang } = req.body ?? {};
    const config = EVENT_CONFIG[event as LogEventType];
    if (!config) {
      res.status(400).json({ error: 'Invalid event type' });
      return;
    }

    const webhookUrl = process.env[config.envVar];
    if (!webhookUrl) {
      res.status(500).json({ error: 'Webhook not configured' });
      return;
    }

    const timestamp = new Date().toLocaleString('es-ES', {
      timeZone: 'Europe/Madrid',
      timeZoneName: 'short',
    });

    const embed = {
      title: config.title,
      color: config.color,
      fields: [
        {
          name: '👤 Usuario',
          value: typeof userName === 'string' ? userName.slice(0, 40) : 'desconocido',
          inline: true,
        },
        {
          name: '📱 Dispositivo',
          value: typeof device === 'string' ? device : 'desconocido',
          inline: true,
        },
        {
          name: '💻 Plataforma',
          value: typeof platform === 'string' ? platform : 'desconocido',
          inline: true,
        },
        {
          name: '🌐 Idioma',
          value: typeof lang === 'string' ? lang : 'desconocido',
          inline: true,
        },
      ],
      footer: { text: timestamp },
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });
    res.status(204).end();
  } catch (err) {
    console.error('log-access error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
}