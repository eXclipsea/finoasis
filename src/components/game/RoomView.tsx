'use client';

import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, X } from 'lucide-react';
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

// Simple geometric reward icons
const REWARD_ICONS: Record<string, React.FC<{className?: string}>> = {
  carrot: ({ className }) => (
    <svg viewBox="0 0 40 40" className={className}>
      <ellipse cx="20" cy="25" rx="10" ry="15" fill="#FF8C42" stroke="#CC5500" strokeWidth="2"/>
      <path d="M20 10 L18 5 L22 5 Z" fill="#228B22"/>
    </svg>
  ),
  coin: ({ className }) => (
    <svg viewBox="0 0 40 40" className={className}>
      <circle cx="20" cy="20" r="16" fill="#FFD700" stroke="#B8860B" strokeWidth="2"/>
      <text x="20" y="26" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#B8860B">$</text>
    </svg>
  ),
  gem: ({ className }) => (
    <svg viewBox="0 0 40 40" className={className}>
      <path d="M20 5 L35 15 L20 35 L5 15 Z" fill="#40E0D0" stroke="#008B8B" strokeWidth="2"/>
      <path d="M20 5 L20 15 L35 15" fill="#48D1CC" opacity="0.5"/>
    </svg>
  ),
  star: ({ className }) => (
    <svg viewBox="0 0 40 40" className={className}>
      <path d="M20 3 L25 15 L38 15 L28 23 L32 36 L20 28 L8 36 L12 23 L2 15 L15 15 Z" fill="#FFD700" stroke="#DAA520" strokeWidth="2"/>
    </svg>
  ),
  heart: ({ className }) => (
    <svg viewBox="0 0 40 40" className={className}>
      <path d="M20 35 L8 22 C3 16 3 8 10 5 C15 3 18 7 20 10 C22 7 25 3 30 5 C37 8 37 16 32 22 Z" fill="#FF69B4" stroke="#C71585" strokeWidth="2"/>
    </svg>
  ),
  crown: ({ className }) => (
    <svg viewBox="0 0 40 40" className={className}>
      <path d="M5 30 L35 30 L32 10 L25 18 L20 8 L15 18 L8 10 Z" fill="#FFD700" stroke="#B8860B" strokeWidth="2"/>
      <circle cx="10" cy="28" r="2" fill="#FF0000"/>
      <circle cx="20" cy="28" r="2" fill="#0000FF"/>
      <circle cx="30" cy="28" r="2" fill="#00FF00"/>
    </svg>
  ),
};

const REWARDS = [
  { id: 'coin', name: '10 Coins', value: 10, icon: 'coin', chance: 0.4 },
  { id: 'carrot', name: '5 Carrots', value: 5, icon: 'carrot', chance: 0.3 },
  { id: 'gem', name: 'Rare Gem', value: 50, icon: 'gem', chance: 0.15 },
  { id: 'star', name: 'Star Power', value: 100, icon: 'star', chance: 0.1 },
  { id: 'heart', name: 'Love Boost', value: 25, icon: 'heart', chance: 0.04 },
  { id: 'crown', name: 'JACKPOT!', value: 500, icon: 'crown', chance: 0.01 },
];

const SPIN_COST = 5;

