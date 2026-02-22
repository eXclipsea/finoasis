'use client';

import { useState, useEffect } from 'react';
import { Leaf, Store, Sofa, X, Flame, MapPin, Hand } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

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
}

interface PlacedItem {
  id: string;
  type: string;
  category: 'furniture' | 'plant';
  x: number;
  y: number;
  stage?: string;
}

export default function YardView({ yardId, coins: initialCoins, pet }: YardProps) {
  const [coins, setCoins] = useState(initialCoins);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [placementMode, setPlacementMode] = useState<{type: string, category: 'furniture' | 'plant', cost: number} | null>(null);
  
  const [items, setItems] = useState<PlacedItem[]>([]);
  const [petPos, setPetPos] = useState({ x: 5, y: 5 });
  const [petState, setPetState] = useState<'idle' | 'sitting'>('idle');

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
      setPetState('idle');
    }
  };

  const handlePetCommand = (command: 'sit' | 'come') => {
    if (command === 'sit') {
      setPetState('sitting');
    } else {
      setPetState('idle');
      // Pet comes to the center
      setPetPos({ x: 5, y: 5 });
    }
  };

  const renderItem = (item: PlacedItem) => {
    if (item.category === 'plant') {
      return (
        <div className="flex flex-col items-center justify-end h-full w-full relative group">
          {item.stage === 'seed' ? (
            <div className="h-4 w-4 bg-amber-700 rounded-full mb-1"></div>
          ) : (
            <Leaf className="h-8 w-8 text-emerald-500 mb-1" />
          )}
          <div className="hidden group-hover:block absolute -top-8 bg-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
            {item.stage === 'seed' ? 'Growing...' : 'Fully Grown'}
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-end justify-center h-full w-full text-slate-800">
        <Sofa className="h-8 w-8 text-amber-600 mb-2" />
      </div>
    );
  };

  return (
    <div className="relative aspect-video w-full bg-[#8BC34A] rounded-2xl overflow-hidden border-4 border-emerald-800 shadow-inner group/yard">
      {/* Background/Sky */}
      <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-sky-300 to-sky-100"></div>

      {/* The House (2.5D background element) */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-48 h-48 drop-shadow-2xl z-10 pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* House Base */}
          <path d="M50 100 L150 100 L150 180 L50 180 Z" fill="#FEF3C7" />
          {/* House Side/Depth */}
          <path d="M150 100 L180 80 L180 160 L150 180 Z" fill="#FDE68A" />
          {/* Roof */}
          <path d="M20 100 L100 40 L180 100 Z" fill="#F87171" />
          {/* Roof Side/Depth */}
          <path d="M100 40 L130 20 L210 80 L180 100 Z" fill="#EF4444" />
          {/* Door */}
          <path d="M85 140 L115 140 L115 180 L85 180 Z" fill="#92400E" />
          {/* Windows */}
          <rect x="60" y="110" width="20" height="20" fill="#E0F2FE" />
          <rect x="120" y="110" width="20" height="20" fill="#E0F2FE" />
        </svg>
      </div>

      {/* The Grid (Yard) - CSS Isometric effect */}
      <div className="absolute bottom-0 inset-x-0 h-[70%] flex justify-center items-end pb-8" style={{ perspective: '1200px' }}>
        <div 
          className="w-[400px] h-[400px] grid grid-cols-10 grid-rows-10 border border-white/20 shadow-2xl bg-emerald-600/20"
          style={{ 
            transform: 'rotateX(60deg) rotateZ(45deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          {Array.from({ length: 100 }).map((_, i) => {
            const x = i % 10;
            const y = Math.floor(i / 10);
            
            // Check for items
            const item = items.find(item => item.x === x && item.y === y);
            
            // Check for pet
            const isPetHere = petPos.x === x && petPos.y === y;

            return (
              <div 
                key={i} 
                onClick={() => handleGridClick(x, y)}
                className={`border border-white/10 relative transition-colors ${placementMode ? 'hover:bg-white/40 cursor-crosshair' : 'hover:bg-white/10 cursor-pointer'}`}
              >
                {/* Render Item (Standing up in 3D space) */}
                {item && (
                  <div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-16 origin-bottom pointer-events-none"
                    style={{ transform: 'rotateZ(-45deg) rotateX(-60deg)' }}
                  >
                    {renderItem(item)}
                  </div>
                )}

                {/* Render Pet */}
                {isPetHere && pet && (
                  <div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 origin-bottom pointer-events-none z-20 flex items-end justify-center transition-all duration-500"
                    style={{ transform: 'rotateZ(-45deg) rotateX(-60deg)' }}
                  >
                    <div className={`relative ${petState === 'idle' ? 'animate-bounce' : ''}`}>
                      {pet.stage === 'egg' ? (
                        <div className="h-10 w-8 bg-amber-100 rounded-full border-2 border-amber-200 shadow-inner mb-2"></div>
                      ) : (
                        <Flame className={`h-12 w-12 text-amber-500 mb-2 ${petState === 'sitting' ? 'scale-y-75 translate-y-2' : ''}`} />
                      )}
                      {petState === 'sitting' && (
                        <div className="absolute -top-6 -right-4 bg-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm whitespace-nowrap">
                          *sitting*
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Placement Mode HUD */}
      {placementMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-3 z-30 animate-fade-in-up">
          <MapPin className="h-5 w-5 text-emerald-400" />
          Click anywhere in the yard to place {placementMode.type}
          <button 
            onClick={() => setPlacementMode(null)}
            className="ml-2 bg-white/20 hover:bg-white/30 rounded-full p-1 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* HUD Overlay */}
      <div className="absolute top-4 right-4 z-30 flex gap-2">
        <button 
          onClick={() => setIsShopOpen(true)}
          className="bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-2xl font-bold text-slate-800 shadow-lg hover:scale-105 transition-transform flex items-center gap-2 border border-slate-200"
        >
          <Store className="h-5 w-5 text-emerald-600" />
          Shop
        </button>
      </div>

      {/* Pet Commands Overlay */}
      <div className="absolute bottom-4 right-4 z-30 flex gap-2">
        <button 
          onClick={() => handlePetCommand('come')}
          className="bg-blue-600/90 text-white px-4 py-2 rounded-xl font-bold shadow-lg hover:bg-blue-700 hover:scale-105 transition-transform flex items-center gap-2 text-sm"
        >
          <Hand className="h-4 w-4" /> Come
        </button>
        <button 
          onClick={() => handlePetCommand('sit')}
          className="bg-indigo-600/90 text-white px-4 py-2 rounded-xl font-bold shadow-lg hover:bg-indigo-700 hover:scale-105 transition-transform flex items-center gap-2 text-sm"
        >
          Sit
        </button>
      </div>

      {/* Furniture Shop Modal */}
      {isShopOpen && (
        <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-black text-xl flex items-center gap-3 text-slate-800">
                <Store className="h-6 w-6 text-emerald-600" />
                Oasis Shop
              </h3>
              <div className="flex items-center gap-4">
                <span className="font-bold text-amber-600 bg-amber-100 px-3 py-1 rounded-full text-sm">
                  {coins} Coins
                </span>
                <button onClick={() => setIsShopOpen(false)} className="text-slate-400 hover:text-slate-800 bg-white rounded-full p-1.5 shadow-sm transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
              {/* Shop Item: Bench */}
              <button 
                onClick={() => {
                  setPlacementMode({ type: 'bench', category: 'furniture', cost: 50 });
                  setIsShopOpen(false);
                }}
                disabled={coins < 50}
                className="border-2 border-slate-100 rounded-2xl p-5 text-center hover:border-emerald-500 hover:shadow-md transition-all group disabled:opacity-50 disabled:hover:border-slate-100 disabled:cursor-not-allowed relative overflow-hidden"
              >
                <div className="h-16 w-16 mx-auto bg-amber-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sofa className="h-8 w-8 text-amber-600" />
                </div>
                <h4 className="font-bold text-slate-800 mb-1">Cozy Bench</h4>
                <p className="text-sm font-black text-amber-500">50 Coins</p>
              </button>

              {/* Shop Item: Plant */}
              <button 
                onClick={() => {
                  setPlacementMode({ type: 'sunflower', category: 'plant', cost: 100 });
                  setIsShopOpen(false);
                }}
                disabled={coins < 100}
                className="border-2 border-slate-100 rounded-2xl p-5 text-center hover:border-emerald-500 hover:shadow-md transition-all group disabled:opacity-50 disabled:hover:border-slate-100 disabled:cursor-not-allowed relative overflow-hidden"
              >
                <div className="h-16 w-16 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Leaf className="h-8 w-8 text-emerald-600" />
                </div>
                <h4 className="font-bold text-slate-800 mb-1">Sunflower Seed</h4>
                <p className="text-sm font-black text-amber-500">100 Coins</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
