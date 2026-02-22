'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Settings, 
  X,
  Sparkles,
  ChevronLeft,
  Trash2
} from 'lucide-react';
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

// Grid tile system - 6x6 grid
const GRID_SIZE = 6;
const TILE_SIZE = 100 / GRID_SIZE;

// Furniture sizes in tiles
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

interface GridItem {
  id: string;
  uniqueId: string;
  type: string;
  category: 'furniture' | 'plant' | 'decor';
  gridX: number;
  gridY: number;
  rotation: number;
}

interface Room {
  id: string;
  name: string;
  floorColor: string;
  wallColor: string;
  items: GridItem[];
  grid: (string | null)[][];
  unlocked: boolean;
  unlockPrice: number;
  position: { x: number; y: number };
}

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
    className={`relative group flex flex-col items-center transition-all duration-200 ${active ? 'scale-110' : ''}`}
  >
    <div className={`relative w-16 h-16 transition-all duration-200 ${
      active 
        ? 'bg-gradient-to-br from-[#C4A574] to-[#A68B5B]' 
        : 'bg-gradient-to-br from-[#D4B896] to-[#C4A574] hover:from-[#C4A574] hover:to-[#A68B5B]'
    }`}
    style={{
      borderRadius: '60% 40% 50% 50% / 50% 60% 40% 50%',
      boxShadow: active 
        ? '0 8px 20px rgba(196, 165, 116, 0.5), inset 0 -3px 0 rgba(0,0,0,0.1)' 
        : '0 4px 12px rgba(0,0,0,0.15), inset 0 -2px 0 rgba(0,0,0,0.1)'
    }}>
      <div className="absolute inset-0 flex items-center justify-center text-[#3D2914]">
        {icon}
      </div>
      {badge !== undefined && badge > 0 && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF8C42] rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-[#F5EDE4]">
          {badge}
        </div>
      )}
    </div>
    <span className={`mt-2 text-xs font-bold ${active ? 'text-[#6B4423]' : 'text-[#8B7355]'} group-hover:text-[#6B4423]`}>
      {label}
    </span>
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
  
  const [gameMode, setGameMode] = useState<'island' | 'room'>('island');
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 'living-room',
      name: 'Living Room',
      floorColor: '#DEB887',
      wallColor: '#E8D4B8',
      items: [],
      grid: Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)),
      unlocked: true,
      unlockPrice: 0,
      position: { x: 50, y: 60 }
    },
    {
      id: 'bedroom',
      name: 'Bedroom',
      floorColor: '#F5DEB3',
      wallColor: '#FDF8F3',
      items: [],
      grid: Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)),
      unlocked: false,
      unlockPrice: 500,
      position: { x: 20, y: 35 }
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      floorColor: '#F5DEB3',
      wallColor: '#FFE4C4',
      items: [],
      grid: Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)),
      unlocked: false,
      unlockPrice: 800,
      position: { x: 80, y: 35 }
    }
  ]);
  
  const currentRoom = rooms.find(r => r.id === currentRoomId) || null;
  
  const [activeTab, setActiveTab] = useState<'shop' | 'decorate' | 'settings' | null>(null);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<string | null>(null);
  const [inventory, setInventory] = useState<{ id: string; uniqueId: string; type: string; category: string }[]>([]);
  const [potatoPosition, setPotatoPosition] = useState({ x: 3, y: 3 });
  const [dogPosition, setDogPosition] = useState({ x: 2, y: 4 });
  const [outfit, setOutfit] = useState<string[]>([]);
  const [selectedRoomItem, setSelectedRoomItem] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8 && gameMode === 'room') {
        const potato = document.getElementById('potato-character');
        if (potato) {
          potato.style.transform = 'translate(-50%, -60%) scale(1.05)';
          setTimeout(() => {
            potato.style.transform = 'translate(-50%, -50%) scale(1)';
          }, 200);
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [gameMode]);

  const handleBuyItem = useCallback((itemId: string, category: string, price: number) => {
    if (!isAdmin && carrots < price) return;
    
    const newItem = {
      id: itemId,
      uniqueId: `${itemId}-${Date.now()}`,
      type: itemId,
      category
    };
    
    setInventory(prev => [...prev, newItem]);
    if (!isAdmin) {
      setCarrots(prev => prev - price);
    }
    
    setActiveTab('decorate');
    setSelectedInventoryItem(newItem.uniqueId);
  }, [carrots, isAdmin]);

  const canPlaceItem = (room: Room, itemType: string, gridX: number, gridY: number): boolean => {
    const size = FURNITURE_SIZES[itemType] || { width: 1, height: 1 };
    
    if (gridX + size.width > GRID_SIZE || gridY + size.height > GRID_SIZE) return false;
    if (gridX < 0 || gridY < 0) return false;
    
    for (let y = gridY; y < gridY + size.height; y++) {
      for (let x = gridX; x < gridX + size.width; x++) {
        if (room.grid[y][x] !== null) return false;
      }
    }
    return true;
  };

  const handlePlaceItem = useCallback((itemUniqueId: string, gridX: number, gridY: number) => {
    if (!currentRoomId) return;
    
    const inventoryItem = inventory.find(i => i.uniqueId === itemUniqueId);
    if (!inventoryItem) return;
    
    const room = rooms.find(r => r.id === currentRoomId);
    if (!room) return;
    
    if (!canPlaceItem(room, inventoryItem.type, gridX, gridY)) return;
    
    const size = FURNITURE_SIZES[inventoryItem.type] || { width: 1, height: 1 };
    
    setRooms(prev => prev.map(r => {
      if (r.id === currentRoomId) {
        const newGrid = r.grid.map(row => [...row]);
        for (let y = gridY; y < gridY + size.height; y++) {
          for (let x = gridX; x < gridX + size.width; x++) {
            newGrid[y][x] = inventoryItem.uniqueId;
          }
        }
        
        return {
          ...r,
          items: [...r.items, {
            id: inventoryItem.id,
            uniqueId: inventoryItem.uniqueId,
            type: inventoryItem.type,
            category: inventoryItem.category as any,
            gridX,
            gridY,
            rotation: 0
          }],
          grid: newGrid
        };
      }
      return r;
    }));
    
    setInventory(prev => prev.filter(i => i.uniqueId !== itemUniqueId));
    setSelectedInventoryItem(null);
  }, [currentRoomId, inventory, rooms]);

  const handleDeleteItem = useCallback((uniqueId: string) => {
    if (!currentRoomId) return;
    
    setRooms(prev => prev.map(r => {
      if (r.id === currentRoomId) {
        const item = r.items.find(i => i.uniqueId === uniqueId);
        if (!item) return r;
        
        const size = FURNITURE_SIZES[item.type] || { width: 1, height: 1 };
        const newGrid = r.grid.map(row => [...row]);
        
        for (let y = item.gridY; y < item.gridY + size.height; y++) {
          for (let x = item.gridX; x < item.gridX + size.width; x++) {
            if (newGrid[y] && newGrid[y][x] === uniqueId) {
              newGrid[y][x] = null;
            }
          }
        }
        
        return {
          ...r,
          items: r.items.filter(i => i.uniqueId !== uniqueId),
          grid: newGrid
        };
      }
      return r;
    }));
    
    setSelectedRoomItem(null);
  }, [currentRoomId]);

  const handleUnlockRoom = useCallback((roomId: string, price: number) => {
    if (!isAdmin && carrots < price) return;
    
    setRooms(prev => prev.map(r => 
      r.id === roomId ? { ...r, unlocked: true } : r
    ));
    
    if (!isAdmin) {
      setCarrots(prev => prev - price);
    }
  }, [carrots, isAdmin]);

  const handleColorChange = useCallback((type: 'floor' | 'wall', color: string) => {
    if (!currentRoomId) return;
    
    setRooms(prev => prev.map(room => {
      if (room.id === currentRoomId) {
        return { 
          ...room, 
          [type === 'floor' ? 'floorColor' : 'wallColor']: color 
        };
      }
      return room;
    }));
  }, [currentRoomId]);

  const handleEnterRoom = (roomId: string) => {
    setCurrentRoomId(roomId);
    setGameMode('room');
    setActiveTab(null);
  };

  const handleExitRoom = () => {
    setGameMode('island');
    setCurrentRoomId(null);
    setActiveTab(null);
    setSelectedRoomItem(null);
    setSelectedInventoryItem(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // ISLAND VIEW
  if (gameMode === 'island') {
    return (
      <div className="flex flex-col h-screen overflow-hidden relative" 
           style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #B8E0F0 50%, #E0F0F8 100%)' }}>
        
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[5%] w-32 h-16 bg-white/40 rounded-full blur-xl" />
          <div className="absolute top-[20%] right-[10%] w-48 h-20 bg-white/30 rounded-full blur-xl" />
          <div className="absolute top-[5%] left-[40%] w-40 h-16 bg-white/25 rounded-full blur-xl" />
          <div className="absolute bottom-[30%] left-[15%] w-36 h-14 bg-white/20 rounded-full blur-xl" />
          <div className="absolute bottom-[40%] right-[20%] w-44 h-18 bg-white/25 rounded-full blur-xl" />
        </div>

        <div className="relative z-20 flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full border-2 border-white/50 shadow-lg">
              <span className="font-black text-[#6B4423]">Beanie&apos;s Island</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur px-4 py-2 rounded-full border-2 border-[#FF8C42] shadow-lg">
            <IsometricCarrot className="w-5 h-7" />
            <span className="font-black text-[#FF8C42] text-lg">{carrots}</span>
          </div>
        </div>

        <div className="flex-1 relative">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${room.position.x}%`,
                top: `${room.position.y}%`,
                width: '180px',
                height: '180px'
              }}
            >
              {!room.unlocked ? (
                <button
                  onClick={() => handleUnlockRoom(room.id, room.unlockPrice)}
                  className="w-full h-full relative group"
                >
                  <div className="absolute inset-0 bg-[#D4B896]/30 rounded-2xl border-2 border-dashed border-[#8B7355]/50 backdrop-blur-sm" 
                       style={{
                         transform: 'rotateX(60deg) rotateZ(-45deg)',
                         transformStyle: 'preserve-3d'
                       }}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-3xl mb-2">🔒</div>
                      <div className="flex items-center gap-1 bg-white/80 px-2 py-1 rounded-full">
                        <IsometricCarrot className="w-3 h-4" />
                        <span className="text-xs font-bold text-[#6B4423]">{room.unlockPrice}</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                    <span className="text-xs font-bold text-[#8B7355]">{room.name}</span>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => handleEnterRoom(room.id)}
                  className="w-full h-full relative group"
                >
                  <div 
                    className="absolute inset-0 rounded-2xl shadow-2xl transition-all duration-300 group-hover:scale-105"
                    style={{
                      backgroundColor: room.floorColor,
                      transform: 'rotateX(60deg) rotateZ(-45deg)',
                      transformStyle: 'preserve-3d',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.2), -10px 10px 20px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div 
                      className="absolute -top-[30%] left-0 right-0 h-[30%]"
                      style={{ backgroundColor: room.wallColor }}
                    />
                    <div 
                      className="absolute -top-[30%] right-0 w-[30%] h-full origin-right"
                      style={{ 
                        backgroundColor: room.wallColor,
                        filter: 'brightness(0.9)',
                        transform: 'rotateY(-90deg)',
                        transformOrigin: 'right center'
                      }}
                    />
                    
                    {room.items.slice(0, 3).map((item) => (
                      <div
                        key={item.uniqueId}
                        className="absolute w-4 h-4"
                        style={{
                          left: `${20 + (item.gridX * 12)}%`,
                          top: `${20 + (item.gridY * 12)}%`
                        }}
                      >
                        <FurnitureItem type={item.type} className="w-full h-full" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white/95 px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
                    <span className="text-sm font-black text-[#6B4423]">{room.name}</span>
                  </div>
                  
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold text-white bg-[#6B4423]/80 px-3 py-1 rounded-full">Tap to Enter</span>
                  </div>
                </button>
              )}
            </div>
          ))}
          
          <div 
            className="absolute pointer-events-none"
            style={{
              left: '50%',
              top: '75%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="w-20 h-24 animate-bounce" style={{ animationDuration: '3s' }}>
              <IsometricPotato outfit={outfit} />
            </div>
          </div>
        </div>

        <div className="relative z-20 pb-6 pt-2">
          <div className="flex items-center justify-center gap-6">
            <ToolbarButton
              icon={<Settings className="w-7 h-7" />}
              label="Settings"
              active={activeTab === 'settings'}
              onClick={() => setActiveTab(activeTab === 'settings' ? null : 'settings')}
            />
          </div>
        </div>

        {activeTab === 'settings' && (
          <div className="absolute top-[80px] right-4 w-72 bg-white/95 backdrop-blur-xl rounded-3xl border-2 border-[#C9B77D] shadow-2xl z-30 max-h-[60vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-[#6B4423]">⚙️ Settings</h2>
                <button 
                  onClick={() => setActiveTab(null)}
                  className="p-2 hover:bg-[#F5EDE4] rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-[#6B4423]" />
                </button>
              </div>
              <SettingsPanel 
                onSignOut={handleSignOut}
                user={user}
                isAdmin={isAdmin}
                outfit={outfit}
                onOutfitChange={setOutfit}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // ROOM VIEW
  return (
    <div className="flex flex-col h-screen overflow-hidden relative"
         style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #B8D4E8 40%, #D4E8D4 70%, #E8D4B8 100%)' }}>
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] left-[10%] w-48 h-20 bg-white/25 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-[15%] right-[15%] w-56 h-24 bg-white/20 rounded-full blur-2xl" style={{ animation: 'float 6s ease-in-out infinite' }} />
        <div className="absolute top-[8%] left-[50%] w-40 h-16 bg-white/15 rounded-full blur-2xl" />
      </div>

      <div className="relative z-20 flex items-center justify-between px-4 py-3">
        <button 
          onClick={handleExitRoom}
          className="flex items-center gap-2 bg-white/90 backdrop-blur px-4 py-2 rounded-full border-2 border-white/50 shadow-lg hover:bg-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-[#6B4423]" />
          <span className="font-bold text-[#6B4423]">Island</span>
        </button>
        
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur px-4 py-2 rounded-full border-2 border-[#FF8C42] shadow-lg">
          <IsometricCarrot className="w-5 h-7" />
          <span className="font-black text-[#FF8C42] text-lg">{carrots}</span>
        </div>
      </div>

      <div className="relative z-20 text-center mb-2">
        <h1 className="text-2xl font-black text-[#6B4423] drop-shadow-lg">{currentRoom?.name}</h1>
      </div>

      <div className="flex-1 relative flex items-center justify-center p-4">
        <div 
          className="relative"
          style={{
            width: 'min(90vw, 500px)',
            height: 'min(90vw, 500px)',
            transform: 'rotateX(60deg) rotateZ(-45deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          <div 
            className="absolute inset-0 shadow-2xl"
            style={{ 
              backgroundColor: currentRoom?.floorColor || '#DEB887',
              boxShadow: '0 30px 60px rgba(0,0,0,0.3), -20px 20px 40px rgba(0,0,0,0.2)'
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
              const x = idx % GRID_SIZE;
              const y = Math.floor(idx / GRID_SIZE);
              const isOccupied = currentRoom?.grid[y][x] !== null;
              const isSelected = selectedInventoryItem && !isOccupied;
              
              return (
                <button
                  key={idx}
                  className={`absolute transition-all duration-200 ${
                    isOccupied 
                      ? 'bg-black/10' 
                      : isSelected
                        ? 'bg-[#FF8C42]/30 hover:bg-[#FF8C42]/50 cursor-pointer'
                        : 'hover:bg-white/20'
                  }`}
                  style={{
                    left: `${x * TILE_SIZE}%`,
                    top: `${y * TILE_SIZE}%`,
                    width: `${TILE_SIZE}%`,
                    height: `${TILE_SIZE}%`,
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}
                  onClick={() => {
                    if (selectedInventoryItem && !isOccupied) {
                      handlePlaceItem(selectedInventoryItem, x, y);
                    }
                  }}
                  disabled={!selectedInventoryItem || isOccupied}
                >
                  {isSelected && !isOccupied && (
                    <div className="absolute inset-2 border-2 border-dashed border-[#FF8C42] rounded" />
                  )}
                </button>
              );
            })}

            {currentRoom?.items.map((item) => {
              const size = FURNITURE_SIZES[item.type] || { width: 1, height: 1 };
              const isSelected = selectedRoomItem === item.uniqueId;
              
              return (
                <div
                  key={item.uniqueId}
                  className={`absolute transition-all duration-200 ${
                    isSelected ? 'z-20' : 'z-10'
                  }`}
                  style={{
                    left: `${item.gridX * TILE_SIZE}%`,
                    top: `${item.gridY * TILE_SIZE}%`,
                    width: `${size.width * TILE_SIZE}%`,
                    height: `${size.height * TILE_SIZE}%`,
                    transform: `rotateZ(45deg) rotateX(-60deg) ${isSelected ? 'scale(1.2) translateY(-10px)' : ''}`,
                    transformStyle: 'preserve-3d'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (activeTab === 'decorate') {
                      setSelectedRoomItem(isSelected ? null : item.uniqueId);
                    }
                  }}
                >
                  <div className={`relative w-full h-full ${isSelected ? 'ring-4 ring-[#FF8C42] ring-opacity-50' : ''}`}>
                    <FurnitureItem type={item.type} className="w-full h-full drop-shadow-xl" />
                  </div>
                </div>
              );
            })}

            <div
              id="potato-character"
              className="absolute z-30 transition-all duration-300"
              style={{
                left: `${potatoPosition.x * TILE_SIZE + TILE_SIZE/2}%`,
                top: `${potatoPosition.y * TILE_SIZE + TILE_SIZE/2}%`,
                width: `${TILE_SIZE * 1.5}%`,
                height: `${TILE_SIZE * 1.5}%`,
                transform: 'rotateZ(45deg) rotateX(-60deg) translate(-50%, -50%)',
                transformStyle: 'preserve-3d'
              }}
            >
              <IsometricPotato outfit={outfit} className="w-full h-full drop-shadow-2xl" />
            </div>

            <div
              className="absolute z-25 transition-all duration-1000"
              style={{
                left: `${dogPosition.x * TILE_SIZE + TILE_SIZE/2}%`,
                top: `${dogPosition.y * TILE_SIZE + TILE_SIZE/2}%`,
                width: `${TILE_SIZE}%`,
                height: `${TILE_SIZE}%`,
                transform: 'rotateZ(45deg) rotateX(-60deg) translate(-50%, -50%)',
                transformStyle: 'preserve-3d'
              }}
            >
              <IsometricDog className="w-full h-full drop-shadow-xl" />
            </div>
          </div>

          <div 
            className="absolute -top-[30%] left-0 right-0 h-[30%] origin-bottom"
            style={{ 
              backgroundColor: currentRoom?.wallColor || '#E8D4B8',
              transform: 'rotateX(-90deg)',
              transformOrigin: 'bottom'
            }}
          />
          <div 
            className="absolute top-0 -right-[30%] w-[30%] h-full origin-left"
            style={{ 
              backgroundColor: currentRoom?.wallColor || '#E8D4B8',
              filter: 'brightness(0.85)',
              transform: 'rotateY(90deg)',
              transformOrigin: 'left'
            }}
          />
        </div>
      </div>

      {activeTab && (
        <div className="absolute top-[80px] right-4 w-80 bg-white/95 backdrop-blur-xl rounded-3xl border-2 border-[#C9B77D] shadow-2xl z-30 max-h-[65vh] overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-[#6B4423]">
                {activeTab === 'shop' && '🥕 Shop'}
                {activeTab === 'decorate' && '🎨 Decorate'}
                {activeTab === 'settings' && '⚙️ Settings'}
              </h2>
              <button 
                onClick={() => { setActiveTab(null); setSelectedRoomItem(null); setSelectedInventoryItem(null); }}
                className="p-2 hover:bg-[#F5EDE4] rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-[#6B4423]" />
              </button>
            </div>

            {activeTab === 'shop' && currentRoom && (
              <ShopPanel 
                carrots={carrots} 
                onBuy={handleBuyItem} 
                isAdmin={isAdmin}
              />
            )}

            {activeTab === 'decorate' && currentRoom && (
              <DecoratePanel 
                inventory={inventory}
                selectedInventoryItem={selectedInventoryItem}
                selectedRoomItem={selectedRoomItem}
                onSelectInventoryItem={setSelectedInventoryItem}
                onDelete={handleDeleteItem}
                onColorChange={handleColorChange}
                currentFloorColor={currentRoom.floorColor}
                currentWallColor={currentRoom.wallColor}
                roomItems={currentRoom.items}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsPanel 
                onSignOut={handleSignOut} 
                user={user} 
                isAdmin={isAdmin}
                outfit={outfit}
                onOutfitChange={setOutfit}
              />
            )}
          </div>
        </div>
      )}

      <div className="relative z-20 pb-6 pt-2">
        <div className="flex items-center justify-center gap-6">
          <ToolbarButton
            icon={<div className="text-2xl">🎨</div>}
            label="Decorate"
            active={activeTab === 'decorate'}
            onClick={() => setActiveTab(activeTab === 'decorate' ? null : 'decorate')}
            badge={inventory.length}
          />
          
          <ToolbarButton
            icon={<IsometricCarrot className="w-8 h-10" />}
            label="Shop"
            active={activeTab === 'shop'}
            onClick={() => setActiveTab(activeTab === 'shop' ? null : 'shop')}
          />
          
          <ToolbarButton
            icon={<Settings className="w-7 h-7" />}
            label="Settings"
            active={activeTab === 'settings'}
            onClick={() => setActiveTab(activeTab === 'settings' ? null : 'settings')}
          />
        </div>
      </div>
    </div>
  );
}

function ShopPanel({ 
  carrots, 
  onBuy, 
  isAdmin,
}: { 
  carrots: number; 
  onBuy: (id: string, category: string, price: number) => void;
  isAdmin: boolean;
}) {
  const [category, setCategory] = useState<'all' | 'furniture' | 'plants' | 'decor'>('all');
  
  const items = category === 'all' 
    ? [...FURNITURE_ITEMS, ...PLANT_ITEMS, ...DECOR_ITEMS]
    : category === 'furniture' 
      ? FURNITURE_ITEMS
      : category === 'plants'
        ? PLANT_ITEMS
        : DECOR_ITEMS;

  return (
    <div className="space-y-4">
      <div className="flex gap-1 overflow-x-auto pb-2">
        {(['all', 'furniture', 'plants', 'decor'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              category === cat 
                ? 'bg-[#FF8C42] text-white' 
                : 'bg-[#F5EDE4] text-[#8B7355] hover:bg-[#E6D5C3]'
            }`}
          >
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onBuy(item.id, item.category, item.price)}
            disabled={!isAdmin && carrots < item.price}
            className="bg-white hover:bg-[#FFF8F3] border-2 border-[#E6D5C3] hover:border-[#FF8C42] rounded-2xl p-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <div className="flex justify-center mb-2 h-12">
              <FurnitureItem type={item.id} className="group-hover:scale-110 transition-transform max-h-full" />
            </div>
            <div className="font-bold text-[#6B4423] text-xs text-center leading-tight">{item.name}</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              <IsometricCarrot className="w-3 h-4" />
              <span className={`text-sm font-black ${isAdmin || carrots >= item.price ? 'text-[#FF8C42]' : 'text-red-400'}`}>
                {isAdmin ? 'FREE' : item.price}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function DecoratePanel({
  inventory,
  selectedInventoryItem,
  selectedRoomItem,
  onSelectInventoryItem,
  onDelete,
  onColorChange,
  currentFloorColor,
  currentWallColor,
  roomItems,
}: {
  inventory: { uniqueId: string; type: string; category: string }[];
  selectedInventoryItem: string | null;
  selectedRoomItem: string | null;
  onSelectInventoryItem: (id: string | null) => void;
  onDelete: (id: string) => void;
  onColorChange: (type: 'floor' | 'wall', color: string) => void;
  currentFloorColor: string;
  currentWallColor: string;
  roomItems: GridItem[];
}) {
  const [activeSection, setActiveSection] = useState<'inventory' | 'colors' | 'placed'>('inventory');

  return (
    <div className="space-y-4">
      <div className="flex gap-1">
        {(['inventory', 'colors', 'placed'] as const).map(section => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeSection === section 
                ? 'bg-[#A67B5B] text-white' 
                : 'bg-[#F5EDE4] text-[#8B7355] hover:bg-[#E6D5C3]'
            }`}
          >
            {section === 'inventory' && `Items (${inventory.length})`}
            {section === 'colors' && 'Colors'}
            {section === 'placed' && `Placed (${roomItems.length})`}
          </button>
        ))}
      </div>

      {activeSection === 'inventory' && (
        <div>
          <p className="text-xs text-[#8B7355] mb-3">
            {selectedInventoryItem 
              ? "Tap a highlighted tile to place!" 
              : "Tap an item to select it for placement"}
          </p>
          {inventory.length === 0 ? (
            <p className="text-xs text-[#8B7355] text-center py-4">Your inventory is empty! Buy items from the shop.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {inventory.map((item) => (
                <button
                  key={item.uniqueId}
                  onClick={() => onSelectInventoryItem(
                    selectedInventoryItem === item.uniqueId ? null : item.uniqueId
                  )}
                  className={`rounded-xl p-2 transition-all ${
                    selectedInventoryItem === item.uniqueId
                      ? 'bg-[#FF8C42]/20 border-2 border-[#FF8C42] ring-2 ring-[#FF8C42]/30'
                      : 'bg-white border-2 border-[#E6D5C3] hover:border-[#FF8C42]'
                  }`}
                >
                  <FurnitureItem type={item.type} className="w-full h-10" />
                  {selectedInventoryItem === item.uniqueId && (
                    <div className="mt-1 text-[10px] font-bold text-[#FF8C42] text-center">SELECTED</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSection === 'colors' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-[#6B4423] mb-2 text-sm">Floor Color</h3>
            <div className="flex gap-2 flex-wrap">
              {FLOOR_COLORS.map(color => (
                <button
                  key={color.id}
                  onClick={() => onColorChange('floor', color.color)}
                  className={`w-10 h-10 rounded-xl border-2 transition-all ${
                    currentFloorColor === color.color 
                      ? 'border-[#6B4423] scale-110' 
                      : 'border-[#E6D5C3] hover:border-[#A67B5B]'
                  }`}
                  style={{ backgroundColor: color.color }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-[#6B4423] mb-2 text-sm">Wall Color</h3>
            <div className="flex gap-2 flex-wrap">
              {WALL_COLORS.map(color => (
                <button
                  key={color.id}
                  onClick={() => onColorChange('wall', color.color)}
                  className={`w-10 h-10 rounded-xl border-2 transition-all ${
                    currentWallColor === color.color 
                      ? 'border-[#6B4423] scale-110' 
                      : 'border-[#E6D5C3] hover:border-[#A67B5B]'
                  }`}
                  style={{ backgroundColor: color.color }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSection === 'placed' && (
        <div>
          {roomItems.length === 0 ? (
            <p className="text-xs text-[#8B7355] text-center py-4">No items placed yet!</p>
          ) : (
            <div className="space-y-2">
              {roomItems.map((item) => (
                <div 
                  key={item.uniqueId}
                  className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${
                    selectedRoomItem === item.uniqueId 
                      ? 'bg-[#FF8C42]/20 border-2 border-[#FF8C42]' 
                      : 'bg-white border-2 border-[#E6D5C3]'
                  }`}
                >
                  <div className="w-12 h-12">
                    <FurnitureItem type={item.type} className="w-full h-full" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-[#6B4423] text-sm">{item.type}</div>
                    <div className="text-xs text-[#8B7355]">Pos: {item.gridX}, {item.gridY}</div>
                  </div>
                  <button
                    onClick={() => onDelete(item.uniqueId)}
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SettingsPanel({ 
  onSignOut, 
  user, 
  isAdmin,
  outfit,
  onOutfitChange
}: { 
  onSignOut: () => void | Promise<void>; 
  user: any; 
  isAdmin: boolean;
  outfit: string[];
  onOutfitChange: (outfit: string[]) => void;
}) {
  const [activeSection, setActiveSection] = useState<'account' | 'outfit'>('account');

  const toggleOutfit = (item: string) => {
    if (outfit.includes(item)) {
      onOutfitChange(outfit.filter(i => i !== item));
    } else {
      onOutfitChange([...outfit, item]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1">
        <button
          onClick={() => setActiveSection('account')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeSection === 'account' 
              ? 'bg-[#A67B5B] text-white' 
              : 'bg-[#F5EDE4] text-[#8B7355] hover:bg-[#E6D5C3]'
          }`}
        >
          Account
        </button>
        <button
          onClick={() => setActiveSection('outfit')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeSection === 'outfit' 
              ? 'bg-[#A67B5B] text-white' 
              : 'bg-[#F5EDE4] text-[#8B7355] hover:bg-[#E6D5C3]'
          }`}
        >
          Potato
        </button>
      </div>

      {activeSection === 'account' && (
        <div className="space-y-3">
          <div className="bg-[#FDF8F3] rounded-2xl p-3 border-2 border-[#E6D5C3]">
            <div className="text-xs text-[#8B7355] mb-1">Email</div>
            <div className="font-bold text-[#6B4423] text-sm">{user?.email}</div>
            {isAdmin && (
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-[#FF8C42]/20 text-[#FF8C42] rounded-full text-xs font-bold">
                <Sparkles className="w-3 h-3" />
                Admin - Infinite Carrots
              </div>
            )}
          </div>
          
          <button
            onClick={onSignOut}
            className="w-full bg-[#A67B5B] hover:bg-[#8B7355] text-white font-bold py-3 rounded-xl transition-all"
          >
            Sign Out
          </button>
        </div>
      )}

      {activeSection === 'outfit' && (
        <div className="space-y-3">
          <p className="text-xs text-[#8B7355] text-center">Customize your potato!</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => toggleOutfit('hat')}
              className={`p-3 rounded-xl border-2 transition-all ${
                outfit.includes('hat')
                  ? 'bg-[#FF8C42] text-white border-[#FF8C42]'
                  : 'bg-white border-[#E6D5C3] hover:border-[#FF8C42]'
              }`}
            >
              <div className="text-2xl mb-1">🥕</div>
              <div className="text-xs font-bold">Carrot Hat</div>
            </button>
            <button
              onClick={() => toggleOutfit('glasses')}
              className={`p-3 rounded-xl border-2 transition-all ${
                outfit.includes('glasses')
                  ? 'bg-[#FF8C42] text-white border-[#FF8C42]'
                  : 'bg-white border-[#E6D5C3] hover:border-[#FF8C42]'
              }`}
            >
              <div className="text-2xl mb-1">👓</div>
              <div className="text-xs font-bold">Glasses</div>
            </button>
            <button
              onClick={() => toggleOutfit('bow')}
              className={`p-3 rounded-xl border-2 transition-all ${
                outfit.includes('bow')
                  ? 'bg-[#FF8C42] text-white border-[#FF8C42]'
                  : 'bg-white border-[#E6D5C3] hover:border-[#FF8C42]'
              }`}
            >
              <div className="text-2xl mb-1">🎀</div>
              <div className="text-xs font-bold">Cute Bow</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
