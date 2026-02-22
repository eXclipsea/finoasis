// Custom SVG furniture assets - Focus Friend inspired style
// Isometric perspective with bold outlines, warm cozy colors

const COLORS = {
  // Warm browns
  brownDark: '#6B4423',
  brownMedium: '#8B6914', 
  brownLight: '#A67B5B',
  brownCream: '#C9A77D',
  brownPale: '#D4B896',
  
  // Cozy accents
  sage: '#7EB8A2',
  sageDark: '#6BA08A',
  peach: '#E8A87C',
  peachDark: '#D9976B',
  cream: '#F5EDE4',
  
  // Outline
  outline: '#4A3728',
  
  // Character
  bean: '#A67B5B',
  beanLight: '#C9A77D',
  leaf: '#7EB8A2',
};

import React from 'react';

export const FurnitureItem = ({ type, className = "" }: { type: string; className?: string }) => {
  switch (type) {
    // CHAIRS - Isometric with depth
    case 'cozy-chair':
      return (
        <svg viewBox="0 0 70 70" className={`w-18 h-18 ${className}`}>
          {/* Back leg */}
          <path d="M20 50 L20 62 L25 62 L25 50" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          {/* Seat back (tall) */}
          <path d="M15 25 L15 50 L55 50 L55 25 L45 20 L25 20 Z" fill={COLORS.brownMedium} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M20 30 L20 48 L50 48 L50 30" fill={COLORS.brownLight} stroke={COLORS.outline} strokeWidth="1.5"/>
          {/* Seat top */}
          <ellipse cx="35" cy="50" rx="22" ry="10" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="2"/>
          {/* Front legs */}
          <path d="M25 55 L25 65 L30 65 L30 55" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M45 55 L45 63 L50 63 L50 55" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          {/* Button on back */}
          <circle cx="35" cy="35" r="3" fill={COLORS.brownDark}/>
        </svg>
      );

    case 'wooden-chair':
      return (
        <svg viewBox="0 0 60 70" className={`w-16 h-18 ${className}`}>
          {/* Back legs */}
          <path d="M15 45 L15 60 L20 60 L20 45" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M45 45 L45 58 L50 58 L50 45" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          {/* Backrest */}
          <rect x="15" y="20" width="40" height="30" rx="3" fill={COLORS.brownMedium} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="20" y="25" width="30" height="20" rx="2" fill={COLORS.brownLight} stroke={COLORS.outline} strokeWidth="1.5"/>
          {/* Slats */}
          <line x1="25" y1="28" x2="25" y2="42" stroke={COLORS.brownDark} strokeWidth="2"/>
          <line x1="35" y1="28" x2="35" y2="42" stroke={COLORS.brownDark} strokeWidth="2"/>
          <line x1="45" y1="28" x2="45" y2="42" stroke={COLORS.brownDark} strokeWidth="2"/>
          {/* Seat */}
          <ellipse cx="35" cy="48" rx="20" ry="8" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="2"/>
          {/* Front legs */}
          <path d="M22 50 L22 65 L27 65 L27 50" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M43 50 L43 63 L48 63 L48 50" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
        </svg>
      );

    // TABLES - With visible depth
    case 'wooden-table':
      return (
        <svg viewBox="0 0 70 60" className={`w-20 h-16 ${className}`}>
          {/* Table top surface */}
          <ellipse cx="35" cy="30" rx="28" ry="15" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="2"/>
          <ellipse cx="35" cy="30" rx="24" ry="12" fill={COLORS.brownPale} stroke={COLORS.outline} strokeWidth="1.5"/>
          {/* Table edge/thickness */}
          <path d="M7 30 L7 38 Q35 52 63 38 L63 30" fill={COLORS.brownMedium} stroke={COLORS.outline} strokeWidth="2"/>
          {/* Legs - visible from isometric angle */}
          <path d="M12 42 L12 55 L18 55 L18 45" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M52 45 L52 55 L58 55 L58 42" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M32 48 L32 58 L38 58 L38 48" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
        </svg>
      );

    case 'coffee-table':
      return (
        <svg viewBox="0 0 60 50" className={`w-16 h-14 ${className}`}>
          {/* Table top */}
          <ellipse cx="30" cy="25" rx="25" ry="12" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="2"/>
          <ellipse cx="30" cy="25" rx="20" ry="9" fill={COLORS.brownPale} stroke={COLORS.outline} strokeWidth="1.5"/>
          {/* Side thickness */}
          <path d="M5 25 L5 30 Q30 42 55 30 L55 25" fill={COLORS.brownLight} stroke={COLORS.outline} strokeWidth="2"/>
          {/* Rounded legs */}
          <circle cx="12" cy="38" r="5" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <circle cx="48" cy="38" r="5" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
        </svg>
      );

    // BEDS - With headboard and depth
    case 'cozy-bed':
      return (
        <svg viewBox="0 0 80 70" className={`w-22 h-20 ${className}`}>
          {/* Back headboard */}
          <rect x="15" y="15" width="50" height="25" rx="3" fill={COLORS.brownMedium} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="20" y="20" width="40" height="15" rx="2" fill={COLORS.brownLight} stroke={COLORS.outline} strokeWidth="1.5"/>
          {/* Mattress base */}
          <path d="M10 35 L70 35 L70 45 L10 45 Z" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          {/* Mattress top */}
          <rect x="10" y="38" width="60" height="15" rx="3" fill={COLORS.cream} stroke={COLORS.outline} strokeWidth="2"/>
          {/* Blanket */}
          <path d="M10 43 Q40 48 70 43 L70 55 Q40 60 10 55 Z" fill={COLORS.sage} stroke={COLORS.outline} strokeWidth="2" opacity="0.9"/>
          {/* Pillow */}
          <ellipse cx="25" cy="42" rx="10" ry="6" fill="white" stroke={COLORS.outline} strokeWidth="1.5"/>
          {/* Legs */}
          <rect x="12" y="55" width="6" height="8" rx="1" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="62" y="55" width="6" height="8" rx="1" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
        </svg>
      );

    // STORAGE
    case 'bookshelf':
      return (
        <svg viewBox="0 0 60 80" className={`w-16 h-20 ${className}`}>
          {/* Main frame */}
          <rect x="10" y="10" width="40" height="60" rx="3" fill={COLORS.brownMedium} stroke={COLORS.outline} strokeWidth="2"/>
          {/* Inner backing */}
          <rect x="15" y="15" width="30" height="50" rx="2" fill={COLORS.brownLight} stroke={COLORS.outline} strokeWidth="1.5"/>
          {/* Shelves */}
          <line x1="15" y1="28" x2="45" y2="28" stroke={COLORS.brownDark} strokeWidth="3"/>
          <line x1="15" y1="42" x2="45" y2="42" stroke={COLORS.brownDark} strokeWidth="3"/>
          {/* Books - colorful spines */}
          <rect x="18" y="18" width="5" height="8" rx="1" fill={COLORS.peach} stroke={COLORS.outline} strokeWidth="1"/>
          <rect x="25" y="16" width="6" height="10" rx="1" fill={COLORS.sage} stroke={COLORS.outline} strokeWidth="1"/>
          <rect x="33" y="19" width="4" height="7" rx="1" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="1"/>
          <rect x="38" y="17" width="5" height="9" rx="1" fill="#E8B4B4" stroke={COLORS.outline} strokeWidth="1"/>
        </svg>
      );

    case 'dresser':
      return (
        <svg viewBox="0 0 70 60" className={`w-18 h-16 ${className}`}>
          {/* Body */}
          <rect x="10" y="15" width="50" height="35" rx="4" fill={COLORS.brownMedium} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="15" y="20" width="40" height="25" rx="2" fill={COLORS.brownLight} stroke={COLORS.outline} strokeWidth="1.5"/>
          {/* Drawers */}
          <rect x="18" y="22" width="16" height="10" rx="2" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="1.5"/>
          <rect x="36" y="22" width="16" height="10" rx="2" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="1.5"/>
          <rect x="18" y="35" width="16" height="10" rx="2" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="1.5"/>
          <rect x="36" y="35" width="16" height="10" rx="2" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="1.5"/>
          {/* Knobs */}
          <circle cx="26" cy="27" r="2" fill={COLORS.brownDark}/>
          <circle cx="44" cy="27" r="2" fill={COLORS.brownDark}/>
          <circle cx="26" cy="40" r="2" fill={COLORS.brownDark}/>
          <circle cx="44" cy="40" r="2" fill={COLORS.brownDark}/>
          {/* Legs */}
          <rect x="12" y="50" width="6" height="6" rx="1" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="1.5"/>
          <rect x="52" y="50" width="6" height="6" rx="1" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="1.5"/>
        </svg>
      );

    // PLANTS
    case 'potted-plant':
      return (
        <svg viewBox="0 0 50 60" className={`w-14 h-16 ${className}`}>
          {/* Pot - with depth */}
          <ellipse cx="25" cy="48" rx="15" ry="6" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M10 35 L12 48 L38 48 L40 35 Q25 40 10 35" fill={COLORS.peachDark} stroke={COLORS.outline} strokeWidth="2"/>
          <ellipse cx="25" cy="35" rx="15" ry="5" fill={COLORS.peach} stroke={COLORS.outline} strokeWidth="2"/>
          {/* Leaves */}
          <ellipse cx="25" cy="25" rx="10" ry="15" fill={COLORS.sage} stroke={COLORS.outline} strokeWidth="2"/>
          <ellipse cx="18" cy="30" rx="6" ry="10" fill={COLORS.sageDark} stroke={COLORS.outline} strokeWidth="2" transform="rotate(-20 18 30)"/>
          <ellipse cx="32" cy="30" rx="6" ry="10" fill={COLORS.sage} stroke={COLORS.outline} strokeWidth="2" transform="rotate(20 32 30)"/>
          <ellipse cx="25" cy="15" rx="5" ry="8" fill={COLORS.leaf} stroke={COLORS.outline} strokeWidth="1.5"/>
        </svg>
      );

    case 'tall-plant':
      return (
        <svg viewBox="0 0 45 80" className={`w-14 h-20 ${className}`}>
          {/* Pot */}
          <ellipse cx="22" cy="70" rx="15" ry="6" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M7 55 L10 70 L35 70 L38 55" fill={COLORS.peachDark} stroke={COLORS.outline} strokeWidth="2"/>
          {/* Stems */}
          <path d="M22 55 Q15 40 12 25" stroke={COLORS.brownDark} strokeWidth="2" fill="none"/>
          <path d="M22 55 Q28 40 32 20" stroke={COLORS.brownDark} strokeWidth="2" fill="none"/>
          <path d="M22 55 L22 15" stroke={COLORS.brownDark} strokeWidth="2"/>
          {/* Leaves */}
          <ellipse cx="12" cy="25" rx="7" ry="12" fill={COLORS.sage} stroke={COLORS.outline} strokeWidth="2" transform="rotate(-25 12 25)"/>
          <ellipse cx="32" cy="20" rx="7" ry="12" fill={COLORS.sageDark} stroke={COLORS.outline} strokeWidth="2" transform="rotate(25 32 20)"/>
          <ellipse cx="22" cy="15" rx="6" ry="10" fill={COLORS.leaf} stroke={COLORS.outline} strokeWidth="2"/>
        </svg>
      );

    case 'cactus':
      return (
        <svg viewBox="0 0 40 60" className={`w-12 h-16 ${className}`}>
          {/* Pot */}
          <ellipse cx="20" cy="52" rx="12" ry="5" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M8 42 L10 52 L30 52 L32 42" fill={COLORS.peachDark} stroke={COLORS.outline} strokeWidth="2"/>
          {/* Main cactus body */}
          <ellipse cx="20" cy="32" rx="10" ry="18" fill={COLORS.sage} stroke={COLORS.outline} strokeWidth="2"/>
          {/* Arm */}
          <ellipse cx="30" cy="28" rx="6" ry="10" fill={COLORS.sageDark} stroke={COLORS.outline} strokeWidth="2"/>
          {/* Little spines */}
          <line x1="15" y1="22" x2="13" y2="20" stroke={COLORS.outline} strokeWidth="1.5"/>
          <line x1="25" y1="30" x2="27" y2="28" stroke={COLORS.outline} strokeWidth="1.5"/>
          <line x1="18" y1="38" x2="16" y2="36" stroke={COLORS.outline} strokeWidth="1.5"/>
        </svg>
      );

    // DECOR
    case 'rug':
      return (
        <svg viewBox="0 0 90 50" className={`w-28 h-16 ${className}`}>
          {/* Main rug */}
          <ellipse cx="45" cy="25" rx="40" ry="20" fill={COLORS.peach} stroke={COLORS.outline} strokeWidth="2"/>
          <ellipse cx="45" cy="25" rx="32" ry="15" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="2"/>
          {/* Pattern - checkerboard hint */}
          <ellipse cx="30" cy="22" rx="6" ry="4" fill={COLORS.sage} opacity="0.6"/>
          <ellipse cx="45" cy="30" rx="6" ry="4" fill={COLORS.sage} opacity="0.6"/>
          <ellipse cx="60" cy="22" rx="6" ry="4" fill={COLORS.sage} opacity="0.6"/>
          <ellipse cx="45" cy="18" rx="6" ry="4" fill={COLORS.brownLight} opacity="0.5"/>
        </svg>
      );

    case 'lamp':
      return (
        <svg viewBox="0 0 45 70" className={`w-14 h-20 ${className}`}>
          {/* Base */}
          <ellipse cx="22" cy="62" rx="12" ry="5" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          {/* Stand */}
          <rect x="19" y="35" width="6" height="27" rx="2" fill={COLORS.brownMedium} stroke={COLORS.outline} strokeWidth="2"/>
          {/* Lamp shade */}
          <path d="M10 38 L12 18 L33 18 L35 38 Z" fill={COLORS.peach} stroke={COLORS.outline} strokeWidth="2"/>
          <ellipse cx="22" cy="18" rx="10" ry="4" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="2"/>
          {/* Light glow */}
          <ellipse cx="22" cy="32" rx="15" ry="10" fill="#FFE4B5" opacity="0.4"/>
        </svg>
      );

    case 'clock':
      return (
        <svg viewBox="0 0 45 45" className={`w-14 h-14 ${className}`}>
          {/* Frame */}
          <circle cx="22" cy="22" r="20" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="3"/>
          <circle cx="22" cy="22" r="16" fill="white" stroke={COLORS.outline} strokeWidth="2"/>
          {/* Face */}
          <circle cx="22" cy="22" r="14" fill={COLORS.cream} stroke={COLORS.outline} strokeWidth="1"/>
          {/* Hour markers */}
          <circle cx="22" cy="10" r="1.5" fill={COLORS.outline}/>
          <circle cx="34" cy="22" r="1.5" fill={COLORS.outline}/>
          <circle cx="22" cy="34" r="1.5" fill={COLORS.outline}/>
          <circle cx="10" cy="22" r="1.5" fill={COLORS.outline}/>
          {/* Hands */}
          <line x1="22" y1="22" x2="22" y2="12" stroke={COLORS.outline} strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="22" y1="22" x2="30" y2="22" stroke={COLORS.outline} strokeWidth="2" strokeLinecap="round"/>
          {/* Center */}
          <circle cx="22" cy="22" r="3" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="1"/>
        </svg>
      );

    // CLOTHING/ACCESSORIES
    case 'beanie':
      return (
        <svg viewBox="0 0 45 35" className={`w-12 h-10 ${className}`}>
          <ellipse cx="22" cy="20" rx="18" ry="12" fill={COLORS.sage} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="4" y="18" width="36" height="10" rx="3" fill={COLORS.sageDark} stroke={COLORS.outline} strokeWidth="2"/>
          <circle cx="22" cy="8" r="6" fill={COLORS.sage} stroke={COLORS.outline} strokeWidth="2"/>
          <circle cx="22" cy="5" r="3" fill={COLORS.leaf}/>
        </svg>
      );

    case 'glasses':
      return (
        <svg viewBox="0 0 45 25" className={`w-14 h-8 ${className}`}>
          <circle cx="13" cy="12" r="10" fill="#E8A87C" opacity="0.3" stroke={COLORS.outline} strokeWidth="2.5"/>
          <circle cx="32" cy="12" r="10" fill="#E8A87C" opacity="0.3" stroke={COLORS.outline} strokeWidth="2.5"/>
          <line x1="23" y1="12" x2="22" y2="12" stroke={COLORS.outline} strokeWidth="2"/>
          <line x1="3" y1="12" x2="0" y2="10" stroke={COLORS.outline} strokeWidth="2"/>
          <line x1="42" y1="12" x2="45" y2="10" stroke={COLORS.outline} strokeWidth="2"/>
        </svg>
      );

    case 'scarf':
      return (
        <svg viewBox="0 0 45 60" className={`w-12 h-16 ${className}`}>
          <path d="M10 12 Q22 8 35 12 L35 18 Q22 22 10 18 Z" fill={COLORS.peach} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M12 18 L12 50 L22 55 L22 20" fill={COLORS.peachDark} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M20 18 L20 48 L30 52 L30 20" fill={COLORS.peach} stroke={COLORS.outline} strokeWidth="2"/>
          {/* Fringe */}
          <line x1="15" y1="52" x2="15" y2="58" stroke={COLORS.outline} strokeWidth="1.5"/>
          <line x1="19" y1="54" x2="19" y2="60" stroke={COLORS.outline} strokeWidth="1.5"/>
          <line x1="26" y1="50" x2="26" y2="56" stroke={COLORS.outline} strokeWidth="1.5"/>
        </svg>
      );

    case 'bowtie':
      return (
        <svg viewBox="0 0 40 30" className={`w-12 h-9 ${className}`}>
          <path d="M5 15 L18 8 L18 22 L5 15" fill={COLORS.peach} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M35 15 L22 8 L22 22 L35 15" fill={COLORS.peach} stroke={COLORS.outline} strokeWidth="2"/>
          <circle cx="20" cy="15" r="5" fill={COLORS.peachDark} stroke={COLORS.outline} strokeWidth="2"/>
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 50 50" className={`w-14 h-14 ${className}`}>
          <rect x="10" y="10" width="30" height="30" rx="5" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="2"/>
        </svg>
      );
  }
};

