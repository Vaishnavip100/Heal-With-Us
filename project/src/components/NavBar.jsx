import React from 'react';
import { Link } from 'react-router-dom';
import HeartLogo from './HeartLogo';
import '../styles/NavBar.css';

function NavBar({ isAuthenticated, onLogout }) {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <HeartLogo />
        Heal With Us
      </Link>
      {isAuthenticated ? (
        <div className="nav-buttons">
          <Link to="/resources" className="button button-secondary">
            More Resources
          </Link>
          <button onClick={onLogout} className="button button-secondary">
            Logout
          </button>
        </div>
      ) : (
        <div className="nav-buttons">
          <Link to="/resources" className="button button-secondary">
            More Resources
          </Link>
          <Link to="/login" className="button button-secondary">
            Log In
          </Link>
          <Link to="/signup" className="button button-primary">
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}

export default NavBar;