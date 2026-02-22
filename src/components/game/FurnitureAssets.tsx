import React from 'react';

// ========== COLOR PALETTE (Matching the furniture style - warm peachy tones) ==========
export const COLORS = {
  // Warm tones matching the furniture
  peach: '#F4A460',
  peachLight: '#FFB88C',
  peachDark: '#D4915D',
  cream: '#FFF5E6',
  beige: '#E8D4B8',
  beigeDark: '#C9A87C',
  brown: '#8B6F47',
  brownDark: '#6B4E3D',
  
  // Shadows
  shadowLight: 'rgba(139, 111, 71, 0.15)',
  shadowMedium: 'rgba(107, 78, 61, 0.25)',
  shadowDark: 'rgba(107, 78, 61, 0.4)',
  
  // Accent colors
  carrot: '#FF8C42',
  carrotLight: '#FFB347',
  green: '#7EB8A2',
  greenDark: '#5D8A7A',
};

// ========== ISOMETRIC POTATO CHARACTER ==========
interface CharacterProps {
  className?: string;
  isMoving?: boolean;
  outfit?: string[];
}

export const IsometricPotato: React.FC<CharacterProps> = ({ 
  className = '', 
  isMoving = false,
  outfit = []
}) => {
  return (
    <svg viewBox="0 0 100 120" className={`${className} ${isMoving ? 'animate-bounce' : ''}`}>
      <defs>
        {/* Main body gradient - isometric lighting */}
        <linearGradient id="potatoTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={COLORS.peachLight} />
          <stop offset="100%" stopColor={COLORS.peach} />
        </linearGradient>
        <linearGradient id="potatoLeft" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={COLORS.peach} />
          <stop offset="100%" stopColor={COLORS.peachDark} />
        </linearGradient>
        <linearGradient id="potatoRight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={COLORS.peach} />
          <stop offset="100%" stopColor={COLORS.brown} />
        </linearGradient>
      </defs>
      
      {/* Shadow */}
      <ellipse cx="50" cy="110" rx="35" ry="8" fill={COLORS.shadowMedium} />
      
      {/* Potato body - isometric block shape */}
      <g transform="translate(50, 65)">
        {/* Top face */}
        <path d="M-30 -20 L0 -35 L30 -20 L0 -5 Z" fill="url(#potatoTop)" />
        {/* Left face */}
        <path d="M-30 -20 L0 -5 L0 45 L-30 30 Z" fill="url(#potatoLeft)" />
        {/* Right face */}
        <path d="M0 -5 L30 -20 L30 30 L0 45 Z" fill="url(#potatoRight)" />
      </g>
      
      {/* Eyes - on the front face */}
      <g transform="translate(50, 55)">
        {/* Left eye */}
        <ellipse cx="-12" cy="0" rx="6" ry="8" fill="#3D3D3D" />
        <circle cx="-10" cy="-2" r="3" fill="white" />
        {/* Right eye */}
        <ellipse cx="12" cy="0" rx="6" ry="8" fill="#3D3D3D" />
        <circle cx="14" cy="-2" r="3" fill="white" />
      </g>
      
      {/* Blush */}
      <circle cx="32" cy="70" r="4" fill="#FFB6C1" opacity="0.6" />
      <circle cx="68" cy="70" r="4" fill="#FFB6C1" opacity="0.6" />
      
      {/* Small smile */}
      <path d="M45 75 Q50 80 55 75" stroke="#3D3D3D" strokeWidth="2" strokeLinecap="round" fill="none" />
      
      {/* Sprout on top */}
      <g transform="translate(50, 30)">
        <path d="M0 0 Q-8 -15 0 -25 Q8 -15 0 0" fill={COLORS.green} />
        <path d="M0 -25 Q5 -30 8 -22" stroke={COLORS.greenDark} strokeWidth="2" fill="none" />
      </g>
      
      {/* Tiny arms */}
      <ellipse cx="22" cy="75" rx="5" ry="8" fill={COLORS.peachDark} transform="rotate(-20 22 75)" />
      <ellipse cx="78" cy="75" rx="5" ry="8" fill={COLORS.peachDark} transform="rotate(20 78 75)" />
      
      {/* Accessories */}
      {outfit.includes('hat') && (
        <g transform="translate(50, 28)">
          <path d="M-15 0 L15 0 L10 -15 L-10 -15 Z" fill={COLORS.carrot} />
          <path d="M0 -15 L5 -25 L0 -22 L-5 -25 Z" fill={COLORS.carrotLight} />
        </g>
      )}
      {outfit.includes('glasses') && (
        <g transform="translate(50, 55)">
          <circle cx="-12" cy="0" r="9" fill="none" stroke="#3D3D3D" strokeWidth="2" />
          <circle cx="12" cy="0" r="9" fill="none" stroke="#3D3D3D" strokeWidth="2" />
          <line x1="-3" y1="0" x2="3" y2="0" stroke="#3D3D3D" strokeWidth="2" />
        </g>
      )}
    </svg>
  );
};

