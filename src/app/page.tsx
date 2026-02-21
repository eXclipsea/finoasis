import Link from 'next/link';
import { ArrowRight, Building2, Coins, Target, TrendingUp, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="px-6 py-4 flex items-center justify-between border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-xl">FinOasis</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Log in
          </Link>
          <Link 
            href="/signup" 
            className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            Start Playing
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-24 md:py-32 flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
            <Coins className="h-4 w-4" />
            <span>The #1 Gamified Student Budgeting App</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
            Build your city. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              Grow your savings.
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl">
            Stop tracking expenses on boring spreadsheets. Turn your budget into a thriving oasis, adopt a mythical savings pet, and level up your financial life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link 
              href="/signup" 
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-transform hover:scale-105"
            >
              Start Your City Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-6 py-20 bg-slate-50 border-t">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How it works</h2>
              <p className="text-slate-600 text-lg">Managing money doesn't have to be a chore.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Build Your Oasis</h3>
                <p className="text-slate-600">
                  Your real-life savings balance determines the size of your city. Hit your weekly budget goals to unlock new buildings, cafes, and monuments.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                  <Target className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Raise a Coin Critter</h3>
                <p className="text-slate-600">
                  Adopt a virtual pet that thrives when you save. Log transactions and avoid overspending to keep them happy, and unlock cool hats and accessories!
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                  <ShieldCheck className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Defeat "Boss" Expenses</h3>
                <p className="text-slate-600">
                  Big upcoming expenses like textbooks or spring break are "Boss Fights". Save up ahead of time to deal damage and defeat them stress-free.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-slate-300" />
            <span className="font-bold text-xl text-slate-200">FinOasis</span>
          </div>
          <p>© {new Date().getFullYear()} FinOasis. Built for students.</p>
        </div>
      </footer>
    </div>
  );
}
