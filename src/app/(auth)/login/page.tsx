import Link from 'next/link';
import { Home, ArrowLeft, Mail, Lock } from 'lucide-react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const { message } = await searchParams;

  const signIn = async (formData: FormData) => {
    'use server';

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect(`/login?message=${encodeURIComponent(error.message)}`);
    }

    return redirect('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F4F8] to-[#D4E9F0] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Clouds */}
      <div className="absolute top-10 left-10 w-40 h-24 bg-white/60 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute top-20 right-20 w-32 h-20 bg-white/50 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute bottom-20 left-1/4 w-48 h-28 bg-white/40 rounded-full blur-2xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-[#B8D4E3] p-8 relative z-10">
        <Link
          href="/"
          className="absolute left-8 top-8 text-slate-400 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>

        <div className="flex flex-col items-center mb-8 pt-8">
          <div className="bg-[#7EB8A2] p-4 rounded-3xl shadow-lg mb-4">
            <Home className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-[#2D5A4A] tracking-tight">Welcome Back</h1>
          <p className="text-[#5A8A7A] font-medium mt-2">Your cozy room awaits</p>
        </div>

        <form className="flex flex-col gap-4" action={signIn}>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                className="w-full bg-[#F5F9FB] border-2 border-[#B8D4E3] rounded-xl px-4 py-3.5 pl-11 text-[#2D5A4A] font-medium focus:outline-none focus:ring-2 focus:ring-[#7EB8A2]/20 focus:border-[#7EB8A2] transition-all placeholder:text-[#8AB3A8]"
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
                className="w-full bg-[#F5F9FB] border-2 border-[#B8D4E3] rounded-xl px-4 py-3.5 pl-11 text-[#2D5A4A] font-medium focus:outline-none focus:ring-2 focus:ring-[#7EB8A2]/20 focus:border-[#7EB8A2] transition-all placeholder:text-[#8AB3A8]"
                type="password"
                name="password"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button className="mt-4 w-full bg-[#7EB8A2] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#7EB8A2]/20 hover:bg-[#6BA08A] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2">
            Sign In
          </button>
          
          {message && (
            <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl text-center border border-red-200">
              {message}
            </div>
          )}

          <div className="text-center mt-6 text-[#5A8A7A] font-medium">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#7EB8A2] hover:text-[#6BA08A] font-bold hover:underline">
              Create Account
            </Link>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-[#8AB3A8] font-medium">BudgetFriend v1.0 💰</p>
          </div>
        </form>
      </div>
    </div>
  );
}
