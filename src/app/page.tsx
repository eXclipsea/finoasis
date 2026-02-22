import Link from 'next/link';
import { ArrowRight, Home, Sparkles, Heart, Wallet } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#E8F4F8] to-[#D4E9F0] text-slate-800">
      {/* Navigation */}
      <header className="px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-[#B8D4E3]">
        <div className="flex items-center gap-3">
          <div className="bg-[#7EB8A2] p-2.5 rounded-2xl shadow-sm">
            <Home className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-[#2D5A4A]">BudgetFriend</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-semibold text-[#5A8A7A] hover:text-[#2D5A4A] transition-colors">
            Log in
          </Link>
          <Link 
            href="/signup" 
            className="text-sm font-bold bg-[#7EB8A2] text-white px-6 py-3 rounded-full hover:bg-[#6BA08A] hover:shadow-lg hover:shadow-[#7EB8A2]/20 transition-all duration-300"
          >
            Get Started
          </Link>
        </nav>
      </header>

      <main className="flex-1 overflow-hidden">
        {/* Hero Section */}
        <section className="relative px-6 pt-20 pb-16 md:pt-28 md:pb-24 flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Decorative clouds */}
          <div className="absolute top-20 left-10 w-32 h-20 bg-white/80 rounded-full blur-xl -z-10"></div>
          <div className="absolute top-32 right-20 w-40 h-24 bg-white/60 rounded-full blur-xl -z-10"></div>
          <div className="absolute top-10 left-1/3 w-24 h-16 bg-white/70 rounded-full blur-lg -z-10"></div>
          
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border-2 border-[#B8D4E3] shadow-sm text-[#5A8A7A] text-sm font-bold mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Your cozy financial companion</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#2D5A4A] mb-6 leading-[1.15]">
            Make budgeting <br />
            <span className="text-[#7EB8A2]">adorable.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#5A8A7A] mb-10 max-w-xl font-medium leading-relaxed">
            Connect your bank, track your spending, and decorate your own cozy room. BudgetFriend makes saving money feel like a warm hug.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
            <Link 
              href="/signup" 
              className="group flex items-center justify-center gap-2 bg-[#E8A87C] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#D9976B] shadow-xl shadow-[#E8A87C]/20 transition-all hover:scale-105 w-full sm:w-auto"
            >
              Start Your Journey
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Room preview illustration with custom SVG */}
          <div className="mt-16 relative">
            <div className="w-80 h-80 md:w-96 md:h-96 bg-white/50 rounded-3xl border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Background */}
                <rect x="20" y="20" width="160" height="160" rx="20" fill="#FDF8F3"/>
                
                {/* Floor */}
                <path d="M20 120 L100 180 L180 120 L100 60 Z" fill="#E6D5C3"/>
                <path d="M20 120 L100 180 L180 120" stroke="#D4C4B0" strokeWidth="2" fill="none"/>
                
                {/* Window */}
                <path d="M70 40 Q70 20 100 20 Q130 20 130 40 L130 70 L70 70 Z" fill="#E8F4F8" stroke="#B8D4E3" strokeWidth="3"/>
                <line x1="100" y1="20" x2="100" y2="70" stroke="#B8D4E3" strokeWidth="2"/>
                <line x1="70" y1="45" x2="130" y2="45" stroke="#B8D4E3" strokeWidth="2"/>
                {/* Cloud in window */}
                <circle cx="90" cy="38" r="6" fill="white"/>
                <circle cx="100" cy="32" r="8" fill="white"/>
                <circle cx="110" cy="38" r="6" fill="white"/>
                
                {/* Plant */}
                <ellipse cx="150" cy="95" rx="8" ry="12" fill="#7EB8A2"/>
                <ellipse cx="142" cy="100" rx="5" ry="8" fill="#6BA08A"/>
                <ellipse cx="158" cy="100" rx="5" ry="8" fill="#8ABFA8"/>
                <path d="M142 110 L145 125 L155 125 L158 110 Z" fill="#D9976B"/>
                
                {/* Chair */}
                <ellipse cx="60" cy="115" rx="15" ry="10" fill="#A67B5B"/>
                <ellipse cx="60" cy="110" rx="12" ry="8" fill="#C9A77D"/>
                <path d="M48 105 Q45 90 60 88 Q75 90 72 105" fill="#8B6914"/>
                
                {/* Rug */}
                <ellipse cx="100" cy="135" rx="30" ry="15" fill="#E8A87C" opacity="0.7"/>
                <ellipse cx="100" cy="135" rx="20" ry="10" fill="#F0C4A8" opacity="0.5"/>
                
                {/* Pet character */}
                <ellipse cx="100" cy="125" rx="12" ry="10" fill="#A67B5B"/>
                <circle cx="100" cy="110" r="10" fill="#C9A77D"/>
                <ellipse cx="90" cy="105" rx="3" ry="5" fill="#A67B5B"/>
                <ellipse cx="110" cy="105" rx="3" ry="5" fill="#A67B5B"/>
                <circle cx="97" cy="108" r="2" fill="#3D2914"/>
                <circle cx="103" cy="108" r="2" fill="#3D2914"/>
              </svg>
            </div>
            {/* Floating decorative elements - SVG instead of emoji */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#7EB8A2]/20 rounded-full flex items-center justify-center animate-bounce">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="#E8A87C"/>
                <text x="12" y="16" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">$</text>
              </svg>
            </div>
            <div className="absolute -bottom-2 -left-6 w-14 h-14 bg-[#E8A87C]/20 rounded-full flex items-center justify-center animate-pulse">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M12 2C7 8 7 14 12 22C17 14 17 8 12 2Z" fill="#7EB8A2"/>
              </svg>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-20 bg-white/60 relative">
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-[#2D5A4A] mb-4">How it works</h2>
              <p className="text-[#5A8A7A] text-lg max-w-xl mx-auto font-medium">Three simple steps to make your finances fun.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-[#F5F9FB] p-8 rounded-3xl border-2 border-[#E8F4F8] hover:border-[#7EB8A2] hover:shadow-lg transition-all duration-300 group text-center">
                <div className="h-16 w-16 bg-[#7EB8A2]/20 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                  <Wallet className="h-8 w-8 text-[#7EB8A2]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#2D5A4A]">1. Connect</h3>
                <p className="text-[#5A8A7A] font-medium">
                  Link your bank account securely with Plaid. We only read your transactions—no funny business.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#F5F9FB] p-8 rounded-3xl border-2 border-[#E8F4F8] hover:border-[#E8A87C] hover:shadow-lg transition-all duration-300 group text-center">
                <div className="h-16 w-16 bg-[#E8A87C]/20 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                  <Heart className="h-8 w-8 text-[#E8A87C]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#2D5A4A]">2. Save</h3>
                <p className="text-[#5A8A7A] font-medium">
                  Hit your budget goals and watch your savings grow. Every dollar saved earns you coins!
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#F5F9FB] p-8 rounded-3xl border-2 border-[#E8F4F8] hover:border-[#7EB8A2] hover:shadow-lg transition-all duration-300 group text-center">
                <div className="h-16 w-16 bg-[#7EB8A2]/20 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                  <Home className="h-8 w-8 text-[#7EB8A2]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#2D5A4A]">3. Decorate</h3>
                <p className="text-[#5A8A7A] font-medium">
                  Spend your coins on cute furniture, plants, and outfits. Build your dream cozy room!
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#2D5A4A] text-white/70 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">BudgetFriend</span>
          </div>
          <p className="font-medium text-white/50">© {new Date().getFullYear()} BudgetFriend. Saving made cozy.</p>
        </div>
      </footer>
    </div>
  );
}
