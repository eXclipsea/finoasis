'use client';

import { useState, useCallback } from 'react';
import { Settings, X, Sparkles, Trash2, ChevronLeft } from 'lucide-react';
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
  pet: any;
  profile: any;
  bankAccounts: any[];
  user: any;
}

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
};

interface PlacedItem {
  id: string;
  uniqueId: string;
  type: string;
  gridX: number;
  gridY: number;
}

interface Room {
  id: string;
  name: string;
  floorColor: string;
  wallColor: string;
  items: PlacedItem[];
  grid: (string | null)[][];
  position: { x: number; y: number };
}

// ========== ISLAND VIEW ==========
function IslandView({ 
  rooms, 
  onEnterRoom, 
  carrots, 
  outfit,
  onSettings 
}: { 
  rooms: Room[]; 
  onEnterRoom: (id: string) => void;
  carrots: number;
  outfit: string[];
  onSettings: () => void;
}) {
  return (
    <div className="flex flex-col h-screen" style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #B8D4E8 50%, #D4E8D4 100%)' }}>
      {/* Clouds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-12 bg-white/20 rounded-full blur-xl" />
        <div className="absolute top-20 right-20 w-48 h-16 bg-white/15 rounded-full blur-xl" />
        <div className="absolute top-5 left-1/2 w-40 h-14 bg-white/10 rounded-full blur-xl" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3">
        <div className="bg-white/90 px-3 py-1.5 rounded-full shadow-sm">
          <span className="font-bold text-[#6B4423] text-sm">Beanie&apos;s Home</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-full shadow-sm">
          <IsometricCarrot className="w-4 h-5" />
          <span className="font-bold text-[#FF8C42] text-sm">{carrots}</span>
        </div>
      </div>

      {/* Floating rooms */}
      <div className="flex-1 relative">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onEnterRoom(room.id)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
            style={{
              left: `${room.position.x}%`,
              top: `${room.position.y}%`,
            }}
          >
            {/* Room preview */}
            <div 
              className="w-28 h-28 transition-transform group-hover:scale-105"
              style={{
                transform: 'rotateX(60deg) rotateZ(-45deg)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Floor */}
              <div 
                className="absolute inset-0 rounded-lg shadow-xl"
                style={{ backgroundColor: room.floorColor }}
              />
              {/* Wall */}
              <div 
                className="absolute -top-1/3 left-0 right-0 h-1/3 rounded-t-lg"
                style={{ backgroundColor: room.wallColor }}
              />
              {/* Side wall */}
              <div 
                className="absolute top-0 -right-1/3 w-1/3 h-full rounded-r-lg"
                style={{ 
                  backgroundColor: room.wallColor,
                  filter: 'brightness(0.85)',
                  transform: 'rotateY(-90deg)',
                  transformOrigin: 'left'
                }}
              />
            </div>
            
            {/* Label */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md whitespace-nowrap">
              <span className="text-xs font-bold text-[#6B4423]">{room.name}</span>
            </div>
          </button>
        ))}

        {/* Beanie floating */}
        <div 
          className="absolute left-1/2 top-[70%] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="w-16 h-20 animate-bounce" style={{ animationDuration: '3s' }}>
            <IsometricPotato outfit={outfit} />
          </div>
        </div>
      </div>

      {/* Settings button */}
      <div className="pb-6 flex justify-center">
        <button 
          onClick={onSettings}
          className="w-14 h-14 bg-[#D4B896] rounded-full flex items-center justify-center shadow-lg hover:bg-[#C4A574] transition-colors"
        >
          <Settings className="w-6 h-6 text-[#3D2914]" />
        </button>
      </div>
    </div>
  );
}

