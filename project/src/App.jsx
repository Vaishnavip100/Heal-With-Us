import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import './App.css';

import LandingPage from './components/LandingPage';
import QuotesPage from './components/QuotesPage';
import ResourcesPage from './components/ResourcesPage';
import CausesPage from './components/CausesPage';
import StudyTechniquesPage from './components/StudyTechniquesPage';
import MoodGame from './components/MoodGame';
import HeartLogo from './components/HeartLogo';
import SupportNetwork from './components/SupportNetwork';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import CommunityChat from './components/CommunityChat';

// --- Configuration ---
const SOCKET_SERVER_URL = "https://heal-with-us-backend.onrender.com";
const USER_STORAGE_KEY = 'healWithUsUser';
//LOGIN COMPONENT
function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const from = location.state?.from || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!formData.email || !formData.password) {
      setError('Please enter email and password.');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(`${SOCKET_SERVER_URL}/api/auth/login`, formData);
      console.log('Login API Success Response:', response.data);
      if (response.data && response.data.user) {
        console.log('User data found:', response.data.user);
        onLoginSuccess(response.data.user);
        navigate(from, { replace: true });
      } else {
        console.error('Login successful but user data missing in response');
        setError('Login succeeded but user data was not received correctly.');
      }
    } catch (err) {
      console.error('Login API Error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
       <Link to="/" className="logo" style={{ justifyContent: 'center', marginBottom: '1.5rem', display: 'inline-flex' }}>
          <HeartLogo /> Heal With Us
       </Link>
      <h2 className="auth-title">Log In to Heal With Us</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
          <div className="form-group"><label className="form-label" htmlFor="email">Email</label><input type="email" id="email" name="email" className="form-input" value={formData.email} onChange={handleChange} required disabled={loading}/></div>
          <div className="form-group"><label className="form-label" htmlFor="password">Password</label><input type="password" id="password" name="password" className="form-input" value={formData.password} onChange={handleChange} required disabled={loading}/></div>
          <button type="submit" className="form-button" disabled={loading}>{loading ? 'Logging In...' : 'Log In'}</button>
      </form>
      <p className="auth-switch">Don't have an account? <Link to="/signup">Sign Up</Link></p>
      <Link to="/" className="back-link">Back to Home</Link>
    </div>
  );
}

