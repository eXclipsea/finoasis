import { NextResponse } from 'next/server';
import { CountryCode, Products } from 'plaid';
import { plaidClient } from '@/lib/plaid/client';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const request = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: user.id,
      },
      client_name: 'FinOasis',
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
      webhook: process.env.NEXT_PUBLIC_SITE_URL + '/api/plaid/webhook',
      redirect_uri: process.env.NEXT_PUBLIC_SITE_URL,
    };

    const response = await plaidClient.linkTokenCreate(request);
    
    return NextResponse.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error('Error creating link token:', error);
    return NextResponse.json(
      { error: 'Failed to create link token' },
      { status: 500 }
    );
  }
}
