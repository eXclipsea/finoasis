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

// ========== COLORFUL DECOR ITEMS (Focus Friend Style) ==========

// Stack of colorful books
export const IsometricBooks: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 50 40" className={className}>
    <g transform="translate(25, 20)">
      {/* Shadow */}
      <ellipse cx="0" cy="15" rx="20" ry="5" fill={COLORS.shadowLight} />
      
      {/* Book 1 - Pink */}
      <path d="M-15 8 L0 0 L15 8 L0 16 Z" fill="#FF9AA2" />
      <path d="M-15 8 L0 16 L0 20 L-15 12 Z" fill="#E8888F" />
      <path d="M0 16 L15 8 L15 12 L0 20 Z" fill="#D6777E" />
      
      {/* Book 2 - Teal */}
      <path d="M-13 2 L0 -6 L13 2 L0 10 Z" fill="#A0E7E5" />
      <path d="M-13 2 L0 10 L0 14 L-13 6 Z" fill="#8CD5D3" />
      <path d="M0 10 L13 2 L13 6 L0 14 Z" fill="#78C3C1" />
      
      {/* Book 3 - Yellow */}
      <path d="M-11 -4 L0 -12 L11 -4 L0 4 Z" fill="#FFF4BD" />
      <path d="M-11 -4 L0 4 L0 8 L-11 0 Z" fill="#EBE0A8" />
      <path d="M0 4 L11 -4 L11 0 L0 8 Z" fill="#D7CC94" />
    </g>
  </svg>
);

// Hanging vines
export const IsometricVines: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 60 80" className={className}>
    <g transform="translate(30, 10)">
      {/* Main vine stems */}
      <path d="M0 0 Q-5 20 -8 35 Q-12 50 -5 65" stroke={COLORS.greenDark} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M0 0 Q8 15 5 30 Q2 45 10 60" stroke={COLORS.green} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M0 0 Q3 12 12 25 Q15 40 8 55" stroke="#9BC48E" strokeWidth="2" fill="none" strokeLinecap="round" />
      
      {/* Leaves */}
      <ellipse cx="-8" cy="20" rx="5" ry="8" fill={COLORS.green} transform="rotate(-30 -8 20)" />
      <ellipse cx="-5" cy="35" rx="4" ry="7" fill={COLORS.greenDark} transform="rotate(20 -5 35)" />
      <ellipse cx="-8" cy="50" rx="5" ry="8" fill={COLORS.green} transform="rotate(-15 -8 50)" />
      <ellipse cx="5" cy="25" rx="4" ry="6" fill="#9BC48E" transform="rotate(40 5 25)" />
      <ellipse cx="8" cy="40" rx="4" ry="7" fill={COLORS.green} transform="rotate(-25 8 40)" />
      <ellipse cx="10" cy="55" rx="3" ry="6" fill={COLORS.greenDark} transform="rotate(15 10 55)" />
      <ellipse cx="12" cy="30" rx="4" ry="6" fill="#9BC48E" transform="rotate(35 12 30)" />
      
      {/* Cute flowers */}
      <g transform="translate(-5, 65)">
        <circle cx="0" cy="0" r="4" fill="#FFB6C1" />
        <circle cx="-3" cy="-2" r="3" fill="#FFB6C1" />
        <circle cx="3" cy="-2" r="3" fill="#FFB6C1" />
        <circle cx="0" cy="-4" r="3" fill="#FFB6C1" />
        <circle cx="0" cy="-1" r="2" fill="#FFE4B5" />
      </g>
      
      <g transform="translate(8, 55)">
        <circle cx="0" cy="0" r="3" fill="#DDA0DD" />
        <circle cx="-2" cy="-2" r="2.5" fill="#DDA0DD" />
        <circle cx="2" cy="-2" r="2.5" fill="#DDA0DD" />
        <circle cx="0" cy="-3" r="2.5" fill="#DDA0DD" />
        <circle cx="0" cy="-1" r="1.5" fill="#FFF" />
      </g>
    </g>
  </svg>
);

// Cute stickers/decals
export const IsometricStarSticker: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 40 40" className={className}>
    <g transform="translate(20, 20)">
      {/* Star with soft glow */}
      <circle cx="0" cy="0" r="16" fill="#FFD700" opacity="0.3" />
      <path d="M0 -12 L3 -4 L12 -4 L5 2 L8 10 L0 6 L-8 10 L-5 2 L-12 -4 L-3 -4 Z" fill="#FFD700" />
      <path d="M0 -10 L2 -4 L8 -4 L4 0 L6 6 L0 3 L-6 6 L-4 0 L-8 -4 L-2 -4 Z" fill="#FFED4E" />
      {/* Sparkle */}
      <circle cx="-8" cy="-8" r="2" fill="white" opacity="0.8" />
    </g>
  </svg>
);

