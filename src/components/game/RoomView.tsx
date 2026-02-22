'use client';

import { useState, useCallback } from 'react';
import { X, Trash2, ChevronLeft } from 'lucide-react';
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

// Hand-drawn organic blob shape for islands
const IslandBlob = ({ color, strokeColor = '#8B7355' }: { color: string; strokeColor?: string }) => (
  <svg viewBox="0 0 200 120" className="w-full h-full">
    <defs>
      <filter id="sketchy">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
      </filter>
    </defs>
    {/* Main island blob - wobbly organic shape */}
    <path
      d="M30 60 Q20 30 50 20 Q80 10 110 25 Q150 15 170 45 Q190 70 170 90 Q150 110 110 105 Q70 115 40 95 Q15 85 30 60"
      fill={color}
      stroke={strokeColor}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      filter="url(#sketchy)"
    />
    {/* Shadow underneath */}
    <ellipse
      cx="100"
      cy="105"
      rx="75"
      ry="12"
      fill="rgba(0,0,0,0.15)"
      filter="url(#sketchy)"
    />
    {/* Little grass tufts */}
    <path d="M60 35 Q55 25 50 30" stroke="#7A9E7A" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M140 40 Q145 30 150 35" stroke="#7A9E7A" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M100 20 Q105 10 110 18" stroke="#7A9E7A" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

// Hand-drawn cloud
const CloudBlob = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full opacity-60">
    <path
      d="M20 40 Q10 30 20 20 Q30 10 50 15 Q70 5 90 15 Q110 20 110 35 Q115 50 95 55 Q75 60 50 55 Q25 60 15 50 Q10 45 20 40"
      fill="white"
      stroke="none"
    />
  </svg>
);

// Sketchy hand-drawn button
const SketchyButton = ({ 
  children, 
  onClick, 
  active = false,
  className = ''
}: { 
  children: React.ReactNode; 
  onClick: () => void; 
  active?: boolean;
  className?: string;
}) => {
  const baseColor = active ? '#C4A574' : '#E8D4B8';
  const strokeColor = '#8B7355';
  
  return (
    <button onClick={onClick} className={`relative w-16 h-16 ${className}`}>
      <svg viewBox="0 0 70 70" className="w-full h-full absolute inset-0">
        {/* Wobbly button shape */}
        <path
          d="M10 15 Q8 8 15 8 L55 8 Q62 8 60 15 L58 55 Q60 62 52 62 L18 62 Q10 62 12 55 Z"
          fill={baseColor}
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Highlight line */}
        <path
          d="M15 12 L55 12"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </button>
  );
};

// Hand-drawn label pill
const LabelPill = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    <svg viewBox="0 0 100 40" className="w-full h-10 absolute inset-0">
      <rect
        x="5"
        y="5"
        width="90"
        height="30"
        rx="15"
        ry="15"
        fill="white"
        stroke="#8B7355"
        strokeWidth="2"
      />
    </svg>
    <div className="relative px-6 py-2 text-center">
      <span className="text-xs font-bold text-[#5D4E37]">{children}</span>
    </div>
  </div>
);

