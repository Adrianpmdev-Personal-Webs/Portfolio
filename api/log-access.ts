/**
 * log-access
 *
 * Vercel serverless function that receives portfolio events, checks origin and
 * rate limit, validates the payload and forwards it to Discord webhooks.
 *
 * @author adrianpmdev
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const PRODUCTION_ORIGIN = 'https://adrianpmdev-portfolio.vercel.app';

const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;
const DISCORD_TIMEOUT_MS = 5_000;
const MAX_USER_NAME_LENGTH = 40;
const hits = new Map<string, number[]>();

const DEVICES = ['movil', 'tablet', 'ordenador'] as const;
const PLATFORMS = ['iPhone', 'iPad', 'Android', 'Windows', 'macOS', 'Linux', 'ChromeOS', 'Desconocido'] as const;
const LANGUAGES = ['es', 'en', 'fr'] as const;

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

function isAllowedOrigin(origin: string): boolean {
  if (origin === PRODUCTION_ORIGIN) return true;
  if (process.env.VERCEL_URL && origin === `https://${process.env.VERCEL_URL}`) return true;
  return process.env.VERCEL_ENV === 'development' && /^http:\/\/localhost:\d+$/.test(origin);
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT;
}

function oneOf<T extends string>(allowed: readonly T[], value: unknown): T | 'desconocido' {
  return allowed.includes(value as T) ? (value as T) : 'desconocido';
}

function sanitizeUserName(value: unknown): string {
  if (typeof value !== 'string') return 'desconocido';
  const clean = value.replace(/[\u0000-\u001f`*_~|>@]/g, '').trim().slice(0, MAX_USER_NAME_LENGTH);
  return clean || 'desconocido';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    if (!isAllowedOrigin(req.headers.origin ?? '')) {
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
        { name: '👤 Usuario', value: sanitizeUserName(userName), inline: true },
        { name: '📱 Dispositivo', value: oneOf(DEVICES, device), inline: true },
        { name: '💻 Plataforma', value: oneOf(PLATFORMS, platform), inline: true },
        { name: '🌐 Idioma', value: oneOf(LANGUAGES, lang), inline: true },
      ],
      footer: { text: timestamp },
    };

    const discordResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed], allowed_mentions: { parse: [] } }),
      signal: AbortSignal.timeout(DISCORD_TIMEOUT_MS),
    });

    if (!discordResponse.ok) {
      console.error('log-access: Discord responded with', discordResponse.status);
      res.status(502).json({ error: 'Upstream error' });
      return;
    }

    res.status(204).end();
  } catch (err) {
    console.error('log-access error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
}
