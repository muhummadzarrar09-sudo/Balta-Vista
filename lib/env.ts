import { z } from 'zod';

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().optional(),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().regex(/^\d{10,15}$/).optional(),
  NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL: z.url().optional().or(z.literal('')),
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().optional().or(z.literal(''))
});

const serverEnvSchema = publicEnvSchema.extend({
  RECAPTCHA_SECRET_KEY: z.string().optional().or(z.literal('')),
  BOOKING_WEBHOOK_URL: z.url().optional().or(z.literal('')),
  BOOKING_WEBHOOK_SECRET: z.string().min(12).optional().or(z.literal('')),
  ANALYTICS_WEBHOOK_URL: z.url().optional().or(z.literal('')),
  ANALYTICS_WEBHOOK_SECRET: z.string().min(12).optional().or(z.literal(''))
});

export function getPublicEnv() {
  return publicEnvSchema.parse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL: process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  });
}

export function getServerEnv() {
  return serverEnvSchema.parse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL: process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    BOOKING_WEBHOOK_URL: process.env.BOOKING_WEBHOOK_URL,
    BOOKING_WEBHOOK_SECRET: process.env.BOOKING_WEBHOOK_SECRET,
    ANALYTICS_WEBHOOK_URL: process.env.ANALYTICS_WEBHOOK_URL,
    ANALYTICS_WEBHOOK_SECRET: process.env.ANALYTICS_WEBHOOK_SECRET
  });
}

export function getWhatsAppNumber() {
  const env = getPublicEnv();
  return env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
}

export function getSiteUrl() {
  const env = getPublicEnv();
  return env.NEXT_PUBLIC_SITE_URL || '';
}
