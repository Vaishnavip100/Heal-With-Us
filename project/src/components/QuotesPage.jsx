import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import '../styles/QuotesPage.css'; // Make sure this CSS file exists and is updated

// --- Initial Data (can be moved outside or fetched) ---
const initialQuotesData = [
  {
    id: 1, // Add unique IDs
    text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.",
    author: "Noam Shpancer"
  },
  {
    id: 2,
    text: "You don't have to control your thoughts. You just have to stop letting them control you.",
    author: "Dan Millman"
  },
  {
    id: 3,
    text: "Self-care is not self-indulgence, it is self-preservation.",
    author: "Audre Lorde"
  },
  {
    id: 4,
    text: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    author: "Unknown"
  },
  {
    id: 5,
    text: "Recovery is not one and done. It is a lifelong journey that takes place one day, one step at a time.",
    author: "Unknown"
  }
];

function QuotesPage({ isAuthenticated, onLogout }) {
  // --- State ---
  const [quotes, setQuotes] = useState(initialQuotesData);
  const [newQuoteText, setNewQuoteText] = useState('');
  const [newQuoteAuthor, setNewQuoteAuthor] = useState('');
  const [editingId, setEditingId] = useState(null); // ID of the quote being edited
  const [editText, setEditText] = useState('');
  const [editAuthor, setEditAuthor] = useState('');

  // --- CRUD Handlers ---

  // CREATE
  const handleAddQuote = (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    if (!newQuoteText.trim() || !newQuoteAuthor.trim()) {
      alert("Please enter both quote text and author.");
      return;
    }
    const newQuote = {
      // Use a simple timestamp or a more robust method for unique IDs
      id: Date.now(),
      text: newQuoteText,
      author: newQuoteAuthor
    };
    setQuotes([...quotes, newQuote]);
    setNewQuoteText(''); // Clear input fields
    setNewQuoteAuthor('');
  };

  // DELETE
  const handleDeleteQuote = (idToDelete) => {
    if (window.confirm("Are you sure you want to delete this quote?")) {
      setQuotes(quotes.filter(quote => quote.id !== idToDelete));
       // If deleting the quote currently being edited, cancel edit mode
      if (editingId === idToDelete) {
        setEditingId(null);
        setEditText('');
        setEditAuthor('');
      }
    }
  };

  // UPDATE - Start Editing
  const handleStartEdit = (quote) => {
    setEditingId(quote.id);
    setEditText(quote.text);
    setEditAuthor(quote.author);
  };

  // UPDATE - Cancel Editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
    setEditAuthor('');
  };

  // UPDATE - Save Edit
  const handleSaveEdit = (e) => {
    e.preventDefault();
     if (!editText.trim() || !editAuthor.trim()) {
      alert("Quote text and author cannot be empty.");
      return;
    }
    setQuotes(quotes.map(quote =>
      quote.id === editingId
        ? { ...quote, text: editText, author: editAuthor }
        : quote
    ));
    setEditingId(null); // Exit editing mode
    setEditText('');
    setEditAuthor('');
  };


  // --- Render ---
  return (
    <div className="container">
      <NavBar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <div className="quotes-page-content"> {/* Added wrapper for better styling control */}
        <h1>Inspirational Mental Health Quotes</h1>

        {/* --- Add Quote Form --- */}
        <div className="add-quote-form">
          <h2>Add a New Quote</h2>
          <form onSubmit={handleAddQuote}>
            <textarea
              placeholder="Quote text..."
              value={newQuoteText}
              onChange={(e) => setNewQuoteText(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Author..."
              value={newQuoteAuthor}
              onChange={(e) => setNewQuoteAuthor(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-add">Add Quote</button>
          </form>
        </div>

        {/* --- Quotes Grid (Read, Update, Delete) --- */}
        <div className="quotes-container">
          <div className="quotes-grid">
            {quotes.map((quote) => (
              <div key={quote.id} className="quote-card">
                {editingId === quote.id ? (
                  // --- Editing View ---
                  <form onSubmit={handleSaveEdit} className="edit-quote-form">
                     <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        required
                     />
                     <input
                        type="text"
                        value={editAuthor}
                        onChange={(e) => setEditAuthor(e.target.value)}
                        required
                     />
                     <div className="edit-actions">
                        <button type="submit" className="btn btn-save">Save</button>
                        <button type="button" onClick={handleCancelEdit} className="btn btn-cancel">Cancel</button>
                     </div>
                  </form>
                ) : (
                  // --- Display View ---
                  <>
                    <p className="quote-text">"{quote.text}"</p>
                    <p className="quote-author">- {quote.author}</p>
                    <div className="quote-actions">
                      <button onClick={() => handleStartEdit(quote)} className="btn btn-edit">Edit</button>
                      <button onClick={() => handleDeleteQuote(quote.id)} className="btn btn-delete">Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuotesPage;