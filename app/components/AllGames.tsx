import React from 'react';

const games = [
  { name: "Picture Matching", icon: "🖼️", description: "Match the Pictures" },
  { name: "Maze Game", icon: "🌀", description: "Find the Way Out" },
  { name: "Coding Adventure", icon: "💻", description: "Learn to code by solving puzzles" },
  { name: "Robotics Builder", icon: "🤖", description: "Create and program your own robots" },
];

const GamesSection: React.FC = () => {
  return (
    <section className="all-games-section">
        <h2 className="all-games-title">Children's Games</h2>
      <div className="all-games-container">
        <div className="all-games-left">
          <img src="/images/all-games.jpg" alt="Main Game Visual" className="all-games-image" />
        </div>
        <div className="all-games-right">
          <div className="all-games-grid">
            {games.map((game, index) => (
              <div key={index} className="all-games-card">
                <div className="all-games-icon">{game.icon}</div>
                <h3 className="all-games-card-title">{game.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GamesSection;
