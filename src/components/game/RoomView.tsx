'use client';

import { useState, useCallback } from 'react';
import { Settings, X, Sparkles, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  FurnitureItem, 
  IsometricPotato, 
  IsometricDog,
  IsometricCarrot,
  FURNITURE_ITEMS, 
  PLANT_ITEMS, 
  DECOR_ITEMS,
  WALL_COLORS,
  FLOOR_COLORS,
} from '@/components/game/FurnitureAssets';

interface RoomViewProps {
  yardId: string;
  carrots: number;
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

// Single 6x6 grid
const GRID_SIZE = 6;
const TILE_SIZE = 100 / GRID_SIZE;

const FURNITURE_SIZES: Record<string, { width: number; height: number }> = {
  'dog-bowl': { width: 1, height: 1 },
  'lamp': { width: 1, height: 1 },
  'plant': { width: 1, height: 1 },
  'coffee-cup': { width: 1, height: 1 },
  'toy-ball': { width: 1, height: 1 },
  'cushion': { width: 1, height: 1 },
  'star-sticker': { width: 1, height: 1 },
  'heart-sticker': { width: 1, height: 1 },
  'cloud-sticker': { width: 1, height: 1 },
  'books': { width: 1, height: 1 },
  'picture-frame': { width: 1, height: 1 },
  'chair': { width: 2, height: 1 },
  'dog-bed': { width: 2, height: 1 },
  'bed': { width: 2, height: 2 },
  'table': { width: 2, height: 2 },
  'bookshelf': { width: 2, height: 1 },
  'rug': { width: 3, height: 2 },
  'window': { width: 2, height: 1 },
  'hanging-plant': { width: 1, height: 2 },
  'vines': { width: 2, height: 2 },
  'door': { width: 1, height: 1 },
};

interface PlacedItem {
  id: string;
  uniqueId: string;
  type: string;
  gridX: number;
  gridY: number;
}

// Simple toolbar button
const ToolbarButton = ({ 
  icon, 
  label, 
  active, 
  onClick, 
  badge 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  onClick: () => void;
  badge?: number;
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 ${active ? 'scale-110' : ''}`}
  >
    <div className={`w-16 h-14 flex items-center justify-center transition-all ${
      active 
        ? 'bg-[#C4A574] text-white' 
        : 'bg-[#D4B896] text-[#3D2914] hover:bg-[#C4A574]'
    }`}
    style={{
      borderRadius: '50% 50% 45% 45% / 60% 60% 40% 40%',
      boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
    }}>
      {icon}
    </div>
    <span className={`text-xs font-bold ${active ? 'text-[#6B4423]' : 'text-[#8B7355]'}`}>
      {label}
    </span>
    {badge !== undefined && badge > 0 && (
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF8C42] text-white text-xs rounded-full flex items-center justify-center">
        {badge}
      </span>
    )}
  </button>
);

export default function RoomView({ 
  yardId, 
  carrots: initialCarrots = 0, 
  pet, 
  profile, 
  bankAccounts = [],
  user
}: RoomViewProps) {
  const router = useRouter();
  const supabase = createClient();
  
  const isAdmin = user?.email === '2landonl10@gmail.com';
  const [carrots, setCarrots] = useState(isAdmin ? 999999 : initialCarrots);
  
  // ONE room only
  const [floorColor, setFloorColor] = useState('#DEB887');
  const [wallColor, setWallColor] = useState('#E8D4B8');
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [grid, setGrid] = useState<(string | null)[][]>(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
  );
  
  // UI State
  const [activeTab, setActiveTab] = useState<'shop' | 'decorate' | 'settings' | null>(null);
  const [inventory, setInventory] = useState<{ id: string; uniqueId: string; type: string; category: string }[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [outfit, setOutfit] = useState<string[]>([]);

  const handleBuy = useCallback((itemId: string, category: string, price: number) => {
    if (!isAdmin && carrots < price) return;
    const newItem = { id: itemId, uniqueId: `${itemId}-${Date.now()}`, type: itemId, category };
    setInventory(prev => [...prev, newItem]);
    if (!isAdmin) setCarrots(prev => prev - price);
    setActiveTab('decorate');
    setSelectedItem(newItem.uniqueId);
  }, [carrots, isAdmin]);

  const canPlace = (itemType: string, x: number, y: number): boolean => {
    const size = FURNITURE_SIZES[itemType] || { width: 1, height: 1 };
    if (x + size.width > GRID_SIZE || y + size.height > GRID_SIZE) return false;
    for (let gy = y; gy < y + size.height; gy++) {
      for (let gx = x; gx < x + size.width; gx++) {
        if (grid[gy][gx] !== null) return false;
      }
    }
    return true;
  };

  const handlePlace = useCallback((itemId: string, x: number, y: number) => {
    const item = inventory.find(i => i.uniqueId === itemId);
    if (!item || !canPlace(item.type, x, y)) return;
    
    const size = FURNITURE_SIZES[item.type] || { width: 1, height: 1 };
    const newGrid = grid.map(row => [...row]);
    for (let gy = y; gy < y + size.height; gy++) {
      for (let gx = x; gx < x + size.width; gx++) {
        newGrid[gy][gx] = item.uniqueId;
      }
    }
    
    setGrid(newGrid);
    setPlacedItems(prev => [...prev, { id: item.id, uniqueId: item.uniqueId, type: item.type, gridX: x, gridY: y }]);
    setInventory(prev => prev.filter(i => i.uniqueId !== itemId));
    setSelectedItem(null);
  }, [inventory, grid]);

  const handleDelete = useCallback((uniqueId: string) => {
    const item = placedItems.find(i => i.uniqueId === uniqueId);
    if (!item) return;
    
    const size = FURNITURE_SIZES[item.type] || { width: 1, height: 1 };
    const newGrid = grid.map(row => [...row]);
    for (let y = item.gridY; y < item.gridY + size.height; y++) {
      for (let x = item.gridX; x < item.gridX + size.width; x++) {
        if (newGrid[y] && newGrid[y][x] === uniqueId) newGrid[y][x] = null;
      }
    }
    
    setGrid(newGrid);
    setPlacedItems(prev => prev.filter(i => i.uniqueId !== uniqueId));
  }, [placedItems, grid]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const allItems = [...FURNITURE_ITEMS, ...PLANT_ITEMS, ...DECOR_ITEMS];

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #B8D4E8 30%, #E8D4B8 100%)' }}>
      
      {/* Top bar - simple */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="bg-white/80 px-4 py-2 rounded-full border-2 border-[#C4A574]">
          <span className="font-bold text-[#6B4423]">Beanie&apos;s Room</span>
        </div>
        <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border-2 border-[#FF8C42]">
          <IsometricCarrot className="w-5 h-6" />
          <span className="font-black text-[#FF8C42]">{carrots}</span>
        </div>
      </div>

      {/* Room - centered */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div 
          className="relative"
          style={{
            width: 'min(85vw, 450px)',
            height: 'min(85vw, 450px)',
            transform: 'rotateX(60deg) rotateZ(-45deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Floor */}
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundColor: floorColor,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
          >
            {/* Grid tiles */}
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
              const x = idx % GRID_SIZE;
              const y = Math.floor(idx / GRID_SIZE);
              const isOccupied = grid[y][x] !== null;
              const isHighlighted = selectedItem && !isOccupied;
              
              return (
                <button
                  key={idx}
                  className={`absolute ${isOccupied ? 'bg-black/10' : isHighlighted ? 'bg-[#FF8C42]/40 animate-pulse' : 'hover:bg-white/20'}`}
                  style={{
                    left: `${x * TILE_SIZE}%`,
                    top: `${y * TILE_SIZE}%`,
                    width: `${TILE_SIZE}%`,
                    height: `${TILE_SIZE}%`,
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}
                  onClick={() => selectedItem && !isOccupied && handlePlace(selectedItem, x, y)}
                />
              );
            })}

            {/* Placed items */}
            {placedItems.map((item) => {
              const size = FURNITURE_SIZES[item.type] || { width: 1, height: 1 };
              return (
                <div
                  key={item.uniqueId}
                  className="absolute"
                  style={{
                    left: `${item.gridX * TILE_SIZE}%`,
                    top: `${item.gridY * TILE_SIZE}%`,
                    width: `${size.width * TILE_SIZE}%`,
                    height: `${size.height * TILE_SIZE}%`,
                    transform: 'rotateZ(45deg) rotateX(-60deg)',
                  }}
                  onClick={() => activeTab === 'decorate' && handleDelete(item.uniqueId)}
                >
                  <FurnitureItem type={item.type} className="w-full h-full" />
                </div>
              );
            })}

            {/* Potato */}
            <div
              className="absolute z-10"
              style={{
                left: '40%',
                top: '40%',
                width: '25%',
                height: '25%',
                transform: 'rotateZ(45deg) rotateX(-60deg) translate(-50%, -50%)',
              }}
            >
              <IsometricPotato outfit={outfit} />
            </div>

            {/* Dog */}
            <div
              className="absolute z-10"
              style={{
                left: '65%',
                top: '60%',
                width: '20%',
                height: '20%',
                transform: 'rotateZ(45deg) rotateX(-60deg) translate(-50%, -50%)',
              }}
            >
              <IsometricDog />
            </div>
          </div>

          {/* Walls */}
          <div 
            className="absolute -top-[25%] left-0 right-0 h-[25%] origin-bottom"
            style={{ 
              backgroundColor: wallColor,
              transform: 'rotateX(-90deg)',
              transformOrigin: 'bottom'
            }}
          />
          <div 
            className="absolute top-0 -right-[25%] w-[25%] h-full origin-left"
            style={{ 
              backgroundColor: wallColor,
              filter: 'brightness(0.9)',
              transform: 'rotateY(90deg)',
              transformOrigin: 'left'
            }}
          />
        </div>
      </div>

      {/* Side panel */}
      {activeTab && (
        <div className="absolute top-20 right-4 w-72 bg-white rounded-2xl border-2 border-[#C4A574] shadow-xl z-20 max-h-[60vh] overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#6B4423]">
                {activeTab === 'shop' && '🥕 Shop'}
                {activeTab === 'decorate' && '🎨 Decorate'}
                {activeTab === 'settings' && '⚙️ Settings'}
              </h3>
              <button onClick={() => { setActiveTab(null); setSelectedItem(null); }} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-[#6B4423]" />
              </button>
            </div>

            {activeTab === 'shop' && (
              <div className="grid grid-cols-2 gap-2">
                {allItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleBuy(item.id, item.category, item.price)}
                    disabled={!isAdmin && carrots < item.price}
                    className="bg-[#F5EDE4] hover:bg-[#E8D4B8] rounded-xl p-2 disabled:opacity-50"
                  >
                    <FurnitureItem type={item.id} className="w-full h-10" />
                    <div className="text-xs font-bold text-[#6B4423] mt-1">{item.name}</div>
                    <div className="flex items-center justify-center gap-1">
                      <IsometricCarrot className="w-3 h-4" />
                      <span className="text-xs text-[#FF8C42] font-bold">{item.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'decorate' && (
              <div>
                {inventory.length === 0 ? (
                  <p className="text-sm text-[#8B7355] text-center py-4">Buy items from the shop!</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {inventory.map((item) => (
                      <button
                        key={item.uniqueId}
                        onClick={() => setSelectedItem(selectedItem === item.uniqueId ? null : item.uniqueId)}
                        className={`p-2 rounded-xl border-2 ${selectedItem === item.uniqueId ? 'border-[#FF8C42] bg-[#FF8C42]/20' : 'border-[#E8D4B8] bg-white'}`}
                      >
                        <FurnitureItem type={item.type} className="w-full h-8" />
                      </button>
                    ))}
                  </div>
                )}
                
                {placedItems.length > 0 && (
                  <div>
                    <p className="text-xs text-[#8B7355] mb-2">Tap items in room to remove</p>
                    <div className="space-y-1">
                      {placedItems.map((item) => (
                        <div key={item.uniqueId} className="flex items-center justify-between bg-[#F5EDE4] p-2 rounded-lg">
                          <span className="text-sm text-[#6B4423]">{item.type}</span>
                          <button onClick={() => handleDelete(item.uniqueId)} className="text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-[#E8D4B8]">
                  <p className="text-xs font-bold text-[#6B4423] mb-2">Floor Color</p>
                  <div className="flex gap-2">
                    {FLOOR_COLORS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setFloorColor(c.color)}
                        className={`w-8 h-8 rounded-lg border-2 ${floorColor === c.color ? 'border-[#6B4423]' : 'border-[#E8D4B8]'}`}
                        style={{ backgroundColor: c.color }}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-bold text-[#6B4423] mb-2 mt-3">Wall Color</p>
                  <div className="flex gap-2">
                    {WALL_COLORS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setWallColor(c.color)}
                        className={`w-8 h-8 rounded-lg border-2 ${wallColor === c.color ? 'border-[#6B4423]' : 'border-[#E8D4B8]'}`}
                        style={{ backgroundColor: c.color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-3">
                <div className="bg-[#F5EDE4] rounded-xl p-3">
                  <p className="text-xs text-[#8B7355]">{user?.email}</p>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FF8C42]/20 text-[#FF8C42] rounded-full text-xs">
                      <Sparkles className="w-3 h-3" /> Admin
                    </span>
                  )}
                </div>
                
                <div>
                  <p className="text-xs font-bold text-[#6B4423] mb-2">Outfit</p>
                  <div className="flex gap-2">
                    <button onClick={() => setOutfit(prev => prev.includes('hat') ? prev.filter(o => o !== 'hat') : [...prev, 'hat'])} className={`p-2 rounded-lg ${outfit.includes('hat') ? 'bg-[#FF8C42] text-white' : 'bg-[#F5EDE4]'}`}>🥕</button>
                    <button onClick={() => setOutfit(prev => prev.includes('glasses') ? prev.filter(o => o !== 'glasses') : [...prev, 'glasses'])} className={`p-2 rounded-lg ${outfit.includes('glasses') ? 'bg-[#FF8C42] text-white' : 'bg-[#F5EDE4]'}`}>👓</button>
                    <button onClick={() => setOutfit(prev => prev.includes('bow') ? prev.filter(o => o !== 'bow') : [...prev, 'bow'])} className={`p-2 rounded-lg ${outfit.includes('bow') ? 'bg-[#FF8C42] text-white' : 'bg-[#F5EDE4]'}`}>🎀</button>
                  </div>
                </div>
                
                <button onClick={handleSignOut} className="w-full bg-[#A67B5B] text-white font-bold py-2 rounded-xl">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom toolbar - 3 buttons */}
      <div className="pb-6 pt-2 flex justify-center">
        <div className="flex items-center gap-8">
          <ToolbarButton
            icon={<span className="text-xl">🎨</span>}
            label="Decorate"
            active={activeTab === 'decorate'}
            onClick={() => setActiveTab(activeTab === 'decorate' ? null : 'decorate')}
            badge={inventory.length}
          />
          <ToolbarButton
            icon={<IsometricCarrot className="w-7 h-8" />}
            label="Shop"
            active={activeTab === 'shop'}
            onClick={() => setActiveTab(activeTab === 'shop' ? null : 'shop')}
          />
          <ToolbarButton
            icon={<Settings className="w-6 h-6" />}
            label="Settings"
            active={activeTab === 'settings'}
            onClick={() => setActiveTab(activeTab === 'settings' ? null : 'settings')}
          />
        </div>
      </div>
    </div>
  );
}
