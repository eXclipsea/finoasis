'use client';

import { useState, useEffect } from 'react';
import { 
  Home, 
  Shirt, 
  Sofa, 
  Wallet, 
  Settings, 
  X,
  Sparkles,
  Heart,
  Coins,
  Sprout,
  Plus
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import PlaidLinkButton from '@/components/plaid/PlaidLinkButton';
import { useRouter } from 'next/navigation';
import { 
  FurnitureItem, 
  PetCharacter, 
  FURNITURE_ITEMS, 
  PLANT_ITEMS, 
  DECOR_ITEMS,
  CLOTHING_ITEMS
} from '@/components/game/FurnitureAssets';

interface RoomViewProps {
  yardId: string;
  coins: number;
  pet: {
    id: string;
    name: string;
    stage: string;
    happiness: number;
    health: number;
  } | null;
  profile: any;
  bankAccounts: any[];
  user: any;
}

interface PlacedItem {
  id: string;
  type: string;
  category: 'furniture' | 'plant' | 'decor' | 'clothing';
  x: number;
  y: number;
  rotation?: number;
  variant?: string;
}

type SidebarTab = 'shop' | 'closet' | 'bank' | 'settings' | null;

// Admin email for infinite coins
const ADMIN_EMAIL = '2landonl10@gmail.com';

export default function RoomView({ yardId, coins: initialCoins, pet, profile, bankAccounts, user }: RoomViewProps) {
  const router = useRouter();
  const isAdmin = user?.email === ADMIN_EMAIL;
  const [coins, setCoins] = useState(isAdmin ? 999999 : initialCoins);
  const [activeTab, setActiveTab] = useState<SidebarTab>(null);
  const [showBankModal, setShowBankModal] = useState(bankAccounts.length === 0 && !isAdmin);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [petPosition, setPetPosition] = useState({ x: 225, y: 225 });
  
  // Room items state - starts empty (blank room)
  const [items, setItems] = useState<PlacedItem[]>([]);
  
  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Pet movement animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPetPosition({
        x: 150 + Math.random() * 150,
        y: 150 + Math.random() * 150,
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleBuyItem = (itemType: string, category: 'furniture' | 'plant' | 'decor', price: number) => {
    if (!isAdmin && coins < price) return;
    
    const newItem: PlacedItem = {
      id: Date.now().toString(),
      type: itemType,
      category,
      x: Math.floor(Math.random() * 7) + 1,
      y: Math.floor(Math.random() * 7) + 1,
      rotation: 0,
    };
    
    setItems([...items, newItem]);
    if (!isAdmin) {
      setCoins(coins - price);
    }
  };

  // Render the isometric room
  const renderRoom = () => {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Room container with isometric transform */}
        <div 
          className="relative transition-transform duration-500"
          style={{
            transform: isMobile 
              ? 'rotateX(55deg) rotateZ(45deg) scale(0.65)' 
              : 'rotateX(55deg) rotateZ(45deg) scale(1.1)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Floor - BIGGER (450px) */}
          <div className="relative w-[450px] h-[450px] bg-[#E6D5C3] rounded-lg shadow-2xl">
            {/* Floor wood pattern */}
            <div className="absolute inset-2 bg-[#D4C4B0] rounded">
              {/* Wood planks */}
              <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-[2px]">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`rounded-sm ${
                      i % 3 === 0 ? 'bg-[#C9B8A4]' : 
                      i % 3 === 1 ? 'bg-[#D4C4B0]' : 
                      'bg-[#DECCB8]'
                    }`} 
                  />
                ))}
              </div>
            </div>
            
            {/* Room grid overlay for placement */}
            <div className="absolute inset-2 grid grid-cols-9 grid-rows-9">
              {Array.from({ length: 81 }).map((_, i) => (
                <div 
                  key={i} 
                  className="border border-[#B8A890]/10"
                />
              ))}
            </div>
            
            {/* Room items */}
            {items.map((item) => (
              <RoomItem key={item.id} item={item} />
            ))}
            
            {/* Pet character */}
            <div 
              className="absolute transition-all duration-[3000ms] ease-in-out"
              style={{
                left: `${petPosition.x}px`,
                top: `${petPosition.y}px`,
                transform: 'rotateZ(-45deg) rotateX(-55deg) translateZ(20px)',
                zIndex: 100,
              }}
            >
              <PetAvatar stage={pet?.stage || 'egg'} name={pet?.name || 'Buddy'} />
            </div>
          </div>
          
          {/* Back wall */}
          <div 
            className="absolute -top-[150px] left-0 w-[450px] h-[150px] bg-[#FDF8F3] origin-bottom rounded-t-lg"
            style={{ transform: 'rotateX(-90deg)' }}
          >
            {/* Window - arched like Focus Friend */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2">
              <svg width="80" height="100" viewBox="0 0 80 100" className="drop-shadow-md">
                {/* Window frame */}
                <path d="M10,40 Q10,10 40,10 Q70,10 70,40 L70,90 L10,90 Z" fill="#E8F4F8" stroke="#B8D4E3" strokeWidth="4"/>
                {/* Window panes */}
                <line x1="40" y1="10" x2="40" y2="90" stroke="#B8D4E3" strokeWidth="2"/>
                <line x1="10" y1="50" x2="70" y2="50" stroke="#B8D4E3" strokeWidth="2"/>
                {/* Sky gradient */}
                <path d="M14,40 Q14,14 40,14 Q66,14 66,40 L66,86 L14,86 Z" fill="url(#skyGradient)"/>
                {/* Clouds in window */}
                <circle cx="30" cy="35" r="8" fill="white" opacity="0.8"/>
                <circle cx="40" cy="30" r="10" fill="white" opacity="0.8"/>
                <circle cx="50" cy="35" r="8" fill="white" opacity="0.8"/>
                <defs>
                  <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#87CEEB"/>
                    <stop offset="100%" stopColor="#E8F4F8"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            {/* Wall decorations */}
            <div className="absolute top-8 left-8">
              <svg width="30" height="40" viewBox="0 0 30 40" className="drop-shadow-sm">
                <rect x="2" y="2" width="26" height="36" fill="#8B7355" rx="2"/>
                <rect x="5" y="5" width="20" height="30" fill="#F5E6D3"/>
                <circle cx="15" cy="15" r="6" fill="#7EB8A2"/>
              </svg>
            </div>
            
            {/* Star decoration */}
            <div className="absolute top-10 right-10">
              <svg width="24" height="24" viewBox="0 0 24 24" className="animate-pulse">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#E8A87C"/>
              </svg>
            </div>
          </div>
          
          {/* Side wall */}
          <div 
            className="absolute top-0 -left-[150px] w-[150px] h-[450px] bg-[#F5EDE4] origin-right rounded-l-lg"
            style={{ transform: 'rotateY(90deg)' }}
          >
            {/* Picture frame on side wall */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2">
              <svg width="50" height="60" viewBox="0 0 50 60" className="drop-shadow-md">
                <rect x="5" y="5" width="40" height="50" fill="#8B7355" rx="3"/>
                <rect x="8" y="8" width="34" height="44" fill="#FDF8F3" rx="2"/>
                {/* Simple mountain art */}
                <path d="M12,35 L20,20 L28,30 L35,15 L42,35 Z" fill="#7EB8A2" opacity="0.6"/>
                <circle cx="35" cy="18" r="4" fill="#E8A87C" opacity="0.5"/>
              </svg>
            </div>
            
            {/* Plant on side wall shelf */}
            <div className="absolute top-40 left-1/2 -translate-x-1/2">
              <svg width="35" height="45" viewBox="0 0 35 45">
                {/* Shelf */}
                <rect x="0" y="35" width="35" height="6" fill="#8B7355" rx="1"/>
                {/* Pot */}
                <path d="M10,35 L12,25 L25,25 L27,35 Z" fill="#D9976B"/>
                {/* Plant leaves */}
                <ellipse cx="18" cy="22" rx="6" ry="10" fill="#7EB8A2"/>
                <ellipse cx="14" cy="24" rx="5" ry="8" fill="#6BA08A"/>
                <ellipse cx="22" cy="24" rx="5" ry="8" fill="#8ABFA8"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Desktop layout with sidebar
  const DesktopLayout = () => (
    <div className="flex h-screen bg-gradient-to-br from-[#F5EDE4] via-[#E6D5C3] to-[#D4C4B0] overflow-hidden">
      {/* Left sidebar - Navigation */}
      <div className="w-20 bg-[#FDF8F3]/90 backdrop-blur-xl border-r-2 border-[#C9B8A4] flex flex-col items-center py-6 gap-4 z-20">
        <div className="w-14 h-14 bg-[#A67B5B] rounded-2xl flex items-center justify-center shadow-lg mb-4">
          <Home className="w-7 h-7 text-white" />
        </div>
        
        <NavButton 
          icon={<Sofa className="w-6 h-6" />} 
          label="Shop" 
          active={activeTab === 'shop'}
          onClick={() => setActiveTab(activeTab === 'shop' ? null : 'shop')}
        />
        <NavButton 
          icon={<Shirt className="w-6 h-6" />} 
          label="Closet" 
          active={activeTab === 'closet'}
          onClick={() => setActiveTab(activeTab === 'closet' ? null : 'closet')}
        />
        <NavButton 
          icon={<Wallet className="w-6 h-6" />} 
          label="Bank" 
          active={activeTab === 'bank'}
          onClick={() => setActiveTab(activeTab === 'bank' ? null : 'bank')}
        />
        <NavButton 
          icon={<Settings className="w-6 h-6" />} 
          label="Settings" 
          active={activeTab === 'settings'}
          onClick={() => setActiveTab(activeTab === 'settings' ? null : 'settings')}
        />
      </div>

      {/* Main content - Room */}
      <div className="flex-1 flex flex-col relative">
        {/* Top resource bars */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-4 z-10">
          <ResourceBar 
            icon={<Coins className="w-4 h-4" />} 
            value={coins} 
            max={1000} 
            color="bg-[#E8A87C]"
            label="Coins"
          />
          <ResourceBar 
            icon={<Heart className="w-4 h-4" />} 
            value={pet?.happiness || 80} 
            max={100} 
            color="bg-[#E8919C]"
            label="Happiness"
          />
          <ResourceBar 
            icon={<Sprout className="w-4 h-4" />} 
            value={profile?.level || 1} 
            max={50} 
            color="bg-[#7EB8A2]"
            label="Level"
          />
        </div>

        {/* Room view */}
        <div className="flex-1 flex items-center justify-center">
          {renderRoom()}
        </div>

        {/* Bottom action button */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <button className="group relative bg-[#E8A87C] hover:bg-[#D9976B] text-white px-12 py-5 rounded-3xl font-black text-xl shadow-2xl shadow-[#E8A87C]/30 hover:shadow-[#E8A87C]/50 transition-all duration-300 hover:scale-105 active:scale-95">
            <span className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 animate-pulse" />
              SAVE MONEY!
              <Sparkles className="w-6 h-6 animate-pulse" />
            </span>
            {/* Decorative leaves - SVG instead of emoji */}
            <span className="absolute -top-2 -left-3">
              <svg width="24" height="24" viewBox="0 0 24 24" className="animate-bounce">
                <path d="M12 2C7 8 7 14 12 22C17 14 17 8 12 2Z" fill="#7EB8A2"/>
              </svg>
            </span>
            <span className="absolute -top-2 -right-3">
              <svg width="24" height="24" viewBox="0 0 24 24" className="animate-bounce delay-100">
                <path d="M12 2C7 8 7 14 12 22C17 14 17 8 12 2Z" fill="#6BA08A"/>
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* Right sidebar - Content panels */}
      {activeTab && (
        <div className="w-80 bg-[#FDF8F3]/95 backdrop-blur-xl border-l-2 border-[#C9B8A4] overflow-y-auto z-20">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-[#2D5A4A]">
                {activeTab === 'shop' && 'Shop'}
                {activeTab === 'closet' && 'Closet'}
                {activeTab === 'bank' && 'Bank'}
                {activeTab === 'settings' && 'Settings'}
              </h2>
              <button 
                onClick={() => setActiveTab(null)}
                className="p-2 hover:bg-[#F5EDE4] rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-[#6B4423]" />
              </button>
            </div>
            
            {activeTab === 'shop' && <ShopPanel coins={coins} onBuy={handleBuyItem} isAdmin={isAdmin} />}
            {activeTab === 'closet' && <ClosetPanel onSelect={(item) => console.log('Selected:', item)} />}
            {activeTab === 'bank' && <BankPanel bankAccounts={bankAccounts} onConnect={() => setShowBankModal(true)} />}
            {activeTab === 'settings' && <SettingsPanel onSignOut={handleSignOut} user={user} isAdmin={isAdmin} />}
          </div>
        </div>
      )}
    </div>
  );

  // Mobile layout with bottom controls
  const MobileLayout = () => (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#F5EDE4] to-[#E6D5C3] overflow-hidden">
      {/* Top resource bars */}
      <div className="flex justify-center gap-3 p-4 pt-12 bg-[#FDF8F3]/50 backdrop-blur-sm border-b border-[#C9B8A4]">
        <ResourceBar 
          icon={<Coins className="w-3 h-3" />} 
          value={coins} 
          max={1000} 
          color="bg-[#E8A87C]"
          label="Coins"
          compact
        />
        <ResourceBar 
          icon={<Heart className="w-3 h-3" />} 
          value={pet?.happiness || 80} 
          max={100} 
          color="bg-[#E8919C]"
          label="Happiness"
          compact
        />
        <ResourceBar 
          icon={<Sprout className="w-3 h-3" />} 
          value={profile?.level || 1} 
          max={50} 
          color="bg-[#7EB8A2]"
          label="Level"
          compact
        />
      </div>

      {/* Room view */}
      <div className="flex-1 relative">
        {renderRoom()}
        
        {/* Floating action button */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
          <button className="group bg-[#E8A87C] hover:bg-[#D9976B] text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-[#E8A87C]/30 transition-all duration-300 hover:scale-105 active:scale-95">
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              SAVE!
            </span>
          </button>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="bg-white/90 backdrop-blur-xl border-t-2 border-[#B8D4E3] px-6 py-4 flex justify-around items-center">
        <NavButton 
          icon={<Sofa className="w-6 h-6" />} 
          label="Shop" 
          active={activeTab === 'shop'}
          onClick={() => setActiveTab(activeTab === 'shop' ? null : 'shop')}
          mobile
        />
        <NavButton 
          icon={<Shirt className="w-6 h-6" />} 
          label="Closet" 
          active={activeTab === 'closet'}
          onClick={() => setActiveTab(activeTab === 'closet' ? null : 'closet')}
          mobile
        />
        <NavButton 
          icon={<Wallet className="w-6 h-6" />} 
          label="Bank" 
          active={activeTab === 'bank'}
          onClick={() => setActiveTab(activeTab === 'bank' ? null : 'bank')}
          mobile
        />
        <NavButton 
          icon={<Settings className="w-6 h-6" />} 
          label="Settings" 
          active={activeTab === 'settings'}
          onClick={() => setActiveTab(activeTab === 'settings' ? null : 'settings')}
          mobile
        />
      </div>

      {/* Mobile modal for tabs */}
      {activeTab && (
        <div className="absolute inset-0 bg-black/30 z-50 flex items-end">
          <div className="w-full bg-[#FDF8F3] rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-[#2D5A4A]">
                {activeTab === 'shop' && 'Shop'}
                {activeTab === 'closet' && 'Closet'}
                {activeTab === 'bank' && 'Bank'}
                {activeTab === 'settings' && 'Settings'}
              </h2>
              <button 
                onClick={() => setActiveTab(null)}
                className="p-2 hover:bg-[#F5EDE4] rounded-xl"
              >
                <X className="w-5 h-5 text-[#6B4423]" />
              </button>
            </div>
            
            {activeTab === 'shop' && <ShopPanel coins={coins} onBuy={handleBuyItem} isAdmin={isAdmin} mobile />}
            {activeTab === 'closet' && <ClosetPanel onSelect={(item) => console.log('Selected:', item)} mobile />}
            {activeTab === 'bank' && <BankPanel bankAccounts={bankAccounts} onConnect={() => setShowBankModal(true)} mobile />}
            {activeTab === 'settings' && <SettingsPanel onSignOut={handleSignOut} user={user} isAdmin={isAdmin} mobile />}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
      
      {/* Bank Connection Modal */}
      {showBankModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-center mb-4">
              <svg width="64" height="64" viewBox="0 0 64 64" className="text-[#7EB8A2]">
                <rect x="8" y="20" width="48" height="36" rx="4" fill="#7EB8A2" opacity="0.2"/>
                <rect x="12" y="24" width="40" height="28" rx="2" fill="none" stroke="#7EB8A2" strokeWidth="2"/>
                <path d="M12 32 L52 32" stroke="#7EB8A2" strokeWidth="2"/>
                <circle cx="20" cy="40" r="3" fill="#7EB8A2"/>
                <path d="M32 8 L32 20" stroke="#7EB8A2" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="32" cy="8" r="4" fill="#E8A87C"/>
              </svg>
            </div>
            <h2 className="text-2xl font-black text-[#2D5A4A] mb-4 text-center">Connect Your Bank</h2>
            <p className="text-[#5A8A7A] mb-6 text-center">
              Link your bank account to start earning coins for saving money!
            </p>
            <div className="flex justify-center">
              <PlaidLinkButton />
            </div>
            <button 
              onClick={() => setShowBankModal(false)}
              className="mt-4 w-full text-[#8AB3A8] hover:text-[#5A8A7A] font-medium"
            >
              Skip for now
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Sub-components
function NavButton({ icon, label, active, onClick, mobile = false }: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void;
  mobile?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-200 ${
        active 
          ? 'bg-[#A67B5B]/20 text-[#6B4423]' 
          : 'text-[#8B7355] hover:bg-[#F5EDE4] hover:text-[#6B4423]'
      }`}
    >
      {icon}
      <span className={`font-bold ${mobile ? 'text-[10px]' : 'text-xs'}`}>{label}</span>
    </button>
  );
}

function ResourceBar({ icon, value, max, color, label, compact = false }: { 
  icon: React.ReactNode; 
  value: number; 
  max: number; 
  color: string;
  label: string;
  compact?: boolean;
}) {
  return (
    <div className={`bg-white/90 backdrop-blur rounded-full border-2 border-[#B8D4E3] flex items-center gap-2 ${compact ? 'px-3 py-1.5' : 'px-4 py-2'} shadow-sm`}>
      <div className={`${color} text-white rounded-full p-1`}>
        {icon}
      </div>
      <div>
        <span className={`font-black text-[#2D5A4A] ${compact ? 'text-sm' : 'text-base'}`}>{value}</span>
        {!compact && <span className="text-xs text-[#8AB3A8] ml-1">{label}</span>}
      </div>
    </div>
  );
}

function RoomItem({ item }: { item: PlacedItem }) {
  return (
    <div
      className="absolute transition-all duration-300 hover:scale-110 cursor-pointer"
      style={{
        left: `${item.x * 50}px`,
        top: `${item.y * 50}px`,
        transform: `rotateZ(-45deg) rotateX(-55deg) translateZ(10px)`,
        zIndex: 10,
      }}
    >
      <FurnitureItem type={item.type} />
    </div>
  );
}

function PetAvatar({ stage, name }: { stage: string; name: string }) {
  return (
    <div className="relative group">
      <div className="animate-bounce">
        <PetCharacter stage={stage} isMoving />
      </div>
      {/* Speech bubble on hover */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
        <span className="text-sm font-bold text-[#2D5A4A]">Hi! I&apos;m {name}</span>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45" />
      </div>
    </div>
  );
}

function ShopPanel({ 
  coins, 
  onBuy, 
  isAdmin = false,
  mobile = false 
}: { 
  coins: number; 
  onBuy: (itemType: string, category: 'furniture' | 'plant' | 'decor', price: number) => void;
  isAdmin?: boolean;
  mobile?: boolean;
}) {
  const allItems = [
    ...FURNITURE_ITEMS,
    ...PLANT_ITEMS,
    ...DECOR_ITEMS,
  ];

  return (
    <div className={`grid ${mobile ? 'grid-cols-2' : 'grid-cols-2'} gap-3 max-h-[60vh] overflow-y-auto`}>
      {allItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onBuy(item.id, item.category, item.price)}
          disabled={!isAdmin && coins < item.price}
          className="bg-[#FDF8F3] hover:bg-white border-2 border-[#C9B8A4] hover:border-[#A67B5B] rounded-2xl p-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="flex justify-center mb-2">
            <FurnitureItem type={item.id} className="group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-bold text-[#2D5A4A] text-sm">{item.name}</div>
          <div className="flex items-center justify-center gap-1 mt-1">
            <Coins className="w-3 h-3 text-[#E8A87C]" />
            <span className="text-sm font-black text-[#E8A87C]">{isAdmin ? 'FREE' : item.price}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function ClosetPanel({ 
  onSelect, 
  mobile = false 
}: { 
  onSelect?: (item: { id: string; name: string }) => void;
  mobile?: boolean;
}) {
  const outfits: { id: string; name: string; price: number; category: string }[] = CLOTHING_ITEMS;

  return (
    <div className={`grid ${mobile ? 'grid-cols-3' : 'grid-cols-2'} gap-3`}>
      {outfits.map((outfit) => (
        <button
          key={outfit.id}
          onClick={() => onSelect?.(outfit)}
          className="bg-[#FDF8F3] hover:bg-white border-2 border-[#C9B8A4] hover:border-[#E8919C] rounded-2xl p-4 transition-all"
        >
          <div className="flex justify-center mb-2">
            <FurnitureItem type={outfit.id} />
          </div>
          <div className="font-bold text-[#2D5A4A] text-sm text-center">{outfit.name}</div>
        </button>
      ))}
    </div>
  );
}

function BankPanel({ 
  bankAccounts, 
  onConnect,
  mobile = false 
}: { 
  bankAccounts: any[]; 
  onConnect?: () => void;
  mobile?: boolean;
}) {
  return (
    <div className="space-y-4">
      {bankAccounts.length > 0 ? (
        bankAccounts.map((account) => (
          <div key={account.id} className="bg-[#FDF8F3] rounded-2xl p-4 border-2 border-[#C9B8A4]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#A67B5B]/20 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-[#A67B5B]" />
              </div>
              <div>
                <div className="font-bold text-[#2D5A4A]">{account.institution_name}</div>
                <div className="text-xs text-[#8AB3A8] capitalize">{account.status}</div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <svg width="48" height="48" viewBox="0 0 64 64" className="text-[#7EB8A2]">
              <rect x="8" y="20" width="48" height="36" rx="4" fill="#7EB8A2" opacity="0.2"/>
              <rect x="12" y="24" width="40" height="28" rx="2" fill="none" stroke="#7EB8A2" strokeWidth="2"/>
              <path d="M12 32 L52 32" stroke="#7EB8A2" strokeWidth="2"/>
              <circle cx="20" cy="40" r="3" fill="#7EB8A2"/>
            </svg>
          </div>
          <p className="text-[#5A8A7A] mb-4">No bank connected yet</p>
          {onConnect ? (
            <button 
              onClick={onConnect}
              className="bg-[#A67B5B] hover:bg-[#8B7355] text-white font-bold py-2 px-6 rounded-xl transition-all"
            >
              Connect Bank
            </button>
          ) : (
            <PlaidLinkButton />
          )}
        </div>
      )}
    </div>
  );
}

function SettingsPanel({ 
  onSignOut, 
  user, 
  isAdmin = false,
  mobile = false 
}: { 
  onSignOut: () => void | Promise<void>; 
  user: any; 
  isAdmin?: boolean;
  mobile?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="bg-[#FDF8F3] rounded-2xl p-4 border-2 border-[#C9B8A4]">
        <div className="font-bold text-[#6B4423] mb-1">Email</div>
        <div className="text-[#8B7355] text-sm">{user.email}</div>
        {isAdmin && (
          <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-[#E8A87C]/20 text-[#E8A87C] rounded-full text-xs font-bold">
            <Sparkles className="w-3 h-3" />
            Admin - Infinite Coins
          </div>
        )}
      </div>
      
      <button
        onClick={onSignOut}
        className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-xl border-2 border-red-200 transition-all"
      >
        Sign Out
      </button>
    </div>
  );
}
