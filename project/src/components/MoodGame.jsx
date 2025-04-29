import React, { useState } from 'react';
import NavBar from './NavBar';
import '../styles/MoodGames.css';

function MoodGame({ isAuthenticated, onLogout }) {
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Click the happy faces to boost your mood!');
  const [activeEmojis, setActiveEmojis] = useState(Array(9).fill(true));

  const handleClick = (index) => {
    if (!activeEmojis[index]) return;

    // Increase score safely
    setScore((prevScore) => prevScore + 1);

    // Random motivational message
    const messages = [
      "You're doing great!", "Keep going!", "Fantastic job!",
      "You're amazing!", "Feel the positivity!", "Awesome click!",
      "Mood lifted!", "Way to go!",
    ];
    setMessage(messages[Math.floor(Math.random() * messages.length)]);

    // Deactivate clicked emoji
    setActiveEmojis((prevEmojis) => {
      const newActiveEmojis = [...prevEmojis];
      newActiveEmojis[index] = false;
      return newActiveEmojis;
    });

    // Reactivate emoji after delay
    setTimeout(() => {
      setActiveEmojis((prevEmojis) => {
        const newActiveEmojis = [...prevEmojis];
        newActiveEmojis[index] = true;
        return newActiveEmojis;
      });
    }, 750);
  };

  return (
    <div className="container">
      <NavBar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <div className="game-container">
        <h1>Smile & Play</h1>
        <div className="game-score">Score: {score}</div>
        <p className="game-message">{message}</p>
        <div className="game-grid">
          {activeEmojis.map((isActive, index) => (
            <button
              key={index}
              className={`emoji-button ${!isActive ? 'inactive' : ''}`}
              onClick={() => handleClick(index)}
              disabled={!isActive}
            >
              😊
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MoodGame;
