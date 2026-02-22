'use client';

import { useState, useCallback } from 'react';
import { X, Droplets, Sprout, Flower2, Coins } from 'lucide-react';
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

type PlantStage = 'seed' | 'sprout' | 'growing' | 'mature' | 'flowering' | 'harvest';

interface Plant {
  id: string;
  type: 'carrot' | 'tomato' | 'sunflower' | 'rose';
  stage: PlantStage;
  growth: number; // 0-100
  water: number; // 0-100
  plantedAt: number;
}

const PLANT_CONFIG = {
  carrot: { name: 'Carrot', stages: 5, color: '#FF8C42', value: 10, waterCost: 5 },
  tomato: { name: 'Tomato', stages: 6, color: '#FF6347', value: 15, waterCost: 8 },
  sunflower: { name: 'Sunflower', stages: 7, color: '#FFD700', value: 25, waterCost: 12 },
  rose: { name: 'Rose', stages: 8, color: '#FF69B4', value: 40, waterCost: 15 },
};

const STAGE_THRESHOLDS: Record<PlantStage, number> = {
  seed: 0,
  sprout: 15,
  growing: 35,
  mature: 60,
  flowering: 80,
  harvest: 100,
};

// Simple plant SVG component
const PlantSVG = ({ plant, stage }: { plant: Plant; stage: PlantStage }) => {
  const config = PLANT_CONFIG[plant.type];
  const progress = plant.growth / 100;
  
  const getHeight = () => {
    switch (stage) {
      case 'seed': return 10;
      case 'sprout': return 25;
      case 'growing': return 40 + (progress - 0.35) * 30;
      case 'mature': return 70 + (progress - 0.6) * 20;
      case 'flowering': return 90;
      case 'harvest': return 100;
    }
  };
  
  const h = getHeight();
  
  return (
    <svg viewBox="0 0 60 100" className="w-full h-full">
      {/* Soil */}
      <ellipse cx="30" cy="90" rx="25" ry="8" fill="#8B4513" opacity="0.6" />
      
      {stage === 'seed' && (
        <ellipse cx="30" cy="88" rx="6" ry="4" fill="#654321" />
      )}
      
      {(stage === 'sprout' || stage === 'growing') && (
        <>
          {/* Stem */}
          <path 
            d={`M30 88 Q${30 + Math.sin(progress * 10) * 5} ${88 - h/2} 30 ${88 - h}`}
            stroke={config.color}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          {/* Leaves */}
          <ellipse cx="25" cy={88 - h/2} rx="8" ry="4" fill="#228B22" transform={`rotate(-30 25 ${88 - h/2})`} />
          <ellipse cx="35" cy={88 - h/3} rx="8" ry="4" fill="#228B22" transform={`rotate(30 35 ${88 - h/3})`} />
        </>
      )}
      
      {(stage === 'mature' || stage === 'flowering' || stage === 'harvest') && (
        <>
          {/* Full stem */}
          <path d="M30 88 Q32 50 30 20" stroke={config.color} strokeWidth="5" fill="none" strokeLinecap="round" />
          {/* More leaves */}
          <ellipse cx="22" cy="70" rx="10" ry="5" fill="#228B22" transform="rotate(-25 22 70)" />
          <ellipse cx="38" cy="60" rx="10" ry="5" fill="#228B22" transform="rotate(25 38 60)" />
          <ellipse cx="24" cy="45" rx="8" ry="4" fill="#228B22" transform="rotate(-20 24 45)" />
          <ellipse cx="36" cy="35" rx="8" ry="4" fill="#228B22" transform="rotate(20 36 35)" />
        </>
      )}
      
      {/* Flower/fruit */}
      {stage === 'flowering' && (
        <>
          <circle cx="30" cy="20" r="12" fill={config.color} />
          <circle cx="30" cy="20" r="8" fill="#FFD700" />
          <circle cx="30" cy="20" r="3" fill="#8B4513" />
        </>
      )}
      
      {stage === 'harvest' && (
        <>
          {plant.type === 'carrot' && (
            <path d="M25 25 L30 15 L35 25 L32 50 L28 50 Z" fill="#FF8C42" stroke="#CC5500" strokeWidth="2" />
          )}
          {plant.type === 'tomato' && (
            <circle cx="30" cy="30" r="12" fill="#FF6347" stroke="#CC2200" strokeWidth="2" />
          )}
          {plant.type === 'sunflower' && (
            <>
              <circle cx="30" cy="25" r="15" fill="#FFD700" stroke="#DAA520" strokeWidth="2" />
              <circle cx="30" cy="25" r="8" fill="#8B4513" />
            </>
          )}
          {plant.type === 'rose' && (
            <>
              <circle cx="30" cy="22" r="10" fill="#FF69B4" />
              <circle cx="30" cy="22" r="7" fill="#FF1493" />
              <circle cx="30" cy="22" r="4" fill="#FFB6C1" />
            </>
          )}
        </>
      )}
      
      {/* Water indicator */}
      {plant.water < 30 && (
        <text x="30" y="10" textAnchor="middle" fontSize="12">💧</text>
      )}
    </svg>
  );
};

