import { z } from 'zod';

export const bookingSchema = z.object({
  checkIn: z.string().min(1, 'Select a check-in date'),
  checkOut: z.string().min(1, 'Select a check-out date'),
  room: z.enum(['single', 'double', 'suite'], { message: 'Choose a room tier' }),
  name: z.string().trim().min(2, 'Your name is required').max(80),
  email: z.email('Enter a valid email').max(120),
  phone: z.string().trim().min(7, 'Enter a reachable phone number').max(30),
  guests: z.coerce.number().int().min(1).max(8),
  arrivalWindow: z.enum(['morning', 'afternoon', 'evening', 'unsure']).optional().default('unsure'),
  message: z.string().trim().max(500).optional().default(''),
  companyWebsite: z.string().max(0).optional().or(z.literal(''))
}).refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
  message: 'Check-out must be after check-in',
  path: ['checkOut']
}).refine((data) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(data.checkIn) >= today;
}, {
  message: 'Check-in cannot be in the past',
  path: ['checkIn']
});

export type BookingInput = z.output<typeof bookingSchema>;
export type BookingFormValues = z.input<typeof bookingSchema>;
