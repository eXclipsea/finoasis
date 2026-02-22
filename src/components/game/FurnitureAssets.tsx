// Custom SVG furniture assets - Potato & Dog Theme!
// Isometric perspective with bold outlines, warm earthy colors

const COLORS = {
  // Earthy browns (for potatoes and furniture)
  brownDark: '#5D3A1A',
  brownMedium: '#8B6914', 
  brownLight: '#A67B5B',
  brownCream: '#C9A77D',
  brownPale: '#D4B896',
  
  // Potato colors
  potato: '#C4A574',
  potatoLight: '#D4B896',
  potatoDark: '#A68B5B',
  potatoSpot: '#8B7355',
  
  // Dog colors
  dogBrown: '#A67B5B',
  dogLight: '#C9A77D',
  dogEar: '#8B6914',
  
  // Carrot orange (new currency!)
  carrot: '#FF8C42',
  carrotDark: '#E67300',
  carrotGreen: '#4CAF50',
  
  // Cozy accents
  sage: '#7EB8A2',
  sageDark: '#6BA08A',
  peach: '#E8A87C',
  peachDark: '#D9976B',
  cream: '#FDF8F3',
  sky: '#B8D4E8',
  
  // Outline
  outline: '#3D2914',
  
  // Wall/Floor options
  wallBlue: '#A8C5D9',
  wallGreen: '#B8D4B8',
  wallPink: '#E8C5C5',
  wallYellow: '#F0E4A8',
  wallPurple: '#D4C5E8',
  wallBeige: '#E6D5C3',
  floorWood: '#C4A080',
  floorDark: '#8B6914',
  floorLight: '#E6D5C3',
};

import React from 'react';

// ============================================
// POTATO CHARACTER (Main player companion)
// ============================================
export const PotatoCharacter = ({ 
  isMoving = false, 
  isHappy = false,
  outfit = [] as string[]
}: { 
  isMoving?: boolean; 
  isHappy?: boolean;
  outfit?: string[];
}) => {
  return (
    <svg viewBox="0 0 70 85" className={`w-20 h-24 ${isMoving ? 'animate-bounce' : ''}`}>
      {/* Shadow */}
      <ellipse cx="35" cy="78" rx="18" ry="5" fill="#000" opacity="0.15"/>
      
      {/* Potato body - irregular organic shape */}
      <path d="M20 25 Q15 40 18 55 Q20 70 30 75 Q40 78 50 72 Q58 65 58 50 Q58 35 50 25 Q42 15 30 18 Q22 20 20 25" 
            fill={COLORS.potato} stroke={COLORS.outline} strokeWidth="3"/>
      
      {/* Potato eye spots/lumps */}
      <ellipse cx="25" cy="30" rx="4" ry="3" fill={COLORS.potatoSpot} opacity="0.4"/>
      <ellipse cx="50" cy="35" rx="3" ry="4" fill={COLORS.potatoSpot} opacity="0.4"/>
      <ellipse cx="35" cy="60" rx="5" ry="3" fill={COLORS.potatoSpot} opacity="0.4"/>
      
      {/* Highlight */}
      <ellipse cx="30" cy="28" rx="8" ry="5" fill={COLORS.potatoLight} opacity="0.5"/>
      
      {/* Eyes */}
      <circle cx="28" cy="40" r="4" fill="white" stroke={COLORS.outline} strokeWidth="2"/>
      <circle cx="28" cy="40" r="2" fill={COLORS.outline}/>
      <circle cx="28" cy="39" r="1" fill="white"/>
      
      <circle cx="42" cy="40" r="4" fill="white" stroke={COLORS.outline} strokeWidth="2"/>
      <circle cx="42" cy="40" r="2" fill={COLORS.outline}/>
      <circle cx="42" cy="39" r="1" fill="white"/>
      
      {/* Eyebrows */}
      <path d="M24 33 Q28 30 32 33" stroke={COLORS.outline} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M38 33 Q42 30 46 33" stroke={COLORS.outline} strokeWidth="2" fill="none" strokeLinecap="round"/>
      
      {/* Smile */}
      <path d="M30 52 Q35 56 40 52" stroke={COLORS.outline} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      
      {/* Blush */}
      <ellipse cx="22" cy="48" rx="5" ry="3" fill="#FFB6C1" opacity="0.6"/>
      <ellipse cx="48" cy="48" rx="5" ry="3" fill="#FFB6C1" opacity="0.6"/>
      
      {/* Arms (stubby potato arms) */}
      <ellipse cx="12" cy="50" rx="5" ry="8" fill={COLORS.potato} stroke={COLORS.outline} strokeWidth="2" transform="rotate(-25 12 50)"/>
      <ellipse cx="58" cy="50" rx="5" ry="8" fill={COLORS.potato} stroke={COLORS.outline} strokeWidth="2" transform="rotate(25 58 50)"/>
      
      {/* Little sprouts on top */}
      <path d="M32 18 Q30 8 32 5" stroke={COLORS.carrotGreen} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <ellipse cx="32" cy="5" rx="2" ry="4" fill={COLORS.carrotGreen} stroke={COLORS.outline} strokeWidth="1"/>
      
      {/* Accessories */}
      {outfit?.includes('glasses') && (
        <g>
          <circle cx="28" cy="40" r="7" fill="none" stroke="#333" strokeWidth="2"/>
          <circle cx="42" cy="40" r="7" fill="none" stroke="#333" strokeWidth="2"/>
          <line x1="35" y1="40" x2="37" y2="40" stroke="#333" strokeWidth="2"/>
        </g>
      )}
      {outfit?.includes('hat') && (
        <g>
          <path d="M20 20 L35 5 L50 20 Z" fill={COLORS.carrot} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="18" y="18" width="34" height="6" rx="2" fill={COLORS.carrotDark} stroke={COLORS.outline} strokeWidth="2"/>
        </g>
      )}
      
      {/* Happy sparkles */}
      {isHappy && (
        <g>
          <text x="55" y="25" fontSize="16">✨</text>
          <text x="10" y="30" fontSize="12">✨</text>
        </g>
      )}
    </svg>
  );
};

