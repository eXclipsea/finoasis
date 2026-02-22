'use client';

import { useState, useEffect } from 'react';
import { X, Droplets, Plus, Wallet, ShoppingBag } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface RoomViewProps {
  yardId: string;
  carrots: number;
  pet: any;
  profile: any;
  bankAccounts: any[];
  user: any;
}

type TreeStage = 'seed' | 'sprout' | 'sapling' | 'young' | 'growing' | 'teen' | 'adult' | 'mature';
type TreeType = 'oak' | 'pine' | 'cherry' | 'willow' | 'maple';
type DecorationType = 'rock' | 'flower' | 'mushroom' | 'fence' | 'pond';

interface Tree {
  id: string;
  type: TreeType;
  stage: TreeStage;
  health: number;
  lastWatered: number;
  plantedAt: string;
  slotIndex: number;
  totalWaters: number;
}

interface Decoration {
  id: string;
  type: DecorationType;
  slotIndex: number;
}

interface PlantingSlot {
  index: number;
  x: number;
  y: number;
  occupied: boolean;
  type?: 'tree' | 'decoration';
}

const TREE_CONFIG: Record<TreeType, { 
  name: string; 
  trunkColor: string; 
  leafColor: string;
  waterToNextStage: number;
}> = {
  oak: { name: 'Oak', trunkColor: '#6D4C41', leafColor: '#7CB342', waterToNextStage: 5 },
  pine: { name: 'Pine', trunkColor: '#5D4037', leafColor: '#2E7D32', waterToNextStage: 6 },
  cherry: { name: 'Cherry', trunkColor: '#6D4C41', leafColor: '#F48FB1', waterToNextStage: 7 },
  willow: { name: 'Willow', trunkColor: '#5D4037', leafColor: '#9CCC65', waterToNextStage: 8 },
  maple: { name: 'Maple', trunkColor: '#6D4C41', leafColor: '#FF7043', waterToNextStage: 6 },
};

const DECORATION_CONFIG: Record<DecorationType, { name: string; cost: number; color: string }> = {
  rock: { name: 'Rock', cost: 10, color: '#9E9E9E' },
  flower: { name: 'Flowers', cost: 8, color: '#E91E63' },
  mushroom: { name: 'Mushroom', cost: 12, color: '#FF5722' },
  fence: { name: 'Picket Fence', cost: 20, color: '#8D6E63' },
  pond: { name: 'Mini Pond', cost: 30, color: '#29B6F6' },
};

const STAGE_ORDER: TreeStage[] = ['seed', 'sprout', 'sapling', 'young', 'growing', 'teen', 'adult', 'mature'];

// Fixed planting slots (9 slots in 3x3 grid)
const PLANTING_SLOTS: PlantingSlot[] = [
  { index: 0, x: 25, y: 25, occupied: false },
  { index: 1, x: 50, y: 25, occupied: false },
  { index: 2, x: 75, y: 25, occupied: false },
  { index: 3, x: 25, y: 50, occupied: false },
  { index: 4, x: 50, y: 50, occupied: false },
  { index: 5, x: 75, y: 50, occupied: false },
  { index: 6, x: 25, y: 75, occupied: false },
  { index: 7, x: 50, y: 75, occupied: false },
  { index: 8, x: 75, y: 75, occupied: false },
];

