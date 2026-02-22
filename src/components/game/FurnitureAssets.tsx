'use client';

import React from 'react';

// ========== FOCUS FRIEND COLOR PALETTE ==========
export const COLORS = {
  // Warm neutral tones (Focus Friend style)
  cream: '#FDF8F3',
  creamDark: '#F5EDE4',
  beige: '#E8D4B8',
  beigeLight: '#F0E0C8',
  beigeDark: '#D4B896',
  tan: '#C4A574',
  tanDark: '#A68B5B',
  brown: '#8B7355',
  brownDark: '#6B4423',
  
  // Warm accent colors
  peach: '#FFD4A3',
  peachLight: '#FFE4C4',
  peachDark: '#FFC494',
  
  // Carrot orange
  carrot: '#FF8C42',
  carrotLight: '#FFB347',
  carrotDark: '#E67332',
  
  // Soft greens (sage/mint)
  sage: '#A8C4A0',
  sageLight: '#B8D4B0',
  sageDark: '#7BA87B',
  mint: '#7EB8A2',
  mintDark: '#5D8A7A',
  
  // Soft pinks
  pink: '#FFB6C1',
  pinkLight: '#FFC8D6',
  pinkDark: '#FF8FB0',
  
  // Soft purples
  lavender: '#DDA0DD',
  lavenderLight: '#E8C4E8',
  
  // Soft blues
  sky: '#B8D4E8',
  skyLight: '#C8E0F0',
  
  // Soft yellows
  butter: '#FFF4BD',
  butterDark: '#F0E0A0',
  
  // Shadows
  shadowLight: 'rgba(107, 78, 61, 0.12)',
  shadowMedium: 'rgba(107, 78, 61, 0.25)',
  shadowDark: 'rgba(107, 78, 61, 0.4)',
};

// ========== SHARED SVG DEFS & FILTERS ==========
const SvgDefs = () => (
  <defs>
    {/* Soft shadow filter */}
    <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
      <feOffset in="blur" dx="1" dy="2" result="offsetBlur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.3"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode in="offsetBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    {/* Blended feature filter */}
    <filter id="blended" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    {/* Inner glow for depth */}
    <filter id="innerGlow">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
      <feComposite in="blur" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"/>
      <feFlood floodColor={COLORS.brown} floodOpacity="0.3" result="color"/>
      <feComposite in="color" in2="shadowDiff" operator="in" result="shadow"/>
      <feComposite in="shadow" in2="SourceGraphic" operator="over"/>
    </filter>
    
    {/* Gradient definitions */}
    <radialGradient id="beanBodyGrad" cx="35%" cy="40%" r="65%" fx="30%" fy="35%">
      <stop offset="0%" stopColor={COLORS.beigeLight} />
      <stop offset="30%" stopColor={COLORS.beigeDark} />
      <stop offset="70%" stopColor={COLORS.tan} />
      <stop offset="100%" stopColor={COLORS.tanDark} />
    </radialGradient>
    
    <radialGradient id="bellyHighlight" cx="40%" cy="45%" r="40%">
      <stop offset="0%" stopColor={COLORS.cream} stopOpacity="0.5" />
      <stop offset="100%" stopColor={COLORS.cream} stopOpacity="0" />
    </radialGradient>
    
    <linearGradient id="woodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor={COLORS.beige} />
      <stop offset="50%" stopColor={COLORS.tan} />
      <stop offset="100%" stopColor={COLORS.tanDark} />
    </linearGradient>
    
    <linearGradient id="woodDarkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor={COLORS.tan} />
      <stop offset="100%" stopColor={COLORS.brown} />
    </linearGradient>
  </defs>
);

