import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { TRACKS } from './constants';
import { Trophy, Gamepad2, Headphones } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrack = TRACKS[currentTrackIndex];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white selection:text-black overflow-hidden relative">
      {/* Atmospheric Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] blur-[120px] opacity-20 transition-colors duration-1000"
          style={{ backgroundColor: currentTrack.color }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] blur-[120px] opacity-10 transition-colors duration-1000"
          style={{ backgroundColor: '#ff00ff' }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-start mb-12">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 shadow-lg bg-white/5"
              style={{ color: currentTrack.color }}
            >
              <Gamepad2 size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">NEON SLITHER</h1>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mt-1">Arcade & Beats Edition</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">High Score</span>
            <div className="flex items-center gap-2 text-2xl font-black italic">
              <Trophy size={20} className="text-yellow-500" />
              <span>{Math.max(score, 1250)}</span>
            </div>
          </div>
        </header>

        {/* Game and Player Section */}
        <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
          {/* Left Side: Stats & Info (Desktop) */}
          <div className="hidden xl:flex flex-col gap-8 w-64">
            <div className="space-y-4">
              <h2 className="text-xs font-mono text-white/30 uppercase tracking-[0.3em]">Instructions</h2>
              <ul className="space-y-3 text-sm text-white/60 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[10px]">↑</span>
                  Move Up
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[10px]">↓</span>
                  Move Down
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[10px]">←</span>
                  Move Left
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[10px]">→</span>
                  Move Right
                </li>
                <li className="flex items-center gap-2">
                  <span className="px-2 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[10px]">SPACE</span>
                  Pause / Play
                </li>
              </ul>
            </div>
          </div>

          {/* Center: Snake Game */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              {/* Score Overlay - Positioned exactly as in screenshot */}
              <div className="absolute -top-14 left-0 right-0 flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Current Score</span>
                  <span className="text-4xl font-black italic tabular-nums leading-none tracking-tighter" style={{ color: currentTrack.color, textShadow: `0 0 20px ${currentTrack.color}66` }}>
                    {score.toString().padStart(4, '0')}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[9px] font-mono text-white/60 uppercase tracking-widest">Live Session</span>
                </div>
              </div>

              <SnakeGame onScoreChange={setScore} accentColor={currentTrack.color} />
            </div>
          </div>

          {/* Right Side: Music Player */}
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center gap-3 self-start lg:self-center">
              <Headphones size={16} className="text-white/40" />
              <h2 className="text-xs font-mono text-white/30 uppercase tracking-[0.3em]">Now Playing</h2>
            </div>
            <MusicPlayer 
              currentTrackIndex={currentTrackIndex} 
              onTrackChange={setCurrentTrackIndex} 
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-auto py-6 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">
          <span>© 2026 Neon Slither Arcade</span>
          <div className="flex gap-6">
            <span className="hover:text-white/40 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white/40 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-white/40 cursor-pointer transition-colors">Support</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
