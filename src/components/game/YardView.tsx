'use client';

import { useState, useEffect, useRef } from 'react';
import { Leaf, Store, Sofa, X, Flame, MapPin, Hand, Coins, Menu, Home, Banknote, User, Settings, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import PlaidLinkButton from '@/components/plaid/PlaidLinkButton';
import CheckoutButton from '@/components/stripe/CheckoutButton';
import { useRouter } from 'next/navigation';

interface YardProps {
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
  category: 'furniture' | 'plant';
  x: number;
  y: number;
  stage?: string;
}

type ModalType = 'shop' | 'bank' | 'profile' | 'menu' | null;

export default function YardView({ yardId, coins: initialCoins, pet, profile, bankAccounts, user }: YardProps) {
  const router = useRouter();
  const [coins, setCoins] = useState(initialCoins);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [placementMode, setPlacementMode] = useState<{type: string, category: 'furniture' | 'plant', cost: number} | null>(null);
  
  const [items, setItems] = useState<PlacedItem[]>([]);
  const [petPos, setPetPos] = useState({ x: 5, y: 5 });
  const [petState, setPetState] = useState<'idle' | 'sitting' | 'walking'>('idle');

  // Camera State
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  useEffect(() => {
    // Load initial items
    const fetchItems = async () => {
      if (!yardId) return;
      const { data: furniture } = await supabase.from('furniture').select('*').eq('yard_id', yardId);
      const { data: plants } = await supabase.from('plants').select('*').eq('yard_id', yardId);
      
      const loadedItems: PlacedItem[] = [];
      if (furniture) {
        furniture.forEach(f => loadedItems.push({ id: f.id, type: f.item_type, category: 'furniture', x: f.position_x, y: f.position_y }));
      }
      if (plants) {
        plants.forEach(p => loadedItems.push({ id: p.id, type: p.plant_type, category: 'plant', x: p.position_x, y: p.position_y, stage: p.stage }));
      }
      setItems(loadedItems);
    };
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yardId]);

  // Handle Pan/Zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = -e.deltaY * 0.001;
      setScale(prev => Math.min(Math.max(0.5, prev + delta), 2));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag if not clicking a UI element or grid tile directly (handled by bubble propagation if needed, but we want background drag)
    if ((e.target as HTMLElement).closest('.grid-tile')) return;
    
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.grid-tile')) return;
    setIsDragging(true);
    setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleGridClick = async (x: number, y: number) => {
    if (placementMode) {
      if (coins < placementMode.cost) {
        alert("Not enough coins!");
        setPlacementMode(null);
        return;
      }

      // Check if tile is occupied
      if (items.some(i => i.x === x && i.y === y)) {
        alert("Tile is occupied!");
        return;
      }

      // Deduct coins & Optimistic UI
      setCoins(prev => prev - placementMode.cost);
      const newItem: PlacedItem = {
        id: Math.random().toString(),
        type: placementMode.type,
        category: placementMode.category,
        x,
        y,
        stage: placementMode.category === 'plant' ? 'seed' : undefined
      };
      setItems(prev => [...prev, newItem]);
      setPlacementMode(null);

      // Save to DB
      await supabase.from('yards').update({ coins: coins - placementMode.cost }).eq('id', yardId);
      
      if (placementMode.category === 'furniture') {
        await supabase.from('furniture').insert({
          yard_id: yardId,
          item_type: placementMode.type,
          position_x: x,
          position_y: y
        });
      } else {
        await supabase.from('plants').insert({
          yard_id: yardId,
          plant_type: placementMode.type,
          position_x: x,
          position_y: y,
          stage: 'seed'
        });
      }
    } else {
      // If not placing an item, move the pet to the clicked tile
      setPetPos({ x, y });
      setPetState('walking');
      setTimeout(() => setPetState('idle'), 1000);
    }
  };

  const handlePetCommand = (command: 'sit' | 'come') => {
    if (command === 'sit') {
      setPetState('sitting');
    } else {
      setPetState('idle');
      setPetPos({ x: 5, y: 5 });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const renderItem = (item: PlacedItem) => {
    if (item.category === 'plant') {
      return (
        <div className="flex flex-col items-center justify-end h-full w-full relative group">
          {item.stage === 'seed' ? (
            <div className="h-4 w-4 bg-amber-700 rounded-full mb-1 shadow-sm"></div>
          ) : (
            <Leaf className="h-10 w-10 text-emerald-500 mb-2 drop-shadow-md" />
          )}
        </div>
      );
    }
    return (
      <div className="flex items-end justify-center h-full w-full text-slate-800">
        <Sofa className="h-12 w-12 text-amber-600 mb-2 drop-shadow-lg" />
      </div>
    );
  };

  return (
    <div className="relative w-screen h-screen bg-[#A5D6A7] overflow-hidden select-none font-sans">
      {/* Game World Container */}
      <div 
        ref={containerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        {/* Center the world initially */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          
          {/* Room / Yard Container (Isometric) */}
          <div 
            className="relative"
            style={{ 
              transform: 'rotateX(60deg) rotateZ(45deg)',
              transformStyle: 'preserve-3d',
              width: '600px',
              height: '600px'
            }}
          >
            {/* Floor Base */}
            <div className="absolute inset-0 bg-[#E8F5E9] shadow-2xl rounded-sm border-[16px] border-[#5D4037]"></div>

            {/* Walls (Pseudo-3D) */}
            {/* Left Wall (Back) */}
            <div 
              className="absolute -left-4 -top-4 w-4 h-[632px] bg-[#D7CCC8] origin-right shadow-inner"
              style={{ transform: 'rotateY(-90deg)' }}
            >
              <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-50"></div>
            </div>
            {/* Top Wall (Back) */}
            <div 
              className="absolute -top-4 -left-4 w-[632px] h-4 bg-[#D7CCC8] origin-bottom shadow-inner"
              style={{ transform: 'rotateX(90deg)' }}
            >
              <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-50"></div>
            </div>

            {/* Grid Tiles */}
            <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 p-1">
              {Array.from({ length: 100 }).map((_, i) => {
                const x = i % 10;
                const y = Math.floor(i / 10);
                const item = items.find(item => item.x === x && item.y === y);
                const isPetHere = petPos.x === x && petPos.y === y;

                return (
                  <div 
                    key={i} 
                    onClick={() => handleGridClick(x, y)}
                    className={`
                      grid-tile border border-emerald-900/5 relative transition-all duration-200
                      ${(x + y) % 2 === 0 ? 'bg-[#C8E6C9]' : 'bg-[#A5D6A7]'} // Checkerboard pattern
                      ${placementMode ? 'hover:bg-white/40 cursor-pointer' : 'hover:brightness-110'}
                    `}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Render Item (Standing up in 3D space) */}
                    {item && (
                      <div 
                        className="absolute bottom-1 left-1/2 -translate-x-1/2 origin-bottom pointer-events-none z-10"
                        style={{ transform: 'rotateZ(-45deg) rotateX(-60deg) scale(2)' }}
                      >
                        {renderItem(item)}
                      </div>
                    )}

                    {/* Render Pet */}
                    {isPetHere && pet && (
                      <div 
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 origin-bottom pointer-events-none z-20 transition-all duration-500"
                        style={{ transform: 'rotateZ(-45deg) rotateX(-60deg) scale(2)' }}
                      >
                        <div className={`relative ${petState === 'idle' ? 'animate-bounce' : ''} ${petState === 'walking' ? 'animate-pulse' : ''}`}>
                          {pet.stage === 'egg' ? (
                            <div className="h-8 w-6 bg-amber-100 rounded-full border-2 border-amber-200 shadow-inner"></div>
                          ) : (
                            <Flame className={`h-10 w-10 text-amber-500 drop-shadow-md ${petState === 'sitting' ? 'translate-y-1 scale-y-90' : ''}`} />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* --- UI OVERLAYS --- */}

      {/* Top Bar: Resources & Menu */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none z-50">
        {/* User Profile / Level */}
        <div className="pointer-events-auto bg-white/90 backdrop-blur-md border-2 border-slate-200 rounded-2xl p-2 pr-6 flex items-center gap-3 shadow-lg">
          <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-2 rounded-xl">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-slate-800 text-sm">{profile?.level || 1}</div>
            <div className="text-xs text-slate-500 font-bold">Level</div>
          </div>
        </div>

        {/* Resources */}
        <div className="pointer-events-auto bg-amber-100/90 backdrop-blur-md border-2 border-amber-200 rounded-full px-6 py-2 flex items-center gap-2 shadow-lg scale-110 origin-top">
          <Coins className="h-5 w-5 text-amber-600" />
          <span className="font-black text-amber-800 text-lg">{coins}</span>
        </div>

        {/* Settings / Menu Button */}
        <button 
          onClick={() => setActiveModal('menu')}
          className="pointer-events-auto bg-white/90 backdrop-blur-md p-3 rounded-2xl border-2 border-slate-200 shadow-lg hover:scale-105 transition-transform text-slate-700"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Bottom Bar: Main Actions */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="pointer-events-auto bg-white/90 backdrop-blur-md border-2 border-slate-200 rounded-3xl p-3 flex items-center gap-4 shadow-2xl">
          <button 
            onClick={() => setActiveModal('shop')}
            className="flex flex-col items-center gap-1 group p-2 rounded-xl hover:bg-emerald-50 transition-colors"
          >
            <div className="bg-emerald-100 p-3 rounded-2xl group-hover:scale-110 transition-transform">
              <Store className="h-6 w-6 text-emerald-600" />
            </div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Shop</span>
          </button>

          <button 
            onClick={() => setActiveModal('bank')}
            className="flex flex-col items-center gap-1 group p-2 rounded-xl hover:bg-blue-50 transition-colors"
          >
            <div className="bg-blue-100 p-3 rounded-2xl group-hover:scale-110 transition-transform">
              <Banknote className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Bank</span>
          </button>

          <button 
            onClick={() => handlePetCommand('come')}
            className="flex flex-col items-center gap-1 group p-2 rounded-xl hover:bg-amber-50 transition-colors"
          >
            <div className="bg-amber-100 p-3 rounded-2xl group-hover:scale-110 transition-transform">
              <Hand className="h-6 w-6 text-amber-600" />
            </div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Pet</span>
          </button>
        </div>
      </div>

      {/* Placement HUD */}
      {placementMode && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-3 z-50 animate-bounce">
          <MapPin className="h-5 w-5 text-emerald-400" />
          Tap to place {placementMode.type}
          <button 
            onClick={() => setPlacementMode(null)}
            className="ml-2 bg-white/20 hover:bg-white/30 rounded-full p-1 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* --- MODALS --- */}

      {/* 1. Shop Modal */}
      {activeModal === 'shop' && (
        <div className="absolute inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-2xl text-slate-800">Shop</h3>
              <button onClick={() => setActiveModal(null)}><X className="h-6 w-6 text-slate-400" /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4 overflow-y-auto">
              <button 
                onClick={() => { setPlacementMode({ type: 'bench', category: 'furniture', cost: 50 }); setActiveModal(null); }}
                disabled={coins < 50}
                className="bg-slate-50 p-4 rounded-2xl border-2 border-transparent hover:border-emerald-500 transition-all text-center group"
              >
                <div className="bg-white rounded-xl p-4 mb-3 shadow-sm group-hover:scale-105 transition-transform">
                  <Sofa className="h-10 w-10 mx-auto text-amber-600" />
                </div>
                <div className="font-bold text-slate-800">Cozy Bench</div>
                <div className="text-amber-500 font-black text-sm">50 Coins</div>
              </button>
              <button 
                onClick={() => { setPlacementMode({ type: 'sunflower', category: 'plant', cost: 100 }); setActiveModal(null); }}
                disabled={coins < 100}
                className="bg-slate-50 p-4 rounded-2xl border-2 border-transparent hover:border-emerald-500 transition-all text-center group"
              >
                <div className="bg-white rounded-xl p-4 mb-3 shadow-sm group-hover:scale-105 transition-transform">
                  <Leaf className="h-10 w-10 mx-auto text-emerald-600" />
                </div>
                <div className="font-bold text-slate-800">Sunflower</div>
                <div className="text-amber-500 font-black text-sm">100 Coins</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Bank Modal */}
      {activeModal === 'bank' && (
        <div className="absolute inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-2xl text-slate-800">Bank</h3>
              <button onClick={() => setActiveModal(null)}><X className="h-6 w-6 text-slate-400" /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="bg-emerald-50 p-6 rounded-2xl mb-6 text-center">
                <div className="text-sm font-bold text-emerald-600 uppercase tracking-wide mb-1">Total Savings</div>
                <div className="text-4xl font-black text-emerald-900">$1,250.00</div>
              </div>
              
              <h4 className="font-bold text-slate-900 mb-4">Linked Accounts</h4>
              {bankAccounts && bankAccounts.length > 0 ? (
                <div className="space-y-3">
                  {bankAccounts.map((account) => (
                    <div key={account.id} className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-100 p-2 rounded-lg"><Home className="h-5 w-5 text-slate-500" /></div>
                        <div>
                          <div className="font-bold text-slate-800">{account.institution_name}</div>
                          <div className="text-xs text-slate-500 capitalize">{account.status}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl mb-4">
                  <p className="text-slate-500 text-sm mb-4">Link a bank account to start earning coins!</p>
                  <PlaidLinkButton />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Menu Modal */}
      {activeModal === 'menu' && (
        <div className="absolute inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-slate-500" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{user.email}</div>
                  <div className="text-xs text-slate-500">{profile?.subscription_tier === 'premium' ? 'Premium Member' : 'Free Plan'}</div>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)}><X className="h-6 w-6 text-slate-400" /></button>
            </div>
            <div className="p-2">
              <button onClick={() => {}} className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 rounded-xl transition-colors text-left">
                <Settings className="h-5 w-5 text-slate-500" />
                <span className="font-medium text-slate-700">Settings</span>
              </button>
              <div className="h-px bg-slate-100 my-1"></div>
              <button onClick={handleSignOut} className="w-full p-4 flex items-center gap-4 hover:bg-red-50 rounded-xl transition-colors text-left text-red-600">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-bold">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
