import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import '../styles/ResourcesPage.css';

function ResourcesPage({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="container">
      <NavBar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <div className="resources-container">
        <h1>Additional Resources</h1>
        <div className="resources-grid">
          <div className="resource-card" onClick={() => navigate('/success-stories')}>
            <div className="resource-icon">🌟</div>
            <h3>Causes of Mental Health Issues</h3>
            <p>Understand the key factors—stress, trauma, and genetics—that can impact your mental health and emotional well-being.</p>
          </div>
          <div className="resource-card" onClick={() => navigate('/study-techniques')}>
            <div className="resource-icon">🎯</div>
            <h3>Techniques To Overcome</h3>
            <p>Learn effective techniques to manage and overcome mental health challenges.</p>
          </div>
          <div className="resource-card" onClick={() => navigate('/mood-game')}>
            <div className="resource-icon">🎮</div>
            <h3>Smile & Play</h3>
            <p>Play our specially designed game to lift your spirits and reduce stress.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResourcesPage;