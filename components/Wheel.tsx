import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { User } from '../types';
import { calculateWeights } from '../services/storage';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface WheelProps {
  users: User[];
  onSpinEnd: (winnerId: string) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

export const Wheel: React.FC<WheelProps> = ({ users, onSpinEnd, isSpinning, setIsSpinning }) => {
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<User | null>(null);
  
  // Calculate segments based on weights
  const segments = useMemo(() => calculateWeights(users), [users]);

  // Prepare Chart.js data
  const data: ChartData<'doughnut'> = {
    labels: segments.map(s => s.name),
    datasets: [
      {
        data: segments.map(s => s.probability * 100), // Use percentages for visualization
        backgroundColor: segments.map(s => s.color),
        borderColor: '#2C3A47', // Brutal Dark
        borderWidth: 3, // Thick border
        hoverOffset: 0,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    rotation: 0,
    layout: {
      padding: 20
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#2C3A47',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#000',
        borderWidth: 0,
        cornerRadius: 0, // Boxy tooltip
        displayColors: false,
        padding: 12,
        callbacks: {
          label: (item) => {
            const val = item.raw as number;
            return `${item.label}: ${val.toFixed(1)}%`;
          }
        }
      },
      datalabels: {
        color: '#2C3A47',
        font: {
          weight: '900',
          size: 16,
          family: 'Inter',
        },
        formatter: (value, ctx) => {
          if (value < 4) return ''; 
          return ctx.chart.data.labels?.[ctx.dataIndex];
        },
        anchor: 'center',
        align: 'center',
        backgroundColor: '#F5F6FA',
        borderRadius: 0,
        borderWidth: 2,
        borderColor: '#2C3A47',
        padding: {
          top: 4,
          bottom: 4,
          left: 8,
          right: 8
        },
        offset: 0,
      },
    },
    cutout: '25%', 
  };

  const handleSpin = () => {
    if (isSpinning || users.length === 0) return;

    setIsSpinning(true);
    setWinner(null);

    // 1. Determine Winner based on weights logic
    const random = Math.random();
    let accumulatedProbability = 0;
    let selectedIndex = -1;

    for (let i = 0; i < segments.length; i++) {
      accumulatedProbability += segments[i].probability;
      if (random <= accumulatedProbability) {
        selectedIndex = i;
        break;
      }
    }
    
    if (selectedIndex === -1) selectedIndex = segments.length - 1;

    const selectedSegment = segments[selectedIndex];
    
    // 2. Calculate rotation
    let angleStart = 0;
    for (let i = 0; i < selectedIndex; i++) {
      angleStart += segments[i].probability * 360;
    }
    const angleSize = selectedSegment.probability * 360;
    const angleCenter = angleStart + (angleSize / 2);

    const baseSpins = 5; 
    const randomOffset = (Math.random() - 0.5) * (angleSize * 0.8); 
    const targetAngle = angleCenter + randomOffset;
    
    const currentRotationMod = rotation % 360;
    const distToTarget = (360 - targetAngle) - currentRotationMod;
    
    let finalRotationDelta = distToTarget;
    if (finalRotationDelta < 0) {
      finalRotationDelta += 360;
    }
    
    const totalRotation = rotation + finalRotationDelta + (baseSpins * 360);
    
    setRotation(totalRotation);

    // 3. Wait for animation
    setTimeout(() => {
      setIsSpinning(false);
      setWinner(selectedSegment);
      onSpinEnd(selectedSegment.id);
    }, 4000); 
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-4">
      {/* Pointer */}
      <div className="relative z-10 translate-y-7">
        <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-brutal-dark drop-shadow-[0_4px_0_rgba(0,0,0,0.2)]"></div>
      </div>

      {/* Wheel Container */}
      <div className="relative w-full aspect-square max-w-[450px]">
        {/* Background decorative circle */}
        <div className="absolute inset-0 rounded-full border-4 border-brutal-dark bg-white shadow-hard-lg"></div>

        <div 
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0, 0.2, 1)' : 'none' 
          }}
          className="w-full h-full p-1"
        >
          <Doughnut data={data} options={options} />
        </div>
        
        {/* Center Button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button 
            onClick={handleSpin}
            disabled={isSpinning || users.length === 0}
            className={`pointer-events-auto w-24 h-24 rounded-full border-4 border-brutal-dark flex items-center justify-center font-black text-xl tracking-widest transition-all transform z-20 shadow-hard
              ${isSpinning 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed translate-y-[4px] translate-x-[4px] shadow-none' 
                : 'bg-brutal-yellow text-brutal-dark hover:bg-yellow-400 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-hard-lg active:translate-y-0 active:translate-x-0 active:shadow-hard'
              }`}
          >
            {isSpinning ? '...' : 'SPIN'}
          </button>
        </div>
      </div>
      
      {/* Winner Display */}
      <div className="h-24 mt-12 w-full flex justify-center">
        {winner && !isSpinning && (
          <div className="animate-[bounce_0.5s_infinite] bg-brutal-coral border-3 border-brutal-dark shadow-hard p-4 rotate-2">
            <p className="text-xs text-white font-bold uppercase tracking-widest mb-1">The Chosen One</p>
            <h2 className="text-4xl font-black text-white uppercase leading-none">{winner.name}</h2>
          </div>
        )}
      </div>
    </div>
  );
};