// Slot machine reel
const Reel = ({ spinning, finalReward, position }: { spinning: boolean; finalReward: any; position: number }) => {
  const offset = position * -80;
  
  return (
    <div className="w-20 h-20 bg-white border-4 border-[#8B4513] rounded-lg overflow-hidden relative shadow-inner">
      <div 
        className="absolute transition-transform duration-100"
        style={{ 
          transform: spinning ? `translateY(${offset}px)` : `translateY(${-80 * REWARDS.findIndex(r => r.id === finalReward?.id)}px)`,
          transition: spinning ? 'none' : 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
      >
        {[...REWARDS, ...REWARDS, ...REWARDS].map((reward, i) => {
          const Icon = REWARD_ICONS[reward.icon];
          return (
            <div key={i} className="w-20 h-20 flex items-center justify-center">
              <Icon className="w-14 h-14" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function GachaGame({ yardId, carrots: initialCarrots = 0, pet, profile, bankAccounts = [], user }: RoomViewProps) {
  const router = useRouter();
  const supabase = createClient();
  
  const isAdmin = user?.email === '2landonl10@gmail.com';
  const [carrots, setCarrots] = useState(isAdmin ? 999999 : initialCarrots);
  const [inventory, setInventory] = useState<{id: string; icon: string; name: string; value: number}[]>([]);
  const [showInventory, setShowInventory] = useState(false);
  
  // Slot machine state
  const [reels, setReels] = useState([REWARDS[0], REWARDS[0], REWARDS[0]]);
  const [spinning, setSpinning] = useState(false);
  const [spinPositions, setSpinPositions] = useState([0, 0, 0]);
  const [lastWin, setLastWin] = useState<any>(null);
  const [showWinModal, setShowWinModal] = useState(false);
  const [jackpot, setJackpot] = useState(false);
  
  // Bank connection for "Save to Spin"
  const [savingsAmount, setSavingsAmount] = useState(10);

  const spin = async () => {
    if (spinning) return;
    if (carrots < SPIN_COST && !isAdmin) return;
    
    if (!isAdmin) setCarrots(c => c - SPIN_COST);
    setSpinning(true);
    setJackpot(false);
    setLastWin(null);
    
    // Animate
    const duration = 2000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Random positions during spin
      setSpinPositions([
        Math.floor(Math.random() * REWARDS.length * 3),
        Math.floor(Math.random() * REWARDS.length * 3),
        Math.floor(Math.random() * REWARDS.length * 3)
      ]);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Final result
        const results = [
          weightedRandom(),
          weightedRandom(),
          weightedRandom()
        ];
        setReels(results);
        setSpinPositions(results.map(r => REWARDS.findIndex(x => x.id === r.id)));
        setSpinning(false);
        
        // Calculate win
        const allMatch = results[0].id === results[1].id && results[1].id === results[2].id;
        const twoMatch = results[0].id === results[1].id || results[1].id === results[2].id || results[0].id === results[2].id;
        
        if (allMatch) {
          // Jackpot - 10x value
          const winValue = results[0].value * 10;
          setCarrots(c => c + winValue);
          setLastWin({ ...results[0], winValue });
          setJackpot(true);
          setShowWinModal(true);
          setInventory(prev => [...prev, results[0], results[0], results[0]]);
        } else if (twoMatch) {
          // Small win - 2x value
          const matched = results[0].id === results[1].id ? results[0] : results[1];
          const winValue = matched.value * 2;
          setCarrots(c => c + winValue);
          setLastWin({ ...matched, winValue });
          setShowWinModal(true);
          setInventory(prev => [...prev, matched, matched]);
        } else {
          // No win - but give consolation item
          setInventory(prev => [...prev, results[0]]);
        }
      }
    };
    
    requestAnimationFrame(animate);
  };
  
  const weightedRandom = () => {
    const rand = Math.random();
    let cumulative = 0;
    for (const reward of REWARDS) {
      cumulative += reward.chance;
      if (rand <= cumulative) return reward;
    }
    return REWARDS[0];
  };

  const handleSaveToSpin = () => {
    // In real app, this would trigger a bank transfer
    // For now, simulate saving money
    const earnedCarrots = Math.floor(savingsAmount / 2);
    setCarrots(c => c + earnedCarrots);
    alert(`Saved $${savingsAmount}! Earned ${earnedCarrots} carrots.`);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#1a1a2e] to-[#16213e]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#FF8C42] to-[#CC5500]" />
          <span className="font-bold text-white">{carrots}</span>
        </div>
        <button onClick={() => setShowInventory(true)} className="bg-white/10 px-3 py-1.5 rounded-full text-white text-sm">
          Inventory ({inventory.length})
        </button>
      </div>

      {/* Main slot machine */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Machine frame */}
        <div className="bg-gradient-to-b from-[#8B4513] to-[#654321] p-4 rounded-2xl shadow-2xl border-4 border-[#4a3010]">
          {/* Glass window */}
          <div className="bg-[#2a2a3a] p-4 rounded-xl border-4 border-[#4a3010] mb-4">
            <div className="flex gap-2">
              {reels.map((reward, i) => (
                <Reel key={i} spinning={spinning} finalReward={reward} position={spinPositions[i]} />
              ))}
            </div>
          </div>
          
          {/* Lever */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={spin}
              disabled={spinning || (carrots < SPIN_COST && !isAdmin)}
              className="flex-1 bg-gradient-to-b from-[#FF8C42] to-[#CC5500] text-white font-black py-4 px-8 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
            >
              {spinning ? 'SPINNING...' : `SPIN (${SPIN_COST} 🥕)`}
            </button>
          </div>
        </div>

        {/* Save to earn more */}
        <div className="mt-8 bg-white/10 rounded-xl p-4 w-full max-w-sm">
          <p className="text-white/60 text-sm mb-2 text-center">Save money to earn carrots</p>
          <div className="flex gap-2">
            <input
              type="number"
              value={savingsAmount}
              onChange={(e) => setSavingsAmount(Math.max(1, parseInt(e.target.value) || 0))}
              className="flex-1 bg-white/20 text-white rounded-lg px-3 py-2 text-center font-bold"
            />
            <button
              onClick={handleSaveToSpin}
              className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg active:scale-95"
            >
              Save & Earn
            </button>
          </div>
          <p className="text-white/40 text-xs mt-2 text-center">Save ${savingsAmount} → Get {Math.floor(savingsAmount / 2)} carrots</p>
        </div>
      </div>

      {/* Win modal */}
      {showWinModal && lastWin && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowWinModal(false)}>
          <div className="bg-white rounded-2xl p-6 text-center animate-bounce">
            {jackpot && <p className="text-3xl font-black text-[#FFD700] mb-2">JACKPOT!</p>}
            <p className="text-xl font-bold text-[#333] mb-4">You won!</p>
            <div className="flex justify-center mb-4">
              {(() => {
                const Icon = REWARD_ICONS[lastWin.icon];
                return <Icon className="w-20 h-20" />;
              })()}
            </div>
            <p className="text-2xl font-black text-[#FF8C42]">+{lastWin.winValue} 🥕</p>
            <p className="text-sm text-gray-500 mt-2">Tap anywhere to continue</p>
          </div>
        </div>
      )}

      {/* Inventory modal */}
      {showInventory && (
        <div className="absolute inset-0 bg-black/80 z-50" onClick={() => setShowInventory(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Your Collection</h2>
              <button onClick={() => setShowInventory(false)}><X /></button>
            </div>
            {inventory.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Spin to win items!</p>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {inventory.map((item, i) => {
                  const Icon = REWARD_ICONS[item.icon];
                  return (
                    <div key={i} className="bg-gray-100 rounded-lg p-2 flex flex-col items-center">
                      <Icon className="w-10 h-10" />
                      <span className="text-[10px] text-gray-600 mt-1 text-center">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <div className="flex justify-center gap-4 pb-6 pt-2">
        <button onClick={() => {}} className="px-4 py-2 bg-white/10 rounded-full text-white text-sm">Spin</button>
        <button onClick={() => setShowInventory(true)} className="px-4 py-2 bg-white/10 rounded-full text-white text-sm">Collection</button>
        <button onClick={handleSignOut} className="px-4 py-2 bg-white/10 rounded-full text-white text-sm">Logout</button>
      </div>
    </div>
  );
}
