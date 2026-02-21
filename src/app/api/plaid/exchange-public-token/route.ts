import { NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaid/client';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { public_token, institution_name } = await request.json();
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token,
    });
    
    const { access_token, item_id } = exchangeResponse.data;

    // Save the access token and item ID to Supabase
    // Security Note: In a production app, you should encrypt the access_token before storing it!
    const { error } = await supabase.from('bank_accounts').insert({
      user_id: user.id,
      plaid_access_token: access_token,
      plaid_item_id: item_id,
      institution_name: institution_name || 'Linked Bank Account',
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error exchanging public token:', error);
    return NextResponse.json(
      { error: 'Failed to exchange public token' },
      { status: 500 }
    );
  }
}
