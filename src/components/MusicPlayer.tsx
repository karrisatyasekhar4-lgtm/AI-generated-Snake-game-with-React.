import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';
import { TRACKS } from '../constants';

interface MusicPlayerProps {
  currentTrackIndex: number;
  onTrackChange: (index: number) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ currentTrackIndex, onTrackChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    handleNext();
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    onTrackChange((currentTrackIndex + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    onTrackChange((currentTrackIndex - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    if (audioRef.current) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
    }
  };

  return (
    <div className="w-full max-w-md bg-[#151619] border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-20 transition-colors duration-1000"
        style={{ backgroundColor: currentTrack.color }}
      />
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      <div className="flex flex-col gap-6 relative z-10">
        {/* Track Info */}
        <div className="flex items-center gap-4">
          <motion.div 
            key={currentTrack.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg border border-white/10 relative"
            style={{ boxShadow: `0 0 20px ${currentTrack.color}33` }}
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg tracking-tight truncate">{currentTrack.title}</h3>
            <p className="text-white/50 text-sm font-medium">{currentTrack.artist}</p>
          </div>
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10"
            style={{ color: currentTrack.color }}
          >
            <Music size={18} />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white hover:accent-opacity-80 transition-all"
            style={{ 
              backgroundImage: `linear-gradient(to right, ${currentTrack.color} ${progress}%, transparent ${progress}%)` 
            }}
          />
          <div className="flex justify-between text-[10px] font-mono text-white/30 uppercase tracking-widest">
            <span>{Math.floor((audioRef.current?.currentTime || 0) / 60)}:{(Math.floor((audioRef.current?.currentTime || 0) % 60)).toString().padStart(2, '0')}</span>
            <span>{Math.floor((audioRef.current?.duration || 0) / 60)}:{(Math.floor((audioRef.current?.duration || 0) % 60)).toString().padStart(2, '0')}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-4">
          <button 
            onClick={handlePrev}
            className="p-2 text-white/60 hover:text-white transition-colors"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-16 h-16 rounded-full flex items-center justify-center bg-white text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            {isPlaying ? <Pause size={28} fill="black" /> : <Play size={28} fill="black" className="ml-1" />}
          </button>

          <button 
            onClick={handleNext}
            className="p-2 text-white/60 hover:text-white transition-colors"
          >
            <SkipForward size={24} />
          </button>
        </div>

        {/* Volume / Extra */}
        <div className="flex items-center gap-3 pt-2 border-t border-white/5">
          <Volume2 size={14} className="text-white/30" />
          <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-white/20 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
};
