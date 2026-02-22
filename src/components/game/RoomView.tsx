'use client';

import { useState, useCallback, useEffect } from 'react';
import { X, Droplets, Plus, Trash2 } from 'lucide-react';
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
type TreeType = 'oak' | 'pine' | 'cherry' | 'palm';

interface Tree {
  id: string;
  type: TreeType;
  stage: TreeStage;
  health: number; // 0-100, dies at 0
  plantedAt: string;
  lastWatered: number;
  name?: string;
  x: number;
  y: number;
}

const TREE_CONFIG: Record<TreeType, { name: string; color: string; stages: number }> = {
  oak: { name: 'Oak', color: '#228B22', stages: 5 },
  pine: { name: 'Pine', color: '#2F4F2F', stages: 5 },
  cherry: { name: 'Cherry', color: '#FFB7C5', stages: 5 },
  palm: { name: 'Palm', color: '#8B7355', stages: 4 },
};

// Simple geometric tree SVG - Forest style
const TreeSVG = ({ type, stage, health }: { type: TreeType; stage: TreeStage; health: number }) => {
  const isDead = health <= 0;
  const color = isDead ? '#8B7355' : TREE_CONFIG[type].color;
  
  // Size based on stage
  const sizes: Record<TreeStage, number> = {
    seed: 15,
    sprout: 25,
    sapling: 45,
    tree: 70,
    mature: 90,
  };
  const size = sizes[stage];
  
  if (isDead) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Dead tree - brown stump */}
        <rect x="42" y="60" width="16" height="30" fill="#8B7355" />
        <path d="M50 60 L30 40 M50 60 L70 40 M50 50 L40 30 M50 50 L60 30" 
          stroke="#8B7355" strokeWidth="4" strokeLinecap="round" />
        <text x="50" y="25" textAnchor="middle" fontSize="20">💀</text>
      </svg>
    );
  }
  
  if (stage === 'seed') {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <ellipse cx="50" cy="85" rx="12" ry="6" fill="#8B4513" />
        <circle cx="50" cy="82" r="5" fill="#654321" />
      </svg>
    );
  }
  
  if (stage === 'sprout') {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M50 85 L50 60" stroke="#8B4513" strokeWidth="4" />
        <ellipse cx="40" cy="65" rx="8" ry="4" fill={color} />
        <ellipse cx="60" cy="68" rx="8" ry="4" fill={color} />
      </svg>
    );
  }
  
  if (stage === 'sapling') {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="45" y="50" width="10" height="35" fill="#8B4513" rx="2" />
        <circle cx="50" cy="45" r={size * 0.4} fill={color} />
        <circle cx="35" cy="55" r={size * 0.25} fill={color} />
        <circle cx="65" cy="50" r={size * 0.3} fill={color} />
      </svg>
    );
  }
  
  // Tree and mature stages
  if (type === 'oak') {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="42" y={100 - size * 0.6} width="16" height={size * 0.6} fill="#8B4513" rx="2" />
        <circle cx="50" cy={100 - size * 0.8} r={size * 0.5} fill={color} />
        <circle cx="30" cy={100 - size * 0.7} r={size * 0.35} fill={color} />
        <circle cx="70" cy={100 - size * 0.75} r={size * 0.4} fill={color} />
        <circle cx="40" cy={100 - size} r={size * 0.3} fill={color} />
        <circle cx="60" cy={100 - size * 0.95} r={size * 0.35} fill={color} />
      </svg>
    );
  }
  
  if (type === 'pine') {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="45" y={100 - size * 0.5} width="10" height={size * 0.5} fill="#654321" />
        <path d={`M50 ${100 - size} L30 ${100 - size * 0.6} L70 ${100 - size * 0.6} Z`} fill={color} />
        <path d={`M50 ${100 - size * 0.7} L35 ${100 - size * 0.4} L65 ${100 - size * 0.4} Z`} fill={color} />
        <path d={`M50 ${100 - size * 0.4} L40 ${100 - size * 0.15} L60 ${100 - size * 0.15} Z`} fill={color} />
      </svg>
    );
  }
  
  if (type === 'cherry') {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="45" y={100 - size * 0.6} width="10" height={size * 0.6} fill="#8B4513" rx="2" />
        <circle cx="50" cy={100 - size * 0.7} r={size * 0.5} fill="#FFB7C5" />
        <circle cx="30" cy={100 - size * 0.6} r={size * 0.3} fill="#FFB7C5" />
        <circle cx="70" cy={100 - size * 0.65} r={size * 0.35} fill="#FFB7C5" />
        <circle cx="40" cy={100 - size * 0.85} r={size * 0.25} fill="#FFB7C5" />
        <circle cx="60" cy={100 - size * 0.8} r={size * 0.28} fill="#FFB7C5" />
        {/* Flowers */}
        {stage === 'mature' && (
          <>
            <circle cx="35" cy={100 - size * 0.65} r="3" fill="white" />
            <circle cx="65" cy={100 - size * 0.7} r="3" fill="white" />
            <circle cx="50" cy={100 - size * 0.9} r="3" fill="white" />
          </>
        )}
      </svg>
    );
  }
  
  // Palm
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="45" y={100 - size * 0.7} width="10" height={size * 0.7} fill="#8B7355" rx="2" />
      <ellipse cx="50" cy={100 - size * 0.75} rx={size * 0.4} ry={size * 0.15} fill="#228B22" />
      <path d={`M50 ${100 - size * 0.75} L20 ${100 - size} M50 ${100 - size * 0.75} L80 ${100 - size}`} 
        stroke="#228B22" strokeWidth="6" strokeLinecap="round" />
      <path d={`M50 ${100 - size * 0.75} L25 ${100 - size * 0.5} M50 ${100 - size * 0.75} L75 ${100 - size * 0.5}`} 
        stroke="#228B22" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
};

