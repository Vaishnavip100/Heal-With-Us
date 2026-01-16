import React from 'react';
import NavBar from './NavBar';
import '../styles/QuotesPage.css';

function QuotesPage({ isAuthenticated, onLogout }) {
  const quotes = [
    {
      text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.",
      author: "Noam Shpancer"
    },
    {
      text: "You don't have to control your thoughts. You just have to stop letting them control you.",
      author: "Dan Millman"
    },
    {
      text: "Self-care is not self-indulgence, it is self-preservation.",
      author: "Audre Lorde"
    },
    {
      text: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
      author: "Unknown"
    },
    {
      text: "Recovery is not one and done. It is a lifelong journey that takes place one day, one step at a time.",
      author: "Unknown"
    }
  ];

  return (
    <div className="container">
      <NavBar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <div className="quotes-container">
        <h1>Inspirational Mental Health Quotes</h1>
        <div className="quotes-grid">
          {quotes.map((quote, index) => (
            <div key={index} className="quote-card">
              <p className="quote-text">"{quote.text}"</p>
              <p className="quote-author">- {quote.author}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuotesPage;