// ============================================
// DOG COMPANION
// ============================================
export const DogCharacter = ({ isMoving = false }: { isMoving?: boolean }) => {
  return (
    <svg viewBox="0 0 65 60" className={`w-16 h-16 ${isMoving ? 'animate-bounce' : ''}`}>
      {/* Shadow */}
      <ellipse cx="32" cy="55" rx="15" ry="4" fill="#000" opacity="0.15"/>
      
      {/* Tail - wagging */}
      <path d="M45 40 Q55 35 52 25" stroke={COLORS.dogBrown} strokeWidth="6" fill="none" strokeLinecap="round">
        <animate attributeName="d" values="M45 40 Q55 35 52 25;M45 40 Q50 30 48 20;M45 40 Q55 35 52 25" dur="0.5s" repeatCount="indefinite"/>
      </path>
      
      {/* Body */}
      <ellipse cx="32" cy="42" rx="20" ry="12" fill={COLORS.dogBrown} stroke={COLORS.outline} strokeWidth="2"/>
      <ellipse cx="32" cy="42" rx="14" ry="8" fill={COLORS.dogLight} opacity="0.5"/>
      
      {/* Front legs */}
      <rect x="22" y="48" width="5" height="8" rx="2" fill={COLORS.dogBrown} stroke={COLORS.outline} strokeWidth="2"/>
      <rect x="38" y="48" width="5" height="8" rx="2" fill={COLORS.dogBrown} stroke={COLORS.outline} strokeWidth="2"/>
      
      {/* Back legs */}
      <rect x="18" y="45" width="5" height="8" rx="2" fill={COLORS.dogEar} stroke={COLORS.outline} strokeWidth="2"/>
      <rect x="42" y="45" width="5" height="8" rx="2" fill={COLORS.dogEar} stroke={COLORS.outline} strokeWidth="2"/>
      
      {/* Head */}
      <circle cx="32" cy="28" r="16" fill={COLORS.dogBrown} stroke={COLORS.outline} strokeWidth="2"/>
      
      {/* Snout */}
      <ellipse cx="32" cy="32" rx="8" ry="6" fill={COLORS.dogLight} stroke={COLORS.outline} strokeWidth="2"/>
      <ellipse cx="32" cy="30" rx="4" ry="3" fill="#FFB6C1" opacity="0.4"/>
      
      {/* Nose */}
      <circle cx="32" cy="28" r="3" fill={COLORS.outline}/>
      
      {/* Eyes */}
      <circle cx="26" cy="25" r="3.5" fill="white" stroke={COLORS.outline} strokeWidth="1.5"/>
      <circle cx="26" cy="25" r="2" fill={COLORS.outline}/>
      <circle cx="38" cy="25" r="3.5" fill="white" stroke={COLORS.outline} strokeWidth="1.5"/>
      <circle cx="38" cy="25" r="2" fill={COLORS.outline}/>
      
      {/* Happy eyebrows */}
      <path d="M23 20 Q26 18 29 20" stroke={COLORS.outline} strokeWidth="2" fill="none"/>
      <path d="M35 20 Q38 18 41 20" stroke={COLORS.outline} strokeWidth="2" fill="none"/>
      
      {/* Ears - floppy */}
      <ellipse cx="16" cy="28" rx="6" ry="10" fill={COLORS.dogEar} stroke={COLORS.outline} strokeWidth="2" transform="rotate(-20 16 28)"/>
      <ellipse cx="48" cy="28" rx="6" ry="10" fill={COLORS.dogEar} stroke={COLORS.outline} strokeWidth="2" transform="rotate(20 48 28)"/>
      
      {/* Collar */}
      <path d="M22 38 Q32 42 42 38" stroke={COLORS.carrot} strokeWidth="4" fill="none" strokeLinecap="round"/>
      <circle cx="32" cy="42" r="3" fill={COLORS.carrotDark} stroke={COLORS.outline} strokeWidth="1"/>
    </svg>
  );
};

// ============================================
// CARROT CURRENCY ICON
// ============================================
export const CarrotIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 30 50" className={`w-6 h-10 ${className}`}>
    {/* Greens */}
    <path d="M15 12 Q8 5 12 0" stroke={COLORS.carrotGreen} strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M15 12 Q15 3 15 0" stroke={COLORS.carrotGreen} strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M15 12 Q22 5 18 0" stroke={COLORS.carrotGreen} strokeWidth="3" fill="none" strokeLinecap="round"/>
    
    {/* Carrot body */}
    <path d="M10 15 L20 15 L16 45 Q15 48 14 45 Z" fill={COLORS.carrot} stroke={COLORS.outline} strokeWidth="2"/>
    
    {/* Carrot lines */}
    <line x1="13" y1="20" x2="17" y2="20" stroke={COLORS.carrotDark} strokeWidth="1" opacity="0.5"/>
    <line x1="13" y1="28" x2="17" y2="28" stroke={COLORS.carrotDark} strokeWidth="1" opacity="0.5"/>
    <line x1="13" y1="36" x2="17" y2="36" stroke={COLORS.carrotDark} strokeWidth="1" opacity="0.5"/>
  </svg>
);

