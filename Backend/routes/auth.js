const express = require('express');
const User = require('../models/user'); // Import the User model

const router = express.Router();

// --- Signup Route ---
router.post('/signup', async (req, res) => {
    const { name, email,password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    try {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        const newUser = new User({
            name,
            email: email.toLowerCase(),
            password 
        });

        // Save the user to the database
        await newUser.save();

        // Respond (don't send the password back, even the hash)
        res.status(201).json({
            message: 'User registered successfully!',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            }
        });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: 'Server error during registration.', error: error.message });
    }
});

// --- Login Route ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password.' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Login successful!
        res.status(200).json({
            message: 'Login successful!',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error during login.', error: error.message });
    }
});


module.exports = router;