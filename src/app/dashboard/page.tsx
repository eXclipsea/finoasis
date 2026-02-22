import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import RoomView from '@/components/game/RoomView';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // Fetch user profile for subscription status
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier, subscription_status, level')
    .eq('id', user.id)
    .single();

  // Fetch gamification data (pet and yard)
  const { data: pet } = await supabase
    .from('pets')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const { data: yard } = await supabase
    .from('yards')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Fetch linked bank accounts
  const { data: bankAccounts } = await supabase
    .from('bank_accounts')
    .select('*')
    .eq('user_id', user.id);

  return (
    <RoomView 
      yardId={yard?.id || ''} 
      carrots={yard?.coins || 0} 
      pet={pet}
      profile={profile}
      bankAccounts={bankAccounts || []}
      user={user}
    />
  );
}
