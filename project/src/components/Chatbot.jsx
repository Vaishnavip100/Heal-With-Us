import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/Chatbot.css';

const CHATBOT_API_URL = 'http://localhost:5001/api/chat/message';

// Accept isAuthenticated as a prop
function Chatbot({ isAuthenticated,onLogout }) {
    if (!isAuthenticated) {
        console.log("EmotionalSupport: User not authenticated, redirecting to login.");
        // Use Navigate component for redirection
        return <Navigate to="/login" replace />;
      }
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Update initial greeting based on auth status
    useEffect(() => {
        setIsLoading(true);
        let greeting;
        if (isAuthenticated) {
             greeting = {
                sender: 'bot',
                text: "Welcome back! I'm here to listen. How can I support you today? (Remember, I'm not a substitute for professional help.)"
            };
        } else {
             greeting = {
                sender: 'bot',
                text: "Hello! You can chat with me for support. Please remember, I'm not a substitute for professional help. For a more personalized experience, consider logging in."
            };
        }
        setMessages([greeting]);
        setIsLoading(false);
    }, [isAuthenticated]);


    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleSendMessage = async () => {
        const userMessageText = input.trim();
        if (!userMessageText || isLoading) return;

        const newUserMessage = { sender: 'user', text: userMessageText };
        setMessages(prevMessages => [...prevMessages, newUserMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post(CHATBOT_API_URL, {
                message: userMessageText
            });
            const botMessage = { sender: 'bot', text: response.data.reply };
            setMessages(prevMessages => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = { sender: 'bot', text: "Sorry, something went wrong. Please try again later." };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !isLoading) {
            handleSendMessage();
        }
    };

    return (
        <div className="container">
        <NavBar isAuthenticated={isAuthenticated} onLogout={onLogout} />
            <div className="chatbot-container">
                <h2>{isAuthenticated ? "Member Chat" : "Support Chat"}</h2>
                <div className="chatbot-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}-message`}>
                            <p>{msg.text}</p>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                {isLoading && <div className="loading-indicator">Bot is typing...</div>}

                {!isAuthenticated && (
                    <div className="login-prompt">
                        <Link to="/login">Log In</Link> or <Link to="/signup">Sign Up</Link> for the full experience.
                    </div>
                )}

                <div className="chatbot-input-area">
                    <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message here..."
                        disabled={isLoading}
                        aria-label="Chat message input"
                    />
                    <button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Chatbot;