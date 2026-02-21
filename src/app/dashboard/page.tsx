import { redirect } from 'next/navigation';
import { Building2, Coins, Flame, Heart, Zap, Banknote, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import PlaidLinkButton from '@/components/plaid/PlaidLinkButton';
import CheckoutButton from '@/components/stripe/CheckoutButton';

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
    .select('subscription_tier, subscription_status')
    .eq('id', user.id)
    .single();

  // Fetch gamification data (pet and city)
  const { data: pet } = await supabase
    .from('pets')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const { data: city } = await supabase
    .from('cities')
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
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b bg-white">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-xl">FinOasis</span>
          {isPremium && (
            <span className="ml-2 bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> PRO
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
            <Coins className="h-4 w-4 text-amber-500" />
            <span className="font-medium text-sm text-slate-700">
              ${city?.funds || '0.00'}
            </span>
          </div>
          <form action={handleSignOut}>
            <button className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* City Overview (Base Builder) */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">
                  {city?.name || 'Your Metropolis'}
                </h2>
                <p className="text-slate-500 flex items-center gap-2">
                  <span>Population: {city?.population || 0}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-rose-500" />
                    Happiness: {city?.happiness || 100}%
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                  Shop
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Build New
                </button>
              </div>
            </div>

            {/* City Visual Representation Placeholder */}
            <div className="aspect-video bg-gradient-to-b from-blue-50 to-emerald-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="text-center z-10">
                <Building2 className="h-16 w-16 text-blue-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">Your city is growing!</p>
                <p className="text-sm text-slate-400">Save more to unlock skyscrapers</p>
              </div>
            </div>
          </div>

          {/* Linked Bank Accounts (Plaid) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Banknote className="h-5 w-5 text-emerald-600" />
                Linked Accounts
              </h3>
              <PlaidLinkButton />
            </div>

            {bankAccounts && bankAccounts.length > 0 ? (
              <div className="space-y-3">
                {bankAccounts.map((account) => (
                  <div key={account.id} className="p-4 border rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{account.institution_name}</p>
                        <p className="text-sm text-slate-500 capitalize">Status: {account.status}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                      Syncing
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 border-2 border-dashed rounded-xl border-slate-200 bg-slate-50">
                <p className="text-slate-600 mb-2">No bank accounts linked yet.</p>
                <p className="text-sm text-slate-500">Link an account to automatically earn XP for saving!</p>
              </div>
            )}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Pet Companion Sidebar (Tamagotchi) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center justify-between">
              <span>Your Companion</span>
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                Stage: {pet?.stage || 'Egg'}
              </span>
            </h3>

            {/* Pet Visual */}
            <div className="aspect-square bg-slate-50 rounded-xl mb-6 flex items-center justify-center border-2 border-slate-100 relative overflow-hidden">
              <div className="animate-bounce z-10">
                {pet?.stage === 'egg' ? (
                  <div className="h-24 w-20 bg-amber-100 rounded-full border-4 border-amber-200 shadow-inner"></div>
                ) : (
                  <Flame className="h-24 w-24 text-amber-500" />
                )}
              </div>
              {/* Decorative background */}
              <div className="absolute bottom-0 w-full h-1/3 bg-emerald-100 rounded-t-full opacity-50"></div>
            </div>

            <div className="text-center mb-6">
              <h4 className="font-bold text-xl text-slate-900">{pet?.name || 'Coin Critter'}</h4>
              <p className="text-sm text-slate-500">Needs a financial win to hatch!</p>
            </div>

            {/* Pet Stats */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Heart className="h-4 w-4 text-rose-500" /> Health
                  </span>
                  <span className="text-slate-900">{pet?.health || 100}/100</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-500 rounded-full" 
                    style={{ width: `${pet?.health || 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Zap className="h-4 w-4 text-amber-500" /> Energy
                  </span>
                  <span className="text-slate-900">{pet?.happiness || 100}/100</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full" 
                    style={{ width: `${pet?.happiness || 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Subscription Banner (Stripe) */}
          {!isPremium && (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                <h3 className="text-lg font-bold">Go Pro</h3>
              </div>
              <p className="text-slate-300 text-sm mb-6">
                Unlock exclusive mythical pets, massive city monuments, and advanced budgeting analytics.
              </p>
              
              <ul className="space-y-2 mb-6 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-400"></div>
                  Unlimited bank accounts
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-400"></div>
                  Custom pet accessories
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-400"></div>
                  Golden city skyscrapers
                </li>
              </ul>

              {/* Replace 'price_YOUR_PRICE_ID' with your actual Stripe Price ID */}
              <CheckoutButton priceId="price_1T3PNkC7Kvo5MPeVkJe6VUzw" />
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