// CUTE BEAN PET CHARACTER with leaf on head!
export const PetCharacter = ({ stage, isMoving = false }: { stage: string; isMoving?: boolean }) => {
  if (stage === 'egg') {
    return (
      <svg viewBox="0 0 55 70" className={`w-16 h-20 ${isMoving ? 'animate-bounce' : ''}`}>
        {/* Egg body */}
        <ellipse cx="27" cy="40" rx="22" ry="28" fill={COLORS.cream} stroke={COLORS.outline} strokeWidth="3"/>
        <ellipse cx="27" cy="40" rx="18" ry="24" fill="#FFF8F3" stroke={COLORS.brownLight} strokeWidth="1"/>
        {/* Speckles */}
        <circle cx="20" cy="32" r="2" fill={COLORS.brownPale}/>
        <circle cx="32" cy="36" r="1.5" fill={COLORS.brownPale}/>
        <circle cx="24" cy="48" r="2" fill={COLORS.brownPale}/>
        <circle cx="34" cy="44" r="1.5" fill={COLORS.brownPale}/>
        {/* Little face peeking through */}
        <circle cx="22" cy="38" r="2" fill={COLORS.outline} opacity="0.3"/>
        <circle cx="32" cy="38" r="2" fill={COLORS.outline} opacity="0.3"/>
        <path d="M25 44 Q27 46 29 44" stroke={COLORS.outline} strokeWidth="1.5" fill="none" opacity="0.3"/>
      </svg>
    );
  }

  // CUTE BEAN CHARACTER with leaf on head!
  return (
    <svg viewBox="0 0 70 90" className={`w-18 h-24 ${isMoving ? 'animate-bounce' : ''}`}>
      {/* Leaf on top */}
      <ellipse cx="35" cy="12" rx="6" ry="10" fill={COLORS.leaf} stroke={COLORS.outline} strokeWidth="2" transform="rotate(-15 35 12)"/>
      <ellipse cx="40" cy="14" rx="5" ry="8" fill={COLORS.sage} stroke={COLORS.outline} strokeWidth="2" transform="rotate(15 40 14)"/>
      
      {/* Body - bean shape */}
      <ellipse cx="35" cy="50" rx="25" ry="30" fill={COLORS.bean} stroke={COLORS.outline} strokeWidth="3"/>
      <ellipse cx="35" cy="50" rx="20" ry="24" fill={COLORS.beanLight} stroke={COLORS.outline} strokeWidth="2"/>
      
      {/* Belly highlight */}
      <ellipse cx="35" cy="55" rx="12" ry="15" fill={COLORS.brownPale} opacity="0.5"/>
      
      {/* Simple dot eyes */}
      <circle cx="28" cy="42" r="3" fill={COLORS.outline}/>
      <circle cx="42" cy="42" r="3" fill={COLORS.outline}/>
      
      {/* Cute smile */}
      <path d="M30 50 Q35 54 40 50" stroke={COLORS.outline} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      
      {/* Little blush */}
      <ellipse cx="24" cy="48" rx="4" ry="2" fill="#FFB6C1" opacity="0.6"/>
      <ellipse cx="46" cy="48" rx="4" ry="2" fill="#FFB6C1" opacity="0.6"/>
      
      {/* Tiny arms */}
      <ellipse cx="12" cy="48" rx="5" ry="8" fill={COLORS.bean} stroke={COLORS.outline} strokeWidth="2" transform="rotate(-20 12 48)"/>
      <ellipse cx="58" cy="48" rx="5" ry="8" fill={COLORS.bean} stroke={COLORS.outline} strokeWidth="2" transform="rotate(20 58 48)"/>
      
      {/* Little feet */}
      <ellipse cx="25" cy="78" rx="6" ry="4" fill={COLORS.bean} stroke={COLORS.outline} strokeWidth="2"/>
      <ellipse cx="45" cy="78" rx="6" ry="4" fill={COLORS.bean} stroke={COLORS.outline} strokeWidth="2"/>
      
      {/* Holding a phone (like in Focus Friend reference) */}
      <rect x="30" y="55" width="10" height="14" rx="2" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
      <rect x="32" y="57" width="6" height="10" rx="1" fill="#87CEEB"/>
    </svg>
  );
};

