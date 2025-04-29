import React from 'react';
import NavBar from './NavBar';
import '../styles/CausesPage.css';

function CausesPage({ isAuthenticated, onLogout }) {
  return (
    <div className="container">
      <NavBar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <div className="stories-container">
        <h1>Causes of Mental Health Issues</h1>
        <div className="stories-grid">
          <div className="story-card">
            <h3>Trauma or Abuse</h3>
            <p>Ongoing pressure from work, school, or personal life can lead to mental health issues like anxiety, depression, and 
              burnout. Unlike short-term stress, chronic stress negatively impacts the body and mind, weakening the immune system 
              and increasing the risk of heart disease. Prolonged stress often leads to unhealthy coping habits like substance abuse.</p>
          </div>
          <div className="story-card">
            <h3>Conquering Test Anxiety</h3>
            <p>Experiencing emotional, physical, or psychological abuse, especially in childhood, can have lasting effects. 
              Trauma disrupts emotional regulation and trust, often leading to PTSD, depression, or anxiety in adulthood. 
              The impact can affect relationships and daily life, creating challenges that persist over time.</p>
          </div>
          <div className="story-card">
            <h3>Genetic or Biological Factors</h3>
            <p>Mental health conditions can run in families due to genetic factors, increasing susceptibility. Neurochemical imbalances 
              or structural changes in the brain can also contribute to conditions like depression and bipolar disorder. Genetics, 
              combined with external stress, can heighten the risk of mental health struggles.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CausesPage;