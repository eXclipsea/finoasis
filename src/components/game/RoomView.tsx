'use client';

import { useState, useCallback, useEffect } from 'react';
import { X, Droplets, Plus, Wallet } from 'lucide-react';
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

type TreeStage = 'seed' | 'sprout' | 'sapling' | 'tree' | 'mature';
type TreeType = 'oak' | 'pine' | 'cherry' | 'palm' | 'willow';

interface Tree {
  id: string;
  type: TreeType;
  stage: TreeStage;
  health: number;
  growthProgress: number; // 0-100 within current stage
  plantedAt: string;
  lastWatered: number;
  name?: string;
  x: number;
  y: number;
  totalWaterCount: number;
}

const TREE_CONFIG: Record<TreeType, { name: string; color: string; leafColor: string; waterToGrow: number }> = {
  oak: { name: 'Oak', color: '#8B7355', leafColor: '#7CB342', waterToGrow: 8 },
  pine: { name: 'Pine', color: '#5D4037', leafColor: '#2E7D32', waterToGrow: 10 },
  cherry: { name: 'Cherry', color: '#8B7355', leafColor: '#F48FB1', waterToGrow: 12 },
  palm: { name: 'Palm', color: '#A1887F', leafColor: '#66BB6A', waterToGrow: 6 },
  willow: { name: 'Willow', color: '#6D4C41', leafColor: '#9CCC65', waterToGrow: 15 },
};