export default function GardenGame({ yardId, carrots: initialCarrots = 0, pet, profile, bankAccounts = [], user }: RoomViewProps) {
  const router = useRouter();
  const supabase = createClient();
  
  const isAdmin = user?.email === '2landonl10@gmail.com';
  const [carrots, setCarrots] = useState(isAdmin ? 999999 : initialCarrots);
  const [coins, setCoins] = useState(0);
  
  const [plants, setPlants] = useState<Plant[]>([
    { id: '1', type: 'carrot', stage: 'seed', growth: 0, water: 50, plantedAt: Date.now() },
    { id: '2', type: 'tomato', stage: 'sprout', growth: 20, water: 40, plantedAt: Date.now() },
  ]);
  
  const [selectedSeed, setSelectedSeed] = useState<keyof typeof PLANT_CONFIG | null>(null);
  const [showShop, setShowShop] = useState(false);
  const [saveAmount, setSaveAmount] = useState(10);

  const waterPlant = (plantId: string) => {
    const plant = plants.find(p => p.id === plantId);
    if (!plant) return;
    
    const cost = PLANT_CONFIG[plant.type].waterCost;
    if (carrots < cost && !isAdmin) return;
    
    if (!isAdmin) setCarrots(c => c - cost);
    
    setPlants(prev => prev.map(p => {
      if (p.id === plantId) {
        const newWater = Math.min(100, p.water + 40);
        const newGrowth = Math.min(100, p.growth + 15);
        
        // Determine stage
        let newStage: PlantStage = 'seed';
        for (const [stage, threshold] of Object.entries(STAGE_THRESHOLDS)) {
          if (newGrowth >= threshold) {
            newStage = stage as PlantStage;
          }
        }
        
        return { ...p, water: newWater, growth: newGrowth, stage: newStage };
      }
      return p;
    }));
  };
  
  const harvestPlant = (plantId: string) => {
    const plant = plants.find(p => p.id === plantId);
    if (!plant || plant.stage !== 'harvest') return;
    
    const value = PLANT_CONFIG[plant.type].value;
    setCoins(c => c + value);
    
    // Reset to empty plot or remove
    setPlants(prev => prev.filter(p => p.id !== plantId));
  };
  
  const plantSeed = (type: keyof typeof PLANT_CONFIG) => {
    if (carrots < 3 && !isAdmin) return;
    if (!isAdmin) setCarrots(c => c - 3);
    
    const newPlant: Plant = {
      id: Date.now().toString(),
      type,
      stage: 'seed',
      growth: 0,
      water: 50,
      plantedAt: Date.now(),
    };
    
    setPlants(prev => [...prev, newPlant]);
    setSelectedSeed(null);
  };
  
  const handleSave = () => {
    // Simulate saving - in real app this would be a bank transfer
    const earned = Math.floor(saveAmount / 5);
    setCarrots(c => c + earned);
    alert(`Saved $${saveAmount}! Got ${earned} water credits.`);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-sky-200 to-green-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-orange-100 px-3 py-1 rounded-full">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-orange-600">{carrots}</span>
          </div>
          <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
            <Coins className="w-4 h-4 text-yellow-600" />
            <span className="font-bold text-yellow-700">{coins}</span>
          </div>
        </div>
        <button onClick={handleSignOut} className="text-sm text-gray-600">Logout</button>
      </div>

      {/* Garden Grid */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {plants.map(plant => {
            const config = PLANT_CONFIG[plant.type];
            const canHarvest = plant.stage === 'harvest';
            const needsWater = plant.water < 40;
            
            return (
              <div 
                key={plant.id}
                className={`relative bg-gradient-to-b from-amber-100 to-amber-200 rounded-2xl p-4 h-48 shadow-lg ${canHarvest ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}
              >
                {/* Plant */}
                <div className="h-32">
                  <PlantSVG plant={plant} stage={plant.stage} />
                </div>
                
                {/* Info */}
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-xs font-bold text-amber-800 capitalize">{config.name}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/50 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${plant.growth}%` }} />
                    </div>
                    <span className="text-[10px] text-amber-700">{Math.floor(plant.growth)}%</span>
                  </div>
                </div>
                
                {/* Action button */}
                {canHarvest ? (
                  <button 
                    onClick={() => harvestPlant(plant.id)}
                    className="absolute top-2 right-2 bg-yellow-400 text-white p-2 rounded-full shadow-lg animate-bounce"
                  >
                    <Coins className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    onClick={() => waterPlant(plant.id)}
                    disabled={carrots < config.waterCost && !isAdmin}
                    className={`absolute top-2 right-2 p-2 rounded-full shadow-lg transition-transform active:scale-90 ${
                      needsWater ? 'bg-blue-500 text-white animate-pulse' : 'bg-white/80 text-blue-500'
                    } ${carrots < config.waterCost && !isAdmin ? 'opacity-50' : ''}`}
                  >
                    <Droplets className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
          
          {/* Empty plot / Plant button */}
          <button 
            onClick={() => setShowShop(true)}
            className="bg-white/40 border-4 border-dashed border-amber-300 rounded-2xl h-48 flex flex-col items-center justify-center hover:bg-white/60 transition-colors"
          >
            <Sprout className="w-12 h-12 text-amber-400 mb-2" />
            <span className="text-sm font-bold text-amber-600">Plant Seed</span>
            <span className="text-xs text-amber-500">3 💧</span>
          </button>
        </div>
      </div>

      {/* Save to get water */}
      <div className="px-4 pb-2">
        <div className="bg-white rounded-xl p-3 shadow-lg">
          <p className="text-xs text-gray-500 mb-2">Save money to get water credits</p>
          <div className="flex gap-2">
            <input
              type="number"
              value={saveAmount}
              onChange={(e) => setSaveAmount(Math.max(1, parseInt(e.target.value) || 0))}
              className="flex-1 bg-gray-100 rounded-lg px-3 py-2 text-center font-bold"
            />
            <button
              onClick={handleSave}
              className="bg-green-500 text-white font-bold px-4 py-2 rounded-lg active:scale-95"
            >
              Save +{Math.floor(saveAmount / 5)}💧
            </button>
          </div>
        </div>
      </div>

      {/* Seed Shop Modal */}
      {showShop && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-end" onClick={() => setShowShop(false)}>
          <div className="w-full bg-white rounded-t-2xl p-4 max-h-[60vh]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Plant Seeds</h2>
              <button onClick={() => setShowShop(false)}><X className="w-6 h-6" /></button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(PLANT_CONFIG).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => plantSeed(type as keyof typeof PLANT_CONFIG)}
                  disabled={carrots < 3 && !isAdmin}
                  className="bg-gradient-to-br from-green-50 to-amber-50 border-2 border-green-200 rounded-xl p-4 flex flex-col items-center disabled:opacity-50"
                >
                  <div className="w-16 h-16 mb-2">
                    {type === 'carrot' && <div className="w-full h-full bg-orange-400 rounded-full" />}
                    {type === 'tomato' && <div className="w-full h-full bg-red-400 rounded-full" />}
                    {type === 'sunflower' && <div className="w-full h-full bg-yellow-400 rounded-full" />}
                    {type === 'rose' && <div className="w-full h-full bg-pink-400 rounded-full" />}
                  </div>
                  <p className="font-bold text-gray-800">{config.name}</p>
                  <p className="text-xs text-gray-500">Sells for {config.value}🪙</p>
                  <p className="text-xs text-orange-600 font-bold">3 💧 to plant</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