export const IsometricHeartSticker: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 40 40" className={className}>
    <g transform="translate(20, 20)">
      <circle cx="0" cy="0" r="15" fill="#FF6B9D" opacity="0.3" />
      <path d="M0 10 C-10 0 -15 -8 -8 -12 C-4 -14 0 -8 0 -5 C0 -8 4 -14 8 -12 C15 -8 10 0 0 10" fill="#FF6B9D" />
      <path d="M0 8 C-8 0 -12 -6 -6 -10 C-3 -11 0 -7 0 -4 C0 -7 3 -11 6 -10 C12 -6 8 0 0 8" fill="#FF8FB0" />
      <ellipse cx="-4" cy="-8" rx="2" ry="3" fill="white" opacity="0.6" />
    </g>
  </svg>
);

export const IsometricCloudSticker: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 50 35" className={className}>
    <g transform="translate(25, 17)">
      <ellipse cx="0" cy="0" rx="18" ry="10" fill="#E8F4F8" />
      <ellipse cx="-10" cy="2" rx="10" ry="8" fill="#E8F4F8" />
      <ellipse cx="10" cy="2" rx="10" ry="8" fill="#E8F4F8" />
      <ellipse cx="-5" cy="-5" rx="8" ry="7" fill="#F0F8FF" />
      <ellipse cx="5" cy="-5" rx="8" ry="7" fill="#F0F8FF" />
      {/* Blush */}
      <circle cx="-8" cy="3" r="2" fill="#FFB6C1" opacity="0.5" />
      <circle cx="8" cy="3" r="2" fill="#FFB6C1" opacity="0.5" />
    </g>
  </svg>
);

// Picture frame
export const IsometricPictureFrame: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 60 70" className={className}>
    <g transform="translate(30, 35)">
      {/* Frame */}
      <path d="M-20 -25 L20 -25 L20 25 L-20 25 Z" fill={COLORS.brown} stroke={COLORS.brownDark} strokeWidth="2" />
      <path d="M-16 -21 L16 -21 L16 21 L-16 21 Z" fill={COLORS.cream} />
      
      {/* Cute picture - landscape with sun */}
      <rect x="-14" y="-19" width="28" height="38" fill="#B8E0F0" />
      <circle cx="8" cy="-10" r="5" fill="#FFD700" />
      <path d="M-14 5 L-5 0 L5 3 L14 -2 L14 19 L-14 19 Z" fill={COLORS.green} />
      <path d="M-14 10 L-8 6 L0 9 L8 4 L14 8 L14 19 L-14 19 Z" fill={COLORS.greenDark} />
    </g>
  </svg>
);

// Hanging plant with macrame
export const IsometricHangingPlant: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 60 100" className={className}>
    <g transform="translate(30, 15)">
      {/* Hanging string */}
      <line x1="0" y1="0" x2="0" y2="25" stroke={COLORS.beigeDark} strokeWidth="2" />
      
      {/* Macrame holder */}
      <path d="M-15 25 L-8 45 L0 50 L8 45 L15 25" fill="none" stroke={COLORS.cream} strokeWidth="3" strokeLinecap="round" />
      <line x1="-15" y1="25" x2="-5" y2="35" stroke={COLORS.cream} strokeWidth="2" />
      <line x1="15" y1="25" x2="5" y2="35" stroke={COLORS.cream} strokeWidth="2" />
      
      {/* Pot */}
      <ellipse cx="0" cy="45" rx="12" ry="6" fill={COLORS.brown} />
      <path d="M-12 45 L-8 65 L8 65 L12 45" fill={COLORS.brown} />
      <path d="M-12 45 L-8 65 L-8 67 L-12 47 Z" fill={COLORS.brownDark} />
      
      {/* Trailing vines */}
      <path d="M-5 65 Q-15 75 -12 85 Q-10 95 -5 90" stroke={COLORS.green} strokeWidth="2" fill="none" />
      <path d="M5 65 Q15 75 12 85 Q10 95 5 90" stroke={COLORS.greenDark} strokeWidth="2" fill="none" />
      <path d="M0 65 Q-5 80 0 92" stroke="#9BC48E" strokeWidth="2" fill="none" />
      
      {/* Leaves */}
      <ellipse cx="-12" cy="75" rx="4" ry="6" fill={COLORS.green} />
      <ellipse cx="12" cy="75" rx="4" ry="6" fill={COLORS.greenDark} />
      <ellipse cx="-8" cy="85" rx="3" ry="5" fill="#9BC48E" />
      <ellipse cx="8" cy="85" rx="3" ry="5" fill={COLORS.green} />
      <ellipse cx="0" cy="90" rx="3" ry="5" fill={COLORS.greenDark} />
    </g>
  </svg>
);