// ========== ADVANCED BEAN CHARACTER ==========
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
      <SvgDefs />
      
      {/* Ground shadow */}
      <ellipse cx="50" cy="108" rx="28" ry="7" fill={COLORS.brown} opacity="0.25" filter="url(#softShadow)" />
      
      {/* Main bean body - squishy asymmetrical quadratic curves */}
      <path 
        d="M50 22
           Q72 22 78 42
           Q82 58 80 75
           Q78 92 68 100
           Q58 108 50 108
           Q38 108 28 100
           Q18 92 20 75
           Q22 55 28 38
           Q35 22 50 22 Z"
        fill="url(#beanBodyGrad)"
        stroke={COLORS.brown}
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
        filter="url(#softShadow)"
      />
      
      {/* Belly highlight */}
      <ellipse cx="45" cy="65" rx="20" ry="25" fill="url(#bellyHighlight)" opacity="0.6" />
      
      {/* Eyes with blended filter */}
      <g transform="translate(50, 58)" filter="url(#blended)">
        <ellipse cx="-12" cy="-2" rx="5" ry="7" fill={COLORS.brownDark} />
        <ellipse cx="-10" cy="-4" rx="2" ry="3" fill="white" opacity="0.9" />
        <ellipse cx="12" cy="-2" rx="5" ry="7" fill={COLORS.brownDark} />
        <ellipse cx="14" cy="-4" rx="2" ry="3" fill="white" opacity="0.9" />
      </g>
      
      {/* Blush */}
      <g filter="url(#blended)">
        <ellipse cx="28" cy="70" rx="7" ry="4" fill={COLORS.pink} opacity="0.5" />
        <ellipse cx="72" cy="70" rx="7" ry="4" fill={COLORS.pink} opacity="0.5" />
      </g>
      
      {/* Smile */}
      <path 
        d="M44 76 Q50 82 56 76" 
        stroke={COLORS.brownDark} 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        fill="none"
        filter="url(#blended)"
      />
      
      {/* Leaf sprout with organic curves */}
      <g transform="translate(50, 20)" filter="url(#softShadow)">
        <path 
          d="M0 0
             Q-15 -12 -12 -28
             Q-8 -35 0 -32
             Q8 -35 12 -28
             Q15 -12 0 0 Z"
          fill={COLORS.mint}
          stroke={COLORS.mintDark}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M0 0 Q0 -15 0 -28" stroke={COLORS.mintDark} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <ellipse cx="-3" cy="-18" rx="3" ry="6" fill={COLORS.sageLight} opacity="0.5" />
      </g>
      
      {/* Arms with organic curves */}
      <g filter="url(#softShadow)">
        <path 
          d="M22 72 Q18 68 16 75 Q15 80 18 82 Q22 84 24 78"
          fill={COLORS.beigeDark}
          stroke={COLORS.tanDark}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path 
          d="M78 72 Q82 68 84 75 Q85 80 82 82 Q78 84 76 78"
          fill={COLORS.tanDark}
          stroke={COLORS.brown}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>
      
      {/* Feet */}
      <g filter="url(#softShadow)">
        <ellipse cx="38" cy="104" rx="6" ry="3" fill={COLORS.beigeDark} />
        <ellipse cx="62" cy="104" rx="6" ry="3" fill={COLORS.tanDark} />
      </g>
      
      {/* Accessories */}
      {outfit.includes('hat') && (
        <g transform="translate(50, 16)" filter="url(#softShadow)">
          <path d="M-14 -2 L14 -2 L10 -16 L-10 -16 Z" fill={COLORS.carrot} stroke={COLORS.carrotDark} strokeWidth="2" strokeLinejoin="round" />
          <path d="M0 -16 L4 -28 L0 -24 L-4 -28 Z" fill={COLORS.carrotLight} stroke={COLORS.carrotDark} strokeWidth="1.5" strokeLinejoin="round" />
        </g>
      )}
      {outfit.includes('glasses') && (
        <g transform="translate(50, 56)" filter="url(#blended)">
          <circle cx="-12" cy="0" r="10" fill="none" stroke={COLORS.brownDark} strokeWidth="2.5" />
          <circle cx="12" cy="0" r="10" fill="none" stroke={COLORS.brownDark} strokeWidth="2.5" />
          <line x1="-2" y1="0" x2="2" y2="0" stroke={COLORS.brownDark} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}
      {outfit.includes('bow') && (
        <g transform="translate(50, 28)" filter="url(#softShadow)">
          <path d="M0 0 Q-8 -6 -12 -2 Q-14 2 -10 4 Q-6 6 0 2" fill={COLORS.pinkDark} stroke="#E55A8B" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M0 0 Q8 -6 12 -2 Q14 2 10 4 Q6 6 0 2" fill={COLORS.pinkDark} stroke="#E55A8B" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="0" cy="1" r="3" fill={COLORS.pinkLight} stroke="#E55A8B" strokeWidth="1" />
        </g>
      )}
    </svg>
  );
};

// ========== ADVANCED DOG CHARACTER ==========
export const IsometricDog: React.FC<CharacterProps> = ({ 
  className = '', 
  isMoving = false 
}) => {
  return (
    <svg viewBox="0 0 90 110" className={`${className} ${isMoving ? 'animate-pulse' : ''}`}>
      <defs>
        <radialGradient id="dogBodyGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor={COLORS.beigeLight} />
          <stop offset="50%" stopColor={COLORS.tan} />
          <stop offset="100%" stopColor={COLORS.tanDark} />
        </radialGradient>
        <radialGradient id="dogEarGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor={COLORS.tan} />
          <stop offset="100%" stopColor={COLORS.brown} />
        </radialGradient>
      </defs>
      
      {/* Shadow */}
      <ellipse cx="45" cy="100" rx="25" ry="6" fill={COLORS.brown} opacity="0.25" filter="url(#softShadow)" />
      
      {/* Body - organic bean shape */}
      <path 
        d="M45 40
           Q65 40 70 55
           Q72 70 68 85
           Q60 95 45 95
           Q30 95 22 85
           Q18 70 20 55
           Q25 40 45 40 Z"
        fill="url(#dogBodyGrad)"
        stroke={COLORS.brown}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        filter="url(#softShadow)"
      />
      
      {/* Head */}
      <g transform="translate(45, 35)">
        <path 
          d="M0 -15
             Q18 -15 22 0
             Q24 12 18 20
             Q10 26 0 26
             Q-10 26 -18 20
             Q-24 12 -22 0
             Q-18 -15 0 -15 Z"
          fill="url(#dogBodyGrad)"
          stroke={COLORS.brown}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        
        {/* Ears - floppy with curves */}
        <path 
          d="M-18 -5 Q-28 5 -26 18 Q-24 28 -18 22"
          fill="url(#dogEarGrad)"
          stroke={COLORS.brown}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path 
          d="M18 -5 Q28 5 26 18 Q24 28 18 22"
          fill="url(#dogEarGrad)"
          stroke={COLORS.brown}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        
        {/* Eyes - cute oval */}
        <g filter="url(#blended)">
          <ellipse cx="-8" cy="2" rx="4" ry="5" fill={COLORS.brownDark} />
          <circle cx="-6" cy="0" r="1.5" fill="white" />
          <ellipse cx="8" cy="2" rx="4" ry="5" fill={COLORS.brownDark} />
          <circle cx="10" cy="0" r="1.5" fill="white" />
        </g>
        
        {/* Nose */}
        <ellipse cx="0" cy="12" rx="5" ry="4" fill={COLORS.brownDark} filter="url(#blended)" />
        
        {/* Mouth */}
        <path d="M-5 18 Q0 22 5 18" stroke={COLORS.brownDark} strokeWidth="2" strokeLinecap="round" fill="none" filter="url(#blended)" />
        
        {/* Tongue */}
        <ellipse cx="0" cy="22" rx="3" ry="4" fill={COLORS.pink} opacity="0.8" />
      </g>
      
      {/* Tail - wagging */}
      <path 
        d="M65 55 Q78 45 75 35"
        stroke={COLORS.tanDark}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      >
        <animate attributeName="d" values="M65 55 Q78 45 75 35;M65 55 Q82 50 80 40;M65 55 Q78 45 75 35" dur="0.6s" repeatCount="indefinite" />
      </path>
      
      {/* Paws */}
      <g filter="url(#softShadow)">
        <ellipse cx="30" cy="92" rx="6" ry="4" fill={COLORS.beigeDark} />
        <ellipse cx="60" cy="92" rx="6" ry="4" fill={COLORS.tanDark} />
      </g>
    </svg>
  );
};

