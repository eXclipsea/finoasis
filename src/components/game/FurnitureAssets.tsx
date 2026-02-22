// Custom SVG furniture assets - Focus Friend inspired style
// Cozy, hand-drawn aesthetic with warm browns and soft colors

export const FurnitureItem = ({ type, className = "" }: { type: string; className?: string }) => {
  const renderFurniture = () => {
    switch (type) {
      // Chairs
      case 'cozy-chair':
        return (
          <svg viewBox="0 0 60 60" className={`w-16 h-16 ${className}`}>
            {/* Chair body */}
            <ellipse cx="30" cy="35" rx="22" ry="18" fill="#A67B5B" />
            <ellipse cx="30" cy="35" rx="18" ry="14" fill="#C9A77D" />
            {/* Cushion */}
            <ellipse cx="30" cy="38" rx="15" ry="10" fill="#D4B896" />
            {/* Backrest */}
            <path d="M18,30 Q15,15 30,12 Q45,15 42,30" fill="#8B6914" />
            <ellipse cx="30" cy="22" rx="14" ry="10" fill="#A67B5B" />
            {/* Button detail */}
            <circle cx="30" cy="22" r="3" fill="#6B4423" />
          </svg>
        );

      case 'wooden-chair':
        return (
          <svg viewBox="0 0 60 60" className={`w-14 h-14 ${className}`}>
            {/* Seat */}
            <ellipse cx="30" cy="38" rx="18" ry="12" fill="#8B6914" />
            <ellipse cx="30" cy="38" rx="14" ry="9" fill="#A67B5B" />
            {/* Back */}
            <rect x="22" y="15" width="16" height="25" rx="2" fill="#6B4423" />
            <rect x="24" y="18" width="12" height="18" rx="1" fill="#8B6914" />
            {/* Slats */}
            <line x1="26" y1="20" x2="26" y2="32" stroke="#6B4423" strokeWidth="1.5" />
            <line x1="30" y1="20" x2="30" y2="32" stroke="#6B4423" strokeWidth="1.5" />
            <line x1="34" y1="20" x2="34" y2="32" stroke="#6B4423" strokeWidth="1.5" />
          </svg>
        );

      // Beds
      case 'cozy-bed':
        return (
          <svg viewBox="0 0 70 70" className={`w-20 h-20 ${className}`}>
            {/* Mattress base */}
            <ellipse cx="35" cy="45" rx="28" ry="18" fill="#8B7355" />
            {/* Mattress */}
            <ellipse cx="35" cy="43" rx="25" ry="15" fill="#F5EDE4" />
            {/* Blanket */}
            <ellipse cx="35" cy="45" rx="22" ry="12" fill="#7EB8A2" opacity="0.8" />
            {/* Pillow */}
            <ellipse cx="35" cy="32" rx="12" ry="8" fill="white" />
            <ellipse cx="35" cy="32" rx="10" ry="6" fill="#F0F0F0" />
            {/* Headboard */}
            <path d="M12,40 Q12,20 35,18 Q58,20 58,40" fill="#6B4423" />
            <path d="M15,38 Q15,25 35,23 Q55,25 55,38" fill="#8B6914" />
          </svg>
        );

      case 'bunk-bed':
        return (
          <svg viewBox="0 0 50 80" className={`w-14 h-20 ${className}`}>
            {/* Frame */}
            <rect x="5" y="10" width="40" height="65" rx="2" fill="#6B4423" />
            {/* Mattresses */}
            <rect x="8" y="25" width="34" height="12" rx="2" fill="#F5EDE4" />
            <rect x="8" y="55" width="34" height="12" rx="2" fill="#F5EDE4" />
            {/* Ladder */}
            <rect x="32" y="15" width="4" height="60" rx="1" fill="#8B6914" />
            <line x1="32" y1="25" x2="36" y2="25" stroke="#6B4423" strokeWidth="2" />
            <line x1="32" y1="40" x2="36" y2="40" stroke="#6B4423" strokeWidth="2" />
            <line x1="32" y1="55" x2="36" y2="55" stroke="#6B4423" strokeWidth="2" />
          </svg>
        );

      // Tables
      case 'wooden-table':
        return (
          <svg viewBox="0 0 60 50" className={`w-16 h-12 ${className}`}>
            {/* Table top */}
            <ellipse cx="30" cy="25" rx="26" ry="16" fill="#8B6914" />
            <ellipse cx="30" cy="23" rx="24" ry="14" fill="#A67B5B" />
            {/* Legs */}
            <rect x="10" y="30" width="6" height="15" fill="#6B4423" rx="1" />
            <rect x="44" y="30" width="6" height="15" fill="#6B4423" rx="1" />
            <rect x="27" y="35" width="6" height="10" fill="#6B4423" rx="1" />
          </svg>
        );

      case 'coffee-table':
        return (
          <svg viewBox="0 0 50 40" className={`w-14 h-10 ${className}`}>
            {/* Top */}
            <ellipse cx="25" cy="18" rx="22" ry="12" fill="#C9A77D" />
            <ellipse cx="25" cy="16" rx="20" ry="10" fill="#D4B896" />
            {/* Legs */}
            <circle cx="12" cy="28" r="4" fill="#8B6914" />
            <circle cx="38" cy="28" r="4" fill="#8B6914" />
          </svg>
        );

      // Storage
      case 'bookshelf':
        return (
          <svg viewBox="0 0 50 70" className={`w-14 h-20 ${className}`}>
            {/* Frame */}
            <rect x="5" y="5" width="40" height="60" rx="2" fill="#6B4423" />
            <rect x="8" y="8" width="34" height="54" rx="1" fill="#8B6914" />
            {/* Shelves */}
            <line x1="8" y1="22" x2="42" y2="22" stroke="#6B4423" strokeWidth="2" />
            <line x1="8" y1="38" x2="42" y2="38" stroke="#6B4423" strokeWidth="2" />
            {/* Books */}
            <rect x="10" y="12" width="4" height="8" fill="#E8A87C" rx="1" />
            <rect x="15" y="10" width="5" height="10" fill="#7EB8A2" rx="1" />
            <rect x="21" y="13" width="3" height="7" fill="#E8919C" rx="1" />
            <rect x="26" y="11" width="4" height="9" fill="#D4B896" rx="1" />
          </svg>
        );

      case 'dresser':
        return (
          <svg viewBox="0 0 60 50" className={`w-16 h-12 ${className}`}>
            {/* Body */}
            <rect x="5" y="10" width="50" height="35" rx="3" fill="#8B7355" />
            <rect x="8" y="13" width="44" height="29" rx="2" fill="#A67B5B" />
            {/* Drawers */}
            <rect x="10" y="15" width="18" height="10" rx="1" fill="#C9A77D" />
            <rect x="32" y="15" width="18" height="10" rx="1" fill="#C9A77D" />
            <rect x="10" y="28" width="18" height="10" rx="1" fill="#C9A77D" />
            <rect x="32" y="28" width="18" height="10" rx="1" fill="#C9A77D" />
            {/* Knobs */}
            <circle cx="19" cy="20" r="2" fill="#6B4423" />
            <circle cx="41" cy="20" r="2" fill="#6B4423" />
            <circle cx="19" cy="33" r="2" fill="#6B4423" />
            <circle cx="41" cy="33" r="2" fill="#6B4423" />
          </svg>
        );

      // Plants
      case 'potted-plant':
        return (
          <svg viewBox="0 0 40 50" className={`w-12 h-14 ${className}`}>
            {/* Pot */}
            <path d="M10,35 L12,25 L28,25 L30,35 Z" fill="#D9976B" />
            <ellipse cx="20" cy="35" rx="10" ry="3" fill="#B8805F" />
            {/* Leaves */}
            <ellipse cx="20" cy="20" rx="8" ry="12" fill="#7EB8A2" />
            <ellipse cx="14" cy="22" rx="5" ry="9" fill="#6BA08A" />
            <ellipse cx="26" cy="22" rx="5" ry="9" fill="#8ABFA8" />
            <ellipse cx="20" cy="12" rx="4" ry="6" fill="#9BC9B8" />
          </svg>
        );

      case 'tall-plant':
        return (
          <svg viewBox="0 0 40 70" className={`w-12 h-20 ${className}`}>
            {/* Pot */}
            <ellipse cx="20" cy="60" rx="12" ry="5" fill="#8B7355" />
            <path d="M10,60 L12,45 L28,45 L30,60 Z" fill="#A67B5B" />
            {/* Stems */}
            <path d="M20,50 Q15,35 12,20" stroke="#6B4423" strokeWidth="2" fill="none" />
            <path d="M20,50 Q25,35 28,18" stroke="#6B4423" strokeWidth="2" fill="none" />
            <path d="M20,50 Q20,30 20,12" stroke="#6B4423" strokeWidth="2" fill="none" />
            {/* Leaves */}
            <ellipse cx="12" cy="20" rx="6" ry="10" fill="#7EB8A2" transform="rotate(-20 12 20)" />
            <ellipse cx="28" cy="18" rx="6" ry="10" fill="#6BA08A" transform="rotate(20 28 18)" />
            <ellipse cx="20" cy="12" rx="5" ry="8" fill="#8ABFA8" />
          </svg>
        );

      case 'cactus':
        return (
          <svg viewBox="0 0 35 50" className={`w-10 h-14 ${className}`}>
            {/* Pot */}
            <ellipse cx="17" cy="44" rx="10" ry="4" fill="#D9976B" />
            <rect x="9" y="35" width="16" height="9" fill="#C08868" />
            {/* Cactus body */}
            <ellipse cx="17" cy="28" rx="8" ry="14" fill="#7EB8A2" />
            {/* Arm */}
            <ellipse cx="24" cy="25" rx="4" ry="6" fill="#6BA08A" />
            {/* Spines */}
            <line x1="17" y1="18" x2="17" y2="16" stroke="#5A8A7A" strokeWidth="1" />
            <line x1="12" y1="25" x2="10" y2="24" stroke="#5A8A7A" strokeWidth="1" />
            <line x1="22" y1="30" x2="24" y2="29" stroke="#5A8A7A" strokeWidth="1" />
          </svg>
        );

      // Decor
      case 'rug':
        return (
          <svg viewBox="0 0 80 50" className={`w-24 h-14 ${className}`}>
            <ellipse cx="40" cy="25" rx="36" ry="20" fill="#E8A87C" opacity="0.8" />
            <ellipse cx="40" cy="25" rx="30" ry="16" fill="#F0C4A8" opacity="0.6" />
            {/* Pattern */}
            <circle cx="25" cy="20" r="4" fill="#D9976B" opacity="0.5" />
            <circle cx="40" cy="28" r="4" fill="#D9976B" opacity="0.5" />
            <circle cx="55" cy="20" r="4" fill="#D9976B" opacity="0.5" />
          </svg>
        );

      case 'lamp':
        return (
          <svg viewBox="0 0 40 60" className={`w-12 h-16 ${className}`}>
            {/* Base */}
            <ellipse cx="20" cy="55" rx="10" ry="4" fill="#6B4423" />
            {/* Stand */}
            <rect x="18" y="30" width="4" height="25" fill="#8B6914" />
            {/* Shade */}
            <path d="M10,35 L12,15 L28,15 L30,35 Z" fill="#E8A87C" />
            <ellipse cx="20" cy="15" rx="8" ry="3" fill="#F0C4A8" />
            {/* Light glow */}
            <ellipse cx="20" cy="28" rx="12" ry="8" fill="#FFE4B5" opacity="0.3" />
          </svg>
        );

      case 'clock':
        return (
          <svg viewBox="0 0 40 40" className={`w-12 h-12 ${className}`}>
            {/* Frame */}
            <circle cx="20" cy="20" r="18" fill="#8B7355" />
            <circle cx="20" cy="20" r="15" fill="#F5EDE4" />
            {/* Face */}
            <circle cx="20" cy="20" r="12" fill="white" />
            {/* Hands */}
            <line x1="20" y1="20" x2="20" y2="12" stroke="#6B4423" strokeWidth="2" strokeLinecap="round" />
            <line x1="20" y1="20" x2="26" y2="20" stroke="#6B4423" strokeWidth="2" strokeLinecap="round" />
            {/* Center */}
            <circle cx="20" cy="20" r="2" fill="#8B6914" />
          </svg>
        );

      // Accessories
      case 'beanie':
        return (
          <svg viewBox="0 0 40 35" className={`w-10 h-8 ${className}`}>
            <ellipse cx="20" cy="20" rx="15" ry="12" fill="#7EB8A2" />
            <rect x="5" y="18" width="30" height="8" rx="2" fill="#6BA08A" />
            <circle cx="20" cy="8" r="6" fill="#7EB8A2" />
          </svg>
        );

      case 'glasses':
        return (
          <svg viewBox="0 0 40 20" className={`w-12 h-6 ${className}`}>
            <circle cx="12" cy="10" r="9" fill="#E8A87C" opacity="0.3" stroke="#6B4423" strokeWidth="2" />
            <circle cx="28" cy="10" r="9" fill="#E8A87C" opacity="0.3" stroke="#6B4423" strokeWidth="2" />
            <line x1="21" y1="10" x2="19" y2="10" stroke="#6B4423" strokeWidth="2" />
          </svg>
        );

      case 'scarf':
        return (
          <svg viewBox="0 0 40 50" className={`w-10 h-12 ${className}`}>
            <path d="M10,10 Q20,5 30,10 L30,15 Q20,20 10,15 Z" fill="#E8919C" />
            <path d="M12,15 L12,40 L20,45 L20,18" fill="#E8A0AB" />
            <path d="M18,15 L18,38 L26,42 L26,16" fill="#E8919C" />
          </svg>
        );

      case 'bowtie':
        return (
          <svg viewBox="0 0 35 25" className={`w-10 h-7 ${className}`}>
            <path d="M5,12 L15,5 L15,19 L5,12" fill="#E8A87C" />
            <path d="M30,12 L20,5 L20,19 L30,12" fill="#E8A87C" />
            <circle cx="17" cy="12" r="4" fill="#D9976B" />
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 40 40" className={`w-10 h-10 ${className}`}>
            <rect x="5" y="5" width="30" height="30" rx="5" fill="#C9A77D" />
          </svg>
        );
    }
  };

  return renderFurniture();
};