//SIGNUP COMPONENT
function SignUp({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(`${SOCKET_SERVER_URL}/api/auth/signup`, formData);
      console.log('Signup API Success Response:', response.data);
      if (response.data && response.data.user) {
           console.log('User data found after signup:', response.data.user);
           onLoginSuccess(response.data.user);
           navigate('/');
      } else {
          console.error('Signup successful but user data missing in response');
          setError('Signup succeeded but user data was not received correctly.');
      }
    } catch (err) {
      console.error('Signup API Error:', err);
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

   return (
     <div className="auth-container">
       <Link to="/" className="logo" style={{ justifyContent: 'center', marginBottom: '1.5rem', display: 'inline-flex' }}>
          <HeartLogo /> Heal With Us
       </Link>
       <h2 className="auth-title">Sign Up for Heal With Us</h2>
       {error && <p className="error-message">{error}</p>}
       <form onSubmit={handleSubmit}>
          <div className="form-group"><label className="form-label" htmlFor="name">Name</label><input type="text" id="name" name="name" className="form-input" value={formData.name} onChange={handleChange} required disabled={loading}/></div>
          <div className="form-group"><label className="form-label" htmlFor="email">Email</label><input type="email" id="email" name="email" className="form-input" value={formData.email} onChange={handleChange} required disabled={loading}/></div>
          <div className="form-group"><label className="form-label" htmlFor="password">Password</label><input type="password" id="password" name="password" className="form-input" value={formData.password} onChange={handleChange} required disabled={loading}/></div>
          <button type="submit" className="form-button" disabled={loading}>{loading ? 'Signing Up...' : 'Sign Up'}</button>
       </form>
       <p className="auth-switch">Already have an account? <Link to="/login">Log In</Link></p>
       <Link to="/" className="back-link">Back to Home</Link>
     </div>
   );
}

//MAIN APP COMPONENT
const getInitialUser = () => {
  try {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      console.log('Found user in localStorage on init.');
      return JSON.parse(storedUser);
    }
    return null;
  } catch (error) {
    console.error("Error reading user from localStorage:", error);
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

function App() {
  const [currentUser, setCurrentUser] = useState(getInitialUser);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [socketMessages, setSocketMessages] = useState([]);
  const socketRef = useRef(null);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (socketRef.current) return;
    console.log('[Socket.IO] Attempting to connect...');
    socketRef.current = io(SOCKET_SERVER_URL);
    const socket = socketRef.current;
    socket.on('connect', () => { console.log(`[Socket.IO] Connected: ${socket.id}`); setIsConnected(true); });
    socket.on('disconnect', (reason) => { console.log(`[Socket.IO] Disconnected: ${reason}`); setIsConnected(false); });
    socket.on('connect_error', (err) => { console.error('[Socket.IO] Connection Error:', err.message); setIsConnected(false); });
    socket.on('welcome', (message) => { console.log(`[Socket.IO] Server: ${message}`); });
    socket.on('newMessage', (incomingMessage) => {
        console.log('[Socket.IO] Received message:', incomingMessage);
        const messageWithId = { ...incomingMessage, id: incomingMessage.id || Date.now() + Math.random() };
        setSocketMessages((prev) => [...prev, messageWithId]);
    });
    return () => {
        if (socketRef.current) {
            console.log('[Socket.IO] Disconnecting socket...');
            socketRef.current.disconnect();
            socketRef.current = null;
            setIsConnected(false);
        }
    };
  }, []);

  // --- Event Handlers ---
  const sendSocketMessage = useCallback((messageText) => {
    if (socketRef.current && isConnected && messageText.trim() && currentUser) {
        const messageData = {
            message: messageText,
            sender: { id: currentUser._id || currentUser.id, name: currentUser.name },
            timestamp: new Date().toISOString(),
        };
        console.log('[Socket.IO] Sending message:', messageData);
        socketRef.current.emit('sendMessage', messageData);
    } else {
        console.warn('[Socket.IO] Cannot send message.');
    }
  }, [isConnected, currentUser]);

  const handleLoginSuccess = (userData) => {
    if (userData) {
      console.log("handleLoginSuccess: Storing user", userData);
      try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        setCurrentUser(userData);
      } catch (error) {
         console.error("Error storing user in localStorage:", error);
         alert("Could not save your session.");
      }
    } else {
      console.error("handleLoginSuccess received invalid userData!");
    }
  };

  const handleLogout = () => {
    console.log("handleLogout: Clearing user session");
    localStorage.removeItem(USER_STORAGE_KEY);
    setCurrentUser(null);
    console.log("User logged out");
  };

  const isAuthenticated = !!currentUser;

  if (isLoading) {
    return <div className="loading-container">Loading Heal With Us...</div>;
  }

  console.log(`App Render - isAuthenticated: ${isAuthenticated}`);

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ backgroundColor: '#eee', padding: '5px 15px', textAlign: 'right', fontSize: '0.8em', borderBottom: '1px solid #ddd', position: 'sticky', top: 0, zIndex: 10}}>
             Socket: {isConnected ? 'Connected' : 'Disconnected'} | User: {currentUser ? currentUser.name : 'Guest'}
        </div>

        <main style={{ flexGrow: 1 }}>
          <Routes>
            {/* --- Public and Auth Routes --- */}
            <Route path="/" element={<LandingPage isAuthenticated={isAuthenticated} currentUser={currentUser} onLogout={handleLogout} />} />
            <Route path="/login" element={!isAuthenticated ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" replace />} />
            <Route path="/signup" element={!isAuthenticated ? <SignUp onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" replace />} />

            {/* --- Other Standard Routes --- */}
            <Route path="/quotes" element={<QuotesPage isAuthenticated={isAuthenticated} onLogout={handleLogout} />} />
            <Route path="/support-network" element={<SupportNetwork isAuthenticated={isAuthenticated} onLogout={handleLogout} />} />
            <Route path="/resources" element={<ResourcesPage isAuthenticated={isAuthenticated} onLogout={handleLogout} />} />
            <Route path="/success-stories" element={<CausesPage isAuthenticated={isAuthenticated} onLogout={handleLogout} />} />
            <Route path="/study-techniques" element={<StudyTechniquesPage isAuthenticated={isAuthenticated} onLogout={handleLogout} />} />
            <Route path="/mood-game" element={<MoodGame isAuthenticated={isAuthenticated} onLogout={handleLogout} />} />

            {/* --- Protected Routes (Require Authentication) --- */}
            <Route
                path="/chatbot"
                element={isAuthenticated ? <Chatbot isAuthenticated={isAuthenticated} currentUser={currentUser} onLogout={handleLogout} /> : <Navigate to="/login" state={{ from: '/chatbot' }} replace />}
            />
            <Route
                 path="/community-chat"
                 element={
                     isAuthenticated ? (
                          <CommunityChat
                             sendMessage={sendSocketMessage}
                             receivedMessages={socketMessages}
                             isConnected={isConnected}         // Pass socket connection status
                             currentUser={currentUser}          // Pass the user object
                             onLogout={handleLogout}           // Pass the logout handler
                             isAuthenticated={isAuthenticated} // Explicitly pass auth status
                             socketId={socketRef.current?.id}  // Pass the current socket ID
                          />
                     ) : (
                         <Navigate to="/login" state={{ from: '/community-chat' }} replace />
                     )
                 }
             />

            {/* --- Catch-all 404 Route --- */}
            <Route path="*" element={
              <div className="container" style={{ textAlign: 'center', paddingTop: '50px' }}>
                  <h1>404 - Page Not Found</h1>
                  <p>Sorry, the page you requested does not exist.</p>
                  <Link to="/" className="button">Go Back Home</Link>
               </div>
            } />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
