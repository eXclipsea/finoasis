import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiVersion: '2025-02-24.acacia' as any,
  appInfo: {
    name: 'FinOasis',
    version: '1.0.0',
  },
});
