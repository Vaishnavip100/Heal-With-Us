import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NavBar from './NavBar';
import '../styles/LandingPage.css';

function LandingPage({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();

  const quickTools = [
    {
      title: "Breathing Exercise",
      description: "Take a moment to breathe and center yourself",
      icon: "🫁",
      duration: "2 minutes"
    },
    {
      title: "Quick Meditation",
      description: "A short guided meditation for instant calm",
      icon: "🧘‍♀️",
      duration: "5 minutes"
    },
    {
      title: "Gratitude Check",
      description: "List out yourself three things you're grateful for today",
      icon: "🙏",
      duration: "1 minute"
    }
  ];

  return (
    <div className="container">
      <NavBar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <div className="hero">
        <h1>Welcome to Heal With Us</h1>
        <p>
          Embark on your path to inner peace and mental well-being.
          Join our community of mindful individuals dedicated to balance and growth.
        </p>
        <div className="hero-cta">Start Your Healing Journey Today!</div>
        <div className="features">
          {/* Card 1: Emotional Support */}
          <div
            className="feature-card clickable"
            onClick={() => navigate('/chatbot')}
            style={{ cursor: 'pointer' }}
          >
            <div className="feature-icon">♡</div>
            <h3 className="feature-title">Emotional Support</h3>
            <p className="feature-description">
              Get compassionate guidance and support for your emotional well-being,
              available 24/7 whenever you need it.
            </p>
            <p className="click-hint">
              {isAuthenticated ? 'Click to start chatting' : 'Log in to start chatting'}
            </p>
          </div>

          {/* Card 2: Inner Strength (Quotes) */}
          <div
            className="feature-card clickable"
            onClick={() => isAuthenticated ? navigate('/quotes') : navigate('/login')}
            style={{ cursor: 'pointer' }}
          >
            <div className="feature-icon">💪🏼</div>
            <h3 className="feature-title">Inner Strength</h3>
            <p className="feature-description">
              Transform challenges into opportunities with proven strategies for
              self-discovery and development.
            </p>
            <p className="click-hint">
              {isAuthenticated ? 'Click to view inspiring quotes' : 'Log in to view quotes'}
            </p>
          </div>

          {/* Card 3: Support Network */}
          <div
            className="feature-card clickable"
            onClick={() => navigate('/support-network')}
            style={{ cursor: 'pointer' }}
          >
            <div className="feature-icon">🛡️</div>
            <h3 className="feature-title">Support Network</h3>
            <p className="feature-description">
              Access professional help, support groups, and resources for mental health support.
            </p>
            <p className="click-hint">
              {isAuthenticated ? 'Click to view support resources' : 'Log in to view support resources'}
            </p>
          </div>
        </div>
      </div>

      {/* Community Chat Section */}
      <div 
        className="community-chat-section"
        onClick={() => isAuthenticated ? navigate('/community-chat') : navigate('/login', { state: { from: '/community-chat' } })}
        style={{ cursor: 'pointer' }}
      >
        <h2 className="community-chat-title">Community Chat</h2>
        <div className="community-chat-content">
          <p className="community-chat-description">
            Join our supportive community where you can connect with others, share experiences,
            and find understanding in a safe, moderated environment.
            <div className="warning-container">
              <p className="chat-warning">NOTE:- DON'T SHARE YOUR PERSONAL INFORMATION.</p>
              <p className="chat-warning">SHARE IT AT YOUR OWN RISK.</p>
            </div>
          </p>
          <p className="click-hint">
            {isAuthenticated ? 'Click to join community chat' : 'Log in to join community chat'}
          </p>
        </div>
      </div>

      <div className="quick-tools-section">
        <h2>Quick Tools for Well-being</h2>
        <div className="tools-wrapper">
          {quickTools.map((tool, index) => (
            <div key={index} className="tool-card">
              <div className="tool-icon">{tool.icon}</div>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
              <p className="tool-duration"><em>Duration: {tool.duration}</em></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;