// ========== CARROT CURRENCY ICON ==========
export const IsometricCarrot: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg viewBox="0 0 70 90" className={className}>
      <defs>
        <radialGradient id="carrotBodyGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor={COLORS.carrotLight} />
          <stop offset="50%" stopColor={COLORS.carrot} />
          <stop offset="100%" stopColor={COLORS.carrotDark} />
        </radialGradient>
        <linearGradient id="carrotTopGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={COLORS.carrotLight} />
          <stop offset="100%" stopColor={COLORS.carrot} />
        </linearGradient>
      </defs>
      
      {/* Shadow */}
      <ellipse cx="35" cy="82" rx="18" ry="5" fill={COLORS.brown} opacity="0.2" filter="url(#softShadow)" />
      
      {/* Carrot body - organic cone with curves */}
      <path 
        d="M35 25
           Q48 28 52 45
           Q54 62 50 78
           Q45 85 35 85
           Q25 85 20 78
           Q16 62 18 45
           Q22 28 35 25 Z"
        fill="url(#carrotBodyGrad)"
        stroke={COLORS.carrotDark}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        filter="url(#softShadow)"
      />
      
      {/* Carrot lines */}
      <path d="M28 45 Q35 48 42 45" stroke={COLORS.carrotDark} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M26 58 Q35 62 44 58" stroke={COLORS.carrotDark} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M28 70 Q35 73 42 70" stroke={COLORS.carrotDark} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      
      {/* Greens - organic flowing leaves */}
      <g filter="url(#softShadow)">
        <path 
          d="M35 25 Q25 15 22 5 Q20 0 25 2 Q30 5 35 15"
          fill={COLORS.mint}
          stroke={COLORS.mintDark}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path 
          d="M35 25 Q35 12 35 2 Q35 -3 38 2 Q40 8 38 18"
          fill={COLORS.sage}
          stroke={COLORS.mintDark}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path 
          d="M35 25 Q45 15 48 5 Q50 0 45 2 Q40 5 38 18"
          fill={COLORS.sageLight}
          stroke={COLORS.mintDark}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

// ========== FURNITURE COMPONENTS ==========
interface FurnitureProps {
  className?: string;
}

// Wooden Table
export const IsometricTable: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 100 80" className={className}>
    <ellipse cx="50" cy="72" rx="42" ry="8" fill={COLORS.brown} opacity="0.2" filter="url(#softShadow)" />
    <path d="M20 45 Q18 55 20 68 Q22 72 28 70" fill="url(#woodDarkGradient)" stroke={COLORS.brown} strokeWidth="2" strokeLinejoin="round" />
    <path d="M80 45 Q82 55 80 68 Q78 72 72 70" fill={COLORS.tanDark} stroke={COLORS.brown} strokeWidth="2" strokeLinejoin="round" />
    <path d="M30 48 Q28 58 30 70 Q32 73 36 71" fill="url(#woodDarkGradient)" stroke={COLORS.brown} strokeWidth="2" strokeLinejoin="round" />
    <path d="M70 48 Q72 58 70 70 Q68 73 64 71" fill={COLORS.tanDark} stroke={COLORS.brown} strokeWidth="2" strokeLinejoin="round" />
    <path d="M15 35 Q50 25 85 35 Q88 45 85 50 Q50 60 15 50 Q12 45 15 35 Z" fill="url(#woodGradient)" stroke={COLORS.brown} strokeWidth="2.5" strokeLinejoin="round" filter="url(#softShadow)" />
    <ellipse cx="40" cy="38" rx="20" ry="8" fill={COLORS.cream} opacity="0.4" />
  </svg>
);

