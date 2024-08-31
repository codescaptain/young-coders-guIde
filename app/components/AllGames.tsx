import { t } from 'i18next';
import React from 'react';
import { Link } from 'react-router-dom';

const games = [
  { name: "Picture Matching", icon: "🖼️", description: "Match the Pictures", page: "/games/shape-matching" },
  { name: "Maze Game", icon: "🌀", description: "Find the Way Out", page: "/games/labyrinthes"  },
  { name: "Coding Adventure", icon: "💻", description: "Learn to code by solving puzzles", page: "/games/coding-adventure"  },
  { name: "Robotics Builder", icon: "🤖", description: "Create and program your own robots", page: "/games/robot-builder-game"  },
];

const GamesSection: React.FC = () => {
  return (
    <section className="all-games-section">
      <h2 className="all-games-title">{t('games')}</h2>
      <div className="all-games-container">
        <div className="all-games-left">
          <img src="/images/all-games.jpg" alt="Main Game Visual" className="all-games-image" />
        </div>
        <div className="all-games-right">
          <div className="all-games-grid">
            {games.map((game, index) => (
              <Link key={index} to={game.page} className="all-games-card">
                <div className="all-games-icon">{game.icon}</div>
                <h3 className="all-games-card-title">{game.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GamesSection;