// ============================================
// FURNITURE ITEMS
// ============================================
export const FurnitureItem = ({ type, className = "" }: { type: string; className?: string }) => {
  switch (type) {
    // ========== CHAIRS ==========
    case 'cozy-chair':
    case 'chair-cozy':
      return (
        <svg viewBox="0 0 70 70" className={`w-18 h-18 ${className}`}>
          <path d="M20 50 L20 62 L25 62 L25 50" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M15 25 L15 50 L55 50 L55 25 L45 20 L25 20 Z" fill={COLORS.brownMedium} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M20 30 L20 48 L50 48 L50 30" fill={COLORS.brownLight} stroke={COLORS.outline} strokeWidth="1.5"/>
          <ellipse cx="35" cy="50" rx="22" ry="10" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M25 55 L25 65 L30 65 L30 55" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M45 55 L45 63 L50 63 L50 55" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <circle cx="35" cy="35" r="3" fill={COLORS.brownDark}/>
        </svg>
      );

    case 'wooden-chair':
    case 'chair-wooden':
      return (
        <svg viewBox="0 0 60 70" className={`w-16 h-18 ${className}`}>
          <path d="M15 45 L15 60 L20 60 L20 45" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M45 45 L45 58 L50 58 L50 45" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="15" y="20" width="40" height="30" rx="3" fill={COLORS.brownMedium} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="20" y="25" width="30" height="20" rx="2" fill={COLORS.brownLight} stroke={COLORS.outline} strokeWidth="1.5"/>
          <line x1="25" y1="28" x2="25" y2="42" stroke={COLORS.brownDark} strokeWidth="2"/>
          <line x1="35" y1="28" x2="35" y2="42" stroke={COLORS.brownDark} strokeWidth="2"/>
          <line x1="45" y1="28" x2="45" y2="42" stroke={COLORS.brownDark} strokeWidth="2"/>
          <ellipse cx="35" cy="48" rx="20" ry="8" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M22 50 L22 65 L27 65 L27 50" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M43 50 L43 63 L48 63 L48 50" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
        </svg>
      );

    case 'chair-modern':
      return (
        <svg viewBox="0 0 65 75" className={`w-17 h-19 ${className}`}>
          <path d="M18 55 L18 70 L25 70 L25 55" fill="#333" stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M40 55 L40 68 L47 68 L47 55" fill="#333" stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M12 30 Q12 20 32 18 Q52 20 52 30 L50 55 L14 55 Z" fill={COLORS.carrot} stroke={COLORS.outline} strokeWidth="2"/>
          <ellipse cx="32" cy="55" rx="20" ry="8" fill={COLORS.carrotDark} stroke={COLORS.outline} strokeWidth="2"/>
        </svg>
      );

    case 'chair-dog-bed':
      return (
        <svg viewBox="0 0 70 50" className={`w-18 h-13 ${className}`}>
          <ellipse cx="35" cy="38" rx="30" ry="10" fill={COLORS.dogBrown} stroke={COLORS.outline} strokeWidth="2"/>
          <ellipse cx="35" cy="35" rx="25" ry="8" fill={COLORS.dogLight} stroke={COLORS.outline} strokeWidth="2"/>
          <ellipse cx="35" cy="35" rx="20" ry="6" fill="#FFB6C1" opacity="0.3"/>
          <text x="28" y="32" fontSize="14">🦴</text>
        </svg>
      );

    // ========== TABLES ==========
    case 'wooden-table':
    case 'table-wooden':
      return (
        <svg viewBox="0 0 70 60" className={`w-20 h-16 ${className}`}>
          <ellipse cx="35" cy="30" rx="28" ry="15" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="2"/>
          <ellipse cx="35" cy="30" rx="24" ry="12" fill={COLORS.brownPale} stroke={COLORS.outline} strokeWidth="1.5"/>
          <path d="M7 30 L7 38 Q35 52 63 38 L63 30" fill={COLORS.brownMedium} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M12 42 L12 55 L18 55 L18 45" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M52 45 L52 55 L58 55 L58 42" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M32 48 L32 58 L38 58 L38 48" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
        </svg>
      );

    case 'coffee-table':
    case 'table-coffee':
      return (
        <svg viewBox="0 0 60 50" className={`w-16 h-14 ${className}`}>
          <ellipse cx="30" cy="25" rx="25" ry="12" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="2"/>
          <ellipse cx="30" cy="25" rx="20" ry="9" fill={COLORS.brownPale} stroke={COLORS.outline} strokeWidth="1.5"/>
          <path d="M5 25 L5 30 Q30 42 55 30 L55 25" fill={COLORS.brownLight} stroke={COLORS.outline} strokeWidth="2"/>
          <circle cx="12" cy="38" r="5" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <circle cx="48" cy="38" r="5" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
        </svg>
      );

    case 'table-round':
      return (
        <svg viewBox="0 0 65 65" className={`w-17 h-17 ${className}`}>
          <ellipse cx="32" cy="35" rx="28" ry="20" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="2"/>
          <ellipse cx="32" cy="35" rx="22" ry="16" fill={COLORS.brownPale} stroke={COLORS.outline} strokeWidth="1.5"/>
          <path d="M4 35 L6 50 Q32 60 58 50 L60 35" fill={COLORS.brownLight} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M32 52 L32 62" stroke={COLORS.brownDark} strokeWidth="6" strokeLinecap="round"/>
          <ellipse cx="32" cy="62" rx="10" ry="3" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
        </svg>
      );

    case 'table-dining':
      return (
        <svg viewBox="0 0 80 55" className={`w-22 h-15 ${className}`}>
          <rect x="10" y="20" width="60" height="25" rx="3" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="15" y="25" width="50" height="15" rx="2" fill={COLORS.brownPale} stroke={COLORS.outline} strokeWidth="1.5"/>
          <rect x="15" y="45" width="8" height="8" rx="1" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="67" y="45" width="8" height="8" rx="1" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="35" y="48" width="10" height="5" rx="1" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
        </svg>
      );

    // ========== BEDS ==========
    case 'cozy-bed':
    case 'bed-cozy':
      return (
        <svg viewBox="0 0 80 70" className={`w-22 h-20 ${className}`}>
          <rect x="15" y="15" width="50" height="25" rx="3" fill={COLORS.brownMedium} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="20" y="20" width="40" height="15" rx="2" fill={COLORS.brownLight} stroke={COLORS.outline} strokeWidth="1.5"/>
          <path d="M10 35 L70 35 L70 45 L10 45 Z" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="10" y="38" width="60" height="15" rx="3" fill={COLORS.cream} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M10 43 Q40 48 70 43 L70 55 Q40 60 10 55 Z" fill={COLORS.sage} stroke={COLORS.outline} strokeWidth="2" opacity="0.9"/>
          <ellipse cx="25" cy="42" rx="10" ry="6" fill="white" stroke={COLORS.outline} strokeWidth="1.5"/>
          <rect x="12" y="55" width="6" height="8" rx="1" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="62" y="55" width="6" height="8" rx="1" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
        </svg>
      );

    case 'bed-bunk':
      return (
        <svg viewBox="0 0 80 90" className={`w-22 h-24 ${className}`}>
          {/* Bottom bed */}
          <rect x="10" y="50" width="60" height="30" rx="3" fill={COLORS.brownMedium} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="15" y="55" width="50" height="20" rx="2" fill={COLORS.cream} stroke={COLORS.outline} strokeWidth="1.5"/>
          {/* Top bunk */}
          <rect x="10" y="20" width="60" height="25" rx="3" fill={COLORS.brownMedium} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="15" y="25" width="50" height="15" rx="2" fill={COLORS.cream} stroke={COLORS.outline} strokeWidth="1.5"/>
          {/* Posts */}
          <rect x="10" y="20" width="5" height="60" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="65" y="20" width="5" height="60" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          {/* Ladder */}
          <rect x="55" y="20" width="4" height="60" fill={COLORS.brownLight} stroke={COLORS.outline} strokeWidth="1.5"/>
          <line x1="55" y1="35" x2="59" y2="35" stroke={COLORS.outline} strokeWidth="2"/>
          <line x1="55" y1="50" x2="59" y2="50" stroke={COLORS.outline} strokeWidth="2"/>
          <line x1="55" y1="65" x2="59" y2="65" stroke={COLORS.outline} strokeWidth="2"/>
        </svg>
      );

    // ========== BOOKSHELVES ==========
    case 'bookshelf':
    case 'bookshelf-wood':
      return (
        <svg viewBox="0 0 60 80" className={`w-16 h-20 ${className}`}>
          <rect x="10" y="10" width="40" height="60" rx="3" fill={COLORS.brownMedium} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="15" y="15" width="30" height="50" rx="2" fill={COLORS.brownLight} stroke={COLORS.outline} strokeWidth="1.5"/>
          <line x1="15" y1="28" x2="45" y2="28" stroke={COLORS.brownDark} strokeWidth="3"/>
          <line x1="15" y1="42" x2="45" y2="42" stroke={COLORS.brownDark} strokeWidth="3"/>
          <rect x="18" y="18" width="5" height="8" rx="1" fill={COLORS.carrot} stroke={COLORS.outline} strokeWidth="1"/>
          <rect x="25" y="16" width="6" height="10" rx="1" fill={COLORS.sage} stroke={COLORS.outline} strokeWidth="1"/>
          <rect x="33" y="19" width="4" height="7" rx="1" fill={COLORS.peach} stroke={COLORS.outline} strokeWidth="1"/>
          <rect x="38" y="17" width="5" height="9" rx="1" fill="#E8B4B4" stroke={COLORS.outline} strokeWidth="1"/>
        </svg>
      );

    case 'bookshelf-tall':
      return (
        <svg viewBox="0 0 65 100" className={`w-17 h-26 ${className}`}>
          <rect x="10" y="10" width="45" height="80" rx="3" fill={COLORS.brownMedium} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="15" y="15" width="35" height="70" rx="2" fill={COLORS.brownLight} stroke={COLORS.outline} strokeWidth="1.5"/>
          <line x1="15" y1="28" x2="50" y2="28" stroke={COLORS.brownDark} strokeWidth="3"/>
          <line x1="15" y1="42" x2="50" y2="42" stroke={COLORS.brownDark} strokeWidth="3"/>
          <line x1="15" y1="56" x2="50" y2="56" stroke={COLORS.brownDark} strokeWidth="3"/>
          <line x1="15" y1="70" x2="50" y2="70" stroke={COLORS.brownDark} strokeWidth="3"/>
        </svg>
      );

    case 'bookshelf-corner':
      return (
        <svg viewBox="0 0 70 70" className={`w-18 h-18 ${className}`}>
          <path d="M10 60 L10 15 Q35 15 60 15 L60 60" fill={COLORS.brownMedium} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M15 55 L15 20 Q35 20 55 20 L55 55" fill={COLORS.brownLight} stroke={COLORS.outline} strokeWidth="1.5"/>
          <line x1="15" y1="30" x2="55" y2="30" stroke={COLORS.brownDark} strokeWidth="2"/>
          <line x1="15" y1="42" x2="55" y2="42" stroke={COLORS.brownDark} strokeWidth="2"/>
          <rect x="18" y="22" width="4" height="6" rx="1" fill={COLORS.carrot} stroke={COLORS.outline} strokeWidth="1"/>
        </svg>
      );

    // ========== STORAGE ==========
    case 'dresser':
    case 'dresser-wood':
      return (
        <svg viewBox="0 0 70 60" className={`w-18 h-16 ${className}`}>
          <rect x="10" y="15" width="50" height="35" rx="4" fill={COLORS.brownMedium} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="15" y="20" width="40" height="25" rx="2" fill={COLORS.brownLight} stroke={COLORS.outline} strokeWidth="1.5"/>
          <rect x="18" y="22" width="16" height="10" rx="2" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="1.5"/>
          <rect x="36" y="22" width="16" height="10" rx="2" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="1.5"/>
          <rect x="18" y="35" width="16" height="10" rx="2" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="1.5"/>
          <rect x="36" y="35" width="16" height="10" rx="2" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="1.5"/>
          <circle cx="26" cy="27" r="2" fill={COLORS.brownDark}/>
          <circle cx="44" cy="27" r="2" fill={COLORS.brownDark}/>
          <circle cx="26" cy="40" r="2" fill={COLORS.brownDark}/>
          <circle cx="44" cy="40" r="2" fill={COLORS.brownDark}/>
          <rect x="12" y="50" width="6" height="6" rx="1" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="1.5"/>
          <rect x="52" y="50" width="6" height="6" rx="1" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="1.5"/>
        </svg>
      );

    case 'chest':
      return (
        <svg viewBox="0 0 60 45" className={`w-16 h-12 ${className}`}>
          <rect x="5" y="15" width="50" height="25" rx="3" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="10" y="20" width="40" height="15" rx="2" fill={COLORS.brownMedium} stroke={COLORS.outline} strokeWidth="1.5"/>
          <rect x="28" y="20" width="4" height="15" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="1"/>
          <circle cx="30" cy="27" r="3" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="1.5"/>
        </svg>
      );

    // ========== PLANTS ==========
    case 'potted-plant':
    case 'plant-small':
      return (
        <svg viewBox="0 0 50 60" className={`w-14 h-16 ${className}`}>
          <ellipse cx="25" cy="48" rx="15" ry="6" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M10 35 L12 48 L38 48 L40 35 Q25 40 10 35" fill={COLORS.peachDark} stroke={COLORS.outline} strokeWidth="2"/>
          <ellipse cx="25" cy="35" rx="15" ry="5" fill={COLORS.peach} stroke={COLORS.outline} strokeWidth="2"/>
          <ellipse cx="25" cy="25" rx="10" ry="15" fill={COLORS.sage} stroke={COLORS.outline} strokeWidth="2"/>
          <ellipse cx="18" cy="30" rx="6" ry="10" fill={COLORS.sageDark} stroke={COLORS.outline} strokeWidth="2" transform="rotate(-20 18 30)"/>
          <ellipse cx="32" cy="30" rx="6" ry="10" fill={COLORS.sage} stroke={COLORS.outline} strokeWidth="2" transform="rotate(20 32 30)"/>
          <ellipse cx="25" cy="15" rx="5" ry="8" fill={COLORS.carrotGreen} stroke={COLORS.outline} strokeWidth="1.5"/>
        </svg>
      );

    case 'tall-plant':
    case 'plant-tall':
      return (
        <svg viewBox="0 0 45 80" className={`w-14 h-20 ${className}`}>
          <ellipse cx="22" cy="70" rx="15" ry="6" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M7 55 L10 70 L35 70 L38 55" fill={COLORS.peachDark} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M22 55 Q15 40 12 25" stroke={COLORS.brownDark} strokeWidth="2" fill="none"/>
          <path d="M22 55 Q28 40 32 20" stroke={COLORS.brownDark} strokeWidth="2" fill="none"/>
          <path d="M22 55 L22 15" stroke={COLORS.brownDark} strokeWidth="2"/>
          <ellipse cx="12" cy="25" rx="7" ry="12" fill={COLORS.sage} stroke={COLORS.outline} strokeWidth="2" transform="rotate(-25 12 25)"/>
          <ellipse cx="32" cy="20" rx="7" ry="12" fill={COLORS.sageDark} stroke={COLORS.outline} strokeWidth="2" transform="rotate(25 32 20)"/>
          <ellipse cx="22" cy="15" rx="6" ry="10" fill={COLORS.carrotGreen} stroke={COLORS.outline} strokeWidth="2"/>
        </svg>
      );

    case 'cactus':
    case 'plant-cactus':
      return (
        <svg viewBox="0 0 40 60" className={`w-12 h-16 ${className}`}>
          <ellipse cx="20" cy="52" rx="12" ry="5" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M8 42 L10 52 L30 52 L32 42" fill={COLORS.peachDark} stroke={COLORS.outline} strokeWidth="2"/>
          <ellipse cx="20" cy="32" rx="10" ry="18" fill={COLORS.sage} stroke={COLORS.outline} strokeWidth="2"/>
          <ellipse cx="30" cy="28" rx="6" ry="10" fill={COLORS.sageDark} stroke={COLORS.outline} strokeWidth="2"/>
          <line x1="15" y1="22" x2="13" y2="20" stroke={COLORS.outline} strokeWidth="1.5"/>
          <line x1="25" y1="30" x2="27" y2="28" stroke={COLORS.outline} strokeWidth="1.5"/>
          <line x1="18" y1="38" x2="16" y2="36" stroke={COLORS.outline} strokeWidth="1.5"/>
        </svg>
      );

    case 'plant-hanging':
      return (
        <svg viewBox="0 0 50 70" className={`w-14 h-18 ${className}`}>
          {/* Hanging rope */}
          <line x1="25" y1="5" x2="25" y2="25" stroke={COLORS.brownDark} strokeWidth="2"/>
          <line x1="15" y1="5" x2="35" y2="5" stroke={COLORS.brownDark} strokeWidth="2"/>
          {/* Pot */}
          <path d="M15 25 L18 40 L32 40 L35 25" fill={COLORS.peachDark} stroke={COLORS.outline} strokeWidth="2"/>
          {/* Trailing vines */}
          <path d="M20 40 Q18 55 15 60 Q12 65 18 65" stroke={COLORS.sageDark} strokeWidth="3" fill="none"/>
          <path d="M25 40 Q25 52 28 58 Q30 62 25 65" stroke={COLORS.sage} strokeWidth="3" fill="none"/>
          <path d="M30 40 Q32 55 35 60 Q38 63 32 65" stroke={COLORS.carrotGreen} strokeWidth="3" fill="none"/>
        </svg>
      );

    case 'carrot-patch':
      return (
        <svg viewBox="0 0 70 50" className={`w-18 h-13 ${className}`}>
          {/* Dirt patch */}
          <ellipse cx="35" cy="40" rx="30" ry="8" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          {/* Carrots growing */}
          <g>
            <ellipse cx="20" cy="38" rx="3" ry="5" fill={COLORS.carrot} stroke={COLORS.outline} strokeWidth="1.5"/>
            <path d="M20 35 L17 25" stroke={COLORS.carrotGreen} strokeWidth="2"/>
            <path d="M20 35 L20 22" stroke={COLORS.carrotGreen} strokeWidth="2"/>
            <path d="M20 35 L23 25" stroke={COLORS.carrotGreen} strokeWidth="2"/>
          </g>
          <g>
            <ellipse cx="35" cy="38" rx="3" ry="6" fill={COLORS.carrot} stroke={COLORS.outline} strokeWidth="1.5"/>
            <path d="M35 34 L32 24" stroke={COLORS.carrotGreen} strokeWidth="2"/>
            <path d="M35 34 L35 21" stroke={COLORS.carrotGreen} strokeWidth="2"/>
            <path d="M35 34 L38 24" stroke={COLORS.carrotGreen} strokeWidth="2"/>
          </g>
          <g>
            <ellipse cx="50" cy="38" rx="3" ry="5" fill={COLORS.carrot} stroke={COLORS.outline} strokeWidth="1.5"/>
            <path d="M50 35 L47 25" stroke={COLORS.carrotGreen} strokeWidth="2"/>
            <path d="M50 35 L50 22" stroke={COLORS.carrotGreen} strokeWidth="2"/>
            <path d="M50 35 L53 25" stroke={COLORS.carrotGreen} strokeWidth="2"/>
          </g>
        </svg>
      );

    // ========== RUGS ==========
    case 'rug':
    case 'rug-round':
      return (
        <svg viewBox="0 0 90 50" className={`w-28 h-16 ${className}`}>
          <ellipse cx="45" cy="25" rx="40" ry="20" fill={COLORS.peach} stroke={COLORS.outline} strokeWidth="2"/>
          <ellipse cx="45" cy="25" rx="32" ry="15" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="2"/>
          <ellipse cx="30" cy="22" rx="6" ry="4" fill={COLORS.sage} opacity="0.6"/>
          <ellipse cx="45" cy="30" rx="6" ry="4" fill={COLORS.sage} opacity="0.6"/>
          <ellipse cx="60" cy="22" rx="6" ry="4" fill={COLORS.sage} opacity="0.6"/>
          <ellipse cx="45" cy="18" rx="6" ry="4" fill={COLORS.brownLight} opacity="0.5"/>
        </svg>
      );

    case 'rug-rect':
      return (
        <svg viewBox="0 0 80 50" className={`w-24 h-15 ${className}`}>
          <rect x="5" y="5" width="70" height="40" rx="3" fill={COLORS.peachDark} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="10" y="10" width="60" height="30" rx="2" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="20" y="15" width="15" height="8" rx="1" fill={COLORS.sage} opacity="0.7"/>
          <rect x="45" y="20" width="15" height="8" rx="1" fill={COLORS.sage} opacity="0.7"/>
        </svg>
      );

    case 'rug-pattern':
      return (
        <svg viewBox="0 0 70 50" className={`w-22 h-16 ${className}`}>
          <ellipse cx="35" cy="25" rx="32" ry="20" fill={COLORS.carrot} stroke={COLORS.outline} strokeWidth="2"/>
          <ellipse cx="35" cy="25" rx="26" ry="15" fill={COLORS.peach} stroke={COLORS.outline} strokeWidth="2"/>
          <circle cx="25" cy="20" r="5" fill={COLORS.sage} stroke={COLORS.outline} strokeWidth="1"/>
          <circle cx="45" cy="20" r="5" fill={COLORS.sage} stroke={COLORS.outline} strokeWidth="1"/>
          <circle cx="35" cy="35" r="5" fill={COLORS.sage} stroke={COLORS.outline} strokeWidth="1"/>
        </svg>
      );

    case 'rug-dog':
      return (
        <svg viewBox="0 0 70 50" className={`w-22 h-16 ${className}`}>
          <ellipse cx="35" cy="25" rx="32" ry="20" fill={COLORS.dogBrown} stroke={COLORS.outline} strokeWidth="2"/>
          <ellipse cx="35" cy="25" rx="24" ry="14" fill={COLORS.dogLight} stroke={COLORS.outline} strokeWidth="2"/>
          {/* Paw prints */}
          <ellipse cx="25" cy="18" rx="4" ry="5" fill={COLORS.cream} opacity="0.7"/>
          <circle cx="21" cy="14" r="2" fill={COLORS.cream} opacity="0.7"/>
          <circle cx="25" cy="12" r="2" fill={COLORS.cream} opacity="0.7"/>
          <circle cx="29" cy="14" r="2" fill={COLORS.cream} opacity="0.7"/>
          <ellipse cx="45" cy="32" rx="4" ry="5" fill={COLORS.cream} opacity="0.7"/>
          <circle cx="41" cy="28" r="2" fill={COLORS.cream} opacity="0.7"/>
          <circle cx="45" cy="26" r="2" fill={COLORS.cream} opacity="0.7"/>
          <circle cx="49" cy="28" r="2" fill={COLORS.cream} opacity="0.7"/>
        </svg>
      );

    // ========== LAMPS ==========
    case 'lamp':
    case 'lamp-floor':
      return (
        <svg viewBox="0 0 45 70" className={`w-14 h-20 ${className}`}>
          <ellipse cx="22" cy="62" rx="12" ry="5" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="19" y="35" width="6" height="27" rx="2" fill={COLORS.brownMedium} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M10 38 L12 18 L33 18 L35 38 Z" fill={COLORS.peach} stroke={COLORS.outline} strokeWidth="2"/>
          <ellipse cx="22" cy="18" rx="10" ry="4" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="2"/>
          <ellipse cx="22" cy="32" rx="15" ry="10" fill="#FFE4B5" opacity="0.4"/>
        </svg>
      );

    case 'lamp-desk':
      return (
        <svg viewBox="0 0 35 45" className={`w-10 h-12 ${className}`}>
          <ellipse cx="17" cy="40" rx="10" ry="4" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="15" y="25" width="4" height="15" fill={COLORS.brownMedium} stroke={COLORS.outline} strokeWidth="1.5"/>
          <path d="M8 28 L10 15 L25 15 L27 28 Z" fill={COLORS.peach} stroke={COLORS.outline} strokeWidth="2"/>
          <ellipse cx="17" cy="15" rx="8" ry="3" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="1.5"/>
        </svg>
      );

    // ========== CLOCKS ==========
    case 'clock':
    case 'clock-wall':
      return (
        <svg viewBox="0 0 45 45" className={`w-14 h-14 ${className}`}>
          <circle cx="22" cy="22" r="20" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="3"/>
          <circle cx="22" cy="22" r="16" fill="white" stroke={COLORS.outline} strokeWidth="2"/>
          <circle cx="22" cy="22" r="14" fill={COLORS.cream} stroke={COLORS.outline} strokeWidth="1"/>
          <circle cx="22" cy="10" r="1.5" fill={COLORS.outline}/>
          <circle cx="34" cy="22" r="1.5" fill={COLORS.outline}/>
          <circle cx="22" cy="34" r="1.5" fill={COLORS.outline}/>
          <circle cx="10" cy="22" r="1.5" fill={COLORS.outline}/>
          <line x1="22" y1="22" x2="22" y2="12" stroke={COLORS.outline} strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="22" y1="22" x2="30" y2="22" stroke={COLORS.outline} strokeWidth="2" strokeLinecap="round"/>
          <circle cx="22" cy="22" r="3" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="1"/>
        </svg>
      );

    // ========== BILLBOARDS ==========
    case 'billboard':
      return (
        <svg viewBox="0 0 80 70" className={`w-22 h-20 ${className}`}>
          {/* Frame */}
          <rect x="10" y="10" width="60" height="40" rx="3" fill={COLORS.brownMedium} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="15" y="15" width="50" height="30" rx="2" fill="#FFF8F3" stroke={COLORS.outline} strokeWidth="2"/>
          {/* Text lines */}
          <rect x="20" y="22" width="30" height="3" rx="1" fill={COLORS.outline} opacity="0.3"/>
          <rect x="20" y="28" width="40" height="3" rx="1" fill={COLORS.outline} opacity="0.3"/>
          <rect x="20" y="34" width="25" height="3" rx="1" fill={COLORS.outline} opacity="0.3"/>
          {/* Stand legs */}
          <rect x="20" y="50" width="4" height="15" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="56" y="50" width="4" height="15" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          {/* Base */}
          <rect x="15" y="62" width="14" height="5" rx="1" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="51" y="62" width="14" height="5" rx="1" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
        </svg>
      );

    case 'chalkboard':
      return (
        <svg viewBox="0 0 60 50" className={`w-16 h-14 ${className}`}>
          {/* Frame */}
          <rect x="5" y="5" width="50" height="35" rx="2" fill={COLORS.brownMedium} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="8" y="8" width="44" height="29" rx="1" fill="#2D5A4A" stroke={COLORS.outline} strokeWidth="1.5"/>
          {/* Chalk marks */}
          <path d="M12 18 Q20 25 28 18" stroke="white" strokeWidth="1.5" fill="none" opacity="0.8"/>
          <path d="M32 22 L45 22" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6"/>
          <path d="M15 28 Q22 32 30 28" stroke="white" strokeWidth="1.5" fill="none" opacity="0.7"/>
          {/* Tray */}
          <rect x="5" y="40" width="50" height="5" rx="1" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="1.5"/>
          <rect x="20" y="41" width="8" height="2" rx="1" fill="white" opacity="0.6"/>
        </svg>
      );

    case 'poster':
      return (
        <svg viewBox="0 0 40 55" className={`w-12 h-16 ${className}`}>
          <rect x="5" y="5" width="30" height="40" rx="2" fill="#FFF8F3" stroke={COLORS.outline} strokeWidth="2"/>
          {/* Art content */}
          <circle cx="20" cy="18" r="6" fill={COLORS.carrot} stroke={COLORS.outline} strokeWidth="1"/>
          <rect x="12" y="28" width="16" height="3" rx="1" fill={COLORS.sage}/>
          <rect x="12" y="33" width="12" height="3" rx="1" fill={COLORS.peach}/>
          <rect x="12" y="38" width="10" height="2" rx="1" fill={COLORS.brownLight}/>
          {/* Tape */}
          <rect x="15" y="2" width="10" height="4" rx="1" fill={COLORS.peachDark} opacity="0.8"/>
        </svg>
      );

    // ========== STICKERS / WALL DECOR ==========
    case 'sticker-star':
      return (
        <svg viewBox="0 0 35 35" className={`w-10 h-10 ${className}`}>
          <path d="M17 2 L20 13 L32 13 L22 20 L26 32 L17 25 L8 32 L12 20 L2 13 L14 13 Z" 
                fill="#FFD700" stroke={COLORS.outline} strokeWidth="2"/>
        </svg>
      );

    case 'sticker-heart':
      return (
        <svg viewBox="0 0 35 35" className={`w-10 h-10 ${className}`}>
          <path d="M17 28 Q8 20 8 12 A6 6 0 0 1 17 12 A6 6 0 0 1 26 12 Q26 20 17 28" 
                fill="#FF6B6B" stroke={COLORS.outline} strokeWidth="2"/>
        </svg>
      );

    case 'sticker-carrot':
      return (
        <svg viewBox="0 0 35 40" className={`w-10 h-12 ${className}`}>
          <path d="M12 15 L23 15 L20 38 Q17 40 15 38 Z" fill={COLORS.carrot} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M17 15 L14 5" stroke={COLORS.carrotGreen} strokeWidth="2" strokeLinecap="round"/>
          <path d="M17 15 L17 3" stroke={COLORS.carrotGreen} strokeWidth="2" strokeLinecap="round"/>
          <path d="M17 15 L20 5" stroke={COLORS.carrotGreen} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );

    case 'window-sunny':
      return (
        <svg viewBox="0 0 60 70" className={`w-16 h-20 ${className}`}>
          <rect x="10" y="10" width="40" height="50" rx="3" fill={COLORS.sky} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="15" y="15" width="30" height="40" rx="1" fill="#87CEEB" stroke={COLORS.outline} strokeWidth="1.5"/>
          {/* Window panes */}
          <line x1="30" y1="15" x2="30" y2="55" stroke={COLORS.outline} strokeWidth="2"/>
          <line x1="15" y1="35" x2="45" y2="35" stroke={COLORS.outline} strokeWidth="2"/>
          {/* Sun */}
          <circle cx="35" cy="28" r="8" fill="#FFD700" stroke={COLORS.outline} strokeWidth="1"/>
          <line x1="35" y1="17" x2="35" y2="12" stroke="#FFD700" strokeWidth="2"/>
          <line x1="35" y1="39" x2="35" y2="44" stroke="#FFD700" strokeWidth="2"/>
          <line x1="24" y1="28" x2="19" y2="28" stroke="#FFD700" strokeWidth="2"/>
          <line x1="46" y1="28" x2="51" y2="28" stroke="#FFD700" strokeWidth="2"/>
        </svg>
      );

    // ========== DOG ITEMS ==========
    case 'dog-bowl':
      return (
        <svg viewBox="0 0 40 30" className={`w-12 h-9 ${className}`}>
          <ellipse cx="20" cy="20" rx="15" ry="8" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <ellipse cx="20" cy="18" rx="12" ry="5" fill={COLORS.carrot} stroke={COLORS.outline} strokeWidth="1.5"/>
          <text x="12" y="20" fontSize="14">🦴</text>
        </svg>
      );

    case 'dog-toy':
      return (
        <svg viewBox="0 0 45 35" className={`w-14 h-11 ${className}`}>
          {/* Ball */}
          <circle cx="22" cy="20" r="12" fill="#FF6B6B" stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M12 15 Q22 25 32 15" stroke="white" strokeWidth="2" fill="none"/>
          <path d="M12 25 Q22 15 32 25" stroke="white" strokeWidth="2" fill="none"/>
          {/* Squeaker */}
          <circle cx="22" cy="20" r="3" fill="#333" opacity="0.3"/>
        </svg>
      );

    case 'dog-house':
      return (
        <svg viewBox="0 0 70 65" className={`w-20 h-18 ${className}`}>
          {/* House body */}
          <rect x="15" y="30" width="40" height="30" rx="3" fill={COLORS.dogBrown} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="20" y="35" width="30" height="20" rx="2" fill={COLORS.dogLight} stroke={COLORS.outline} strokeWidth="1.5"/>
          {/* Door */}
          <ellipse cx="35" cy="50" rx="8" ry="10" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          <ellipse cx="35" cy="48" rx="5" ry="6" fill={COLORS.cream} stroke={COLORS.outline} strokeWidth="1"/>
          {/* Roof */}
          <path d="M10 30 L35 10 L60 30" fill={COLORS.carrot} stroke={COLORS.outline} strokeWidth="2"/>
          <path d="M15 28 L35 14 L55 28" fill={COLORS.carrotDark} stroke={COLORS.outline} strokeWidth="1.5"/>
        </svg>
      );

    // ========== DOOR ==========
    case 'door':
      return (
        <svg viewBox="0 0 55 90" className={`w-16 h-24 ${className}`}>
          {/* Frame */}
          <rect x="5" y="5" width="45" height="80" rx="2" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="2"/>
          {/* Door */}
          <rect x="10" y="10" width="35" height="70" rx="2" fill={COLORS.brownMedium} stroke={COLORS.outline} strokeWidth="2"/>
          <rect x="15" y="15" width="25" height="60" rx="1" fill={COLORS.brownLight} stroke={COLORS.outline} strokeWidth="1"/>
          {/* Panels */}
          <rect x="18" y="20" width="19" height="20" rx="1" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="1"/>
          <rect x="18" y="45" width="19" height="20" rx="1" fill={COLORS.brownCream} stroke={COLORS.outline} strokeWidth="1"/>
          {/* Handle */}
          <circle cx="38" cy="45" r="3" fill={COLORS.brownDark} stroke={COLORS.outline} strokeWidth="1.5"/>
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

// ============================================
// EXPORT ALL ITEMS
// ============================================
export const FURNITURE_ITEMS = [
  // Chairs
  { id: 'cozy-chair', name: 'Cozy Chair', price: 50, category: 'furniture' },
  { id: 'wooden-chair', name: 'Wooden Chair', price: 35, category: 'furniture' },
  { id: 'chair-modern', name: 'Modern Chair', price: 75, category: 'furniture' },
  { id: 'chair-dog-bed', name: 'Dog Bed', price: 40, category: 'furniture' },
  // Tables
  { id: 'wooden-table', name: 'Wooden Table', price: 80, category: 'furniture' },
  { id: 'coffee-table', name: 'Coffee Table', price: 60, category: 'furniture' },
  { id: 'table-round', name: 'Round Table', price: 90, category: 'furniture' },
  { id: 'table-dining', name: 'Dining Table', price: 120, category: 'furniture' },
  // Beds
  { id: 'cozy-bed', name: 'Cozy Bed', price: 120, category: 'furniture' },
  { id: 'bed-bunk', name: 'Bunk Bed', price: 180, category: 'furniture' },
  // Storage
  { id: 'bookshelf', name: 'Bookshelf', price: 90, category: 'furniture' },
  { id: 'bookshelf-tall', name: 'Tall Bookshelf', price: 130, category: 'furniture' },
  { id: 'bookshelf-corner', name: 'Corner Shelf', price: 100, category: 'furniture' },
  { id: 'dresser', name: 'Dresser', price: 100, category: 'furniture' },
  { id: 'chest', name: 'Treasure Chest', price: 150, category: 'furniture' },
];

export const PLANT_ITEMS = [
  { id: 'potted-plant', name: 'Potted Plant', price: 25, category: 'plant' },
  { id: 'tall-plant', name: 'Tall Plant', price: 40, category: 'plant' },
  { id: 'cactus', name: 'Cactus', price: 20, category: 'plant' },
  { id: 'plant-hanging', name: 'Hanging Plant', price: 35, category: 'plant' },
  { id: 'carrot-patch', name: 'Carrot Patch', price: 30, category: 'plant' },
];

export const DECOR_ITEMS = [
  // Rugs
  { id: 'rug', name: 'Round Rug', price: 45, category: 'decor' },
  { id: 'rug-rect', name: 'Rectangular Rug', price: 50, category: 'decor' },
  { id: 'rug-pattern', name: 'Patterned Rug', price: 60, category: 'decor' },
  { id: 'rug-dog', name: 'Dog Paw Rug', price: 55, category: 'decor' },
  // Lighting
  { id: 'lamp', name: 'Floor Lamp', price: 35, category: 'decor' },
  { id: 'lamp-desk', name: 'Desk Lamp', price: 30, category: 'decor' },
  // Time
  { id: 'clock', name: 'Wall Clock', price: 30, category: 'decor' },
  // Wall Decor
  { id: 'billboard', name: 'Message Board', price: 45, category: 'decor' },
  { id: 'chalkboard', name: 'Chalkboard', price: 40, category: 'decor' },
  { id: 'poster', name: 'Art Poster', price: 20, category: 'decor' },
  // Stickers
  { id: 'sticker-star', name: 'Star Sticker', price: 5, category: 'decor' },
  { id: 'sticker-heart', name: 'Heart Sticker', price: 5, category: 'decor' },
  { id: 'sticker-carrot', name: 'Carrot Sticker', price: 5, category: 'decor' },
  // Windows
  { id: 'window-sunny', name: 'Sunny Window', price: 80, category: 'decor' },
  // Dog items
  { id: 'dog-bowl', name: 'Dog Bowl', price: 15, category: 'decor' },
  { id: 'dog-toy', name: 'Squeaky Toy', price: 20, category: 'decor' },
  { id: 'dog-house', name: 'Dog House', price: 200, category: 'decor' },
  // Door
  { id: 'door', name: 'Wooden Door', price: 100, category: 'decor' },
];

export const CLOTHING_ITEMS = [
  { id: 'hat', name: 'Carrot Hat', price: 25, category: 'clothing' },
  { id: 'glasses', name: 'Cool Glasses', price: 20, category: 'clothing' },
];

export const ALL_ITEMS = [
  ...FURNITURE_ITEMS, 
  ...PLANT_ITEMS, 
  ...DECOR_ITEMS,
  ...CLOTHING_ITEMS
];

export const WALL_COLORS = [
  { id: 'wall-beige', name: 'Warm Beige', color: COLORS.wallBeige },
  { id: 'wall-blue', name: 'Sky Blue', color: COLORS.wallBlue },
  { id: 'wall-green', name: 'Sage Green', color: COLORS.wallGreen },
  { id: 'wall-pink', name: 'Soft Pink', color: COLORS.wallPink },
  { id: 'wall-yellow', name: 'Sunny Yellow', color: COLORS.wallYellow },
  { id: 'wall-purple', name: 'Lavender', color: COLORS.wallPurple },
];

export const FLOOR_COLORS = [
  { id: 'floor-wood', name: 'Wood Floor', color: COLORS.floorWood },
  { id: 'floor-dark', name: 'Dark Wood', color: COLORS.floorDark },
  { id: 'floor-light', name: 'Light Wood', color: COLORS.floorLight },
];

export { COLORS };
