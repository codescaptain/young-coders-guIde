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
    { title: "Meyve Toplama Macerası" },
    { name: "description", content: "Çocuklar için eğlenceli bir meyve toplama oyunu!" },
  ];
};

const MAZE_SIZE = 5;

const generateRandomMaze = () => {
  const maze = Array(MAZE_SIZE).fill(null).map(() => Array(MAZE_SIZE).fill(' '));
  
  // Add walls
  for (let i = 0; i < MAZE_SIZE; i++) {
    for (let j = 0; j < MAZE_SIZE; j++) {
      if (Math.random() < 0.3) { // 30% chance of a wall
        maze[i][j] = 'W';
      }
    }
  }

  maze[0][0] = 'P'; // Start
  maze[MAZE_SIZE-1][MAZE_SIZE-1] = 'E'; // End

  // Ensure there's a path (this is a simple approach and might not always create a solvable maze)
  for (let i = 0; i < MAZE_SIZE - 1; i++) {
    maze[i][i+1] = ' ';
    maze[i+1][i] = ' ';
  }

  return maze;
};

const DIRECTION_EMOJIS: { [key: string]: string } = {
  up: '⬆️',
  right: '➡️',
  down: '⬇️',
  left: '⬅️'
};

export default function Labyrinth() {
  const { t } = useTranslation();
  const [maze, setMaze] = useState(() => generateRandomMaze());
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [commands, setCommands] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<'planning' | 'running' | 'won' | 'lost'>('planning');
  const [warning, setWarning] = useState<string | null>(null);

  const isValidMove = (x: number, y: number) => {
    return x >= 0 && x < MAZE_SIZE && y >= 0 && y < MAZE_SIZE && maze[y][x] !== 'W';
  };

  const addCommand = useCallback((direction: string) => {
    if (gameStatus === 'planning') {
      setCommands(prevCommands => [...prevCommands, direction]);
      setWarning(null);
    }
  }, [gameStatus]);

  const runCommands = useCallback(() => {
    setGameStatus('running');
    let currentX = 0;
    let currentY = 0;
    
    const executeNextCommand = (index: number) => {
      if (index >= commands.length) {
        if (maze[currentY][currentX] === 'E') {
          setGameStatus('won');
        } else {
          setGameStatus('lost');
          setWarning(t('notReachedExit'));
        }
        return;
      }

      const command = commands[index];
      let newX = currentX;
      let newY = currentY;

      switch(command) {
        case 'up': newY--; break;
        case 'down': newY++; break;
        case 'left': newX--; break;
        case 'right': newX++; break;
      }
      
      if (!isValidMove(newX, newY)) {
        setGameStatus('lost');
        setWarning(t('outOfBoundsOrHitWall'));
        return;
      }

      currentX = newX;
      currentY = newY;
      setPlayerPosition({ x: currentX, y: currentY });
      
      setTimeout(() => executeNextCommand(index + 1), 500); // 500ms gecikme ile bir sonraki komutu çalıştır
    };

    executeNextCommand(0);
  }, [commands, maze, t]);

  const resetGame = useCallback(() => {
    const newMaze = generateRandomMaze();
    setMaze(newMaze);
    setPlayerPosition({ x: 0, y: 0 });
    setCommands([]);
    setGameStatus('planning');
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
      <h1>{t('fruitAdventureTitle')}</h1>
      <p>{t('fruitAdventureInstructions')}</p>
      {warning && <div className="warning">{warning}</div>}
      <div className="game-status">
        {gameStatus === 'won' && <p className="success">{t('gameWon')}</p>}
        {gameStatus === 'lost' && <p className="error">{t('gameLost')}</p>}
      </div>
      <div className="game-board">
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
                {x === playerPosition.x && y === playerPosition.y ? '🐰' :
                 cell === 'E' ? '🍎' : cell === 'W' ? '🌳' : ''}
              </div>
            ))
          ))}
        </div>
      </div>
      <div className="controls">
        <button onClick={() => addCommand('up')} disabled={gameStatus !== 'planning'}>⬆️</button>
        <button onClick={() => addCommand('right')} disabled={gameStatus !== 'planning'}>➡️</button>
        <button onClick={() => addCommand('down')} disabled={gameStatus !== 'planning'}>⬇️</button>
        <button onClick={() => addCommand('left')} disabled={gameStatus !== 'planning'}>⬅️</button>
        <button onClick={runCommands} disabled={gameStatus !== 'planning' || commands.length === 0} className="go-button">{t('go')}</button>
        <button onClick={resetGame} className="reset-button">🔄</button>
      </div>
      <div className="command-list">
        {commands.map((command, index) => (
          <span key={index} className="command">{DIRECTION_EMOJIS[command]}</span>
        ))}
      </div>
    </div>
  );
}