require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");

// --- Import Routers ---
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat'); 

const { initializeNlp } = require('./services/nlpSetup');

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// --- Create HTTP Server and Socket.IO Server ---
const httpServer = http.createServer(app); //Create HTTP server instance wrapping Express app
const io = new Server(httpServer, { //Initialize Socket.IO Server attached to http server
    cors: {
        origin: FRONTEND_URL, // Use the variable for frontend URL
        methods: ["GET", "POST"]
    }
});

// --- Main Async Function to Start Server ---
async function startServer() {

    console.log('[Server] Starting application initialization...');

    // --- Database Connection ---
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('[Server] MongoDB Connected Successfully!');
    } catch (err) {
        console.error('[Server] FATAL ERROR: MongoDB Connection Failed.', err);
        process.exit(1);
    }

    // --- Initialize NLP Service ---
    try {
        console.log('[Server] Initializing NLP service...');
        await initializeNlp();
        console.log('[Server] NLP service initialized successfully.');
    } catch (error) {
        console.error('[Server] FATAL ERROR: Failed to initialize NLP service.', error);
        process.exit(1);
    }

    // --- Middleware ---
    console.log('[Server] Configuring middleware...');
    // Standard CORS for Express HTTP routes
    app.use(cors({
        origin: FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    console.log('[Server] Middleware configured.');


    // --- API Routes ---
    console.log('[Server] Mounting API routes...');
    app.get('/', (req, res) => {
        res.status(200).send('Heal With Us API is running!');
    });
    app.use('/api/auth', authRoutes);
    app.use('/api/chat', chatRoutes); 
    console.log('[Server] API routes mounted.');

    // --- Socket.IO Connection Logic
    console.log('[Server] Setting up Socket.IO connection handlers...');
    io.on('connection', (socket) => {
        console.log(`[Socket.IO] User connected: ${socket.id}`);

        // Send a welcome message to the connected client
        socket.emit('welcome', `Welcome! Your ID is ${socket.id}`);

        // Listen for a 'sendMessage' event from this client
        socket.on('sendMessage', (messageData) => {
            console.log(`[Socket.IO] Message received from ${socket.id}:`, messageData);

            io.emit('newMessage', {
                senderId: socket.id, // Identify the sender
                message: messageData.message // Assuming messageData = { message: 'text' }
            });

        });

        // Handle user disconnection
        socket.on('disconnect', (reason) => {
            console.log(`[Socket.IO] User disconnected: ${socket.id}. Reason: ${reason}`);
            // You could potentially notify other users if needed
        });

        // Handle potential errors on a specific socket
        socket.on('error', (error) => {
           console.error(`[Socket.IO] Socket error for ${socket.id}:`, error);
        });
    });
    console.log('[Server] Socket.IO connection handlers set up.');


    // --- Basic 404 Handler ---
    app.use((req, res, next) => {
        res.status(404).json({ message: 'Resource not found on this server.' });
    });

    // --- Global Error Handler ---
    app.use((err, req, res, next) => {
        console.error('[Server] Unhandled Error:', err.stack || err);
        res.status(err.status || 500).json({
            error: 'Internal Server Error',
            message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred.' : err.message
        });
    });

    // --- Start Listening ---
    //Use httpServer.listen, not app.listen
    httpServer.listen(PORT, () => {
        console.log('-------------------------------------------------------');
        console.log(`[Server] Successfully Initialized.`);
        console.log(`[Server] HTTP and Socket.IO listening on port ${PORT}`);
        console.log(`[Server] Access API at: http://localhost:${PORT}`);
        console.log(`[Server] Accepting Socket.IO connections from: ${FRONTEND_URL}`);
        console.log('-------------------------------------------------------');
        // Your reminder logs
    });

}

startServer()
    .catch(err => {
        console.error("[Server] CRITICAL FAILURE during application startup:", err);
        process.exit(1);
    });
