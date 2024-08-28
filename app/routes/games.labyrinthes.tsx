import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import confetti from 'canvas-confetti';
import styles from "~/styles/labyrinth.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Labirent Çözme Oyunu" },
    { name: "description", content: "Çocuklar için eğlenceli bir labirent çözme oyunu!" },
  ];
};


const generateRandomMaze = (size: number = 5) => {
  const maze = Array(size).fill(null).map(() => Array(size).fill(' '));
  
  // Add walls
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (Math.random() < 0.3) { // 30% chance of a wall
        maze[i][j] = 'W';
      }
    }
  }

  // Ensure start and end are clear
  maze[0][0] = 'P'; // Start
  maze[size-1][size-1] = 'E'; // End

  // Ensure there's a path (this is a simple approach and might not always create a solvable maze)
  for (let i = 0; i < size - 1; i++) {
    maze[i][i+1] = ' ';
    maze[i+1][i] = ' ';
  }

  return maze;
};

export default function Labyrinth() {
  const { t } = useTranslation();
  const [maze, setMaze] = useState(() => generateRandomMaze());
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [commands, setCommands] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [warning, setWarning] = useState<string | null>(null);

  const isValidMove = (x: number, y: number) => {
    return x >= 0 && x < maze[0].length && y >= 0 && y < maze.length && maze[y][x] !== 'W';
  };

  const addCommand = useCallback((direction: string) => {
    if (gameStatus === 'playing') {
      let newX = playerPosition.x;
      let newY = playerPosition.y;

      switch(direction) {
        case 'up': newY = Math.max(0, newY - 1); break;
        case 'down': newY = Math.min(maze.length - 1, newY + 1); break;
        case 'left': newX = Math.max(0, newX - 1); break;
        case 'right': newX = Math.min(maze[0].length - 1, newX + 1); break;
      }

      if (isValidMove(newX, newY)) {
        setPlayerPosition({ x: newX, y: newY });
        setCommands(prevCommands => [...prevCommands, direction]);
        setWarning(null);
      } else {
        setWarning(t('invalidMove'));
      }
    }
  }, [gameStatus, playerPosition, maze, t]);

  const runCommands = useCallback(() => {
    let currentX = 0;
    let currentY = 0;
    
    for (let command of commands) {
      switch(command) {
        case 'up': currentY = Math.max(0, currentY - 1); break;
        case 'down': currentY = Math.min(maze.length - 1, currentY + 1); break;
        case 'left': currentX = Math.max(0, currentX - 1); break;
        case 'right': currentX = Math.min(maze[0].length - 1, currentX + 1); break;
      }
      
      if (maze[currentY][currentX] === 'W') {
        setGameStatus('lost');
        setWarning(t('hitWall'));
        return;
      }
    }
    
    setPlayerPosition({ x: currentX, y: currentY });
    
    if (maze[currentY][currentX] === 'E') {
      setGameStatus('won');
    } else {
      setGameStatus('lost');
      setWarning(t('notReachedExit'));
    }
  }, [commands, maze, t]);

  const resetGame = useCallback(() => {
    const newMaze = generateRandomMaze();
    setMaze(newMaze);
    setPlayerPosition({ x: 0, y: 0 });
    setCommands([]);
    setGameStatus('playing');
    setWarning(null);
  }, []);

  useEffect(() => {
    if (gameStatus === 'won') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [gameStatus]);

  return (
    <div className="game-container">
      <h1>{t('mazeTitle')}</h1>
      <p>{t('mazeInstructions')}</p>
      <div className="maze">
        {maze.map((row, y) => (
          row.map((cell, x) => (
            <div 
              key={`${x}-${y}`} 
              className={`cell ${
                x === playerPosition.x && y === playerPosition.y ? 'player' :
                cell === 'W' ? 'wall' :
                cell === 'E' ? 'exit' : 'path'
              }`}
            >
              {x === playerPosition.x && y === playerPosition.y ? '😊' :
               cell === 'E' ? '🚪' : ''}
            </div>
          ))
        ))}
      </div>
      <div className="controls">
        <button onClick={() => addCommand('up')} disabled={gameStatus !== 'playing'}>{t('up')}</button>
        <button onClick={() => addCommand('down')} disabled={gameStatus !== 'playing'}>{t('down')}</button>
        <button onClick={() => addCommand('left')} disabled={gameStatus !== 'playing'}>{t('left')}</button>
        <button onClick={() => addCommand('right')} disabled={gameStatus !== 'playing'}>{t('right')}</button>
        <button onClick={runCommands} disabled={gameStatus !== 'playing' || commands.length === 0}>{t('confirm')}</button>
        <button onClick={resetGame}>{t('reset')}</button>
      </div>
      <div className="command-list">
        {t('commands')}: {commands.join(', ')}
      </div>
      {warning && <div className="warning">{warning}</div>}
      <div className="game-status">
        {gameStatus === 'won' && <p className="success">{t('gameWon')}</p>}
        {gameStatus === 'lost' && <p className="error">{t('gameLost')}</p>}
      </div>
    </div>
  );
}