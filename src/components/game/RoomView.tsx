'use client';

import { useState, useEffect, useRef } from 'react';
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
  ArrowLeft
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import PlaidLinkButton from '@/components/plaid/PlaidLinkButton';
import { useRouter } from 'next/navigation';

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
}

type SidebarTab = 'shop' | 'closet' | 'bank' | 'settings' | null;

export default function RoomView({ yardId, coins: initialCoins, pet, profile, bankAccounts, user }: RoomViewProps) {
  const router = useRouter();
  const [coins, setCoins] = useState(initialCoins);
  const [activeTab, setActiveTab] = useState<SidebarTab>(null);
  const [showBankModal, setShowBankModal] = useState(bankAccounts.length === 0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Room items state
  const [items, setItems] = useState<PlacedItem[]>([
    { id: '1', type: 'desk', category: 'furniture', x: 2, y: 2, rotation: 0 },
    { id: '2', type: 'plant', category: 'decor', x: 5, y: 1, rotation: 0 },
    { id: '3', type: 'rug', category: 'decor', x: 3, y: 4, rotation: 0 },
  ]);
  
  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Render the isometric room
  const renderRoom = () => {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Room container with isometric transform */}
        <div 
          className="relative transition-transform duration-500"
          style={{
            transform: isMobile ? 'rotateX(55deg) rotateZ(45deg) scale(0.7)' : 'rotateX(55deg) rotateZ(45deg) scale(0.9)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Floor */}
          <div className="relative w-[300px] h-[300px] bg-[#F5E6D3] rounded-lg shadow-2xl border-4 border-[#E8D5C4]">
            {/* Floor grid pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full grid grid-cols-6 grid-rows-6">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className={`${i % 2 === 0 ? 'bg-[#D4C4B0]' : 'bg-transparent'}`} />
                ))}
              </div>
            </div>
            
            {/* Room items */}
            {items.map((item) => (
              <RoomItem key={item.id} item={item} />
            ))}
            
            {/* Pet character */}
            <div 
              className="absolute transition-all duration-700 ease-in-out"
              style={{
                left: '150px',
                top: '150px',
                transform: 'rotateZ(-45deg) rotateX(-55deg) translateZ(20px)',
              }}
            >
              <PetAvatar stage={pet?.stage || 'egg'} name={pet?.name || 'Buddy'} />
            </div>
          </div>
          
          {/* Back wall */}
          <div 
            className="absolute -top-[100px] left-0 w-[300px] h-[100px] bg-[#FFF8F0] origin-bottom"
            style={{ transform: 'rotateX(-90deg)' }}
          >
            {/* Window */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-20 bg-[#E8F4F8] rounded-t-full border-4 border-[#D4E9F0]">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#D4E9F0]" />
              <div className="absolute top-0 left-1/2 h-full w-0.5 bg-[#D4E9F0]" />
            </div>
            {/* Wall decor */}
            <div className="absolute top-6 left-4 text-2xl">🌿</div>
            <div className="absolute top-8 right-6 text-xl">⭐</div>
          </div>
          
          {/* Side wall */}
          <div 
            className="absolute top-0 -left-[100px] w-[100px] h-[300px] bg-[#FDF5ED] origin-right"
            style={{ transform: 'rotateY(90deg)' }}
          >
            {/* Picture frame */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-12 h-16 bg-white rounded border-2 border-[#E8D5C4] flex items-center justify-center">
              <span className="text-lg">🖼️</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Desktop layout with sidebar
  const DesktopLayout = () => (
    <div className="flex h-screen bg-gradient-to-br from-[#E8F4F8] via-[#D4E9F0] to-[#B8D4E3] overflow-hidden">
      {/* Left sidebar - Navigation */}
      <div className="w-20 bg-white/80 backdrop-blur-xl border-r-2 border-[#B8D4E3] flex flex-col items-center py-6 gap-4 z-20">
        <div className="w-14 h-14 bg-[#7EB8A2] rounded-2xl flex items-center justify-center shadow-lg mb-4">
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
            {/* Decorative leaves */}
            <span className="absolute -top-2 -left-2 text-2xl animate-bounce">🌱</span>
            <span className="absolute -top-2 -right-2 text-2xl animate-bounce delay-100">🌿</span>
          </button>
        </div>
      </div>

      {/* Right sidebar - Content panels */}
      {activeTab && (
        <div className="w-80 bg-white/90 backdrop-blur-xl border-l-2 border-[#B8D4E3] overflow-y-auto z-20">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-[#2D5A4A]">
                {activeTab === 'shop' && '🛍️ Shop'}
                {activeTab === 'closet' && '👕 Closet'}
                {activeTab === 'bank' && '🏦 Bank'}
                {activeTab === 'settings' && '⚙️ Settings'}
              </h2>
              <button 
                onClick={() => setActiveTab(null)}
                className="p-2 hover:bg-[#F5F9FB] rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-[#5A8A7A]" />
              </button>
            </div>
            
            {activeTab === 'shop' && <ShopPanel coins={coins} />}
            {activeTab === 'closet' && <ClosetPanel />}
            {activeTab === 'bank' && <BankPanel bankAccounts={bankAccounts} />}
            {activeTab === 'settings' && <SettingsPanel onSignOut={handleSignOut} user={user} />}
          </div>
        </div>
      )}
    </div>
  );

  // Mobile layout with bottom controls
  const MobileLayout = () => (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#E8F4F8] to-[#D4E9F0] overflow-hidden">
      {/* Top resource bars */}
      <div className="flex justify-center gap-3 p-4 pt-12 bg-white/50 backdrop-blur-sm border-b border-[#B8D4E3]">
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
          <div className="w-full bg-white rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-[#2D5A4A]">
                {activeTab === 'shop' && '🛍️ Shop'}
                {activeTab === 'closet' && '👕 Closet'}
                {activeTab === 'bank' && '🏦 Bank'}
                {activeTab === 'settings' && '⚙️ Settings'}
              </h2>
              <button 
                onClick={() => setActiveTab(null)}
                className="p-2 hover:bg-[#F5F9FB] rounded-xl"
              >
                <X className="w-5 h-5 text-[#5A8A7A]" />
              </button>
            </div>
            
            {activeTab === 'shop' && <ShopPanel coins={coins} mobile />}
            {activeTab === 'closet' && <ClosetPanel mobile />}
            {activeTab === 'bank' && <BankPanel bankAccounts={bankAccounts} mobile />}
            {activeTab === 'settings' && <SettingsPanel onSignOut={handleSignOut} user={user} mobile />}
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
            <h2 className="text-2xl font-black text-[#2D5A4A] mb-4 text-center">Connect Your Bank 🏦</h2>
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
          ? 'bg-[#7EB8A2]/20 text-[#2D5A4A]' 
          : 'text-[#8AB3A8] hover:bg-[#F5F9FB] hover:text-[#5A8A7A]'
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
  const itemEmojis: Record<string, string> = {
    desk: '🪑',
    plant: '🪴',
    rug: '🧶',
    bed: '🛏️',
    lamp: '💡',
    bookshelf: '📚',
    painting: '🖼️',
  };

  return (
    <div
      className="absolute text-4xl transition-all duration-300 hover:scale-110 cursor-pointer"
      style={{
        left: `${item.x * 50}px`,
        top: `${item.y * 50}px`,
        transform: `rotateZ(-45deg) rotateX(-55deg) translateZ(10px)`,
      }}
    >
      {itemEmojis[item.type] || '📦'}
    </div>
  );
}

function PetAvatar({ stage, name }: { stage: string; name: string }) {
  return (
    <div className="relative group">
      <div className="text-5xl animate-bounce">
        {stage === 'egg' ? '🥚' : '🐻'}
      </div>
      {/* Speech bubble on hover */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        <span className="text-sm font-bold text-[#2D5A4A]">Hi! I&apos;m {name}</span>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45" />
      </div>
    </div>
  );
}

function ShopPanel({ coins, mobile = false }: { coins: number; mobile?: boolean }) {
  const items = [
    { id: '1', name: 'Cozy Chair', emoji: '🪑', price: 50, category: 'furniture' },
    { id: '2', name: 'Potted Plant', emoji: '🪴', price: 30, category: 'decor' },
    { id: '3', name: 'Reading Lamp', emoji: '💡', price: 40, category: 'decor' },
    { id: '4', name: 'Bookshelf', emoji: '📚', price: 80, category: 'furniture' },
    { id: '5', name: 'Rug', emoji: '🧶', price: 60, category: 'decor' },
    { id: '6', name: 'Bed', emoji: '🛏️', price: 100, category: 'furniture' },
  ];

  return (
    <div className={`grid ${mobile ? 'grid-cols-2' : 'grid-cols-2'} gap-3`}>
      {items.map((item) => (
        <button
          key={item.id}
          disabled={coins < item.price}
          className="bg-[#F5F9FB] hover:bg-white border-2 border-[#B8D4E3] hover:border-[#7EB8A2] rounded-2xl p-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{item.emoji}</div>
          <div className="font-bold text-[#2D5A4A] text-sm">{item.name}</div>
          <div className="flex items-center justify-center gap-1 mt-1">
            <Coins className="w-3 h-3 text-[#E8A87C]" />
            <span className="text-sm font-black text-[#E8A87C]">{item.price}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function ClosetPanel({ mobile = false }: { mobile?: boolean }) {
  const outfits = [
    { id: '1', name: 'Beanie', emoji: '🧢' },
    { id: '2', name: 'Glasses', emoji: '👓' },
    { id: '3', name: 'Scarf', emoji: '🧣' },
    { id: '4', name: 'Crown', emoji: '👑' },
  ];

  return (
    <div className={`grid ${mobile ? 'grid-cols-3' : 'grid-cols-2'} gap-3`}>
      {outfits.map((outfit) => (
        <button
          key={outfit.id}
          className="bg-[#F5F9FB] hover:bg-white border-2 border-[#B8D4E3] hover:border-[#E8919C] rounded-2xl p-4 transition-all"
        >
          <div className="text-3xl mb-2">{outfit.emoji}</div>
          <div className="font-bold text-[#2D5A4A] text-sm">{outfit.name}</div>
        </button>
      ))}
    </div>
  );
}

function BankPanel({ bankAccounts, mobile = false }: { bankAccounts: any[]; mobile?: boolean }) {
  return (
    <div className="space-y-4">
      {bankAccounts.length > 0 ? (
        bankAccounts.map((account) => (
          <div key={account.id} className="bg-[#F5F9FB] rounded-2xl p-4 border-2 border-[#B8D4E3]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#7EB8A2]/20 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-[#7EB8A2]" />
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
          <div className="text-4xl mb-4">🏦</div>
          <p className="text-[#5A8A7A] mb-4">No bank connected yet</p>
          <PlaidLinkButton />
        </div>
      )}
    </div>
  );
}

function SettingsPanel({ onSignOut, user, mobile = false }: { onSignOut: () => void; user: any; mobile?: boolean }) {
  return (
    <div className="space-y-4">
      <div className="bg-[#F5F9FB] rounded-2xl p-4 border-2 border-[#B8D4E3]">
        <div className="font-bold text-[#2D5A4A] mb-1">Email</div>
        <div className="text-[#5A8A7A] text-sm">{user.email}</div>
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