// Bookshelf
export const IsometricBookshelf: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 90 110" className={className}>
    <ellipse cx="45" cy="102" rx="35" ry="6" fill={COLORS.brown} opacity="0.2" filter="url(#softShadow)" />
    <path d="M20 20 Q45 15 70 20 Q72 55 70 95 Q45 100 20 95 Q18 55 20 20 Z" fill="url(#woodGradient)" stroke={COLORS.brown} strokeWidth="2.5" strokeLinejoin="round" filter="url(#softShadow)" />
    <path d="M22 40 Q45 38 68 40" stroke={COLORS.brown} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    <path d="M22 60 Q45 58 68 60" stroke={COLORS.brown} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    <path d="M22 80 Q45 78 68 80" stroke={COLORS.brown} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    <rect x="28" y="28" width="8" height="10" rx="1" fill="#FF9AA2" stroke="#E8888F" strokeWidth="1" filter="url(#softShadow)" />
    <rect x="38" y="26" width="6" height="12" rx="1" fill={COLORS.sage} stroke={COLORS.sageDark} strokeWidth="1" filter="url(#softShadow)" />
    <rect x="46" y="29" width="7" height="9" rx="1" fill={COLORS.butter} stroke={COLORS.butterDark} strokeWidth="1" filter="url(#softShadow)" />
    <rect x="32" y="48" width="7" height="10" rx="1" fill={COLORS.sky} stroke="#A8C4D4" strokeWidth="1" filter="url(#softShadow)" />
    <rect x="42" y="50" width="8" height="8" rx="1" fill={COLORS.lavender} stroke="#C890C8" strokeWidth="1" filter="url(#softShadow)" />
  </svg>
);

// Cozy Chair
export const IsometricChair: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 80 90" className={className}>
    <defs>
      <radialGradient id="chairGrad" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor={COLORS.peachLight} />
        <stop offset="50%" stopColor={COLORS.peach} />
        <stop offset="100%" stopColor={COLORS.peachDark} />
      </radialGradient>
      <radialGradient id="cushionGrad" cx="30%" cy="20%" r="60%">
        <stop offset="0%" stopColor={COLORS.pinkLight} />
        <stop offset="100%" stopColor={COLORS.pink} />
      </radialGradient>
    </defs>
    <ellipse cx="40" cy="82" rx="30" ry="6" fill={COLORS.brown} opacity="0.2" filter="url(#softShadow)" />
    <path d="M22 55 Q20 68 22 78 Q25 80 28 78" fill={COLORS.brown} stroke={COLORS.brownDark} strokeWidth="2" strokeLinejoin="round" />
    <path d="M58 55 Q60 68 58 78 Q55 80 52 78" fill={COLORS.tanDark} stroke={COLORS.brown} strokeWidth="2" strokeLinejoin="round" />
    <path d="M20 25 Q40 20 60 25 Q65 45 62 58 Q40 63 18 58 Q15 45 20 25 Z" fill="url(#chairGrad)" stroke={COLORS.brown} strokeWidth="2.5" strokeLinejoin="round" filter="url(#softShadow)" />
    <path d="M18 50 Q40 45 62 50 Q68 58 62 65 Q40 72 18 65 Q12 58 18 50 Z" fill="url(#cushionGrad)" stroke={COLORS.brown} strokeWidth="2.5" strokeLinejoin="round" filter="url(#softShadow)" />
    <path d="M20 65 Q18 72 20 80 Q23 82 26 80" fill={COLORS.brown} stroke={COLORS.brownDark} strokeWidth="2" strokeLinejoin="round" />
    <path d="M60 65 Q62 72 60 80 Q57 82 54 80" fill={COLORS.tanDark} stroke={COLORS.brown} strokeWidth="2" strokeLinejoin="round" />
    <ellipse cx="35" cy="35" rx="12" ry="6" fill={COLORS.cream} opacity="0.4" />
  </svg>
);

// Plant
export const IsometricPlant: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 70 90" className={className}>
    <ellipse cx="35" cy="82" rx="22" ry="5" fill={COLORS.brown} opacity="0.2" filter="url(#softShadow)" />
    <path d="M22 55 Q35 52 48 55 Q52 70 48 78 Q35 82 22 78 Q18 70 22 55 Z" fill="url(#woodGradient)" stroke={COLORS.brown} strokeWidth="2.5" strokeLinejoin="round" filter="url(#softShadow)" />
    <ellipse cx="35" cy="55" rx="14" ry="4" fill={COLORS.beigeDark} stroke={COLORS.brown} strokeWidth="2" />
    <g filter="url(#softShadow)">
      <path d="M35 55 Q25 45 20 30 Q18 20 25 25 Q32 35 35 55" fill={COLORS.mint} stroke={COLORS.mintDark} strokeWidth="2" strokeLinejoin="round" />
      <path d="M35 55 Q45 40 50 25 Q52 15 45 20 Q38 30 35 55" fill={COLORS.sage} stroke={COLORS.mintDark} strokeWidth="2" strokeLinejoin="round" />
      <path d="M35 55 Q30 35 32 18 Q33 10 38 18 Q40 32 35 55" fill={COLORS.sageLight} stroke={COLORS.mintDark} strokeWidth="2" strokeLinejoin="round" />
      <path d="M35 55 Q42 45 48 38 Q50 35 46 40 Q40 48 35 55" fill={COLORS.mint} stroke={COLORS.mintDark} strokeWidth="1.5" strokeLinejoin="round" />
    </g>
    <ellipse cx="35" cy="54" rx="10" ry="2" fill={COLORS.brownDark} opacity="0.6" />
  </svg>
);