// ========== ISOMETRIC DOG COMPANION ==========
export const IsometricDog: React.FC<CharacterProps> = ({ 
  className = '', 
  isMoving = false 
}) => {
  return (
    <svg viewBox="0 0 80 100" className={`${className} ${isMoving ? 'animate-pulse' : ''}`}>
      <defs>
        <linearGradient id="dogTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4A574" />
          <stop offset="100%" stopColor="#C4956A" />
        </linearGradient>
        <linearGradient id="dogLeft" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C4956A" />
          <stop offset="100%" stopColor="#A67B5B" />
        </linearGradient>
        <linearGradient id="dogRight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C4956A" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>
      </defs>
      
      {/* Shadow */}
      <ellipse cx="40" cy="90" rx="25" ry="6" fill={COLORS.shadowMedium} />
      
      {/* Body - smaller isometric block */}
      <g transform="translate(40, 55)">
        <path d="M-20 -12 L0 -22 L20 -12 L0 -2 Z" fill="url(#dogTop)" />
        <path d="M-20 -12 L0 -2 L0 28 L-20 18 Z" fill="url(#dogLeft)" />
        <path d="M0 -2 L20 -12 L20 18 L0 28 Z" fill="url(#dogRight)" />
      </g>
      
      {/* Head */}
      <g transform="translate(40, 35)">
        <ellipse cx="0" cy="0" rx="18" ry="15" fill="#D4A574" />
        {/* Ears */}
        <ellipse cx="-15" cy="2" rx="6" ry="10" fill="#A67B5B" transform="rotate(-30 -15 2)" />
        <ellipse cx="15" cy="2" rx="6" ry="10" fill="#A67B5B" transform="rotate(30 15 2)" />
        {/* Eyes */}
        <circle cx="-6" cy="-2" r="3" fill="#3D3D3D" />
        <circle cx="6" cy="-2" r="3" fill="#3D3D3D" />
        {/* Nose */}
        <ellipse cx="0" cy="6" rx="4" ry="3" fill="#3D3D3D" />
      </g>
      
      {/* Wagging tail */}
      <path d="M55 45 Q65 35 62 30" stroke="#A67B5B" strokeWidth="4" fill="none" strokeLinecap="round">
        <animate attributeName="d" values="M55 45 Q65 35 62 30;M55 45 Q70 40 68 35;M55 45 Q65 35 62 30" dur="0.5s" repeatCount="indefinite" />
      </path>
    </svg>
  );
};

// ========== ISOMETRIC CARROT CURRENCY ICON ==========
export const IsometricCarrot: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg viewBox="0 0 60 80" className={className}>
      <defs>
        <linearGradient id="carrotBodyTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={COLORS.carrotLight} />
          <stop offset="100%" stopColor={COLORS.carrot} />
        </linearGradient>
        <linearGradient id="carrotBodySide" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={COLORS.carrot} />
          <stop offset="100%" stopColor="#E67332" />
        </linearGradient>
      </defs>
      
      {/* Shadow */}
      <ellipse cx="30" cy="72" rx="15" ry="4" fill={COLORS.shadowMedium} />
      
      {/* Carrot body - isometric cone */}
      <g transform="translate(30, 45)">
        <path d="M-8 -20 L8 -20 L0 -8 Z" fill="url(#carrotBodyTop)" />
        <path d="M-8 -20 L0 -8 L0 25 L-12 12 Z" fill="url(#carrotBodySide)" />
        <path d="M8 -20 L0 -8 L0 25 L12 12 Z" fill="#E67332" />
      </g>
      
      {/* Greens */}
      <path d="M30 27 Q25 15 20 10" stroke={COLORS.green} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M30 27 Q30 12 30 8" stroke={COLORS.green} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M30 27 Q35 15 40 10" stroke={COLORS.green} strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
};