export default function ForestGame({ yardId, carrots: initialCarrots = 0, pet, profile, bankAccounts = [], user }: RoomViewProps) {
  const router = useRouter();
  const supabase = createClient();
  
  const isAdmin = user?.email === '2landonl10@gmail.com';
  const [water, setWater] = useState(isAdmin ? 999 : initialCarrots);
  const [totalSaved, setTotalSaved] = useState(0);
  
  const [trees, setTrees] = useState<Tree[]>([
    { id: '1', type: 'oak', stage: 'tree', health: 80, plantedAt: 'Jan 2024', lastWatered: Date.now(), x: 30, y: 40 },
    { id: '2', type: 'pine', stage: 'sapling', health: 60, plantedAt: 'Feb 2024', lastWatered: Date.now() - 86400000, x: 60, y: 35 },
    { id: '3', type: 'cherry', stage: 'mature', health: 95, plantedAt: 'Mar 2024', lastWatered: Date.now(), x: 45, y: 60 },
  ]);
  
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [showPlantModal, setShowPlantModal] = useState(false);
  const [saveAmount, setSaveAmount] = useState(10);
  const [view, setView] = useState<'garden' | 'plant'>('garden');

  // Decay health over time
  useEffect(() => {
    const interval = setInterval(() => {
      setTrees(prev => prev.map(tree => {
        const hoursSinceWater = (Date.now() - tree.lastWatered) / 3600000;
        const decay = hoursSinceWater * 2; // 2% per hour
        const newHealth = Math.max(0, tree.health - decay);
        return { ...tree, health: newHealth };
      }));
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const waterTree = (treeId: string) => {
    if (water < 5) return;
    
    setWater(w => w - 5);
    setTrees(prev => prev.map(tree => {
      if (tree.id === treeId) {
        const newHealth = Math.min(100, tree.health + 40);
        
        // Growth logic
        let newStage = tree.stage;
        if (newHealth > 30 && tree.stage === 'seed') newStage = 'sprout';
        else if (newHealth > 50 && tree.stage === 'sprout') newStage = 'sapling';
        else if (newHealth > 70 && tree.stage === 'sapling') newStage = 'tree';
        else if (newHealth > 90 && tree.stage === 'tree') newStage = 'mature';
        
        return { 
          ...tree, 
          health: newHealth, 
          stage: newStage,
          lastWatered: Date.now()
        };
      }
      return tree;
    }));
  };
  
  const plantTree = (type: TreeType) => {
    if (water < 3) return;
    
    setWater(w => w - 3);
    const newTree: Tree = {
      id: Date.now().toString(),
      type,
      stage: 'seed',
      health: 50,
      plantedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      lastWatered: Date.now(),
      x: 20 + Math.random() * 60,
      y: 30 + Math.random() * 40,
    };
    
    setTrees(prev => [...prev, newTree]);
    setShowPlantModal(false);
  };
  
  const removeDeadTree = (treeId: string) => {
    setTrees(prev => prev.filter(t => t.id !== treeId));
    if (selectedTree?.id === treeId) setSelectedTree(null);
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
    <div className="flex flex-col h-screen bg-gradient-to-b from-sky-100 to-green-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/60 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 px-3 py-1 rounded-full flex items-center gap-1">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-blue-700">{water}</span>
          </div>
          <div className="text-xs text-gray-500">${totalSaved} saved</div>
        </div>
        <button onClick={handleSignOut} className="text-xs text-gray-500">Logout</button>
      </div>

      {view === 'garden' ? (
        <>
          {/* 2.5D Isometric Garden */}
          <div className="flex-1 relative overflow-hidden">
            {/* Ground plane */}
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{ perspective: '1000px' }}
            >
              <div 
                className="relative w-[80vw] h-[80vw] max-w-[500px] max-h-[500px]"
                style={{
                  transform: 'rotateX(60deg) rotateZ(-45deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Grass base */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-300 to-green-400 rounded-3xl shadow-2xl">
                  {/* Grid lines */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={`h${i}`} className="absolute w-full h-px bg-green-500/30" style={{ top: `${(i + 1) * 20}%` }} />
                  ))}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={`v${i}`} className="absolute h-full w-px bg-green-500/30" style={{ left: `${(i + 1) * 20}%` }} />
                  ))}
                </div>
                
                {/* Trees */}
                {activeTrees.map(tree => (
                  <button
                    key={tree.id}
                    onClick={() => { setSelectedTree(tree); setView('plant'); }}
                    className="absolute w-16 h-20 hover:scale-110 transition-transform"
                    style={{
                      left: `${tree.x}%`,
                      top: `${tree.y}%`,
                      transform: 'rotateZ(45deg) rotateX(-60deg)',
                    }}
                  >
                    <TreeSVG type={tree.type} stage={tree.stage} health={tree.health} />
                    {/* Health indicator */}
                    {tree.health < 40 && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[8px] px-1 rounded">
                        thirsty!
                      </div>
                    )}
                  </button>
                ))}
                
                {/* Dead trees */}
                {deadTrees.map(tree => (
                  <button
                    key={tree.id}
                    onClick={() => removeDeadTree(tree.id)}
                    className="absolute w-16 h-20 opacity-50 hover:opacity-100"
                    style={{
                      left: `${tree.x}%`,
                      top: `${tree.y}%`,
                      transform: 'rotateZ(45deg) rotateX(-60deg)',
                    }}
                  >
                    <TreeSVG type={tree.type} stage={tree.stage} health={0} />
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-[8px] px-1 rounded">
                      tap to remove
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Save & Plant controls */}
          <div className="p-4 space-y-3">
            {/* Save money */}
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={saveAmount}
                  onChange={(e) => setSaveAmount(Math.max(1, parseInt(e.target.value) || 0))}
                  className="flex-1 bg-gray-100 rounded-lg px-3 py-2 text-center"
                  placeholder="Amount"
                />
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white font-bold px-4 py-2 rounded-lg"
                >
                  Save +{Math.floor(saveAmount / 5)}💧
                </button>
              </div>
            </div>

            {/* Plant button */}
            <button
              onClick={() => setShowPlantModal(true)}
              className="w-full bg-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Plant New Tree (3💧)
            </button>
          </div>
        </>
      ) : (
        /* Individual Tree View */
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          {selectedTree && (
            <>
              <button 
                onClick={() => setView('garden')}
                className="absolute top-4 left-4 text-gray-500"
              >
                ← Back to Garden
              </button>
              
              <div className="text-center mb-4">
                <p className="text-sm text-gray-500">Planted {selectedTree.plantedAt}</p>
                <p className="text-lg font-bold text-green-800 capitalize">{TREE_CONFIG[selectedTree.type].name}</p>
              </div>
              
              {/* Big tree */}
              <div className="w-48 h-64 mb-6">
                <TreeSVG type={selectedTree.type} stage={selectedTree.stage} health={selectedTree.health} />
              </div>
              
              {/* Health bar */}
              <div className="w-full max-w-xs mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Health</span>
                  <span>{Math.floor(selectedTree.health)}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${selectedTree.health > 60 ? 'bg-green-500' : selectedTree.health > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${selectedTree.health}%` }}
                  />
                </div>
              </div>
              
              {/* Water button */}
              <button
                onClick={() => waterTree(selectedTree.id)}
                disabled={water < 5}
                className="bg-blue-500 text-white font-bold py-3 px-8 rounded-full flex items-center gap-2 disabled:opacity-50 shadow-lg"
              >
                <Droplets className="w-5 h-5" />
                Water (5💧)
              </button>
              
              {selectedTree.health < 30 && (
                <p className="text-red-500 text-sm mt-3 animate-pulse">
                  Your tree needs water soon or it will die!
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Plant Modal */}
      {showPlantModal && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowPlantModal(false)}>
          <div className="w-full bg-white rounded-t-2xl p-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Plant a Tree</h2>
              <button onClick={() => setShowPlantModal(false)}><X className="w-6 h-6" /></button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(TREE_CONFIG).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => plantTree(type as TreeType)}
                  disabled={water < 3}
                  className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex flex-col items-center disabled:opacity-50"
                >
                  <div className="w-16 h-20 mb-2">
                    <TreeSVG type={type as TreeType} stage="sapling" health={100} />
                  </div>
                  <p className="font-bold text-gray-800">{config.name}</p>
                  <p className="text-xs text-green-600">3 💧 to plant</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