// Rug
export const IsometricRug: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 120 70" className={className}>
    <defs>
      <radialGradient id="rugGrad" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stopColor={COLORS.peachLight} />
        <stop offset="100%" stopColor={COLORS.peach} />
      </radialGradient>
    </defs>
    <path d="M20 25 Q60 15 100 25 Q108 35 100 45 Q60 55 20 45 Q12 35 20 25 Z" fill="url(#rugGrad)" stroke={COLORS.tan} strokeWidth="2.5" strokeLinejoin="round" filter="url(#softShadow)" />
    <path d="M28 30 Q60 22 92 30 Q98 35 92 40 Q60 48 28 40 Q22 35 28 30 Z" fill={COLORS.cream} stroke={COLORS.tan} strokeWidth="1.5" strokeLinejoin="round" opacity="0.8" />
    <circle cx="40" cy="35" r="4" fill={COLORS.carrot} opacity="0.6" filter="url(#blended)" />
    <circle cx="60" cy="32" r="3" fill={COLORS.mint} opacity="0.6" filter="url(#blended)" />
    <circle cx="80" cy="35" r="4" fill={COLORS.pink} opacity="0.6" filter="url(#blended)" />
    <circle cx="50" cy="38" r="2.5" fill={COLORS.lavender} opacity="0.6" filter="url(#blended)" />
    <circle cx="70" cy="38" r="2.5" fill={COLORS.butter} opacity="0.6" filter="url(#blended)" />
  </svg>
);

// Dog Bed
export const IsometricDogBed: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 90 60" className={className}>
    <defs>
      <radialGradient id="bedOuterGrad" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor={COLORS.tan} />
        <stop offset="100%" stopColor={COLORS.brown} />
      </radialGradient>
      <radialGradient id="bedInnerGrad" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor={COLORS.cream} />
        <stop offset="100%" stopColor={COLORS.beige} />
      </radialGradient>
    </defs>
    <ellipse cx="45" cy="52" rx="38" ry="6" fill={COLORS.brown} opacity="0.2" filter="url(#softShadow)" />
    <path d="M15 28 Q45 18 75 28 Q82 38 75 48 Q45 55 15 48 Q8 38 15 28 Z" fill="url(#bedOuterGrad)" stroke={COLORS.brown} strokeWidth="2.5" strokeLinejoin="round" filter="url(#softShadow)" />
    <path d="M25 32 Q45 26 65 32 Q70 38 65 44 Q45 48 25 44 Q20 38 25 32 Z" fill="url(#bedInnerGrad)" stroke={COLORS.tan} strokeWidth="2" strokeLinejoin="round" />
    <ellipse cx="35" cy="38" rx="3" ry="2.5" fill={COLORS.pink} opacity="0.5" />
    <circle cx="32" cy="35" r="1.5" fill={COLORS.pink} opacity="0.5" />
    <circle cx="38" cy="35" r="1.5" fill={COLORS.pink} opacity="0.5" />
    <circle cx="35" cy="33" r="1.5" fill={COLORS.pink} opacity="0.5" />
  </svg>
);

// Door
export const IsometricDoor: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 70 110" className={className}>
    <path d="M15 25 Q35 18 55 25 L55 95 Q35 102 15 95 Z" fill="none" stroke={COLORS.brown} strokeWidth="6" strokeLinejoin="round" />
    <path d="M20 30 Q35 24 50 30 L50 92 Q35 97 20 92 Z" fill="url(#woodGradient)" stroke={COLORS.brown} strokeWidth="2" strokeLinejoin="round" filter="url(#softShadow)" />
    <path d="M26 38 Q35 34 44 38 L44 85 Q35 88 26 85 Z" fill={COLORS.cream} stroke={COLORS.tan} strokeWidth="1.5" strokeLinejoin="round" opacity="0.7" />
    <circle cx="45" cy="60" r="3" fill={COLORS.brownDark} filter="url(#blended)" />
  </svg>
);

// Window
export const IsometricWindow: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 90 80" className={className}>
    <defs>
      <linearGradient id="skyView" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#87CEEB" />
        <stop offset="100%" stopColor="#B8D4E8" />
      </linearGradient>
    </defs>
    <path d="M15 20 Q45 10 75 20 L75 65 Q45 75 15 65 Z" fill="none" stroke={COLORS.brown} strokeWidth="5" strokeLinejoin="round" />
    <path d="M20 25 Q45 17 70 25 L70 60 Q45 68 20 60 Z" fill="url(#skyView)" stroke={COLORS.tan} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M45 21 L45 64" stroke={COLORS.brown} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M22 42 L68 42" stroke={COLORS.brown} strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="28" cy="68" r="5" fill={COLORS.mint} filter="url(#softShadow)" />
    <circle cx="62" cy="68" r="5" fill={COLORS.sage} filter="url(#softShadow)" />
  </svg>
);

// Bed
export const IsometricBed: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 110 80" className={className}>
    <defs>
      <radialGradient id="bedFrameGrad" cx="30%" cy="20%" r="80%">
        <stop offset="0%" stopColor={COLORS.beige} />
        <stop offset="100%" stopColor={COLORS.tan} />
      </radialGradient>
      <radialGradient id="blanketGrad" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor={COLORS.pinkLight} />
        <stop offset="100%" stopColor={COLORS.pink} />
      </radialGradient>
    </defs>
    <ellipse cx="55" cy="72" rx="48" ry="7" fill={COLORS.brown} opacity="0.2" filter="url(#softShadow)" />
    <path d="M15 35 Q55 25 95 35 Q100 50 95 65 Q55 75 15 65 Q10 50 15 35 Z" fill="url(#bedFrameGrad)" stroke={COLORS.brown} strokeWidth="2.5" strokeLinejoin="round" filter="url(#softShadow)" />
    <path d="M20 40 Q55 32 90 40 Q94 52 90 62 Q55 68 20 62 Q16 52 20 40 Z" fill="url(#blanketGrad)" stroke={COLORS.pinkDark} strokeWidth="2" strokeLinejoin="round" />
    <ellipse cx="35" cy="38" rx="15" ry="8" fill={COLORS.cream} stroke={COLORS.beigeDark} strokeWidth="2" filter="url(#softShadow)" />
    <circle cx="40" cy="50" r="2" fill={COLORS.cream} opacity="0.6" />
    <circle cx="55" cy="48" r="2.5" fill={COLORS.cream} opacity="0.6" />
    <circle cx="70" cy="52" r="2" fill={COLORS.cream} opacity="0.6" />
    <circle cx="50" cy="58" r="1.5" fill={COLORS.cream} opacity="0.6" />
  </svg>
);