// ========== ROOM VIEW ==========
function RoomViewInner({
  room,
  onBack,
  carrots,
  inventory,
  placedItems,
  selectedItem,
  setSelectedItem,
  handleBuy,
  handlePlace,
  handleDelete,
  setFloorColor,
  setWallColor,
  outfit,
  setOutfit,
  handleSignOut,
  isAdmin,
  user
}: any) {
  const [activeTab, setActiveTab] = useState<'shop' | 'decorate' | null>(null);
  const allItems = [...FURNITURE_ITEMS, ...PLANT_ITEMS, ...DECOR_ITEMS];

  const canPlace = (itemType: string, x: number, y: number) => {
    const size = FURNITURE_SIZES[itemType] || { width: 1, height: 1 };
    if (x + size.width > GRID_SIZE || y + size.height > GRID_SIZE) return false;
    for (let gy = y; gy < y + size.height; gy++) {
      for (let gx = x; gx < x + size.width; gx++) {
        if (room.grid[gy][gx] !== null) return false;
      }
    }
    return true;
  };

  return (
    <div className="flex flex-col h-screen" style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #B8D4E8 30%, #E8D4B8 100%)' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={onBack} className="flex items-center gap-1 bg-white/90 px-3 py-1.5 rounded-full shadow-sm hover:bg-white">
          <ChevronLeft className="w-4 h-4 text-[#6B4423]" />
          <span className="font-bold text-[#6B4423] text-sm">Island</span>
        </button>
        <div className="bg-white/90 px-4 py-1.5 rounded-full shadow-sm">
          <span className="font-bold text-[#6B4423]">{room.name}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-full shadow-sm border border-[#FF8C42]">
          <IsometricCarrot className="w-4 h-5" />
          <span className="font-bold text-[#FF8C42]">{carrots}</span>
        </div>
      </div>

      {/* Room */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div 
          className="relative"
          style={{
            width: 'min(80vw, 400px)',
            height: 'min(80vw, 400px)',
            transform: 'rotateX(60deg) rotateZ(-45deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Floor */}
          <div 
            className="absolute inset-0 shadow-2xl"
            style={{ 
              backgroundColor: room.floorColor,
              boxShadow: '0 30px 60px rgba(0,0,0,0.3)'
            }}
          >
            {/* Grid */}
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
              const x = idx % GRID_SIZE;
              const y = Math.floor(idx / GRID_SIZE);
              const isOccupied = room.grid[y][x] !== null;
              const isHighlighted = selectedItem && !isOccupied && canPlace(inventory.find((i: any) => i.uniqueId === selectedItem)?.type, x, y);
              
              return (
                <button
                  key={idx}
                  className={`absolute ${isOccupied ? '' : isHighlighted ? 'bg-[#FF8C42]/30' : 'hover:bg-white/10'}`}
                  style={{
                    left: `${x * TILE_SIZE}%`,
                    top: `${y * TILE_SIZE}%`,
                    width: `${TILE_SIZE}%`,
                    height: `${TILE_SIZE}%`,
                    border: '1px solid rgba(0,0,0,0.03)'
                  }}
                  onClick={() => {
                    if (selectedItem && !isOccupied) {
                      const item = inventory.find((i: any) => i.uniqueId === selectedItem);
                      if (item && canPlace(item.type, x, y)) {
                        handlePlace(selectedItem, x, y);
                      }
                    }
                  }}
                />
              );
            })}

            {/* Items */}
            {placedItems.map((item: PlacedItem) => {
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
                >
                  <FurnitureItem type={item.type} className="w-full h-full" />
                </div>
              );
            })}

            {/* Characters */}
            <div
              className="absolute z-10"
              style={{
                left: `${2.5 * TILE_SIZE}%`,
                top: `${2.5 * TILE_SIZE}%`,
                width: '20%',
                height: '20%',
                transform: 'rotateZ(45deg) rotateX(-60deg) translate(-50%, -50%)',
              }}
            >
              <IsometricPotato outfit={outfit} />
            </div>
            <div
              className="absolute z-10"
              style={{
                left: `${4.5 * TILE_SIZE}%`,
                top: `${4.5 * TILE_SIZE}%`,
                width: '15%',
                height: '15%',
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
              backgroundColor: room.wallColor,
              transform: 'rotateX(-90deg)',
            }}
          />
          <div 
            className="absolute top-0 -right-[25%] w-[25%] h-full origin-left"
            style={{ 
              backgroundColor: room.wallColor,
              filter: 'brightness(0.9)',
              transform: 'rotateY(90deg)',
            }}
          />
        </div>
      </div>

      {/* Side panel */}
      {activeTab && (
        <div className="absolute top-16 right-2 w-64 bg-white rounded-xl border-2 border-[#C4A574] shadow-xl z-20 max-h-[55vh] overflow-y-auto">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-[#6B4423]">{activeTab === 'shop' ? '🥕 Shop' : '🎨 Decorate'}</h3>
              <button onClick={() => { setActiveTab(null); setSelectedItem(null); }}>
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
                    className="bg-[#F5EDE4] rounded-lg p-2 disabled:opacity-50"
                  >
                    <FurnitureItem type={item.id} className="w-full h-8" />
                    <div className="text-xs text-[#6B4423] font-bold">{item.price}🥕</div>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'decorate' && (
              <div>
                {inventory.length > 0 && (
                  <>
                    <p className="text-xs text-[#8B7355] mb-1">Tap item, then tap grid</p>
                    <div className="grid grid-cols-3 gap-1 mb-3">
                      {inventory.map((item: any) => (
                        <button
                          key={item.uniqueId}
                          onClick={() => setSelectedItem(selectedItem === item.uniqueId ? null : item.uniqueId)}
                          className={`p-2 rounded-lg border-2 ${selectedItem === item.uniqueId ? 'border-[#FF8C42] bg-[#FF8C42]/20' : 'border-[#E8D4B8]'}`}
                        >
                          <FurnitureItem type={item.type} className="w-full h-8" />
                        </button>
                      ))}
                    </div>
                  </>
                )}
                
                {placedItems.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-[#8B7355] mb-1">Placed items:</p>
                    {placedItems.map((item: PlacedItem) => (
                      <div key={item.uniqueId} className="flex items-center justify-between bg-[#F5EDE4] p-2 rounded mb-1">
                        <span className="text-xs text-[#6B4423]">{item.type}</span>
                        <button onClick={() => handleDelete(item.uniqueId)}><Trash2 className="w-4 h-4 text-red-500" /></button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-bold text-[#6B4423]">Floor</p>
                    <div className="flex gap-1">
                      {FLOOR_COLORS.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setFloorColor(c.color)}
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: c.color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#6B4423]">Wall</p>
                    <div className="flex gap-1">
                      {WALL_COLORS.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setWallColor(c.color)}
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: c.color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom 3 buttons */}
      <div className="pb-4 pt-2 flex justify-center gap-6">
        <button 
          onClick={() => setActiveTab(activeTab === 'decorate' ? null : 'decorate')}
          className={`w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-lg transition-colors ${activeTab === 'decorate' ? 'bg-[#C4A574]' : 'bg-[#D4B896] hover:bg-[#C4A574]'}`}
        >
          <span className="text-xl">🎨</span>
          <span className="text-[10px] text-[#3D2914] font-bold">Decorate</span>
        </button>
        <button 
          onClick={() => setActiveTab(activeTab === 'shop' ? null : 'shop')}
          className={`w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-lg transition-colors ${activeTab === 'shop' ? 'bg-[#C4A574]' : 'bg-[#D4B896] hover:bg-[#C4A574]'}`}
        >
          <IsometricCarrot className="w-6 h-7" />
          <span className="text-[10px] text-[#3D2914] font-bold">Shop</span>
        </button>
        <button 
          onClick={() => { setOutfit([]); handleSignOut(); }}
          className="w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-lg bg-[#D4B896] hover:bg-[#C4A574]"
        >
          <Settings className="w-5 h-5 text-[#3D2914]" />
          <span className="text-[10px] text-[#3D2914] font-bold">Settings</span>
        </button>
      </div>
    </div>
  );
}

// ========== MAIN COMPONENT ==========
export default function RoomViewMain({ yardId, carrots: initialCarrots = 0, pet, profile, bankAccounts = [], user }: RoomViewProps) {
  const router = useRouter();
  const supabase = createClient();
  
  const isAdmin = user?.email === '2landonl10@gmail.com';
  const [carrots, setCarrots] = useState(isAdmin ? 999999 : initialCarrots);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [outfit, setOutfit] = useState<string[]>([]);
  
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 'living-room',
      name: 'Living Room',
      floorColor: '#DEB887',
      wallColor: '#E8D4B8',
      items: [],
      grid: Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)),
      position: { x: 50, y: 55 }
    },
    {
      id: 'bedroom',
      name: 'Bedroom',
      floorColor: '#F5DEB3',
      wallColor: '#FDF8F3',
      items: [],
      grid: Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)),
      position: { x: 20, y: 35 }
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      floorColor: '#F5DEB3',
      wallColor: '#FFE4C4',
      items: [],
      grid: Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)),
      position: { x: 80, y: 35 }
    }
  ]);

  const [inventory, setInventory] = useState<{ id: string; uniqueId: string; type: string; category: string; roomId: string }[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const activeRoom = rooms.find(r => r.id === currentRoom);

  const handleBuy = useCallback((itemId: string, category: string, price: number) => {
    if (!isAdmin && carrots < price) return;
    const roomId = currentRoom || 'living-room';
    const newItem = { id: itemId, uniqueId: `${itemId}-${Date.now()}`, type: itemId, category, roomId };
    setInventory(prev => [...prev, newItem]);
    if (!isAdmin) setCarrots(prev => prev - price);
  }, [carrots, isAdmin, currentRoom]);

  const handlePlace = useCallback((itemId: string, x: number, y: number) => {
    if (!currentRoom) return;
    const item = inventory.find(i => i.uniqueId === itemId);
    if (!item) return;
    
    const size = FURNITURE_SIZES[item.type] || { width: 1, height: 1 };
    
    setRooms(prev => prev.map(room => {
      if (room.id === currentRoom) {
        const newGrid = room.grid.map(row => [...row]);
        for (let gy = y; gy < y + size.height; gy++) {
          for (let gx = x; gx < x + size.width; gx++) {
            newGrid[gy][gx] = item.uniqueId;
          }
        }
        return {
          ...room,
          items: [...room.items, { id: item.id, uniqueId: item.uniqueId, type: item.type, gridX: x, gridY: y }],
          grid: newGrid
        };
      }
      return room;
    }));
    
    setInventory(prev => prev.filter(i => i.uniqueId !== itemId));
    setSelectedItem(null);
  }, [inventory, currentRoom]);

  const handleDelete = useCallback((uniqueId: string) => {
    if (!currentRoom) return;
    
    setRooms(prev => prev.map(room => {
      if (room.id === currentRoom) {
        const item = room.items.find(i => i.uniqueId === uniqueId);
        if (!item) return room;
        
        const size = FURNITURE_SIZES[item.type] || { width: 1, height: 1 };
        const newGrid = room.grid.map(row => [...row]);
        
        for (let y = item.gridY; y < item.gridY + size.height; y++) {
          for (let x = item.gridX; x < item.gridX + size.width; x++) {
            if (newGrid[y] && newGrid[y][x] === uniqueId) newGrid[y][x] = null;
          }
        }
        
        return {
          ...room,
          items: room.items.filter(i => i.uniqueId !== uniqueId),
          grid: newGrid
        };
      }
      return room;
    }));
  }, [currentRoom]);

  const setFloorColor = useCallback((color: string) => {
    if (!currentRoom) return;
    setRooms(prev => prev.map(r => r.id === currentRoom ? { ...r, floorColor: color } : r));
  }, [currentRoom]);

  const setWallColor = useCallback((color: string) => {
    if (!currentRoom) return;
    setRooms(prev => prev.map(r => r.id === currentRoom ? { ...r, wallColor: color } : r));
  }, [currentRoom]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Settings panel for island view
  if (showSettings && !currentRoom) {
    return (
      <div className="flex flex-col h-screen" style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #B8D4E8 50%, #D4E8D4 100%)' }}>
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => setShowSettings(false)} className="bg-white/90 px-3 py-1.5 rounded-full">
            <span className="font-bold text-[#6B4423]">Back</span>
          </button>
          <span className="font-bold text-[#6B4423]">Settings</span>
          <div className="w-16" />
        </div>
        
        <div className="flex-1 p-4">
          <div className="bg-white rounded-xl p-4 max-w-sm mx-auto">
            <p className="text-sm text-[#8B7355] mb-2">{user?.email}</p>
            {isAdmin && <span className="text-xs bg-[#FF8C42]/20 text-[#FF8C42] px-2 py-1 rounded-full">Admin</span>}
            
            <div className="mt-4">
              <p className="text-sm font-bold text-[#6B4423] mb-2">Outfit</p>
              <div className="flex gap-2">
                <button onClick={() => setOutfit(prev => prev.includes('hat') ? prev.filter(o => o !== 'hat') : [...prev, 'hat'])} className={`p-2 rounded-lg ${outfit.includes('hat') ? 'bg-[#FF8C42]' : 'bg-[#F5EDE4]'}`}>🥕</button>
                <button onClick={() => setOutfit(prev => prev.includes('glasses') ? prev.filter(o => o !== 'glasses') : [...prev, 'glasses'])} className={`p-2 rounded-lg ${outfit.includes('glasses') ? 'bg-[#FF8C42]' : 'bg-[#F5EDE4]'}`}>👓</button>
                <button onClick={() => setOutfit(prev => prev.includes('bow') ? prev.filter(o => o !== 'bow') : [...prev, 'bow'])} className={`p-2 rounded-lg ${outfit.includes('bow') ? 'bg-[#FF8C42]' : 'bg-[#F5EDE4]'}`}>🎀</button>
              </div>
            </div>
            
            <button onClick={handleSignOut} className="w-full mt-4 bg-[#A67B5B] text-white py-2 rounded-xl font-bold">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show island or room view
  if (!currentRoom) {
    return (
      <IslandView 
        rooms={rooms} 
        onEnterRoom={setCurrentRoom}
        carrots={carrots}
        outfit={outfit}
        onSettings={() => setShowSettings(true)}
      />
    );
  }

  return (
    <RoomViewInner
      room={activeRoom}
      onBack={() => setCurrentRoom(null)}
      carrots={carrots}
      inventory={inventory.filter(i => i.roomId === currentRoom)}
      placedItems={activeRoom?.items || []}
      selectedItem={selectedItem}
      setSelectedItem={setSelectedItem}
      handleBuy={handleBuy}
      handlePlace={handlePlace}
      handleDelete={handleDelete}
      setFloorColor={setFloorColor}
      setWallColor={setWallColor}
      outfit={outfit}
      setOutfit={setOutfit}
      handleSignOut={handleSignOut}
      isAdmin={isAdmin}
      user={user}
    />
  );
}
