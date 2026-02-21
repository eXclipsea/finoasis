import Link from 'next/link';
import { ArrowRight, Home, Coins, Leaf, Sprout, PawPrint } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-slate-800 selection:bg-emerald-200">
      {/* Navigation */}
      <header className="px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-emerald-50/50">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-2 rounded-xl shadow-sm">
            <Home className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">FinOasis</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
            Log in
          </Link>
          <Link 
            href="/signup" 
            className="text-sm font-bold bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
          >
            Start Playing
          </Link>
        </nav>
      </header>

      <main className="flex-1 overflow-hidden">
        {/* Hero Section */}
        <section className="relative px-6 pt-32 pb-24 md:pt-40 md:pb-32 flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Decorative background blobs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-100/50 rounded-full blur-3xl -z-10 opacity-60"></div>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-100/40 rounded-full blur-3xl -z-10"></div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-sm text-emerald-700 text-sm font-bold mb-8 animate-fade-in-up">
            <Sprout className="h-4 w-4" />
            <span>The Cozy Financial Game for Students</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[1.1]">
            Grow your savings. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
              Decorate your home.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl font-medium leading-relaxed">
            Ditch the boring spreadsheets. Turn your budget into a beautiful virtual home, grow a lush garden, and raise a pet companion.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
            <Link 
              href="/signup" 
              className="group flex items-center justify-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 hover:-translate-y-1 w-full sm:w-auto"
            >
              Enter Your Oasis
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-24 bg-white relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Make money fun.</h2>
              <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium">Build healthy financial habits while creating your perfect virtual sanctuary.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {/* Feature 1 */}
              <div className="bg-[#FDFBF7] p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-amber-200 transition-all duration-300 group">
                <div className="h-14 w-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Home className="h-7 w-7 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">Decorate Your Space</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Earn coins by hitting your budget goals. Spend them on aesthetic furniture to customize your 2.5D isometric home and yard.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#FDFBF7] p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 group">
                <div className="h-14 w-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Leaf className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">Grow a Garden</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Transfer money into your savings account to plant seeds. Watch them grow into beautiful flora as your real-life wealth increases.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#FDFBF7] p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group">
                <div className="h-14 w-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <PawPrint className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">Raise a Companion</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Your very own pet follows you around your yard. Avoid bad spending habits to keep them happy, and teach them tricks as you level up.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-slate-800 p-2 rounded-xl">
              <Home className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="font-bold text-2xl text-white tracking-tight">FinOasis</span>
          </div>
          <p className="font-medium text-slate-500">© {new Date().getFullYear()} FinOasis. Plant the seeds of wealth.</p>
        </div>
      </footer>
    </div>
  );
}