// Dog Bowl
export const IsometricDogBowl: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 50 35" className={className}>
    <ellipse cx="25" cy="30" rx="20" ry="4" fill={COLORS.brown} opacity="0.2" filter="url(#softShadow)" />
    <path d="M8 12 Q25 8 42 12 Q45 20 42 26 Q25 32 8 26 Q5 20 8 12 Z" fill="url(#woodGradient)" stroke={COLORS.brown} strokeWidth="2" strokeLinejoin="round" filter="url(#softShadow)" />
    <ellipse cx="25" cy="14" rx="12" ry="4" fill={COLORS.cream} stroke={COLORS.tan} strokeWidth="1.5" />
    <ellipse cx="25" cy="15" rx="10" ry="3" fill={COLORS.carrot} opacity="0.8" />
    <ellipse cx="22" cy="14" rx="3" ry="2" fill={COLORS.carrotLight} />
    <ellipse cx="28" cy="16" rx="3" ry="2" fill={COLORS.carrotDark} />
  </svg>
);

// Lamp
export const IsometricLamp: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 60 100" className={className}>
    <defs>
      <radialGradient id="lampShadeGrad" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stopColor={COLORS.peachLight} />
        <stop offset="100%" stopColor={COLORS.peach} />
      </radialGradient>
      <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFF8DC" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FFF8DC" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="30" cy="92" rx="18" ry="4" fill={COLORS.brown} opacity="0.2" filter="url(#softShadow)" />
    <ellipse cx="30" cy="88" rx="14" ry="5" fill={COLORS.tan} stroke={COLORS.brown} strokeWidth="2" />
    <rect x="27" y="55" width="6" height="33" rx="2" fill={COLORS.brown} stroke={COLORS.brownDark} strokeWidth="1.5" />
    <path d="M12 55 Q30 50 48 55 Q42 25 30 22 Q18 25 12 55 Z" fill="url(#lampShadeGrad)" stroke={COLORS.brown} strokeWidth="2.5" strokeLinejoin="round" filter="url(#softShadow)" />
    <ellipse cx="30" cy="48" rx="12" ry="8" fill="url(#lampGlow)" />
  </svg>
);

// ========== DECOR ITEMS ==========

// Colorful Books
export const IsometricBooks: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 60 45" className={className}>
    <ellipse cx="30" cy="40" rx="25" ry="4" fill={COLORS.brown} opacity="0.2" filter="url(#softShadow)" />
    <path d="M12 30 Q30 26 48 30 Q46 38 30 40 Q14 38 12 30 Z" fill="#FF9AA2" stroke="#E8888F" strokeWidth="2" strokeLinejoin="round" filter="url(#softShadow)" />
    <path d="M15 28 Q30 24 45 28 L45 30 Q30 26 15 30 Z" fill="#FFB6C1" />
    <path d="M15 22 Q30 18 45 22 Q43 30 30 32 Q17 30 15 22 Z" fill={COLORS.sage} stroke={COLORS.sageDark} strokeWidth="2" strokeLinejoin="round" filter="url(#softShadow)" />
    <path d="M18 20 Q30 16 42 20 L42 22 Q30 18 18 22 Z" fill={COLORS.sageLight} />
    <path d="M18 14 Q30 10 42 14 Q40 22 30 24 Q20 22 18 14 Z" fill={COLORS.butter} stroke={COLORS.butterDark} strokeWidth="2" strokeLinejoin="round" filter="url(#softShadow)" />
    <path d="M21 12 Q30 8 39 12 L39 14 Q30 10 21 14 Z" fill="#FFFACD" />
  </svg>
);

// Hanging Vines
export const IsometricVines: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 70 90" className={className}>
    <g filter="url(#softShadow)">
      <path d="M35 5 Q25 25 20 45 Q15 65 22 80" stroke={COLORS.mintDark} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M35 5 Q45 20 42 40 Q40 60 48 75" stroke={COLORS.mint} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M35 5 Q30 18 38 35 Q42 50 35 65" stroke={COLORS.sage} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M20 30 Q12 35 15 42 Q22 38 20 30" fill={COLORS.mint} stroke={COLORS.mintDark} strokeWidth="1" />
      <path d="M42 25 Q50 30 48 38 Q40 33 42 25" fill={COLORS.sage} stroke={COLORS.mintDark} strokeWidth="1" />
      <path d="M22 55 Q15 60 18 68 Q25 62 22 55" fill={COLORS.sageLight} stroke={COLORS.mintDark} strokeWidth="1" />
      <path d="M48 50 Q55 55 52 62 Q45 57 48 50" fill={COLORS.mint} stroke={COLORS.mintDark} strokeWidth="1" />
      <path d="M35 40 Q28 45 32 52 Q40 46 35 40" fill={COLORS.sage} stroke={COLORS.mintDark} strokeWidth="1" />
      <g transform="translate(22, 80)">
        <circle cx="0" cy="0" r="4" fill={COLORS.pink} />
        <circle cx="-3" cy="-2" r="3" fill={COLORS.pinkLight} />
        <circle cx="3" cy="-2" r="3" fill={COLORS.pinkLight} />
        <circle cx="0" cy="-4" r="3" fill={COLORS.pinkLight} />
        <circle cx="0" cy="-1" r="2" fill={COLORS.butter} />
      </g>
    </g>
  </svg>
);

