'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Settings, 
  X,
  Sparkles,
  Heart,
  Sprout,
  Palette,
  Move,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import PlaidLinkButton from '@/components/plaid/PlaidLinkButton';
import { useRouter } from 'next/navigation';
import { 
  FurnitureItem, 
  PotatoCharacter, 
  DogCharacter,
  CarrotIcon,
  FURNITURE_ITEMS, 
  PLANT_ITEMS, 
  DECOR_ITEMS,
  CLOTHING_ITEMS,
  WALL_COLORS,
  FLOOR_COLORS,
  COLORS
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

interface PlacedItem {
  id: string;
  uniqueId: string;
  type: string;
  category: 'furniture' | 'plant' | 'decor' | 'clothing';
  x: number;
  y: number;
  rotation?: number;
}

interface Room {
  id: string;
  name: string;
  floorColor: string;
  wallColor: string;
  items: PlacedItem[];
  doors: { targetRoomId: string; position: 'left' | 'right' | 'top' | 'bottom' }[];
}

// Custom styled button for bottom toolbar
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
    {/* Button background - potato shape */}
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
      {/* Badge */}
      {badge !== undefined && badge > 0 && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF8C42] rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-[#F5EDE4]">
          {badge}
        </div>
      )}
    </div>
    {/* Label */}
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
  
  // Multi-room system
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 'living-room',
      name: 'Living Room',
      floorColor: COLORS.floorWood,
      wallColor: COLORS.wallBeige,
      items: [],
      doors: [{ targetRoomId: 'bedroom', position: 'right' }]
    },
    {
      id: 'bedroom',
      name: 'Bedroom',
      floorColor: COLORS.floorLight,
      wallColor: COLORS.wallBlue,
      items: [],
      doors: [{ targetRoomId: 'living-room', position: 'left' }]
    }
  ]);
  const [currentRoomId, setCurrentRoomId] = useState('living-room');
  const currentRoom = rooms.find(r => r.id === currentRoomId) || rooms[0];
  
  // UI State
  const [activeTab, setActiveTab] = useState<'shop' | 'decorate' | 'settings' | null>(null);
  const [selectedItem, setSelectedItem] = useState<PlacedItem | null>(null);
  const [isPlacingItem, setIsPlacingItem] = useState<string | null>(null);
  const [isMovingPotato, setIsMovingPotato] = useState(false);
  const [potatoPosition, setPotatoPosition] = useState({ x: 50, y: 50 });
  const [dogPosition, setDogPosition] = useState({ x: 30, y: 60 });
  const [inventory, setInventory] = useState<PlacedItem[]>([]);
  const [outfit, setOutfit] = useState<string[]>([]);

  // Potato movement animation
  useEffect(() => {
    const interval = setInterval(() => {
      // Random potato wiggle
      if (Math.random() > 0.7) {
        setPotatoPosition(prev => ({
          x: Math.max(20, Math.min(80, prev.x + (Math.random() - 0.5) * 5)),
          y: Math.max(30, Math.min(70, prev.y + (Math.random() - 0.5) * 3))
        }));
      }
      // Dog follows potato occasionally
      if (Math.random() > 0.6) {
        setDogPosition(prev => ({
          x: prev.x + (potatoPosition.x - prev.x) * 0.1,
          y: prev.y + (potatoPosition.y - prev.y + 10) * 0.1
        }));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [potatoPosition]);

  const handleBuyItem = useCallback((itemId: string, category: string, price: number) => {
    if (!isAdmin && carrots < price) return;
    
    const newItem: PlacedItem = {
      id: itemId,
      uniqueId: `${itemId}-${Date.now()}`,
      type: itemId,
      category: category as any,
      x: 40 + Math.random() * 20,
      y: 40 + Math.random() * 15,
      rotation: 0
    };
    
    setInventory(prev => [...prev, newItem]);
    if (!isAdmin) {
      setCarrots(prev => prev - price);
    }
  }, [carrots, isAdmin]);

  const handlePlaceItem = useCallback((item: PlacedItem) => {
    setRooms(prev => prev.map(room => {
      if (room.id === currentRoomId) {
        return { ...room, items: [...room.items, item] };
      }
      return room;
    }));
    setInventory(prev => prev.filter(i => i.uniqueId !== item.uniqueId));
    setIsPlacingItem(null);
    setActiveTab(null);
  }, [currentRoomId]);

  const handleMoveItem = useCallback((uniqueId: string, newX: number, newY: number) => {
    setRooms(prev => prev.map(room => {
      if (room.id === currentRoomId) {
        return {
          ...room,
          items: room.items.map(item => 
            item.uniqueId === uniqueId ? { ...item, x: newX, y: newY } : item
          )
        };
      }
      return room;
    }));
  }, [currentRoomId]);

  const handleDeleteItem = useCallback((uniqueId: string) => {
    setRooms(prev => prev.map(room => {
      if (room.id === currentRoomId) {
        return {
          ...room,
          items: room.items.filter(item => item.uniqueId !== uniqueId)
        };
      }
      return room;
    }));
    setSelectedItem(null);
  }, [currentRoomId]);

  const handleRoomChange = useCallback((targetRoomId: string) => {
    setIsMovingPotato(true);
    // Animate potato walking to door
    setTimeout(() => {
      setCurrentRoomId(targetRoomId);
      setIsMovingPotato(false);
      // Reset potato position in new room
      setPotatoPosition({ x: 50, y: 50 });
      setDogPosition({ x: 40, y: 60 });
    }, 800);
  }, []);

  const handleColorChange = useCallback((type: 'floor' | 'wall', color: string) => {
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // ========== RENDER ==========
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#B8D4E8] via-[#D4E8D4] to-[#E8D4B8] overflow-hidden relative">
      {/* Animated Background Scenery - Rolling Hills */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Far hills */}
        <svg className="absolute bottom-0 w-full h-[40%]" preserveAspectRatio="none" viewBox="0 0 1200 300">
          <path d="M0 150 Q150 80 300 120 Q450 160 600 100 Q750 40 900 110 Q1050 180 1200 130 L1200 300 L0 300 Z" 
                fill="#7EB8A2" opacity="0.4"/>
          <path d="M0 180 Q200 120 400 160 Q600 200 800 140 Q1000 80 1200 160 L1200 300 L0 300 Z" 
                fill="#8BC48E" opacity="0.5"/>
        </svg>
        {/* Near hills */}
        <svg className="absolute bottom-0 w-full h-[25%]" preserveAspectRatio="none" viewBox="0 0 1200 200">
          <path d="M0 120 Q150 80 300 110 Q450 140 600 90 Q750 50 900 100 Q1050 150 1200 110 L1200 200 L0 200 Z" 
                fill="#A67B5B" opacity="0.3"/>
        </svg>
        {/* Carrot farm patch in distance */}
        <div className="absolute bottom-[20%] left-[5%] opacity-40">
          <svg width="60" height="40" viewBox="0 0 70 50">
            <ellipse cx="35" cy="40" rx="30" ry="8" fill="#5D3A1A"/>
            <ellipse cx="20" cy="38" rx="3" ry="5" fill="#FF8C42"/>
            <path d="M20 35 L17 25" stroke="#4CAF50" strokeWidth="2"/>
            <ellipse cx="35" cy="38" rx="3" ry="6" fill="#FF8C42"/>
            <path d="M35 34 L32 24" stroke="#4CAF50" strokeWidth="2"/>
            <ellipse cx="50" cy="38" rx="3" ry="5" fill="#FF8C42"/>
            <path d="M50 35 L47 25" stroke="#4CAF50" strokeWidth="2"/>
          </svg>
        </div>
        {/* Floating carrot particles */}
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="absolute animate-float"
            style={{
              left: `${15 + i * 20}%`,
              top: `${20 + (i % 2) * 15}%`,
              animation: `float ${4 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          >
            <CarrotIcon className="w-6 h-8 opacity-20" />
          </div>
        ))}
      </div>

      {/* Top Bar - Room info and Carrots */}
      <div className="relative z-20 flex items-center justify-between px-4 py-3">
        {/* Room Navigation */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              const prevRoom = rooms[Math.max(0, rooms.findIndex(r => r.id === currentRoomId) - 1)];
              if (prevRoom.id !== currentRoomId) handleRoomChange(prevRoom.id);
            }}
            className="p-2 bg-[#FDF8F3]/80 backdrop-blur rounded-full hover:bg-[#FDF8F3] transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#6B4423]" />
          </button>
          <div className="bg-[#FDF8F3]/80 backdrop-blur px-4 py-2 rounded-full border-2 border-[#C9B77D]">
            <span className="font-bold text-[#6B4423]">{currentRoom.name}</span>
          </div>
          <button 
            onClick={() => {
              const nextRoom = rooms[Math.min(rooms.length - 1, rooms.findIndex(r => r.id === currentRoomId) + 1)];
              if (nextRoom.id !== currentRoomId) handleRoomChange(nextRoom.id);
            }}
            className="p-2 bg-[#FDF8F3]/80 backdrop-blur rounded-full hover:bg-[#FDF8F3] transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-[#6B4423]" />
          </button>
        </div>

        {/* Carrot Currency */}
        <div className="flex items-center gap-2 bg-[#FDF8F3]/90 backdrop-blur px-4 py-2 rounded-full border-2 border-[#FF8C42]">
          <CarrotIcon className="w-5 h-7" />
          <span className="font-black text-[#FF8C42] text-lg">{carrots}</span>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 relative flex items-center justify-center p-4">
        {/* Room Container */}
        <div className="relative w-full max-w-[500px] aspect-square">
          {/* Floor */}
          <div 
            className="absolute inset-[5%] rounded-3xl shadow-2xl overflow-hidden"
            style={{ backgroundColor: currentRoom.floorColor }}
          >
            {/* Floor pattern */}
            <div className="absolute inset-0 opacity-30">
              <div className="w-full h-full" style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(0,0,0,0.03) 20px, rgba(0,0,0,0.03) 40px)`
              }} />
            </div>

            {/* Walls */}
            <div 
              className="absolute top-0 left-[10%] right-[10%] h-[30%] rounded-t-2xl"
              style={{ backgroundColor: currentRoom.wallColor }}
            >
              {/* Baseboard */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#A67B5B]" />
            </div>

            {/* Door(s) */}
            {currentRoom.doors.map((door, idx) => (
              <button
                key={idx}
                onClick={() => handleRoomChange(door.targetRoomId)}
                className="absolute transition-transform hover:scale-105 active:scale-95"
                style={{
                  ...(door.position === 'right' && { right: '2%', top: '40%', width: '12%', height: '20%' }),
                  ...(door.position === 'left' && { left: '2%', top: '40%', width: '12%', height: '20%' }),
                }}
              >
                <div className="w-full h-full relative">
                  <FurnitureItem type="door" className="w-full h-full" />
                  {/* Door indicator */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FF8C42] text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                    GO
                  </div>
                </div>
              </button>
            ))}

            {/* Window */}
            <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[30%] h-[20%]">
              <FurnitureItem type="window-sunny" className="w-full h-full" />
            </div>

            {/* Placed Items */}
            {currentRoom.items.map((item) => (
              <div
                key={item.uniqueId}
                className={`absolute transition-all duration-200 ${
                  selectedItem?.uniqueId === item.uniqueId 
                    ? 'ring-4 ring-[#FF8C42] ring-opacity-50 scale-110 z-10' 
                    : 'hover:scale-105'
                }`}
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: `translate(-50%, -50%) rotate(${item.rotation || 0}deg)`,
                  width: '20%',
                  height: '20%'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (activeTab === 'decorate') {
                    setSelectedItem(item);
                  }
                }}
              >
                <FurnitureItem type={item.type} className="w-full h-full drop-shadow-lg" />
              </div>
            ))}

            {/* Inventory items being placed */}
            {inventory.map((item) => (
              <button
                key={item.uniqueId}
                className="absolute w-[20%] h-[20%] transition-all hover:scale-110 animate-pulse"
                style={{
                  left: `${40 + Math.random() * 20}%`,
                  top: `${40 + Math.random() * 15}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handlePlaceItem({ ...item, x: 50, y: 50 })}
              >
                <FurnitureItem type={item.type} className="w-full h-full opacity-70" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#FF8C42] rounded-full flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
              </button>
            ))}

            {/* Dog Character */}
            <div
              className="absolute transition-all duration-1000 ease-in-out"
              style={{
                left: `${dogPosition.x}%`,
                top: `${dogPosition.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <DogCharacter isMoving={isMovingPotato} />
            </div>

            {/* Potato Character (Player) */}
            <div
              className="absolute transition-all duration-500 ease-out z-10"
              style={{
                left: `${potatoPosition.x}%`,
                top: `${potatoPosition.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <PotatoCharacter 
                isMoving={isMovingPotato} 
                isHappy={activeTab === 'shop'}
                outfit={outfit}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Active Tab Content */}
      {activeTab && (
        <div className="absolute top-[80px] right-4 w-72 bg-[#FDF8F3]/95 backdrop-blur-xl rounded-3xl border-2 border-[#C9B77D] shadow-2xl z-30 max-h-[60vh] overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-[#6B4423]">
                {activeTab === 'shop' && '🥕 Shop'}
                {activeTab === 'decorate' && '🎨 Decorate'}
                {activeTab === 'settings' && '⚙️ Settings'}
              </h2>
              <button 
                onClick={() => { setActiveTab(null); setSelectedItem(null); }}
                className="p-2 hover:bg-[#F5EDE4] rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-[#6B4423]" />
              </button>
            </div>

            {activeTab === 'shop' && (
              <ShopPanel carrots={carrots} onBuy={handleBuyItem} isAdmin={isAdmin} />
            )}

            {activeTab === 'decorate' && (
              <DecoratePanel 
                inventory={inventory}
                selectedItem={selectedItem}
                onPlace={handlePlaceItem}
                onMove={handleMoveItem}
                onDelete={handleDeleteItem}
                onColorChange={handleColorChange}
                currentFloorColor={currentRoom.floorColor}
                currentWallColor={currentRoom.wallColor}
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

      {/* Bottom Toolbar - Custom Potato Buttons */}
      <div className="relative z-20 pb-6 pt-2">
        <div className="flex items-center justify-center gap-6">
          {/* Decorate Button */}
          <ToolbarButton
            icon={<Palette className="w-7 h-7" />}
            label="Decorate"
            active={activeTab === 'decorate'}
            onClick={() => setActiveTab(activeTab === 'decorate' ? null : 'decorate')}
            badge={inventory.length}
          />
          
          {/* Shop Button */}
          <ToolbarButton
            icon={<CarrotIcon className="w-8 h-10" />}
            label="Shop"
            active={activeTab === 'shop'}
            onClick={() => setActiveTab(activeTab === 'shop' ? null : 'shop')}
          />
          
          {/* Settings Button */}
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

// ========== SHOP PANEL ==========
function ShopPanel({ 
  carrots, 
  onBuy, 
  isAdmin 
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
      {/* Category tabs */}
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

      {/* Items grid */}
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
              <CarrotIcon className="w-3 h-4" />
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

// ========== DECORATE PANEL ==========
function DecoratePanel({
  inventory,
  selectedItem,
  onPlace,
  onMove,
  onDelete,
  onColorChange,
  currentFloorColor,
  currentWallColor
}: {
  inventory: PlacedItem[];
  selectedItem: PlacedItem | null;
  onPlace: (item: PlacedItem) => void;
  onMove: (id: string, x: number, y: number) => void;
  onDelete: (id: string) => void;
  onColorChange: (type: 'floor' | 'wall', color: string) => void;
  currentFloorColor: string;
  currentWallColor: string;
}) {
  const [activeSection, setActiveSection] = useState<'inventory' | 'colors' | 'move'>('inventory');

  return (
    <div className="space-y-4">
      {/* Section tabs */}
      <div className="flex gap-1">
        {(['inventory', 'colors', 'move'] as const).map(section => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeSection === section 
                ? 'bg-[#A67B5B] text-white' 
                : 'bg-[#F5EDE4] text-[#8B7355] hover:bg-[#E6D5C3]'
            }`}
          >
            {section === 'inventory' && 'Items'}
            {section === 'colors' && 'Colors'}
            {section === 'move' && 'Move'}
          </button>
        ))}
      </div>

      {activeSection === 'inventory' && (
        <div>
          <h3 className="font-bold text-[#6B4423] mb-2 text-sm">Unplaced Items ({inventory.length})</h3>
          {inventory.length === 0 ? (
            <p className="text-xs text-[#8B7355] text-center py-4">Your inventory is empty! Buy items from the shop.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {inventory.map((item) => (
                <button
                  key={item.uniqueId}
                  onClick={() => onPlace(item)}
                  className="bg-white border-2 border-[#E6D5C3] hover:border-[#FF8C42] rounded-xl p-2 transition-all"
                >
                  <FurnitureItem type={item.type} className="w-full h-10" />
                  <Plus className="w-4 h-4 mx-auto mt-1 text-[#FF8C42]" />
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

      {activeSection === 'move' && (
        <div>
          {selectedItem ? (
            <div className="space-y-3">
              <p className="text-sm text-[#6B4423]">Moving: <span className="font-bold">{selectedItem.type}</span></p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onMove(selectedItem.uniqueId, selectedItem.x, selectedItem.y - 5)}
                  className="p-3 bg-[#F5EDE4] hover:bg-[#E6D5C3] rounded-xl text-2xl"
                >
                  ↑
                </button>
                <button
                  onClick={() => onMove(selectedItem.uniqueId, selectedItem.x, selectedItem.y + 5)}
                  className="p-3 bg-[#F5EDE4] hover:bg-[#E6D5C3] rounded-xl text-2xl"
                >
                  ↓
                </button>
                <button
                  onClick={() => onMove(selectedItem.uniqueId, selectedItem.x - 5, selectedItem.y)}
                  className="p-3 bg-[#F5EDE4] hover:bg-[#E6D5C3] rounded-xl text-2xl"
                >
                  ←
                </button>
                <button
                  onClick={() => onMove(selectedItem.uniqueId, selectedItem.x + 5, selectedItem.y)}
                  className="p-3 bg-[#F5EDE4] hover:bg-[#E6D5C3] rounded-xl text-2xl"
                >
                  →
                </button>
                <button
                  onClick={() => onDelete(selectedItem.uniqueId)}
                  className="col-span-2 p-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm font-bold">Remove</span>
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#8B7355] text-center py-4">
              Tap an item in the room to select it for moving
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ========== SETTINGS PANEL ==========
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
          </div>
        </div>
      )}
    </div>
  );
}