// Hand-drawn tree using bezier curves - round and bumpy
const HandDrawnTreeSVG = ({ type, stage, health }: { type: TreeType; stage: TreeStage; health: number }) => {
  const isDead = health <= 0;
  const config = TREE_CONFIG[type];
  
  // Size increases with stage
  const stageIndex = STAGE_ORDER.indexOf(stage);
  const baseScale = 0.5 + (stageIndex * 0.08);
  
  if (isDead) {
    return (
      <svg viewBox="0 0 100 120" className="w-full h-full" style={{ transform: `scale(${baseScale})` }}>
        {/* Dead trunk - crooked and dry */}
        <path 
          d="M48 110 Q46 80 48 60 Q50 50 47 40" 
          stroke="#5D4037" 
          strokeWidth="6" 
          fill="none" 
          strokeLinecap="round"
        />
        <path d="M47 70 L32 55 M48 55 L63 48" stroke="#5D4037" strokeWidth="3" fill="none" strokeLinecap="round" />
        <text x="50" y="30" textAnchor="middle" fontSize="20">🍂</text>
      </svg>
    );
  }
  
  // Seed stage
  if (stage === 'seed') {
    return (
      <svg viewBox="0 0 100 120" className="w-full h-full">
        {/* Brown patch with seed */}
        <ellipse cx="50" cy="105" rx="18" ry="8" fill="#6D4C41" opacity="0.4" />
        <ellipse cx="50" cy="102" rx="6" ry="4" fill="#4E342E" />
        <ellipse cx="50" cy="100" rx="3" ry="2" fill="#3E2723" />
      </svg>
    );
  }
  
  // Sprout
  if (stage === 'sprout') {
    return (
      <svg viewBox="0 0 100 120" className="w-full h-full" style={{ transform: `scale(${baseScale})` }}>
        {/* Brown patch */}
        <ellipse cx="50" cy="105" rx="20" ry="10" fill="#6D4C41" opacity="0.3" />
        {/* Wobbly stem */}
        <path d="M50 105 Q52 90 48 80 Q50 75 50 70" stroke="#6D4C41" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Two leaves - organic shapes with bezier */}
        <path d="M50 80 Q35 72 38 62 Q45 68 50 80" fill={config.leafColor} stroke="#33691E" strokeWidth="1" />
        <path d="M50 85 Q65 77 62 67 Q55 73 50 85" fill={config.leafColor} stroke="#33691E" strokeWidth="1" />
      </svg>
    );
  }
  
  // All larger stages use bezier curves for round bumpy foliage
  return (
    <svg viewBox="0 0 100 120" className="w-full h-full" style={{ transform: `scale(${baseScale})` }}>
      {/* Brown patch at base */}
      <ellipse cx="50" cy="108" rx="25" ry="12" fill="#6D4C41" opacity="0.35" />
      
      {/* Trunk - wobbly organic shape */}
      <path 
        d={type === 'pine' 
          ? "M50 108 L48 50 L52 50 Z" 
          : type === 'willow'
          ? "M48 108 Q52 80 50 50 Q48 45 52 45"
          : "M45 108 Q48 75 46 45 Q50 40 54 45 Q52 75 55 108"
        }
        fill={config.trunkColor}
        stroke="#3E2723"
        strokeWidth="2"
      />
      
      {/* Foliage - round bumpy shapes using bezier curves */}
      {type === 'pine' ? (
        // Pine layers - triangular but organic
        <>
          <path d="M50 20 L25 45 Q50 50 75 45 Z" fill={config.leafColor} stroke="#1B5E20" strokeWidth="1.5" />
          <path d="M50 40 L28 65 Q50 72 72 65 Z" fill={config.leafColor} stroke="#1B5E20" strokeWidth="1.5" />
          <path d="M50 60 L30 85 Q50 92 70 85 Z" fill={config.leafColor} stroke="#1B5E20" strokeWidth="1.5" />
        </>
      ) : type === 'willow' ? (
        // Willow - drooping rounded masses
        <>
          <path d="M50 45 Q25 35 30 55 Q40 60 50 45" fill={config.leafColor} stroke="#558B2F" strokeWidth="1" />
          <path d="M50 45 Q75 35 70 55 Q60 60 50 45" fill={config.leafColor} stroke="#558B2F" strokeWidth="1" />
          {/* Drooping branches */}
          <path d="M35 55 Q32 75 30 90 Q28 100 35 95" fill={config.leafColor} stroke="#558B2F" strokeWidth="1" />
          <path d="M65 55 Q68 75 70 88 Q72 98 65 93" fill={config.leafColor} stroke="#558B2F" strokeWidth="1" />
          <path d="M50 55 Q48 80 50 95 Q52 105 50 98" fill={config.leafColor} stroke="#558B2F" strokeWidth="1" />
        </>
      ) : (
        // Oak, Cherry, Maple - round bumpy tree top
        <>
          {/* Main foliage mass - multiple overlapping rounded blobs */}
          <path d="M50 25 Q70 20 75 40 Q80 55 65 65 Q50 70 35 65 Q20 55 25 40 Q30 20 50 25" 
            fill={config.leafColor} stroke="#33691E" strokeWidth="1.5" />
          
          {/* Additional bumpy masses for fullness */}
          <path d="M35 35 Q50 30 55 45 Q50 55 35 50 Q25 42 35 35" 
            fill={config.leafColor} opacity="0.9" />
          <path d="M65 35 Q75 42 70 50 Q55 55 50 45 Q55 30 65 35" 
            fill={config.leafColor} opacity="0.9" />
          <path d="M40 55 Q50 48 60 55 Q65 65 50 68 Q35 65 40 55" 
            fill={config.leafColor} opacity="0.9" />
          
          {/* Stage-specific additions */}
          {stageIndex >= 4 && (
            <>
              <ellipse cx="28" cy="42" rx="12" ry="10" fill={config.leafColor} opacity="0.8" />
              <ellipse cx="72" cy="42" rx="12" ry="10" fill={config.leafColor} opacity="0.8" />
            </>
          )}
          
          {stageIndex >= 6 && (
            <>
              <path d="M20 50 Q30 40 35 52 Q30 62 20 58 Q15 52 20 50" fill={config.leafColor} opacity="0.85" />
              <path d="M80 50 Q70 40 65 52 Q70 62 80 58 Q85 52 80 50" fill={config.leafColor} opacity="0.85" />
            </>
          )}
          
          {/* Cherry blossoms or maple colors for mature */}
          {stage === 'mature' && type === 'cherry' && (
            <>
              <circle cx="35" cy="35" r="5" fill="#FFF" opacity="0.9" />
              <circle cx="55" cy="28" r="5" fill="#FFF" opacity="0.9" />
              <circle cx="65" cy="42" r="5" fill="#FFF" opacity="0.9" />
              <circle cx="45" cy="48" r="5" fill="#FFF" opacity="0.9" />
            </>
          )}
        </>
      )}
    </svg>
  );
};