// Hand-drawn wobbly circle helper
const wobblyCircle = (cx: number, cy: number, r: number, variance: number = 3) => {
  const points = [];
  const segments = 12;
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const vr = r + (Math.random() - 0.5) * variance;
    const x = cx + Math.cos(angle) * vr;
    const y = cy + Math.sin(angle) * vr;
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M ${points.join(' L ')} Z`;
};

// Hand-drawn tree with wobbly organic shapes
const HandDrawnTree = ({ type, stage, health }: { type: TreeType; stage: TreeStage; health: number }) => {
  const isDead = health <= 0;
  const config = TREE_CONFIG[type];
  
  if (isDead) {
    return (
      <svg viewBox="0 0 100 120" className="w-full h-full">
        <defs>
          <filter id="roughPaper">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
        </defs>
        {/* Dead tree trunk - crooked */}
        <path 
          d="M45 110 Q48 80 46 60 Q45 50 50 40" 
          stroke="#5D4037" 
          strokeWidth="8" 
          fill="none" 
          strokeLinecap="round"
          filter="url(#roughPaper)"
        />
        {/* Dead branches */}
        <path d="M46 70 L30 55 M48 55 L65 45 M47 50 L35 35" 
          stroke="#5D4037" strokeWidth="3" fill="none" strokeLinecap="round" />
        <text x="50" y="30" textAnchor="middle" fontSize="20" filter="url(#roughPaper)">💀</text>
      </svg>
    );
  }
  
  if (stage === 'seed') {
    return (
      <svg viewBox="0 0 100 120" className="w-full h-full">
        <defs>
          <filter id="seedRough">
            <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
          </filter>
        </defs>
        {/* Seed in ground */}
        <ellipse cx="50" cy="105" rx="15" ry="6" fill="#8D6E63" filter="url(#seedRough)" />
        <path d="M45 102 Q50 95 55 102" stroke="#6D4C41" strokeWidth="3" fill="none" strokeLinecap="round" filter="url(#seedRough)" />
      </svg>
    );
  }
  
  if (stage === 'sprout') {
    return (
      <svg viewBox="0 0 100 120" className="w-full h-full">
        <defs>
          <filter id="sproutRough">
            <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
          </filter>
        </defs>
        {/* Wobbly stem */}
        <path 
          d="M50 105 Q52 90 48 75 Q50 70 52 65" 
          stroke="#8B7355" 
          strokeWidth="4" 
          fill="none" 
          strokeLinecap="round"
          filter="url(#sproutRough)"
        />
        {/* Two leaves */}
        <path 
          d="M52 75 Q35 70 38 60 Q45 65 52 75" 
          fill={config.leafColor} 
          stroke="#33691E" 
          strokeWidth="1"
          filter="url(#sproutRough)"
        />
        <path 
          d="M48 80 Q65 75 62 65 Q55 70 48 80" 
          fill={config.leafColor} 
          stroke="#33691E" 
          strokeWidth="1"
          filter="url(#sproutRough)"
        />
      </svg>
    );
  }
  
  // Sapling and larger stages
  const scale = stage === 'sapling' ? 0.5 : stage === 'tree' ? 0.75 : 1;
  
  return (
    <svg viewBox="0 0 100 120" className="w-full h-full">
      <defs>
        <filter id="treeRough">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" />
        </filter>
      </defs>
      
      <g transform={`translate(50, 110) scale(${scale}) translate(-50, -110)`}>
        {/* Wobbly trunk */}
        <path 
          d={type === 'pine' 
            ? "M50 110 L48 60 L52 60 Z" 
            : type === 'palm'
            ? "M50 110 Q52 80 48 50 L52 50 Q54 80 50 110"
            : "M45 110 Q48 70 46 40 Q50 35 54 40 Q52 70 55 110"
          }
          fill={config.color}
          stroke="#4E342E"
          strokeWidth="2"
          filter="url(#treeRough)"
        />
        
        {/* Foliage - organic blobs */}
        {type === 'pine' ? (
          // Pine layers
          <>
            <path d="M50 30 L25 55 L75 55 Z" fill={config.leafColor} stroke="#1B5E20" strokeWidth="1" filter="url(#treeRough)" />
            <path d="M50 50 L30 75 L70 75 Z" fill={config.leafColor} stroke="#1B5E20" strokeWidth="1" filter="url(#treeRough)" />
            <path d="M50 70 L35 95 L65 95 Z" fill={config.leafColor} stroke="#1B5E20" strokeWidth="1" filter="url(#treeRough)" />
          </>
        ) : type === 'palm' ? (
          // Palm fronds
          <>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <path
                key={i}
                d={`M50 50 Q${50 + Math.cos(angle * Math.PI / 180) * 35} ${50 + Math.sin(angle * Math.PI / 180) * 15} ${50 + Math.cos(angle * Math.PI / 180) * 50} ${50 + Math.sin(angle * Math.PI / 180) * 25}`}
                stroke={config.leafColor}
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                filter="url(#treeRough)"
              />
            ))}
            <circle cx="50" cy="50" r="8" fill={config.leafColor} filter="url(#treeRough)" />
          </>
        ) : type === 'willow' ? (
          // Willow - drooping branches
          <>
            <path d={wobblyCircle(50, 45, 25, 4)} fill={config.leafColor} stroke="#33691E" strokeWidth="1" filter="url(#treeRough)" />
            <path d="M35 55 Q30 80 32 95" stroke={config.leafColor} strokeWidth="4" strokeLinecap="round" fill="none" filter="url(#treeRough)" />
            <path d="M45 60 Q42 85 44 100" stroke={config.leafColor} strokeWidth="4" strokeLinecap="round" fill="none" filter="url(#treeRough)" />
            <path d="M55 58 Q58 83 56 98" stroke={config.leafColor} strokeWidth="4" strokeLinecap="round" fill="none" filter="url(#treeRough)" />
            <path d="M65 55 Q70 78 68 92" stroke={config.leafColor} strokeWidth="4" strokeLinecap="round" fill="none" filter="url(#roughPaper)" />
          </>
        ) : (
          // Oak and Cherry - round tree tops
          <>
            <path d={wobblyCircle(50, 40, 28, 5)} fill={config.leafColor} stroke="#33691E" strokeWidth="1" filter="url(#treeRough)" />
            <path d={wobblyCircle(35, 55, 18, 3)} fill={config.leafColor} stroke="#33691E" strokeWidth="1" filter="url(#treeRough)" />
            <path d={wobblyCircle(65, 50, 20, 4)} fill={config.leafColor} stroke="#33691E" strokeWidth="1" filter="url(#treeRough)" />
            {stage === 'mature' && type === 'cherry' && (
              // Cherry blossoms
              <>
                <circle cx="40" cy="35" r="4" fill="#FFF" opacity="0.9" />
                <circle cx="55" cy="30" r="4" fill="#FFF" opacity="0.9" />
                <circle cx="60" cy="45" r="4" fill="#FFF" opacity="0.9" />
                <circle cx="45" cy="50" r="4" fill="#FFF" opacity="0.9" />
              </>
            )}
          </>
        )}
      </g>
    </svg>
  );
};

// Hand-drawn colorful blob background
const BlobBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg className="absolute w-full h-full" preserveAspectRatio="none">
      <defs>
        <filter id="blobRough">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
        </filter>
      </defs>
      {/* Sky blobs */}
      <path d="M-50 -50 Q200 100 400 50 Q600 0 800 100 Q1000 200 1200 50 L1200 -50 Z" fill="#81D4FA" opacity="0.6" filter="url(#blobRough)" />
      <path d="M-50 50 Q150 200 350 150 Q550 100 750 180 Q950 250 1150 150 L1200 400 L1200 400 L-50 400 Z" fill="#A5D6A7" opacity="0.7" filter="url(#blobRough)" />
      {/* Cloud blobs */}
      <path d="M50 80 Q100 50 150 80 Q200 50 250 90 Q200 130 150 110 Q100 130 50 100 Z" fill="#E3F2FD" opacity="0.8" filter="url(#blobRough)" />
      <path d="M600 60 Q650 30 700 60 Q750 30 800 70 Q750 110 700 90 Q650 110 600 80 Z" fill="#E8F5E9" opacity="0.7" filter="url(#blobRough)" />
      <path d="M900 120 Q950 90 1000 120 Q1050 90 1100 130 Q1050 170 1000 150 Q950 170 900 140 Z" fill="#FFF3E0" opacity="0.6" filter="url(#blobRough)" />
    </svg>
  </div>
);

// Water droplet animation
const WaterDroplet = ({ x, y }: { x: number; y: number }) => {
  return (
    <div 
      className="absolute w-4 h-6 pointer-events-none animate-bounce"
      style={{ 
        left: x, 
        top: y,
        animation: 'dropletFall 0.8s ease-in forwards'
      }}
    >
      <svg viewBox="0 0 20 30" className="w-full h-full">
        <path d="M10 2 Q18 15 18 20 Q18 28 10 28 Q2 28 2 20 Q2 15 10 2" fill="#29B6F6" stroke="#0277BD" strokeWidth="1.5" />
      </svg>
    </div>
  );
};

export default function ForestGame({ yardId, carrots: initialCarrots = 0, pet, profile, bankAccounts = [], user }: RoomViewProps) {
  const router = useRouter();
  const supabase = createClient();
  
  const isAdmin = user?.email === '2landonl10@gmail.com';
  const [water, setWater] = useState(isAdmin ? 999 : initialCarrots);
  const [totalSaved, setTotalSaved] = useState(0);
  const [plaidConnected, setPlaidConnected] = useState(false);
  
  const [trees, setTrees] = useState<Tree[]>([]);
  const [droplets, setDroplets] = useState<{id: number; x: number; y: number}[]>([]);
  
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [plantingMode, setPlantingMode] = useState(false);
  const [plantingType, setPlantingType] = useState<TreeType | null>(null);
  const [showTreeModal, setShowTreeModal] = useState(false);
  const [saveAmount, setSaveAmount] = useState(10);
  const [view, setView] = useState<'garden' | 'tree'>('garden');

  // Health decay
  useEffect(() => {
    const interval = setInterval(() => {
      setTrees(prev => prev.map(tree => {
        const hoursSinceWater = (Date.now() - tree.lastWatered) / 3600000;
        const decay = hoursSinceWater * 1.5;
        const newHealth = Math.max(0, tree.health - decay);
        return { ...tree, health: newHealth };
      }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const waterTree = (treeId: string, clickX?: number, clickY?: number) => {
    if (water < 5) return;
    
    setWater(w => w - 5);
    
    // Add droplet animation
    if (clickX !== undefined && clickY !== undefined) {
      const id = Date.now();
      setDroplets(prev => [...prev, { id, x: clickX, y: clickY }]);
      setTimeout(() => setDroplets(prev => prev.filter(d => d.id !== id)), 800);
    }
    
    setTrees(prev => prev.map(tree => {
      if (tree.id === treeId) {
        const newWaterCount = tree.totalWaterCount + 1;
        const waterToNextStage = TREE_CONFIG[tree.type].waterToGrow;
        
        // Calculate new stage based on total waters
        let newStage: TreeStage = tree.stage;
        const progressInStage = newWaterCount % waterToNextStage;
        const growthProgress = (progressInStage / waterToNextStage) * 100;
        
        if (newWaterCount >= waterToNextStage * 4) newStage = 'mature';
        else if (newWaterCount >= waterToNextStage * 3) newStage = 'tree';
        else if (newWaterCount >= waterToNextStage * 2) newStage = 'sapling';
        else if (newWaterCount >= waterToNextStage) newStage = 'sprout';
        
        return { 
          ...tree, 
          health: Math.min(100, tree.health + 25),
          growthProgress,
          stage: newStage,
          lastWatered: Date.now(),
          totalWaterCount: newWaterCount
        };
      }
      return tree;
    }));
  };
  
  const handleGardenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!plantingMode || !plantingType) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    if (water < 3) {
      setPlantingMode(false);
      setPlantingType(null);
      return;
    }
    
    setWater(w => w - 3);
    const newTree: Tree = {
      id: Date.now().toString(),
      type: plantingType,
      stage: 'seed',
      health: 60,
      growthProgress: 0,
      plantedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      lastWatered: Date.now(),
      x: Math.max(10, Math.min(90, x)),
      y: Math.max(20, Math.min(80, y)),
      totalWaterCount: 0
    };
    
    setTrees(prev => [...prev, newTree]);
    setPlantingMode(false);
    setPlantingType(null);
  };
  
  const removeDeadTree = (treeId: string) => {
    setTrees(prev => prev.filter(t => t.id !== treeId));
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
    <div className="flex flex-col h-screen bg-[#E8F5E9] relative overflow-hidden">
      {/* Colorful blob background */}
      <BlobBackground />
      
      {/* Droplet animations */}
      {droplets.map(d => (
        <WaterDroplet key={d.id} x={d.x} y={d.y} />
      ))}
      
      {/* Header - hand drawn style */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Water droplet count */}
          <div className="bg-[#81D4FA] px-4 py-2 rounded-2xl border-2 border-[#0277BD] shadow-md">
            <div className="flex items-center gap-1">
              <Droplets className="w-5 h-5 text-[#01579B]" />
              <span className="font-bold text-[#01579B] text-lg">{water}</span>
            </div>
          </div>
          {/* Total saved */}
          <div className="bg-[#A5D6A7] px-3 py-2 rounded-2xl border-2 border-[#2E7D32]">
            <span className="text-sm font-bold text-[#1B5E20]">${totalSaved}</span>
          </div>
        </div>
        
        {/* Plaid connection placeholder */}
        <button 
          onClick={() => setPlaidConnected(!plaidConnected)}
          className={`flex items-center gap-2 px-3 py-2 rounded-2xl border-2 transition-colors ${
            plaidConnected 
              ? 'bg-[#C8E6C9] border-[#4CAF50] text-[#2E7D32]' 
              : 'bg-[#FFCCBC] border-[#FF7043] text-[#D84315]'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span className="text-xs font-bold">{plaidConnected ? 'Connected' : 'Connect Bank'}</span>
        </button>
      </div>

      {view === 'garden' ? (
        <>
          {/* Garden - 2.5D Isometric */}
          <div 
            className="flex-1 relative cursor-crosshair"
            onClick={handleGardenClick}
          >
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{ perspective: '1200px' }}
            >
              <div 
                className="relative w-[85vw] h-[85vw] max-w-[550px] max-h-[550px]"
                style={{
                  transform: 'rotateX(55deg) rotateZ(-45deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Ground - textured green */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#7CB342] to-[#558B2F] rounded-3xl shadow-2xl overflow-hidden">
                  {/* Grass texture dots */}
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-[#8BC34A] rounded-full opacity-50"
                      style={{
                        left: `${Math.random() * 90 + 5}%`,
                        top: `${Math.random() * 90 + 5}%`,
                      }}
                    />
                  ))}
                </div>
                
                {/* Trees */}
                {activeTrees.map(tree => (
                  <button
                    key={tree.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (plantingMode) return;
                      
                      // Water on click if close to tree
                      const clickX = e.clientX;
                      const clickY = e.clientY;
                      waterTree(tree.id, clickX, clickY);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      if (!plantingMode) {
                        setSelectedTree(tree);
                        setView('tree');
                      }
                    }}
                    className="absolute transition-all duration-300 hover:scale-110"
                    style={{
                      left: `${tree.x}%`,
                      top: `${tree.y}%`,
                      width: stageSize(tree.stage),
                      height: stageSize(tree.stage),
                      transform: 'rotateZ(45deg) rotateX(-55deg) translate(-50%, -50%)',
                    }}
                  >
                    <HandDrawnTree type={tree.type} stage={tree.stage} health={tree.health} />
                    
                    {/* Health warning */}
                    {tree.health < 40 && tree.health > 0 && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#FF7043] text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap animate-pulse font-bold">
                        thirsty!
                      </div>
                    )}
                    
                    {/* Water progress ring */}
                    {tree.health > 0 && (
                      <svg className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8" viewBox="0 0 32 32">
                        <circle cx="16" cy="16" r="12" fill="none" stroke="#E0E0E0" strokeWidth="3" />
                        <circle 
                          cx="16" cy="16" r="12" fill="none" stroke="#29B6F6" strokeWidth="3"
                          strokeDasharray={`${(tree.growthProgress / 100) * 75} 75`}
                          strokeLinecap="round"
                          transform="rotate(-90 16 16)"
                        />
                      </svg>
                    )}
                  </button>
                ))}
                
                {/* Dead trees */}
                {deadTrees.map(tree => (
                  <button
                    key={tree.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDeadTree(tree.id);
                    }}
                    className="absolute opacity-60 hover:opacity-100 transition-opacity"
                    style={{
                      left: `${tree.x}%`,
                      top: `${tree.y}%`,
                      width: stageSize(tree.stage),
                      height: stageSize(tree.stage),
                      transform: 'rotateZ(45deg) rotateX(-55deg) translate(-50%, -50%)',
                    }}
                  >
                    <HandDrawnTree type={tree.type} stage={tree.stage} health={0} />
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#5D4037] text-white text-[9px] px-1.5 py-0.5 rounded-full whitespace-nowrap">
                      tap to remove
                    </div>
                  </button>
                ))}
                
                {/* Planting cursor indicator */}
                {plantingMode && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-[#FFF3E0] px-4 py-2 rounded-full border-2 border-[#FF8F00] text-[#E65100] font-bold shadow-lg">
                      Click anywhere to plant {plantingType && TREE_CONFIG[plantingType].name}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="relative z-10 p-4 space-y-3">
            {/* Save money */}
            <div className="bg-[#FFF8E1] rounded-2xl p-3 border-2 border-[#FFCC80] shadow-md">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={saveAmount}
                  onChange={(e) => setSaveAmount(Math.max(1, parseInt(e.target.value) || 0))}
                  className="flex-1 bg-white rounded-xl px-3 py-2 text-center border-2 border-[#FFCC80] font-bold text-[#E65100]"
                />
                <button
                  onClick={handleSave}
                  className="bg-[#66BB6A] text-white font-bold px-4 py-2 rounded-xl border-2 border-[#2E7D32] shadow-md active:scale-95 transition-transform"
                >
                  Save +{Math.floor(saveAmount / 5)}💧
                </button>
              </div>
            </div>

            {/* Plant button */}
            <button
              onClick={() => setShowTreeModal(true)}
              disabled={plantingMode}
              className="w-full bg-[#42A5F5] text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 border-2 border-[#1565C0] shadow-lg active:scale-95 transition-transform disabled:opacity-50"
            >
              <Plus className="w-6 h-6" />
              Plant New Tree (3💧)
            </button>
            
            <p className="text-xs text-center text-[#558B2F]">
              Double-click tree to view • Click to water
            </p>
          </div>
        </>
      ) : (
        /* Individual Tree View */
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
          {selectedTree && (
            <>
              <button 
                onClick={() => setView('garden')}
                className="absolute top-4 left-4 bg-[#FFCC80] px-4 py-2 rounded-full border-2 border-[#FF8F00] text-[#E65100] font-bold shadow-md"
              >
                ← Back to Garden
              </button>
              
              <div className="text-center mb-6">
                <p className="text-sm text-[#558B2F] font-bold">Planted {selectedTree.plantedAt}</p>
                <p className="text-2xl font-black text-[#33691E] capitalize">{TREE_CONFIG[selectedTree.type].name}</p>
                <p className="text-xs text-[#7CB342]">Watered {selectedTree.totalWaterCount} times</p>
              </div>
              
              {/* Big tree */}
              <div className="w-56 h-72 mb-6">
                <HandDrawnTree type={selectedTree.type} stage={selectedTree.stage} health={selectedTree.health} />
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
              
              {/* Growth progress */}
              <div className="w-full max-w-xs mb-6">
                <div className="flex justify-between text-sm font-bold text-[#33691E] mb-1">
                  <span>Growth</span>
                  <span>{selectedTree.stage}</span>
                </div>
                <div className="h-3 bg-[#E0E0E0] rounded-full overflow-hidden border-2 border-[#9E9E9E]">
                  <div 
                    className="h-full bg-[#29B6F6] rounded-full transition-all duration-500"
                    style={{ width: `${selectedTree.growthProgress}%` }}
                  />
                </div>
                <p className="text-xs text-[#7CB342] mt-1 text-center">
                  {selectedTree.totalWaterCount} / {TREE_CONFIG[selectedTree.type].waterToGrow * (selectedTree.stage === 'seed' ? 1 : selectedTree.stage === 'sprout' ? 2 : selectedTree.stage === 'sapling' ? 3 : selectedTree.stage === 'tree' ? 4 : 5)} to next stage
                </p>
              </div>
              
              {/* Water button */}
              <button
                onClick={(e) => {
                  const rect = (e.target as HTMLElement).getBoundingClientRect();
                  waterTree(selectedTree.id, rect.left + rect.width/2, rect.top);
                  // Update selected tree
                  setSelectedTree(prev => prev ? trees.find(t => t.id === prev.id) || null : null);
                }}
                disabled={water < 5}
                className="bg-[#29B6F6] text-white font-bold py-4 px-10 rounded-2xl flex items-center gap-2 border-2 border-[#0277BD] shadow-lg disabled:opacity-50 active:scale-95 transition-all"
              >
                <Droplets className="w-6 h-6" />
                Water (5💧)
              </button>
              
              {selectedTree.health < 30 && selectedTree.health > 0 && (
                <p className="text-[#D84315] text-sm mt-4 font-bold animate-pulse">
                  Your tree needs water soon or it will die!
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Tree Type Selection Modal */}
      {showTreeModal && (
        <div className="absolute inset-0 bg-[#33691E]/70 z-50 flex items-end" onClick={() => setShowTreeModal(false)}>
          <div className="w-full bg-[#FFF8E1] rounded-t-3xl p-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-[#33691E]">Choose Tree Type</h2>
              <button onClick={() => setShowTreeModal(false)} className="bg-[#FFCC80] p-2 rounded-full">
                <X className="w-5 h-5 text-[#E65100]" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(TREE_CONFIG).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => {
                    setPlantingType(type as TreeType);
                    setPlantingMode(true);
                    setShowTreeModal(false);
                  }}
                  disabled={water < 3}
                  className="bg-[#C8E6C9] border-2 border-[#4CAF50] rounded-2xl p-4 flex flex-col items-center disabled:opacity-50 active:scale-95 transition-transform"
                >
                  <div className="w-16 h-20 mb-2">
                    <HandDrawnTree type={type as TreeType} stage="sapling" health={100} />
                  </div>
                  <p className="font-black text-[#33691E]">{config.name}</p>
                  <p className="text-xs text-[#558B2F]">{config.waterToGrow}💧 to grow</p>
                  <p className="text-xs text-[#7CB342] font-bold">3💧 to plant</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes dropletFall {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(100px) scale(0.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function stageSize(stage: TreeStage): string {
  const sizes: Record<TreeStage, string> = {
    seed: '40px',
    sprout: '50px',
    sapling: '70px',
    tree: '100px',
    mature: '130px',
  };
  return sizes[stage];
}
