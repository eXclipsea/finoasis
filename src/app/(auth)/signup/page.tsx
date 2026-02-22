import Link from 'next/link';
import { Sprout, ArrowLeft, Mail, Lock } from 'lucide-react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const { message } = await searchParams;

  const signUp = async (formData: FormData) => {
    'use server';

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = await createClient();

    // 1. Attempt to sign up
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      return redirect('/signup?message=Could not create account');
    }

    // 2. If session exists immediately (Email Confirmations DISABLED in Supabase), redirect to dashboard
    if (data.session) {
      return redirect('/dashboard');
    }

    // 3. Otherwise, if Email Confirmations are ENABLED, ask user to check email
    return redirect('/signup?message=Check email to continue');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 relative z-10 animate-fade-in-up">
        <Link
          href="/"
          className="absolute left-8 top-8 text-slate-400 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>

        <div className="flex flex-col items-center mb-8 pt-8">
          <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-3 rounded-2xl shadow-lg mb-4">
            <Sprout className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Start Your Journey</h1>
          <p className="text-slate-500 font-medium mt-2">Join FinOasis for free</p>
        </div>

        <form className="flex flex-col gap-4" action={signUp}>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 pl-11 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                name="email"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 pl-11 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                type="password"
                name="password"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          <button className="mt-4 w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] hover:shadow-emerald-500/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2">
            Create Account
          </button>
          
          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium text-center border ${
              message.includes('Check email') 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                : 'bg-red-50 text-red-600 border-red-100'
            }`}>
              {message}
            </div>
          )}

          <div className="text-center mt-6 text-slate-500 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