// Star Sticker
export const IsometricStarSticker: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 45 45" className={className}>
    <defs>
      <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFD700" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="22" cy="22" r="18" fill="url(#starGlow)" />
    <path d="M22 5 Q24 12 28 15 Q35 15 38 18 Q32 22 32 28 Q35 32 32 35 Q28 30 22 32 Q16 30 12 35 Q9 32 12 28 Q12 22 6 18 Q9 15 16 15 Q20 12 22 5 Z" fill="#FFD700" stroke="#E5C100" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" filter="url(#softShadow)" />
    <path d="M22 8 Q23 13 26 16 Q30 16 32 18 Q28 21 28 26 Q30 29 28 31 Q25 27 22 29 Q19 27 16 31 Q14 29 16 26 Q16 21 12 18 Q14 16 18 16 Q21 13 22 8 Z" fill="#FFED4E" opacity="0.8" />
  </svg>
);

// Heart Sticker
export const IsometricHeartSticker: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 45 45" className={className}>
    <defs>
      <radialGradient id="heartGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={COLORS.pinkDark} stopOpacity="0.3" />
        <stop offset="100%" stopColor={COLORS.pinkDark} stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="22" cy="22" r="16" fill="url(#heartGlow)" />
    <path d="M22 38 Q8 28 6 18 Q5 10 12 8 Q18 6 22 14 Q26 6 32 8 Q39 10 38 18 Q36 28 22 38 Z" fill={COLORS.pinkDark} stroke="#E55A8B" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" filter="url(#softShadow)" />
    <path d="M22 34 Q10 26 9 18 Q8 13 14 11 Q18 10 22 16" fill={COLORS.pinkLight} opacity="0.6" />
  </svg>
);

// Cloud Sticker
export const IsometricCloudSticker: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 55 40" className={className}>
    <ellipse cx="27" cy="22" rx="18" ry="12" fill="#E8F4F8" stroke="#D4E4EC" strokeWidth="2" strokeLinejoin="round" filter="url(#softShadow)" />
    <ellipse cx="15" cy="24" rx="10" ry="9" fill="#E8F4F8" stroke="#D4E4EC" strokeWidth="2" strokeLinejoin="round" />
    <ellipse cx="39" cy="24" rx="10" ry="9" fill="#E8F4F8" stroke="#D4E4EC" strokeWidth="2" strokeLinejoin="round" />
    <ellipse cx="22" cy="16" rx="8" ry="7" fill="#F0F8FF" stroke="#D4E4EC" strokeWidth="2" strokeLinejoin="round" />
    <ellipse cx="32" cy="16" rx="8" ry="7" fill="#F0F8FF" stroke="#D4E4EC" strokeWidth="2" strokeLinejoin="round" />
    <ellipse cx="18" cy="26" rx="3" ry="2" fill={COLORS.pink} opacity="0.4" filter="url(#blended)" />
    <ellipse cx="36" cy="26" rx="3" ry="2" fill={COLORS.pink} opacity="0.4" filter="url(#blended)" />
  </svg>
);

// Picture Frame
export const IsometricPictureFrame: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 70 85" className={className}>
    <path d="M15 15 Q35 10 55 15 Q58 45 55 75 Q35 80 15 75 Q12 45 15 15 Z" fill={COLORS.tan} stroke={COLORS.brown} strokeWidth="4" strokeLinejoin="round" filter="url(#softShadow)" />
    <path d="M20 20 Q35 16 50 20 Q52 45 50 70 Q35 74 20 70 Q18 45 20 20 Z" fill={COLORS.cream} stroke={COLORS.beigeDark} strokeWidth="2" strokeLinejoin="round" />
    <path d="M23 23 Q35 20 47 23 L47 67 Q35 70 23 67 Z" fill="#B8E0F0" />
    <circle cx="42" cy="32" r="5" fill="#FFD700" filter="url(#blended)" />
    <path d="M23 50 Q30 45 38 48 Q42 50 47 47 L47 67 Q35 70 23 67 Z" fill={COLORS.sage} />
    <path d="M23 58 Q28 54 35 56 Q40 58 47 55 L47 67 Q35 70 23 67 Z" fill={COLORS.mint} />
  </svg>
);

// Hanging Plant
export const IsometricHangingPlant: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 70 110" className={className}>
    <line x1="35" y1="5" x2="35" y2="30" stroke={COLORS.beigeDark} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M20 30 L28 50 L35 55 L42 50 L50 30" fill="none" stroke={COLORS.cream} strokeWidth="3" strokeLinecap="round" />
    <line x1="20" y1="30" x2="28" y2="40" stroke={COLORS.cream} strokeWidth="2" />
    <line x1="50" y1="30" x2="42" y2="40" stroke={COLORS.cream} strokeWidth="2" />
    <line x1="28" y1="50" x2="35" y2="30" stroke={COLORS.cream} strokeWidth="2" />
    <line x1="42" y1="50" x2="35" y2="30" stroke={COLORS.cream} strokeWidth="2" />
    <path d="M22 50 Q35 46 48 50 Q50 70 48 80 Q35 85 22 80 Q20 70 22 50 Z" fill="url(#woodGradient)" stroke={COLORS.brown} strokeWidth="2.5" strokeLinejoin="round" filter="url(#softShadow)" />
    <path d="M25 80 Q18 90 22 100" stroke={COLORS.mint} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M45 80 Q52 90 48 100" stroke={COLORS.sage} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M35 82 Q32 95 35 105" stroke={COLORS.mintDark} strokeWidth="2" fill="none" strokeLinecap="round" />
    <ellipse cx="22" cy="92" rx="4" ry="6" fill={COLORS.mint} stroke={COLORS.mintDark} strokeWidth="1" />
    <ellipse cx="48" cy="92" rx="4" ry="6" fill={COLORS.sage} stroke={COLORS.mintDark} strokeWidth="1" />
    <ellipse cx="35" cy="98" rx="3" ry="5" fill={COLORS.sageLight} stroke={COLORS.mintDark} strokeWidth="1" />
  </svg>
);

