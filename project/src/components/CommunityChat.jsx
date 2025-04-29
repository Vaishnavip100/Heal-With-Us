import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/CommunityChat.css';

function CommunityChat({
  sendMessage,          // Function to send a message via socket
  receivedMessages,     // Array of messages from App.jsx state (or managed internally)
  isConnected,          // Boolean indicating socket connection status
  currentUser,          // Object representing the logged-in user (if available)
  socketId,             // The current client's socket ID from App.jsx
  isAuthenticated,      // Boolean indicating if user is logged in
  onLogout             // Logout function prop
}) {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null); // Ref to auto-scroll

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [receivedMessages]);

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() && isConnected && typeof sendMessage === 'function') {
      sendMessage(messageInput);
      setMessageInput('');
    } else if (!isConnected) {
      alert('Not connected to the chat server. Please wait or refresh.');
    }
  };

  const renderHeader = () => (
     <nav className="navbar chat-navbar">
        <span className="logo-chat">Community Chat</span>
        {isAuthenticated ? (
          <button onClick={onLogout} className="logout-button-chat">Logout</button>
        ) : (
          <span className="login-prompt-chat">Please log in to chat fully.</span>
        )}
     </nav>
  );

  return (
    <div className="community-chat-page">
       {renderHeader()}
       <div className="chat-container">
            <div className="messages-list">
                {receivedMessages && receivedMessages.length > 0 ? (
                    receivedMessages.map((msg, index) => {
                        const isMyMessage = msg.senderId === socketId;
                        // Basic sender display - could be enhanced if backend sends username
                        const senderName = isMyMessage ? 'Me' : `User ${msg.senderId?.substring(0, 6) || 'Unknown'}`;

                        return (
                            <div
                                key={index} // Ideally use a unique message ID from backend if available
                                className={`message-item ${isMyMessage ? 'my-message' : 'other-message'}`}
                            >
                                {!isMyMessage && <div className="sender-name">{senderName}</div>} 
                                <div className="message-bubble">{msg.message}</div>
                            </div>
                        );
                    })
                ) : (
                    <div className="no-messages">No messages yet. Start the conversation!</div>
                )}
                {/* Dummy div to target for scrolling */}
                <div ref={messagesEndRef} />
            </div>

            <form className="input-area" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    className="message-input"
                    value={messageInput}
                    onChange={handleInputChange}
                    placeholder={isConnected ? "Type your message..." : "Connecting..."}
                    disabled={!isConnected || !isAuthenticated} // Disable if not connected or not logged in
                    aria-label="Chat message input"
                />
                <button
                    type="submit"
                    className="send-button"
                    disabled={!isConnected || !messageInput.trim() || !isAuthenticated}
                    aria-label="Send chat message"
                >
                    Send
                </button>
            </form>
        </div>
    </div>

  );
}

export default CommunityChat;