import { redirect } from 'next/navigation';
import { Home, Coins, Flame, Heart, Zap, Banknote, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import PlaidLinkButton from '@/components/plaid/PlaidLinkButton';
import CheckoutButton from '@/components/stripe/CheckoutButton';
import YardView from '@/components/game/YardView';

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

  const handleSignOut = async () => {
    'use server';
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/');
  };

  const isPremium = profile?.subscription_tier === 'premium';

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-emerald-50 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-1.5 rounded-lg shadow-sm">
            <Home className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">FinOasis</span>
          {isPremium && (
            <span className="ml-2 bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm">
              <Sparkles className="h-3 w-3" /> PRO
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full border border-amber-100 shadow-sm">
            <Coins className="h-4 w-4 text-amber-500" />
            <span className="font-bold text-sm text-amber-900">
              {yard?.coins || '0'}
            </span>
          </div>
          <form action={handleSignOut}>
            <button className="text-sm font-semibold text-slate-500 hover:text-emerald-600 transition-colors">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Yard Overview (Home Builder) */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-1">
                  {yard?.name || 'Your Cozy Oasis'}
                </h2>
                <p className="text-slate-500 font-medium flex items-center gap-2">
                  <span>Level {profile?.level || 1}</span>
                </p>
              </div>
            </div>

            {/* 2.5D Isometric Yard Component */}
            <YardView yardId={yard?.id || ''} coins={yard?.coins || 0} pet={pet} />
          </div>

          {/* Linked Bank Accounts (Plaid) */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Banknote className="h-6 w-6 text-emerald-500" />
                Linked Accounts
              </h3>
              <PlaidLinkButton />
            </div>

            {bankAccounts && bankAccounts.length > 0 ? (
              <div className="space-y-4">
                {bankAccounts.map((account) => (
                  <div key={account.id} className="p-5 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-emerald-200 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Home className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-lg">{account.institution_name}</p>
                        <p className="text-sm font-medium text-slate-500 capitalize">Status: {account.status}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full">
                      Syncing Daily
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-10 border-2 border-dashed rounded-3xl border-slate-200 bg-slate-50">
                <p className="text-slate-600 font-medium mb-2">No bank accounts linked yet.</p>
                <p className="text-sm text-slate-500">Link an account to automatically earn coins for saving and fertilize your garden!</p>
              </div>
            )}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Pet Companion Sidebar (Tamagotchi) */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center justify-between">
              <span>Your Companion</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
                Stage: {pet?.stage || 'Egg'}
              </span>
            </h3>

            {/* Pet Visual */}
            <div className="aspect-square bg-[#FDFBF7] rounded-3xl mb-8 flex items-center justify-center border-2 border-slate-100 relative overflow-hidden group">
              <div className="animate-bounce z-10 group-hover:-translate-y-4 transition-transform duration-300">
                {pet?.stage === 'egg' ? (
                  <div className="h-28 w-24 bg-gradient-to-br from-amber-100 to-amber-200 rounded-[50%] border-4 border-amber-300 shadow-inner"></div>
                ) : (
                  <Flame className="h-28 w-28 text-amber-500 drop-shadow-md" />
                )}
              </div>
              {/* Decorative background */}
              <div className="absolute bottom-0 w-full h-1/4 bg-emerald-100 rounded-t-full opacity-50 blur-sm"></div>
            </div>

            <div className="text-center mb-8">
              <h4 className="font-black text-2xl text-slate-900 mb-1">{pet?.name || 'Coin Critter'}</h4>
              <p className="text-sm font-medium text-slate-500">Deposit savings to hatch!</p>
              
              {/* Interactive Pet Commands (MVP Placeholder) */}
              <div className="flex justify-center gap-2 mt-4">
                <button className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-emerald-100 hover:text-emerald-700 transition-colors">
                  Pet
                </button>
                <button className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors">
                  Feed
                </button>
              </div>
            </div>

            {/* Pet Stats */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Heart className="h-4 w-4 text-rose-500" /> Health
                  </span>
                  <span className="text-slate-900">{pet?.health || 100}/100</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-400 to-rose-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${pet?.health || 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-amber-500" /> Energy
                  </span>
                  <span className="text-slate-900">{pet?.happiness || 100}/100</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${pet?.happiness || 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Subscription Banner (Stripe) */}
          {!isPremium && (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl shadow-xl border border-slate-700 text-white relative overflow-hidden">
              {/* Decorative premium glare */}
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-32 h-32 bg-amber-500 rounded-full blur-3xl opacity-20"></div>
              
              <div className="flex items-center gap-2 mb-3 relative z-10">
                <Sparkles className="h-6 w-6 text-amber-400" />
                <h3 className="text-2xl font-black tracking-tight">Go Pro</h3>
              </div>
              <p className="text-slate-300 text-sm mb-8 font-medium leading-relaxed relative z-10">
                Unlock exclusive mythical pets, massive yard expansions, and beautiful aesthetic furniture sets.
              </p>
              
              <ul className="space-y-3 mb-8 text-sm font-medium text-slate-300 relative z-10">
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                  Unlimited bank accounts
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                  Custom pet accessories
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                  Zen Garden furniture pack
                </li>
              </ul>

              {/* Replace 'price_YOUR_PRICE_ID' with your actual Stripe Price ID */}
              <div className="relative z-10">
                <CheckoutButton priceId="price_1T3PNkC7Kvo5MPeVkJe6VUzw" />
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