// Coffee Cup
export const IsometricCoffeeCup: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 35 40" className={className}>
    <defs>
      <radialGradient id="coffeeGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={COLORS.cream} />
        <stop offset="100%" stopColor={COLORS.beige} />
      </radialGradient>
    </defs>
    <ellipse cx="17" cy="36" rx="12" ry="3" fill={COLORS.brown} opacity="0.2" filter="url(#softShadow)" />
    <ellipse cx="17" cy="32" rx="14" ry="4" fill={COLORS.tan} stroke={COLORS.brown} strokeWidth="1.5" />
    <path d="M8 12 Q17 10 26 12 Q28 22 26 30 Q17 34 8 30 Q6 22 8 12 Z" fill="url(#coffeeGrad)" stroke={COLORS.brown} strokeWidth="2" strokeLinejoin="round" filter="url(#softShadow)" />
    <ellipse cx="17" cy="13" rx="8" ry="3" fill="#6B4423" />
    <path d="M26 16 Q30 16 30 21 Q30 26 26 26" stroke={COLORS.cream} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M14 6 Q12 2 14 -2" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" />
    <path d="M20 6 Q22 2 20 -2" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" />
  </svg>
);

// Toy Ball
export const IsometricToyBall: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 45 45" className={className}>
    <defs>
      <radialGradient id="ballGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FF8585" />
        <stop offset="100%" stopColor="#FF6B6B" />
      </radialGradient>
      <radialGradient id="ballHighlight" cx="30%" cy="30%" r="40%">
        <stop offset="0%" stopColor="white" stopOpacity="0.5" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="22" cy="40" rx="14" ry="4" fill={COLORS.brown} opacity="0.2" filter="url(#softShadow)" />
    <circle cx="22" cy="22" r="16" fill="url(#ballGrad)" stroke="#E55A5A" strokeWidth="2.5" strokeLinejoin="round" filter="url(#softShadow)" />
    <circle cx="18" cy="18" r="5" fill="url(#ballHighlight)" />
    <path d="M8 18 Q22 22 36 18" stroke={COLORS.butter} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.9" />
    <path d="M8 26 Q22 30 36 26" stroke={COLORS.mint} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.9" />
    <path d="M12 32 Q22 36 32 32" stroke={COLORS.lavender} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.9" />
  </svg>
);

// Cushion
export const IsometricCushion: React.FC<FurnitureProps> = ({ className }) => (
  <svg viewBox="0 0 55 40" className={className}>
    <defs>
      <radialGradient id="cushionGrad" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor={COLORS.pinkLight} />
        <stop offset="100%" stopColor={COLORS.pink} />
      </radialGradient>
      <radialGradient id="cushionInner" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFC8D6" />
        <stop offset="100%" stopColor={COLORS.pink} />
      </radialGradient>
    </defs>
    <ellipse cx="27" cy="35" rx="22" ry="4" fill={COLORS.brown} opacity="0.2" filter="url(#softShadow)" />
    <path d="M12 18 Q27 12 42 18 Q46 25 42 32 Q27 38 12 32 Q8 25 12 18 Z" fill="url(#cushionGrad)" stroke="#E55A8B" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" filter="url(#softShadow)" />
    <path d="M16 20 Q27 16 38 20 Q40 25 38 30 Q27 34 16 30 Q14 25 16 20 Z" fill="url(#cushionInner)" stroke="none" />
    <circle cx="22" cy="24" r="2" fill={COLORS.cream} opacity="0.7" filter="url(#blended)" />
    <circle cx="32" cy="22" r="2.5" fill={COLORS.cream} opacity="0.7" filter="url(#blended)" />
    <circle cx="27" cy="28" r="2" fill={COLORS.cream} opacity="0.7" filter="url(#blended)" />
    <circle cx="20" cy="29" r="1.5" fill={COLORS.cream} opacity="0.7" filter="url(#blended)" />
    <circle cx="34" cy="28" r="1.5" fill={COLORS.cream} opacity="0.7" filter="url(#blended)" />
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

export const FLOOR_COLORS = [
  { id: 'wood-light', name: 'Light Wood', color: COLORS.beigeLight },
  { id: 'wood', name: 'Wood', color: COLORS.beige },
  { id: 'wood-dark', name: 'Dark Wood', color: COLORS.beigeDark },
  { id: 'tile-cream', name: 'Cream Tile', color: COLORS.cream },
];

export const WALL_COLORS = [
  { id: 'cream', name: 'Cream', color: COLORS.cream },
  { id: 'beige', name: 'Beige', color: COLORS.beige },
  { id: 'peach', name: 'Peach', color: COLORS.peach },
  { id: 'sage', name: 'Sage', color: '#E8F0E0' },
];

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
