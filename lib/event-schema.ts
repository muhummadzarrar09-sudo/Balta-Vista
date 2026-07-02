import { z } from 'zod';

export const eventSchema = z.object({
  name: z.enum([
    'cta_click',
    'whatsapp_click',
    'reviews_click',
    'booking_step_view',
    'booking_submit_success',
    'ambient_toggle'
  ]),
  path: z.string().min(1).max(180),
  label: z.string().max(120).optional(),
  value: z.string().max(120).optional(),
  meta: z.record(z.string(), z.string().max(180)).optional(),
  timestamp: z.string().datetime().optional()
});

export type TrackingEvent = z.infer<typeof eventSchema>;