// Pet avatar component
export const PetCharacter = ({ stage, isMoving = false }: { stage: string; isMoving?: boolean }) => {
  if (stage === 'egg') {
    return (
      <svg viewBox="0 0 50 60" className="w-14 h-16">
        {/* Egg */}
        <ellipse cx="25" cy="35" rx="20" ry="25" fill="#F5EDE4" />
        <ellipse cx="25" cy="35" rx="18" ry="22" fill="#FFF8F3" />
        {/* Speckles */}
        <circle cx="18" cy="28" r="1.5" fill="#D4C4B0" />
        <circle cx="30" cy="32" r="1" fill="#D4C4B0" />
        <circle cx="22" cy="40" r="1.5" fill="#D4C4B0" />
        <circle cx="32" cy="38" r="1" fill="#D4C4B0" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 60 70" className={`w-16 h-18 ${isMoving ? 'animate-bounce' : ''}`}>
      {/* Body */}
      <ellipse cx="30" cy="45" rx="22" ry="18" fill="#A67B5B" />
      <ellipse cx="30" cy="43" rx="18" ry="14" fill="#C9A77D" />
      
      {/* Belly */}
      <ellipse cx="30" cy="45" rx="12" ry="10" fill="#D4B896" />
      
      {/* Head */}
      <circle cx="30" cy="25" r="16" fill="#A67B5B" />
      <circle cx="30" cy="23" r="13" fill="#C9A77D" />
      
      {/* Ears */}
      <ellipse cx="16" cy="15" rx="5" ry="8" fill="#A67B5B" transform="rotate(-20 16 15)" />
      <ellipse cx="44" cy="15" rx="5" ry="8" fill="#A67B5B" transform="rotate(20 44 15)" />
      <ellipse cx="17" cy="16" rx="3" ry="5" fill="#8B6914" transform="rotate(-20 17 16)" />
      <ellipse cx="43" cy="16" rx="3" ry="5" fill="#8B6914" transform="rotate(20 43 16)" />
      
      {/* Face */}
      <circle cx="24" cy="22" r="3" fill="#3D2914" />
      <circle cx="36" cy="22" r="3" fill="#3D2914" />
      <circle cx="25" cy="21" r="1" fill="white" />
      <circle cx="37" cy="21" r="1" fill="white" />
      
      {/* Snout */}
      <ellipse cx="30" cy="28" rx="5" ry="4" fill="#D4B896" />
      <ellipse cx="30" cy="27" rx="3" ry="2" fill="#3D2914" />
      
      {/* Smile */}
      <path d="M26,31 Q30,34 34,31" stroke="#3D2914" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      
      {/* Paws */}
      <ellipse cx="15" cy="52" rx="5" ry="4" fill="#A67B5B" />
      <ellipse cx="45" cy="52" rx="5" ry="4" fill="#A67B5B" />
      
      {/* Tail */}
      <ellipse cx="50" cy="40" rx="4" ry="8" fill="#A67B5B" transform="rotate(30 50 40)" />
    </svg>
  );
};

// Export all available furniture items
export const FURNITURE_ITEMS = [
  { id: 'cozy-chair', name: 'Cozy Chair', price: 50, category: 'furniture' as const },
  { id: 'wooden-chair', name: 'Wooden Chair', price: 35, category: 'furniture' as const },
  { id: 'cozy-bed', name: 'Cozy Bed', price: 120, category: 'furniture' as const },
  { id: 'bunk-bed', name: 'Bunk Bed', price: 150, category: 'furniture' as const },
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
