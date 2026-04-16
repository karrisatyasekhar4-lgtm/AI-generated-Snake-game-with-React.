import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  accentColor: string;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange, accentColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    onScoreChange(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          if (isGameOver) resetGame();
          else setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (direction) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Check collisions
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE ||
          prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            onScoreChange(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [direction, food, isGameOver, isPaused, generateFood, onScoreChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#ff4444';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff4444';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? accentColor : `${accentColor}cc`;
      ctx.shadowBlur = index === 0 ? 20 : 10;
      ctx.shadowColor = accentColor;
      
      const padding = 2;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
    });
    ctx.shadowBlur = 0;

    // Watermark "snake game" in the middle
    ctx.strokeStyle = 'rgba(100, 150, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(canvas.width / 2 - 70, canvas.height / 2 - 50, 140, 60);
    ctx.fillStyle = 'rgba(100, 150, 255, 0.6)';
    ctx.font = 'bold 20px "Inter"';
    ctx.textAlign = 'center';
    ctx.fillText('snake game', canvas.width / 2, canvas.height / 2 - 15);

    if (isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.shadowBlur = 30;
      ctx.shadowColor = '#ff4444';
      ctx.fillStyle = '#ff4444';
      ctx.font = 'bold 36px "JetBrains Mono"';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);
      
      ctx.shadowBlur = 15;
      ctx.shadowColor = accentColor;
      ctx.fillStyle = accentColor;
      ctx.font = '20px "JetBrains Mono"';
      ctx.fillText(`SCORE: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
      
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '10px "JetBrains Mono"';
      ctx.fillText('PRESS SPACE TO RESTART', canvas.width / 2, canvas.height / 2 + 60);
    } else if (isPaused) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.shadowBlur = 40;
      ctx.shadowColor = accentColor;
      ctx.fillStyle = accentColor;
      ctx.font = 'bold 32px "JetBrains Mono"';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2 + 10);
      
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '11px "JetBrains Mono"';
      ctx.fillText('PRESS SPACE TO RESUME', canvas.width / 2, canvas.height / 2 + 45);
    }
  }, [snake, food, isGameOver, isPaused, score, accentColor]);

  return (
    <div className="relative group p-1">
      <div 
        className="absolute inset-0 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"
        style={{ backgroundColor: accentColor }}
      ></div>
      <div 
        className="relative bg-black rounded-[1.5rem] border-2 shadow-2xl overflow-hidden"
        style={{ borderColor: `${accentColor}44`, boxShadow: `0 0 30px ${accentColor}22` }}
      >
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="block"
          id="snake-canvas"
        />
      </div>
    </div>
  );
};
