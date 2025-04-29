import React from 'react';
import NavBar from './NavBar';
import '../styles/StudyTechniquesPage.css';

function StudyTechniquesPage({ isAuthenticated, onLogout }) {
  return (
    <div className="container">
      <NavBar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <div className="techniques-container">
        <h1>Effective Techniques To Overcome</h1>
        <div className="techniques-grid">
          <div className="technique-card">
            <h3>Deep Breathing Exercise</h3>
            <p><strong>4-7-8 Breathing:</strong> A simple yet powerful exercise for calmness and stress relief.</p>
            <div className="technique-tips">
              <h4>How to do it:</h4>
              <ul>
                <li>Inhale deeply through your nose (4 seconds).</li>
                <li>Hold your breath (7 seconds).</li>
                <li>Slowly exhale through your mouth with a "whoosh" (8 seconds).</li>
                <li>Repeat 4-5 times.</li>
              </ul>
            </div>
          </div>
          <div className="technique-card">
            <h3>Grounding Technique</h3>
            <p><strong>5-4-3-2-1 Method:</strong> Focus on the present moment to manage anxiety and overwhelming emotions.</p>
            <div className="technique-tips">
              <h4>How to do it:</h4>
              <ul>
                <li><strong>5 things you see:</strong> Look around and name them.</li>
                <li><strong>4 things you touch:</strong> Notice physical sensations.</li>
                <li><strong>3 things you hear:</strong> Listen for distinct sounds.</li>
                <li><strong>2 things you smell:</strong> Identify scents (or recall favorites).</li>
                <li><strong>1 thing you taste:</strong> Focus on taste (or imagine one).</li>
              </ul>
            </div>
          </div>
          <div className="technique-card">
            <h3>Mindful Walking</h3>
            <p>Calm the mind and enhance awareness by focusing on each step and breath.</p>
            <div className="technique-tips">
              <h4>How to do it:</h4>
              <ul>
                <li>Find a quiet space.</li>
                <li>Stand, breathe, feel grounded.</li>
                <li>Walk slowly and intentionally.</li>
                <li>Sync breath with steps (e.g., inhale 2 steps, exhale 3).</li>
                <li>Engage all senses.</li>
                <li>Gently refocus if distracted.</li>
                <li>End with gratitude.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudyTechniquesPage;