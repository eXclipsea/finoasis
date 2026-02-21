import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const supabase = await createClient();

  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription;
    
    // Retrieve the customer to get the supabase user ID
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    const userId = (customer as Stripe.Customer).metadata.supabase_user_id;

    if (userId) {
      // Update user profile with subscription status
      await supabase
        .from('profiles')
        .update({
          subscription_status: subscription.status,
          subscription_tier: 'premium', // or derive from product ID
        })
        .eq('id', userId);
    }
  } else if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    const userId = (customer as Stripe.Customer).metadata.supabase_user_id;

    if (userId) {
      await supabase
        .from('profiles')
        .update({
          subscription_status: 'canceled',
          subscription_tier: 'free',
        })
        .eq('id', userId);
    }
  }

  return new NextResponse('Webhook handled', { status: 200 });
}