// ========== ISOMETRIC FURNITURE ==========
interface FurnitureProps {
  className?: string;
}

// Wooden table
export const IsometricTable: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 80 70" className={className}>
    <g transform="translate(40, 35)">
      {/* Shadow */}
      <ellipse cx="0" cy="30" rx="35" ry="10" fill={COLORS.shadowLight} />
      
      {/* Table top */}
      <path d="M-35 0 L0 -18 L35 0 L0 18 Z" fill={COLORS.beige} />
      {/* Left side */}
      <path d="M-35 0 L0 18 L0 25 L-35 7 Z" fill={COLORS.beigeDark} />
      {/* Right side */}
      <path d="M0 18 L35 0 L35 7 L0 25 Z" fill={COLORS.brown} />
      
      {/* Legs */}
      <path d="M-28 8 L-28 28 L-22 31 L-22 11 Z" fill={COLORS.brownDark} />
      <path d="M22 11 L22 31 L28 28 L28 8 Z" fill={COLORS.brownDark} />
    </g>
  </svg>
);

// Bookshelf
export const IsometricBookshelf: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 80 100" className={className}>
    <g transform="translate(40, 50)">
      {/* Shadow */}
      <ellipse cx="0" cy="45" rx="35" ry="8" fill={COLORS.shadowLight} />
      
      {/* Main structure */}
      <path d="M-30 -25 L0 -40 L30 -25 L0 -10 Z" fill={COLORS.beige} />
      <path d="M-30 -25 L0 -10 L0 40 L-30 25 Z" fill={COLORS.beigeDark} />
      <path d="M0 -10 L30 -25 L30 25 L0 40 Z" fill={COLORS.brown} />
      
      {/* Shelves */}
      <path d="M-25 -5 L0 8 L25 -5 L0 -18 Z" fill={COLORS.cream} />
      <path d="M-25 15 L0 28 L25 15 L0 2 Z" fill={COLORS.cream} />
      
      {/* Books (colored rectangles) */}
      <rect x="-20" y="-12" width="6" height="15" fill="#FF6B6B" transform="skewY(-15)" />
      <rect x="-12" y="-10" width="5" height="13" fill="#4ECDC4" transform="skewY(-15)" />
      <rect x="-5" y="-8" width="7" height="14" fill="#FFE66D" transform="skewY(-15)" />
    </g>
  </svg>
);

// Cozy chair
export const IsometricChair: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 70 90" className={className}>
    <g transform="translate(35, 45)">
      {/* Shadow */}
      <ellipse cx="0" cy="40" rx="25" ry="6" fill={COLORS.shadowLight} />
      
      {/* Seat */}
      <path d="M-20 0 L0 -10 L20 0 L0 10 Z" fill={COLORS.peachLight} />
      <path d="M-20 0 L0 10 L0 20 L-20 10 Z" fill={COLORS.peach} />
      <path d="M0 10 L20 0 L20 10 L0 20 Z" fill={COLORS.peachDark} />
      
      {/* Backrest */}
      <path d="M-20 -5 L0 -15 L0 -35 L-20 -25 Z" fill={COLORS.peach} />
      <path d="M0 -15 L20 -5 L20 -25 L0 -35 Z" fill={COLORS.peachDark} />
      
      {/* Legs */}
      <rect x="-18" y="12" width="4" height="15" fill={COLORS.brown} />
      <rect x="14" y="12" width="4" height="15" fill={COLORS.brownDark} />
    </g>
  </svg>
);

// Plant pot
export const IsometricPlant: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 60 80" className={className}>
    <g transform="translate(30, 50)">
      {/* Shadow */}
      <ellipse cx="0" cy="25" rx="18" ry="5" fill={COLORS.shadowLight} />
      
      {/* Pot */}
      <path d="M-15 5 L15 5 L10 20 L-10 20 Z" fill={COLORS.brown} />
      <path d="M-15 5 L-10 20 L-10 22 L-15 7 Z" fill={COLORS.brownDark} />
      
      {/* Plant leaves */}
      <ellipse cx="-8" cy="-5" rx="8" ry="12" fill={COLORS.green} transform="rotate(-20 -8 -5)" />
      <ellipse cx="8" cy="-5" rx="8" ry="12" fill={COLORS.greenDark} transform="rotate(20 8 -5)" />
      <ellipse cx="0" cy="-15" rx="6" ry="10" fill={COLORS.green} />
    </g>
  </svg>
);