// Coffee cup
export const IsometricCoffeeCup: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 30 35" className={className}>
    <g transform="translate(15, 17)">
      {/* Shadow */}
      <ellipse cx="0" cy="14" rx="10" ry="3" fill={COLORS.shadowLight} />
      
      {/* Saucer */}
      <ellipse cx="0" cy="10" rx="12" ry="4" fill={COLORS.cream} />
      
      {/* Cup body */}
      <path d="M-8 0 L-6 10 L6 10 L8 0 Z" fill="#FFF5E6" />
      <path d="M-8 0 L-6 10 L-6 11 L-9 1 Z" fill="#EBE0D5" />
      <path d="M8 0 L6 10 L6 11 L9 1 Z" fill="#D4C9BE" />
      
      {/* Coffee liquid */}
      <ellipse cx="0" cy="0" rx="8" ry="3" fill="#6B4423" />
      
      {/* Handle */}
      <path d="M8 2 Q12 2 12 6 Q12 10 8 8" stroke="#FFF5E6" strokeWidth="2" fill="none" />
      
      {/* Steam */}
      <path d="M-3 -5 Q-5 -10 -3 -15" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M3 -5 Q5 -10 3 -15" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6" />
    </g>
  </svg>
);

// Toy ball
export const IsometricToyBall: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 40 40" className={className}>
    <g transform="translate(20, 20)">
      {/* Shadow */}
      <ellipse cx="0" cy="14" rx="12" ry="4" fill={COLORS.shadowLight} />
      
      {/* Ball */}
      <circle cx="0" cy="0" r="14" fill="#FF6B6B" />
      <circle cx="-4" cy="-4" r="4" fill="white" opacity="0.4" />
      
      {/* Stripes */}
      <path d="M-10 -10 Q0 0 10 -10" stroke="#FFE66D" strokeWidth="3" fill="none" />
      <path d="M-12 2 Q0 5 12 2" stroke="#4ECDC4" strokeWidth="3" fill="none" />
      <path d="M-8 8 Q0 12 8 8" stroke="#DDA0DD" strokeWidth="3" fill="none" />
    </g>
  </svg>
);

// Cushion/Pillow
export const IsometricCushion: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 50 35" className={className}>
    <g transform="translate(25, 17)">
      {/* Shadow */}
      <ellipse cx="0" cy="12" rx="20" ry="5" fill={COLORS.shadowLight} />
      
      {/* Cushion */}
      <ellipse cx="0" cy="5" rx="18" ry="10" fill="#FFB6C1" />
      <ellipse cx="-3" cy="3" rx="14" ry="7" fill="#FFC8D6" />
      
      {/* Pattern dots */}
      <circle cx="-8" cy="5" r="2" fill="white" opacity="0.7" />
      <circle cx="0" cy="7" r="2" fill="white" opacity="0.7" />
      <circle cx="8" cy="5" r="2" fill="white" opacity="0.7" />
      <circle cx="-4" cy="2" r="1.5" fill="white" opacity="0.7" />
      <circle cx="4" cy="2" r="1.5" fill="white" opacity="0.7" />
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

export const DECOR_ITEMS: FurnitureItem[] = [
  { id: 'rug', name: 'Patterned Rug', category: 'decor', price: 35, component: IsometricRug },
  { id: 'dog-bowl', name: 'Dog Bowl', category: 'decor', price: 15, component: IsometricDogBowl },
  { id: 'lamp', name: 'Floor Lamp', category: 'decor', price: 45, component: IsometricLamp },
  { id: 'window', name: 'Window', category: 'decor', price: 0, component: IsometricWindow },
  // Colorful Focus Friend style items
  { id: 'books', name: 'Colorful Books', category: 'decor', price: 25, component: IsometricBooks },
  { id: 'vines', name: 'Hanging Vines', category: 'decor', price: 30, component: IsometricVines },
  { id: 'star-sticker', name: 'Star Sticker', category: 'decor', price: 10, component: IsometricStarSticker },
  { id: 'heart-sticker', name: 'Heart Sticker', category: 'decor', price: 10, component: IsometricHeartSticker },
  { id: 'cloud-sticker', name: 'Cloud Sticker', category: 'decor', price: 10, component: IsometricCloudSticker },
  { id: 'picture-frame', name: 'Picture Frame', category: 'decor', price: 35, component: IsometricPictureFrame },
  { id: 'coffee-cup', name: 'Coffee Cup', category: 'decor', price: 15, component: IsometricCoffeeCup },
  { id: 'toy-ball', name: 'Toy Ball', category: 'decor', price: 20, component: IsometricToyBall },
  { id: 'cushion', name: 'Pink Cushion', category: 'decor', price: 25, component: IsometricCushion },
];

export const PLANT_ITEMS: FurnitureItem[] = [
  { id: 'plant', name: 'Potted Plant', category: 'plants', price: 30, component: IsometricPlant },
  { id: 'hanging-plant', name: 'Hanging Plant', category: 'plants', price: 40, component: IsometricHangingPlant },
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