// Export all available furniture items
export const FURNITURE_ITEMS = [
  { id: 'cozy-chair', name: 'Cozy Chair', price: 50, category: 'furniture' as const },
  { id: 'wooden-chair', name: 'Wooden Chair', price: 35, category: 'furniture' as const },
  { id: 'cozy-bed', name: 'Cozy Bed', price: 120, category: 'furniture' as const },
  { id: 'wooden-table', name: 'Wooden Table', price: 80, category: 'furniture' as const },
  { id: 'coffee-table', name: 'Coffee Table', price: 60, category: 'furniture' as const },
  { id: 'bookshelf', name: 'Bookshelf', price: 90, category: 'furniture' as const },
  { id: 'dresser', name: 'Dresser', price: 100, category: 'furniture' as const },
];

export const PLANT_ITEMS = [
  { id: 'potted-plant', name: 'Potted Plant', price: 25, category: 'plant' as const },
  { id: 'tall-plant', name: 'Tall Plant', price: 40, category: 'plant' as const },
  { id: 'cactus', name: 'Cactus', price: 20, category: 'plant' as const },
];

export const DECOR_ITEMS = [
  { id: 'rug', name: 'Rug', price: 45, category: 'decor' as const },
  { id: 'lamp', name: 'Reading Lamp', price: 35, category: 'decor' as const },
  { id: 'clock', name: 'Wall Clock', price: 30, category: 'decor' as const },
];

export const CLOTHING_ITEMS = [
  { id: 'beanie', name: 'Cozy Beanie', price: 15, category: 'clothing' as const },
  { id: 'glasses', name: 'Reading Glasses', price: 20, category: 'clothing' as const },
  { id: 'scarf', name: 'Warm Scarf', price: 18, category: 'clothing' as const },
  { id: 'bowtie', name: 'Bow Tie', price: 12, category: 'clothing' as const },
];

export const ALL_ITEMS = [...FURNITURE_ITEMS, ...PLANT_ITEMS, ...DECOR_ITEMS];