// Rug
export const IsometricRug: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 100 60" className={className}>
    <g transform="translate(50, 30)">
      <path d="M-40 0 L0 -20 L40 0 L0 20 Z" fill={COLORS.peachLight} />
      <path d="M-35 0 L0 -17 L35 0 L0 17 Z" fill={COLORS.peach} />
      <path d="M-30 0 L0 -14 L30 0 L0 14 Z" fill={COLORS.cream} />
      {/* Pattern */}
      <circle cx="-15" cy="0" r="4" fill={COLORS.carrot} opacity="0.6" />
      <circle cx="15" cy="0" r="4" fill={COLORS.carrot} opacity="0.6" />
      <circle cx="0" cy="-8" r="3" fill={COLORS.carrot} opacity="0.6" />
      <circle cx="0" cy="8" r="3" fill={COLORS.carrot} opacity="0.6" />
    </g>
  </svg>
);

// Dog bed
export const IsometricDogBed: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 70 50" className={className}>
    <g transform="translate(35, 25)">
      <ellipse cx="0" cy="15" rx="30" ry="12" fill={COLORS.shadowLight} />
      <ellipse cx="0" cy="5" rx="28" ry="10" fill={COLORS.brown} />
      <ellipse cx="0" cy="5" rx="20" ry="7" fill={COLORS.beige} />
      <ellipse cx="0" cy="5" rx="12" ry="4" fill={COLORS.cream} />
    </g>
  </svg>
);

// Door
export const IsometricDoor: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 60 100" className={className}>
    <g transform="translate(30, 50)">
      {/* Door frame */}
      <path d="M-20 40 L-20 -30 L0 -45 L20 -30 L20 40" fill="none" stroke={COLORS.brown} strokeWidth="8" strokeLinejoin="round" />
      {/* Door panel */}
      <path d="M-15 40 L-15 -25 L0 -37 L15 -25 L15 40" fill={COLORS.beige} />
      {/* Door detail */}
      <path d="M-10 35 L-10 -20 L0 -30 L10 -20 L10 35" fill={COLORS.cream} opacity="0.5" />
      {/* Handle */}
      <circle cx="10" cy="10" r="3" fill={COLORS.brownDark} />
    </g>
  </svg>
);

// Window
export const IsometricWindow: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 80 70" className={className}>
    <g transform="translate(40, 35)">
      {/* Frame */}
      <path d="M-35 10 L-35 -20 L0 -35 L35 -20 L35 10" fill="none" stroke={COLORS.brown} strokeWidth="6" strokeLinejoin="round" />
      {/* Glass/sky */}
      <path d="M-30 8 L-30 -17 L0 -30 L30 -17 L30 8 Z" fill="#87CEEB" />
      {/* Window cross */}
      <path d="M0 -30 L0 8" stroke={COLORS.brown} strokeWidth="3" />
      <path d="M-30 -5 L30 -5" stroke={COLORS.brown} strokeWidth="3" />
      {/* Plants on sill */}
      <circle cx="-20" cy="12" r="5" fill={COLORS.green} />
      <circle cx="20" cy="12" r="5" fill={COLORS.green} />
    </g>
  </svg>
);

// Bed
export const IsometricBed: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 90 70" className={className}>
    <g transform="translate(45, 35)">
      {/* Shadow */}
      <ellipse cx="0" cy="30" rx="40" ry="10" fill={COLORS.shadowLight} />
      
      {/* Mattress base */}
      <path d="M-35 5 L0 -10 L35 5 L0 20 Z" fill={COLORS.cream} />
      <path d="M-35 5 L0 20 L0 25 L-35 10 Z" fill={COLORS.beige} />
      <path d="M0 20 L35 5 L35 10 L0 25 Z" fill={COLORS.beigeDark} />
      
      {/* Blanket */}
      <path d="M-32 2 L0 -12 L32 2 L0 17 Z" fill={COLORS.peachLight} />
      <path d="M-32 2 L0 17 L0 22 L-32 7 Z" fill={COLORS.peach} />
      <path d="M0 17 L32 2 L32 7 L0 22 Z" fill={COLORS.peachDark} />
      
      {/* Pillow */}
      <ellipse cx="-15" cy="-5" rx="12" ry="8" fill="white" />
    </g>
  </svg>
);