// Potato floating animation
const FloatingPotato = ({ outfit }: { outfit: string[] }) => (
  <svg viewBox="0 0 100 120" className="w-24 h-28 animate-bounce" style={{ animationDuration: '2.5s' }}>
    <defs>
      <radialGradient id="potatoBody" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stopColor="#E8D4B8" />
        <stop offset="100%" stopColor="#C4A574" />
      </radialGradient>
    </defs>
    {/* Body - organic potato shape */}
    <path
      d="M30 50 Q20 30 35 20 Q50 10 65 20 Q80 30 75 50 Q85 70 70 85 Q50 100 30 85 Q15 70 30 50"
      fill="url(#potatoBody)"
      stroke="#8B7355"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Eyes */}
    <ellipse cx="42" cy="45" rx="4" ry="5" fill="#3D2914" />
    <ellipse cx="58" cy="45" rx="4" ry="5" fill="#3D2914" />
    <circle cx="43" cy="43" r="1.5" fill="white" />
    <circle cx="59" cy="43" r="1.5" fill="white" />
    {/* Smile */}
    <path
      d="M45 60 Q50 65 55 60"
      stroke="#3D2914"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    {/* Blush */}
    <ellipse cx="35" cy="55" rx="5" ry="3" fill="#FFB6C1" opacity="0.6" />
    <ellipse cx="65" cy="55" rx="5" ry="3" fill="#FFB6C1" opacity="0.6" />
    {/* Leaf on top */}
    <path
      d="M50 15 Q45 5 50 8 Q55 5 50 15"
      fill="#7A9E7A"
      stroke="#5A7E5A"
      strokeWidth="1.5"
    />
  </svg>
);

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
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'linear-gradient(180deg, #A8D8EA 0%, #C5E4F3 50%, #E8F4F8 100%)' }}>
      {/* Clouds - flat 2D */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-8 left-10 w-32 h-16">
          <CloudBlob />
        </div>
        <div className="absolute top-16 right-16 w-40 h-20">
          <CloudBlob />
        </div>
        <div className="absolute top-4 left-1/2 w-28 h-14">
          <CloudBlob />
        </div>
        <div className="absolute top-32 left-1/4 w-24 h-12 opacity-40">
          <CloudBlob />
        </div>
      </div>

      {/* Top bar - flat 2D */}
      <div className="relative z-10 flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-2xl border-2 border-[#8B7355]">
          <span className="font-bold text-[#5D4E37] text-sm">Beanie&apos;s Home</span>
        </div>
        <div className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-2xl border-2 border-[#FF8C42]">
          <IsometricCarrot className="w-4 h-5" />
          <span className="font-bold text-[#FF8C42] text-sm">{carrots}</span>
        </div>
      </div>

      {/* Floating islands - flat 2D organic shapes */}
      <div className="flex-1 relative">
        {/* Bedroom - top left */}
        <button
          onClick={() => onEnterRoom('bedroom')}
          className="absolute left-[10%] top-[20%] w-40 h-24 group"
        >
          <IslandBlob color="#E8D4B8" />
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <LabelPill>Bedroom</LabelPill>
          </div>
        </button>

        {/* Kitchen - top right */}
        <button
          onClick={() => onEnterRoom('kitchen')}
          className="absolute right-[10%] top-[20%] w-40 h-24 group"
        >
          <IslandBlob color="#FFE4C4" />
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <LabelPill>Kitchen</LabelPill>
          </div>
        </button>

        {/* Living Room - center */}
        <button
          onClick={() => onEnterRoom('living-room')}
          className="absolute left-1/2 top-[45%] -translate-x-1/2 w-44 h-28 group"
        >
          <IslandBlob color="#DEB887" />
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <LabelPill>Living Room</LabelPill>
          </div>
        </button>

        {/* Beanie floating - center bottom */}
        <div className="absolute left-1/2 top-[75%] -translate-x-1/2 -translate-y-1/2 z-20">
          <FloatingPotato outfit={outfit} />
        </div>
      </div>

      {/* Settings button - hand drawn */}
      <div className="pb-8 flex justify-center">
        <SketchyButton onClick={onSettings}>
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#5D4E37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v6m0 6v6m-9-9h6m6 0h6" />
          </svg>
        </SketchyButton>
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
    <div className="flex flex-col h-screen" style={{ background: 'linear-gradient(180deg, #A8D8EA 0%, #C5E4F3 30%, #E8F4F8 100%)' }}>
      {/* Top bar - flat 2D */}
      <div className="flex items-center justify-between px-4 py-4 relative z-10">
        <button onClick={onBack} className="flex items-center gap-1 bg-white/90 px-3 py-2 rounded-xl border-2 border-[#8B7355] hover:bg-white">
          <ChevronLeft className="w-4 h-4 text-[#5D4E37]" />
          <span className="font-bold text-[#5D4E37] text-sm">Back</span>
        </button>
        <div className="bg-white/90 px-6 py-2 rounded-2xl border-2 border-[#8B7355]">
          <span className="font-bold text-[#5D4E37]">{room.name}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/90 px-3 py-2 rounded-xl border-2 border-[#FF8C42]">
          <IsometricCarrot className="w-4 h-5" />
          <span className="font-bold text-[#FF8C42]">{carrots}</span>
        </div>
      </div>

      {/* Room - THIS IS THE ONLY 2.5D ELEMENT */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div 
          className="relative"
          style={{
            width: 'min(85vw, 420px)',
            height: 'min(85vw, 420px)',
            transform: 'rotateX(60deg) rotateZ(-45deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Floor */}
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundColor: room.floorColor,
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
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
                    border: '1px solid rgba(0,0,0,0.05)'
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

      {/* Side panel - flat 2D */}
      {activeTab && (
        <div className="absolute top-20 right-2 w-64 bg-white rounded-2xl border-2 border-[#8B7355] shadow-xl z-20 max-h-[55vh] overflow-y-auto">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-[#5D4E37]">{activeTab === 'shop' ? '🥕 Shop' : '🎨 Decorate'}</h3>
              <button onClick={() => { setActiveTab(null); setSelectedItem(null); }}>
                <X className="w-5 h-5 text-[#5D4E37]" />
              </button>
            </div>

            {activeTab === 'shop' && (
              <div className="grid grid-cols-2 gap-2">
                {allItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleBuy(item.id, item.category, item.price)}
                    disabled={!isAdmin && carrots < item.price}
                    className="bg-[#F5EDE4] rounded-xl p-2 border border-[#C4A574] disabled:opacity-50"
                  >
                    <FurnitureItem type={item.id} className="w-full h-8" />
                    <div className="text-xs text-[#5D4E37] font-bold text-center mt-1">{item.price}🥕</div>
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
                          className={`p-2 rounded-xl border-2 ${selectedItem === item.uniqueId ? 'border-[#FF8C42] bg-[#FF8C42]/20' : 'border-[#C4A574] bg-white'}`}
                        >
                          <FurnitureItem type={item.type} className="w-full h-8" />
                        </button>
                      ))}
                    </div>
                  </>
                )}
                
                {placedItems.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-[#8B7355] mb-1">Placed:</p>
                    {placedItems.map((item: PlacedItem) => (
                      <div key={item.uniqueId} className="flex items-center justify-between bg-[#F5EDE4] p-2 rounded-lg mb-1 border border-[#C4A574]">
                        <span className="text-xs text-[#5D4E37]">{item.type}</span>
                        <button onClick={() => handleDelete(item.uniqueId)}><Trash2 className="w-4 h-4 text-red-500" /></button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-bold text-[#5D4E37]">Floor</p>
                    <div className="flex gap-1">
                      {FLOOR_COLORS.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setFloorColor(c.color)}
                          className="w-6 h-6 rounded-lg border border-[#8B7355]"
                          style={{ backgroundColor: c.color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#5D4E37]">Wall</p>
                    <div className="flex gap-1">
                      {WALL_COLORS.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setWallColor(c.color)}
                          className="w-6 h-6 rounded-lg border border-[#8B7355]"
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

      {/* Bottom 3 sketchy buttons - FLAT 2D */}
      <div className="pb-6 pt-2 flex justify-center gap-4">
        <SketchyButton 
          onClick={() => setActiveTab(activeTab === 'decorate' ? null : 'decorate')}
          active={activeTab === 'decorate'}
        >
          <span className="text-2xl">🎨</span>
          <span className="text-[9px] text-[#5D4E37] font-bold mt-0.5">Decorate</span>
        </SketchyButton>
        <SketchyButton 
          onClick={() => setActiveTab(activeTab === 'shop' ? null : 'shop')}
          active={activeTab === 'shop'}
        >
          <IsometricCarrot className="w-7 h-8" />
          <span className="text-[9px] text-[#5D4E37] font-bold mt-0.5">Shop</span>
        </SketchyButton>
        <SketchyButton 
          onClick={() => { setOutfit([]); handleSignOut(); }}
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#5D4E37" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v6m0 6v6m-9-9h6m6 0h6" />
          </svg>
          <span className="text-[9px] text-[#5D4E37] font-bold mt-0.5">Settings</span>
        </SketchyButton>
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

  // Settings panel
  if (showSettings && !currentRoom) {
    return (
      <div className="flex flex-col h-screen" style={{ background: 'linear-gradient(180deg, #A8D8EA 0%, #C5E4F3 50%, #E8F4F8 100%)' }}>
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={() => setShowSettings(false)} className="bg-white/90 px-4 py-2 rounded-xl border-2 border-[#8B7355]">
            <span className="font-bold text-[#5D4E37]">Back</span>
          </button>
          <span className="font-bold text-[#5D4E37]">Settings</span>
          <div className="w-16" />
        </div>
        
        <div className="flex-1 p-4">
          <div className="bg-white rounded-2xl p-4 max-w-sm mx-auto border-2 border-[#8B7355]">
            <p className="text-sm text-[#8B7355] mb-2">{user?.email}</p>
            {isAdmin && <span className="text-xs bg-[#FF8C42]/20 text-[#FF8C42] px-2 py-1 rounded-full">Admin</span>}
            
            <div className="mt-4">
              <p className="text-sm font-bold text-[#5D4E37] mb-2">Outfit</p>
              <div className="flex gap-2">
                <button onClick={() => setOutfit(prev => prev.includes('hat') ? prev.filter(o => o !== 'hat') : [...prev, 'hat'])} className={`p-2 rounded-lg border border-[#8B7355] ${outfit.includes('hat') ? 'bg-[#FF8C42]' : 'bg-[#F5EDE4]'}`}>🥕</button>
                <button onClick={() => setOutfit(prev => prev.includes('glasses') ? prev.filter(o => o !== 'glasses') : [...prev, 'glasses'])} className={`p-2 rounded-lg border border-[#8B7355] ${outfit.includes('glasses') ? 'bg-[#FF8C42]' : 'bg-[#F5EDE4]'}`}>👓</button>
                <button onClick={() => setOutfit(prev => prev.includes('bow') ? prev.filter(o => o !== 'bow') : [...prev, 'bow'])} className={`p-2 rounded-lg border border-[#8B7355] ${outfit.includes('bow') ? 'bg-[#FF8C42]' : 'bg-[#F5EDE4]'}`}>🎀</button>
              </div>
            </div>
            
            <button onClick={handleSignOut} className="w-full mt-4 bg-[#A67B5B] text-white py-2 rounded-xl font-bold border-2 border-[#5D4E37]">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

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
