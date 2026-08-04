
import 'server-only';
import { z } from 'zod';

const envSchema = z.object({
  // Server-only secrets
  RESEND_API_KEY: z.string().min(1),
  EMAIL_FROM: z.string().min(1),
  OTP_SECRET: z.string().min(32, 'OTP_SECRET must be at least 32 characters'),
  FIREBASE_SERVICE_ACCOUNT_KEY: z.string().min(1).transform(val => JSON.parse(val)),

  // Public variables
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
  // ... other public firebase vars
});

export const env = envSchema.parse(process.env);