// Dog bowl
export const IsometricDogBowl: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 40 30" className={className}>
    <g transform="translate(20, 15)">
      <ellipse cx="0" cy="10" rx="15" ry="5" fill={COLORS.shadowLight} />
      <ellipse cx="0" cy="5" rx="15" ry="8" fill={COLORS.brown} />
      <ellipse cx="0" cy="5" rx="12" ry="6" fill={COLORS.carrot} opacity="0.8" />
    </g>
  </svg>
);

// Lamp
export const IsometricLamp: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 50 80" className={className}>
    <g transform="translate(25, 40)">
      {/* Shadow */}
      <ellipse cx="0" cy="35" rx="12" ry="4" fill={COLORS.shadowLight} />
      
      {/* Base */}
      <ellipse cx="0" cy="30" rx="10" ry="4" fill={COLORS.brown} />
      {/* Pole */}
      <rect x="-2" y="5" width="4" height="25" fill={COLORS.brownDark} />
      {/* Shade */}
      <path d="M-15 5 L15 5 L10 -15 L-10 -15 Z" fill={COLORS.peachLight} />
      <path d="M-15 5 L-10 -15 L-10 -12 L-15 2 Z" fill={COLORS.peach} />
      <path d="M15 5 L10 -15 L10 -12 L15 2 Z" fill={COLORS.peachDark} />
      {/* Light glow */}
      <ellipse cx="0" cy="-5" rx="8" ry="5" fill="#FFF5E6" opacity="0.8" />
    </g>
  </svg>
);

// ========== FURNITURE ITEMS DATA ==========
export type FurnitureCategory = 'furniture' | 'plants' | 'decor' | 'doors';

export interface FurnitureItem {
  id: string;
  name: string;
  category: FurnitureCategory;
  price: number;
  component: React.FC<{ className?: string }>;
}

export const FURNITURE_ITEMS: FurnitureItem[] = [
  { id: 'table', name: 'Wooden Table', category: 'furniture', price: 50, component: IsometricTable },
  { id: 'bookshelf', name: 'Bookshelf', category: 'furniture', price: 80, component: IsometricBookshelf },
  { id: 'chair', name: 'Cozy Chair', category: 'furniture', price: 60, component: IsometricChair },
  { id: 'bed', name: 'Cozy Bed', category: 'furniture', price: 120, component: IsometricBed },
  { id: 'dog-bed', name: 'Dog Bed', category: 'furniture', price: 40, component: IsometricDogBed },
];

export const PLANT_ITEMS: FurnitureItem[] = [
  { id: 'plant', name: 'Potted Plant', category: 'plants', price: 30, component: IsometricPlant },
];

export const DECOR_ITEMS: FurnitureItem[] = [
  { id: 'rug', name: 'Patterned Rug', category: 'decor', price: 35, component: IsometricRug },
  { id: 'dog-bowl', name: 'Dog Bowl', category: 'decor', price: 15, component: IsometricDogBowl },
  { id: 'lamp', name: 'Floor Lamp', category: 'decor', price: 45, component: IsometricLamp },
  { id: 'window', name: 'Window', category: 'decor', price: 0, component: IsometricWindow },
];

export const DOOR_ITEMS: FurnitureItem[] = [
  { id: 'door', name: 'Door', category: 'doors', price: 0, component: IsometricDoor },
];

// ========== FLOOR & WALL COLORS ==========
export const FLOOR_COLORS = [
  { id: 'wood-light', name: 'Light Wood', color: '#F5DEB3' },
  { id: 'wood', name: 'Wood', color: '#DEB887' },
  { id: 'wood-dark', name: 'Dark Wood', color: '#C19A6B' },
  { id: 'tile-cream', name: 'Cream Tile', color: '#FFF8DC' },
];

export const WALL_COLORS = [
  { id: 'cream', name: 'Cream', color: '#FDF8F3' },
  { id: 'beige', name: 'Beige', color: '#E8D4B8' },
  { id: 'peach', name: 'Peach', color: '#FFE4C4' },
  { id: 'sage', name: 'Sage', color: '#E8F0E0' },
];

// ========== FURNITURE ITEM RENDERER ==========
interface FurnitureItemProps {
  type: string;
  className?: string;
}

export const FurnitureItem: React.FC<FurnitureItemProps> = ({ type, className = '' }) => {
  const allItems = [...FURNITURE_ITEMS, ...PLANT_ITEMS, ...DECOR_ITEMS, ...DOOR_ITEMS];
  const item = allItems.find(i => i.id === type);
  
  if (!item) return null;
  
  const Component = item.component;
  return <Component className={className} />;
};