// Hand-drawn decoration SVGs
const DecorationSVG = ({ type }: { type: DecorationType }) => {
  const config = DECORATION_CONFIG[type];
  
  switch (type) {
    case 'rock':
      return (
        <svg viewBox="0 0 60 50" className="w-full h-full">
          <path d="M15 40 Q10 35 15 28 Q20 20 30 18 Q40 20 45 28 Q50 35 45 40 Q30 45 15 40" 
            fill={config.color} stroke="#616161" strokeWidth="2" />
          <ellipse cx="25" cy="30" rx="4" ry="3" fill="#BDBDBD" opacity="0.5" />
        </svg>
      );
    case 'flower':
      return (
        <svg viewBox="0 0 60 60" className="w-full h-full">
          <line x1="30" y1="55" x2="30" y2="35" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" />
          <circle cx="30" cy="28" r="10" fill={config.color} />
          <circle cx="30" cy="28" r="4" fill="#FFEB3B" />
          <ellipse cx="25" cy="38" rx="6" ry="3" fill="#4CAF50" />
          <ellipse cx="38" cy="42" rx="6" ry="3" fill="#4CAF50" />
        </svg>
      );
    case 'mushroom':
      return (
        <svg viewBox="0 0 60 70" className="w-full h-full">
          <rect x="22" y="40" width="16" height="25" rx="3" fill="#FFCCBC" />
          <path d="M12 40 Q30 15 48 40 Z" fill={config.color} stroke="#BF360C" strokeWidth="2" />
          <circle cx="22" cy="32" r="3" fill="#FFF" opacity="0.6" />
          <circle cx="38" cy="28" r="4" fill="#FFF" opacity="0.6" />
        </svg>
      );
    case 'fence':
      return (
        <svg viewBox="0 0 80 50" className="w-full h-full">
          <rect x="5" y="20" width="8" height="30" rx="2" fill={config.color} />
          <rect x="25" y="15" width="8" height="30" rx="2" fill={config.color} />
          <rect x="45" y="20" width="8" height="30" rx="2" fill={config.color} />
          <rect x="65" y="15" width="8" height="30" rx="2" fill={config.color} />
          <rect x="5" y="30" width="68" height="4" fill={config.color} />
        </svg>
      );
    case 'pond':
      return (
        <svg viewBox="0 0 80 60" className="w-full h-full">
          <ellipse cx="40" cy="35" rx="35" ry="20" fill={config.color} stroke="#0277BD" strokeWidth="2" />
          <ellipse cx="30" cy="30" rx="8" ry="4" fill="#4FC3F7" opacity="0.6" />
          <ellipse cx="55" cy="38" rx="6" ry="3" fill="#4FC3F7" opacity="0.6" />
        </svg>
      );
    default:
      return null;
  }
};

export default function GardenGame({ yardId, carrots: initialCarrots = 0, pet, profile, bankAccounts = [], user }: RoomViewProps) {
  const router = useRouter();
  const supabase = createClient();
  
  const isAdmin = user?.email === '2landonl10@gmail.com';
  const [water, setWater] = useState(isAdmin ? 999 : initialCarrots);
  const [totalSaved, setTotalSaved] = useState(0);
  const [plaidConnected, setPlaidConnected] = useState(false);
  
  const [trees, setTrees] = useState<Tree[]>([]);
  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const [slots, setSlots] = useState<PlantingSlot[]>(PLANTING_SLOTS);
  
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [showTreeModal, setShowTreeModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [plantingType, setPlantingType] = useState<TreeType | null>(null);
  const [saveAmount, setSaveAmount] = useState(10);
  const [view, setView] = useState<'garden' | 'tree'>('garden');
  const [animatingTree, setAnimatingTree] = useState<string | null>(null);

  // Health decay - all trees including mature can die
  useEffect(() => {
    const interval = setInterval(() => {
      setTrees(prev => prev.map(tree => {
        const hoursSinceWater = (Date.now() - tree.lastWatered) / 3600000;
        const decay = hoursSinceWater * 2.5; // Mature trees die slowly too
        return { ...tree, health: Math.max(0, tree.health - decay) };
      }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const getNextStage = (current: TreeStage): TreeStage | null => {
    const idx = STAGE_ORDER.indexOf(current);
    return idx < STAGE_ORDER.length - 1 ? STAGE_ORDER[idx + 1] : null;
  };

  const waterTree = () => {
    if (!selectedTree || water < 5) return;
    
    // Can only water if tree needs it (health < 100 or not at max stage)
    const needsWater = selectedTree.health < 100 || selectedTree.stage !== 'mature';
    if (!needsWater) return;
    
    setWater(w => w - 5);
    setAnimatingTree(selectedTree.id);
    setTimeout(() => setAnimatingTree(null), 500);
    
    setTrees(prev => {
      const newTrees = prev.map(tree => {
        if (tree.id === selectedTree.id) {
          const newWaters = tree.totalWaters + 1;
          const waterNeeded = TREE_CONFIG[tree.type].waterToNextStage;
          
          // Try to grow
          let newStage = tree.stage;
          const nextStage = getNextStage(tree.stage);
          
          if (nextStage && newWaters >= waterNeeded * (STAGE_ORDER.indexOf(nextStage) + 1)) {
            newStage = nextStage;
          }
          
          // Cap health at 100
          const newHealth = Math.min(100, tree.health + 20);
          
          const updated = { 
            ...tree, 
            health: newHealth,
            stage: newStage,
            lastWatered: Date.now(),
            totalWaters: newWaters
          };
          
          setSelectedTree(updated);
          return updated;
        }
        return tree;
      });
      return newTrees;
    });
  };
  
  const handleSlotClick = (slotIndex: number) => {
    const slot = slots[slotIndex];
    
    if (slot.occupied) {
      // Show tree details
      const tree = trees.find(t => t.slotIndex === slotIndex);
      if (tree) {
        setSelectedTree(tree);
        setView('tree');
      }
      return;
    }
    
    if (!plantingType) return;
    if (water < 3) {
      setPlantingType(null);
      return;
    }
    
    // Plant tree in this slot
    setWater(w => w - 3);
    const newTree: Tree = {
      id: Date.now().toString(),
      type: plantingType,
      stage: 'seed',
      health: 60,
      lastWatered: Date.now(),
      plantedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      slotIndex,
      totalWaters: 0
    };
    
    setTrees(prev => [...prev, newTree]);
    setSlots(prev => prev.map(s => s.index === slotIndex ? { ...s, occupied: true, type: 'tree' } : s));
    setPlantingType(null);
  };
  
  const buyDecoration = (type: DecorationType) => {
    const cost = DECORATION_CONFIG[type].cost;
    if (water < cost) return;
    
    // Find empty slot
    const emptySlot = slots.find(s => !s.occupied);
    if (!emptySlot) {
      alert('No empty spots! Remove a tree or decoration first.');
      return;
    }
    
    setWater(w => w - cost);
    const newDeco: Decoration = {
      id: Date.now().toString(),
      type,
      slotIndex: emptySlot.index
    };
    
    setDecorations(prev => [...prev, newDeco]);
    setSlots(prev => prev.map(s => s.index === emptySlot.index ? { ...s, occupied: true, type: 'decoration' } : s));
  };
  
  const removeDeadTree = (treeId: string, slotIndex: number) => {
    setTrees(prev => prev.filter(t => t.id !== treeId));
    setSlots(prev => prev.map(s => s.index === slotIndex ? { ...s, occupied: false, type: undefined } : s));
    if (selectedTree?.id === treeId) {
      setSelectedTree(null);
      setView('garden');
    }
  };
  
  const handleSave = () => {
    const earnedWater = Math.floor(saveAmount / 5);
    setWater(w => w + earnedWater);
    setTotalSaved(s => s + saveAmount);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const activeTrees = trees.filter(t => t.health > 0);
  const deadTrees = trees.filter(t => t.health <= 0);

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'linear-gradient(180deg, #64B5F6 0%, #90CAF9 40%, #BBDEFB 70%, #E3F2FD 100%)' }}>
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="bg-[#29B6F6] px-4 py-2 rounded-2xl border-2 border-[#0277BD] shadow-md">
            <div className="flex items-center gap-1">
              <Droplets className="w-5 h-5 text-white" />
              <span className="font-bold text-white text-lg">{water}</span>
            </div>
          </div>
          <div className="bg-[#66BB6A] px-3 py-2 rounded-2xl border-2 border-[#2E7D32] shadow-md">
            <span className="text-sm font-bold text-white">${totalSaved}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowShopModal(true)}
            className="bg-[#AB47BC] p-2 rounded-xl border-2 border-[#7B1FA2] shadow-md"
          >
            <ShoppingBag className="w-5 h-5 text-white" />
          </button>
          
          <button 
            onClick={() => setPlaidConnected(!plaidConnected)}
            className={`flex items-center gap-1 px-3 py-2 rounded-2xl border-2 shadow-md ${
              plaidConnected 
                ? 'bg-[#66BB6A] border-[#2E7D32] text-white' 
                : 'bg-[#FF8A65] border-[#D84315] text-white'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span className="text-xs font-bold">{plaidConnected ? 'Bank' : 'Connect'}</span>
          </button>
        </div>
      </div>

      {view === 'garden' ? (
        <>
          {/* Garden with fixed slots */}
          <div className="flex-1 relative p-4">
            <div className="w-full h-full max-w-md mx-auto relative">
              {/* Ground patches */}
              {slots.map(slot => (
                <button
                  key={slot.index}
                  onClick={() => handleSlotClick(slot.index)}
                  className={`absolute rounded-full transition-all active:scale-95 ${
                    slot.occupied 
                      ? 'cursor-pointer' 
                      : plantingType 
                        ? 'cursor-crosshair bg-[#8D6E63]/30 ring-2 ring-[#5D4037] ring-dashed animate-pulse' 
                        : 'cursor-default bg-[#6D4C41]/20'
                  }`}
                  style={{
                    left: `${slot.x}%`,
                    top: `${slot.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: slot.occupied ? '80px' : '60px',
                    height: slot.occupied ? '80px' : '40px',
                  }}
                >
                  {!slot.occupied && !plantingType && (
                    <div className="w-full h-full rounded-full bg-[#6D4C41]/30" />
                  )}
                </button>
              ))}
              
              {/* Trees */}
              {activeTrees.map(tree => {
                const slot = slots.find(s => s.index === tree.slotIndex);
                if (!slot) return null;
                
                return (
                  <button
                    key={tree.id}
                    onClick={() => handleSlotClick(tree.slotIndex)}
                    className={`absolute transition-all duration-300 ${
                      animatingTree === tree.id ? 'scale-110' : 'hover:scale-105'
                    }`}
                    style={{
                      left: `${slot.x}%`,
                      top: `${slot.y - 10}%`,
                      transform: 'translate(-50%, -50%)',
                      width: '100px',
                      height: '120px',
                    }}
                  >
                    <HandDrawnTreeSVG type={tree.type} stage={tree.stage} health={tree.health} />
                    
                    {/* Health warning */}
                    {tree.health < 50 && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#FF5722] text-white text-[9px] px-2 py-0.5 rounded-full whitespace-nowrap animate-pulse font-bold shadow-md">
                        Needs water!
                      </div>
                    )}
                  </button>
                );
              })}
              
              {/* Dead trees */}
              {deadTrees.map(tree => {
                const slot = slots.find(s => s.index === tree.slotIndex);
                if (!slot) return null;
                
                return (
                  <button
                    key={tree.id}
                    onClick={() => removeDeadTree(tree.id, tree.slotIndex)}
                    className="absolute opacity-60 hover:opacity-100 transition-opacity"
                    style={{
                      left: `${slot.x}%`,
                      top: `${slot.y - 10}%`,
                      transform: 'translate(-50%, -50%)',
                      width: '100px',
                      height: '120px',
                    }}
                  >
                    <HandDrawnTreeSVG type={tree.type} stage={tree.stage} health={0} />
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#5D4037] text-white text-[9px] px-2 py-0.5 rounded-full whitespace-nowrap font-bold shadow-md">
                      Tap to remove
                    </div>
                  </button>
                );
              })}
              
              {/* Decorations */}
              {decorations.map(deco => {
                const slot = slots.find(s => s.index === deco.slotIndex);
                if (!slot) return null;
                
                return (
                  <div
                    key={deco.id}
                    className="absolute pointer-events-none"
                    style={{
                      left: `${slot.x}%`,
                      top: `${slot.y}%`,
                      transform: 'translate(-50%, -30%)',
                      width: '60px',
                      height: '50px',
                    }}
                  >
                    <DecorationSVG type={deco.type} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="relative z-10 p-4 space-y-3">
            {/* Save money */}
            <div className="bg-[#FFF8E1] rounded-2xl p-3 border-2 border-[#FFB74D] shadow-md">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={saveAmount}
                  onChange={(e) => setSaveAmount(Math.max(1, parseInt(e.target.value) || 0))}
                  className="flex-1 bg-white rounded-xl px-3 py-2 text-center border-2 border-[#FFB74D] font-bold text-[#E65100]"
                />
                <button
                  onClick={handleSave}
                  className="bg-[#66BB6A] text-white font-bold px-4 py-2 rounded-xl border-2 border-[#2E7D32] shadow-md active:scale-95"
                >
                  Save +{Math.floor(saveAmount / 5)}💧
                </button>
              </div>
            </div>

            {/* Plant button */}
            <button
              onClick={() => setShowTreeModal(true)}
              disabled={!!plantingType}
              className="w-full bg-[#42A5F5] text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 border-2 border-[#1565C0] shadow-lg disabled:opacity-50 active:scale-95"
            >
              <Plus className="w-6 h-6" />
              {plantingType ? `Click a brown spot to plant ${TREE_CONFIG[plantingType].name}` : 'Plant New Tree (3💧)'}
            </button>
          </div>
        </>
      ) : (
        /* Tree Detail View */
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          {selectedTree && (
            <>
              <button 
                onClick={() => setView('garden')}
                className="absolute top-4 left-4 bg-[#FFB74D] px-4 py-2 rounded-full border-2 border-[#F57C00] text-[#E65100] font-bold shadow-md"
              >
                ← Back to Garden
              </button>
              
              <div className="text-center mb-4">
                <p className="text-sm text-[#558B2F] font-bold">Planted {selectedTree.plantedAt}</p>
                <p className="text-2xl font-black text-[#33691E] capitalize">{TREE_CONFIG[selectedTree.type].name}</p>
                <p className="text-sm font-bold text-[#7CB342] capitalize">{selectedTree.stage} Stage</p>
              </div>
              
              {/* Big tree */}
              <div className="w-56 h-64 mb-6">
                <HandDrawnTreeSVG type={selectedTree.type} stage={selectedTree.stage} health={selectedTree.health} />
              </div>
              
              {/* Health bar */}
              <div className="w-full max-w-xs mb-4">
                <div className="flex justify-between text-sm font-bold text-[#33691E] mb-1">
                  <span>Health</span>
                  <span>{Math.floor(selectedTree.health)}%</span>
                </div>
                <div className="h-4 bg-[#E0E0E0] rounded-full overflow-hidden border-2 border-[#9E9E9E]">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedTree.health > 60 ? 'bg-[#66BB6A]' : selectedTree.health > 30 ? 'bg-[#FFCA28]' : 'bg-[#EF5350]'
                    }`}
                    style={{ width: `${selectedTree.health}%` }}
                  />
                </div>
              </div>
              
              {/* Water button - only show if needed */}
              {selectedTree.health < 100 || selectedTree.stage !== 'mature' ? (
                <button
                  onClick={waterTree}
                  disabled={water < 5}
                  className="bg-[#29B6F6] text-white font-bold py-4 px-10 rounded-2xl flex items-center gap-2 border-2 border-[#0277BD] shadow-lg disabled:opacity-50 active:scale-95"
                >
                  <Droplets className="w-6 h-6" />
                  Water Tree (5💧)
                </button>
              ) : (
                <div className="bg-[#66BB6A] text-white font-bold py-3 px-6 rounded-2xl shadow-md">
                  🌳 Healthy Mature Tree!
                </div>
              )}
              
              {selectedTree.health < 40 && selectedTree.health > 0 && (
                <p className="text-[#D84315] text-sm mt-4 font-bold animate-pulse">
                  Your tree needs water soon or it will die!
                </p>
              )}
              
              <p className="text-xs text-[#558B2F] mt-4">
                Total waters: {selectedTree.totalWaters}
              </p>
            </>
          )}
        </div>
      )}

      {/* Tree Selection Modal */}
      {showTreeModal && (
        <div className="absolute inset-0 bg-[#1B5E20]/80 z-50 flex items-end" onClick={() => setShowTreeModal(false)}>
          <div className="w-full bg-[#E8F5E9] rounded-t-3xl p-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-[#33691E]">Choose Tree Type</h2>
              <button onClick={() => setShowTreeModal(false)} className="bg-[#FFB74D] p-2 rounded-full">
                <X className="w-5 h-5 text-[#E65100]" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(TREE_CONFIG).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => {
                    setPlantingType(type as TreeType);
                    setShowTreeModal(false);
                  }}
                  disabled={water < 3}
                  className="bg-[#C8E6C9] border-2 border-[#4CAF50] rounded-2xl p-4 flex flex-col items-center disabled:opacity-50 active:scale-95"
                >
                  <div className="w-16 h-20 mb-2">
                    <HandDrawnTreeSVG type={type as TreeType} stage="sapling" health={100} />
                  </div>
                  <p className="font-black text-[#33691E]">{config.name}</p>
                  <p className="text-xs text-[#558B2F]">{config.waterToNextStage}💧 per stage</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shop Modal */}
      {showShopModal && (
        <div className="absolute inset-0 bg-[#4A148C]/80 z-50 flex items-end" onClick={() => setShowShopModal(false)}>
          <div className="w-full bg-[#F3E5F5] rounded-t-3xl p-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-[#4A148C]">Decoration Shop</h2>
              <button onClick={() => setShowShopModal(false)} className="bg-[#AB47BC] p-2 rounded-full">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(DECORATION_CONFIG).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => buyDecoration(type as DecorationType)}
                  disabled={water < config.cost}
                  className="bg-[#E1BEE7] border-2 border-[#7B1FA2] rounded-2xl p-4 flex flex-col items-center disabled:opacity-50 active:scale-95"
                >
                  <div className="w-14 h-12 mb-2">
                    <DecorationSVG type={type as DecorationType} />
                  </div>
                  <p className="font-black text-[#4A148C]">{config.name}</p>
                  <p className="text-xs text-[#7B1FA2] font-bold">{config.cost}💧</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
