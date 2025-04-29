const { NlpManager } = require('node-nlp');
const fs = require('fs');
const path = require('path');

// --- Configuration ---
const MODEL_FILENAME = path.join(__dirname, '..', 'model.nlp'); // Saves model.nlp in Backend/
const CONFIDENCE_THRESHOLD = 0.55; // Minimum confidence score
const manager = new NlpManager({
    languages: ['en'],
    forceNER: true,
    nlu: {
        log: false,
        useNoneFeature: true,
        // Consider adding more training epochs if accuracy is low after adding data
        // trainEpochs: 100, // Default is 100
    },
    spellCheck: true,
    sentiment: true,
});

// --- Simple State Management ---
// In a real application, this state would likely be tied to a specific user session.
// For this example, we'll use a simple global variable.
let conversationState = {
    lastBotIntent: null, // Stores the intent of the *bot's* last message
    lastSuggestion: null, // Optional: store specifics if needed
    awaitingConfirmation: false, // Flag if the bot just asked a yes/no question or offered a suggestion
};

// Function to reset state (e.g., for a new conversation)
function resetConversationState() {
    conversationState = {
        lastBotIntent: null,
        lastSuggestion: null,
        awaitingConfirmation: false,
    };
}


// --- Training Data ---
console.log('[NLP] Setting up training data...');

// (Keep all your existing manager.addDocument calls here...)
// ... (Greetings, Farewells, Sadness, Anxiety, Stress, Coping, etc.) ...

// NEW: Add Intents for Simple Affirmation and Negation
manager.addDocument('en', 'yes', 'intent.affirmation');
manager.addDocument('en', 'yeah', 'intent.affirmation');
manager.addDocument('en', 'yep', 'intent.affirmation');
manager.addDocument('en', 'sure', 'intent.affirmation');
manager.addDocument('en', 'okay', 'intent.affirmation');
manager.addDocument('en', 'alright', 'intent.affirmation');
manager.addDocument('en', 'I will', 'intent.affirmation');
manager.addDocument('en', 'that sounds good', 'intent.affirmation');

manager.addDocument('en', 'no', 'intent.negation');
manager.addDocument('en', 'nope', 'intent.negation');
manager.addDocument('en', 'nah', 'intent.negation');
manager.addDocument('en', 'not really', 'intent.negation');
manager.addDocument('en', 'I don\'t think so', 'intent.negation');
manager.addDocument('en', 'I can\'t', 'intent.negation');
manager.addDocument('en', 'that doesn\'t sound helpful', 'intent.negation');


// --- Define Answers ---
console.log('[NLP] Setting up answers...');

// (Keep all your existing manager.addAnswer calls here...)
// ... (Greetings, Farewells, Sadness, Anxiety, Stress, Coping, etc.) ...

// Define how certain intents might prompt a confirmation
const INTENTS_PROMPTING_CONFIRMATION = new Set([
    'intent.feeling.sad', // Example: The answer suggests wrapping in a blanket
    'intent.feeling.anxious', // Example: The answer suggests breathing or grounding
    'intent.feeling.stressed', // Example: The answer suggests taking a break
    'intent.ask.coping', // Example: The answer explains a technique like Box Breathing
]);

// NEW: Add Contextual Answers for Affirmation/Negation
// These answers will be selected by our custom logic, not directly by node-nlp's intent matching alone.
const contextualAnswers = {
    affirmation: {
        // Default affirmation response if context is unclear
        default: [
            "Okay, understood.",
            "Alright.",
            "Got it.",
        ],
        // Responses when affirming a suggestion (e.g., from feeling.sad)
        suggestion_accepted: [
            "That's great to hear. Taking that small step can make a difference. Be gentle with yourself.",
            "Good. I hope that brings you a little bit of comfort.",
            "Excellent. Sometimes those small comforts are exactly what's needed.",
        ],
         // Responses when affirming a technique explanation (e.g., from ask.coping)
         technique_understood: [
            "Great. Remember you can try that whenever you feel the need.",
            "Okay, glad that makes sense. Practice can make it more effective.",
        ]
        // Add more contexts as needed
    },
    negation: {
        // Default negation response
        default: [
            "Okay, thanks for letting me know.",
            "Understood.",
            "Alright, maybe something else then?",
        ],
        // Responses when rejecting a suggestion
        suggestion_rejected: [
            "Okay, that's perfectly alright. Not every suggestion works for everyone. Is there something else on your mind?",
            "Understood. Perhaps we can think of something different? Or maybe just talking is helpful right now?",
            "No problem. Let's set that suggestion aside. What else feels present for you?",
        ],
         // Responses when rejecting a technique explanation
         technique_rejected: [
            "Okay, perhaps that technique doesn't resonate right now. There are other ways to cope.",
            "Understood. Maybe that one isn't the right fit. Would you like to hear about a different approach?",
        ]
        // Add more contexts as needed
    }
};

// Helper to get a random answer from a list
function getRandomAnswer(answerList) {
    if (!answerList || answerList.length === 0) return null;
    return answerList[Math.floor(Math.random() * answerList.length)];
}


// Default fallback answers (remain unchanged)
manager.addAnswer('en', 'None', 'I understand you shared something, but I\'m not quite sure how to respond best. Could you perhaps tell me a bit more about what you\'re experiencing?');
manager.addAnswer('en', 'None', 'Thanks for sharing. To help me understand better, could you maybe rephrase that or tell me more about the main feeling involved?');
manager.addAnswer('en', 'None', 'I\'m still learning. Could you try expressing that in a different way so I can try to assist you better?');
manager.addAnswer('en', 'None', 'I hear you. What\'s the most important part of that for you right now?');
// manager.addAnswer('en', 'None', 'Tell me more about that.'); // Can be a bit too passive sometimes


// --- Training Function --- (Unchanged, but ensure it runs)
async function trainNlp() {
    console.log('[NLP] Starting model training (this might take a few moments)...');
    const start = Date.now();
    try {
        await manager.train();
        const end = Date.now();
        console.log(`[NLP] Model trained successfully in ${(end - start) / 1000} seconds!`);
        manager.save(MODEL_FILENAME, true);
        console.log(`[NLP] Model saved to ${MODEL_FILENAME}`);
    } catch (err) {
        console.error('[NLP] Error during training:', err);
    }
}

// --- Initialization Function --- (Unchanged)
async function initializeNlp() {
    if (fs.existsSync(MODEL_FILENAME)) {
        console.log(`[NLP] Loading existing model from ${MODEL_FILENAME}...`);
        try {
             // Load from file path directly with NlpManager v4+
            await manager.load(MODEL_FILENAME);
            console.log('[NLP] Model loaded successfully.');
            return manager;
        } catch (err) {
             console.error(`[NLP] Error loading model from ${MODEL_FILENAME}. It might be corrupted or incompatible. Retraining...`, err);
             await trainNlp();
             return manager;
        }
    } else {
        console.log('[NLP] No existing model found. Starting initial training...');
        await trainNlp();
        return manager;
    }
}

// --- Processing Function (MODIFIED WITH CONTEXT HANDLING) ---
async function processMessage(message) {
    if (!manager || typeof manager.process !== 'function') {
        console.error("[NLP] Error: NLP Manager is not initialized or loaded correctly!");
        return { /* ... error response ... */ };
    }

    try {
        const cleanMessage = message.trim();
        if (!cleanMessage) {
             resetConversationState(); // Reset state on empty message
             return { intent: 'None', score: 0, sentiment: { score: 0, vote: 'neutral' }, answer: "It seems like your message was empty. Can I help with something?" };
        }

        const result = await manager.process('en', cleanMessage);
        let finalIntent = result.intent;
        let finalScore = result.score;
        let finalAnswer = result.answer; // This might be overwritten by contextual logic

        // Log raw result for debugging if needed
        // console.log('[NLP] Raw Result:', JSON.stringify(result, null, 2));
        // console.log('[NLP] State Before:', JSON.stringify(conversationState));

        // --- Contextual Logic ---
        let isContextualResponse = false;
        if (conversationState.awaitingConfirmation) {
            if (finalIntent === 'intent.affirmation' && finalScore >= CONFIDENCE_THRESHOLD) {
                // User said yes/ok/sure etc. after a suggestion/question
                let contextKey = 'default';
                if (conversationState.lastBotIntent && INTENTS_PROMPTING_CONFIRMATION.has(conversationState.lastBotIntent)) {
                     // Simple context check: assume it's related to the last suggestion type
                     contextKey = conversationState.lastBotIntent === 'intent.ask.coping' ? 'technique_understood' : 'suggestion_accepted';
                }
                 finalAnswer = getRandomAnswer(contextualAnswers.affirmation[contextKey] || contextualAnswers.affirmation.default);
                 isContextualResponse = true;
                 console.log(`[NLP] Contextual Affirmation Response (Context: ${contextKey})`);

            } else if (finalIntent === 'intent.negation' && finalScore >= CONFIDENCE_THRESHOLD) {
                // User said no/nope/not really etc.
                 let contextKey = 'default';
                 if (conversationState.lastBotIntent && INTENTS_PROMPTING_CONFIRMATION.has(conversationState.lastBotIntent)) {
                    contextKey = conversationState.lastBotIntent === 'intent.ask.coping' ? 'technique_rejected' : 'suggestion_rejected';
                }
                 finalAnswer = getRandomAnswer(contextualAnswers.negation[contextKey] || contextualAnswers.negation.default);
                 isContextualResponse = true;
                 console.log(`[NLP] Contextual Negation Response (Context: ${contextKey})`);
            }
            // If it wasn't a clear yes/no, we assume the user is changing the subject or answering differently.
            // Reset the awaiting flag so the normal flow continues.
             conversationState.awaitingConfirmation = false;
             conversationState.lastBotIntent = null; // Clear context after handling or ignoring confirmation
        }

        // --- Standard Intent Handling (if not handled contextually) ---
        if (!isContextualResponse) {
            // Check confidence threshold for non-contextual intents
            if (finalScore < CONFIDENCE_THRESHOLD && finalIntent !== 'None') {
                console.log(`[NLP] Low confidence (${finalScore.toFixed(2)}) for intent '${finalIntent}'. Falling back to 'None'. Original text: "${cleanMessage}"`);
                finalIntent = 'None';
                const fallbackResult = await manager.getAnswer('en', 'None'); // Get specific 'None' answer
                finalAnswer = fallbackResult?.answer;
                finalScore = 0; // Reset score
            }

            // If intent is still not 'None' or fallback, potentially set state for next turn
            if (finalIntent !== 'None') {
                if (INTENTS_PROMPTING_CONFIRMATION.has(finalIntent)) {
                    // The bot is about to give an answer that might need confirmation
                    conversationState.awaitingConfirmation = true;
                    conversationState.lastBotIntent = finalIntent; // Remember what type of suggestion was made
                    console.log(`[NLP] Setting awaitingConfirmation=true based on bot intent: ${finalIntent}`);
                } else {
                    // Normal statement/question from user, reset confirmation flag
                     conversationState.awaitingConfirmation = false;
                     conversationState.lastBotIntent = null;
                }
            } else {
                 // If the final intent is 'None', reset confirmation state
                 conversationState.awaitingConfirmation = false;
                 conversationState.lastBotIntent = null;
            }
        }

        // Ensure we *always* have an answer
        if (!finalAnswer) {
             console.warn(`[NLP] No answer found for intent '${finalIntent}' (Contextual: ${isContextualResponse}). Providing generic fallback.`);
             const fallbackResult = await manager.getAnswer('en', 'None');
             finalAnswer = fallbackResult?.answer || "I'm having trouble finding the right words right now. Could you tell me more?";
             // Ensure state is reset if we hit a final fallback
             conversationState.awaitingConfirmation = false;
             conversationState.lastBotIntent = null;
        }

        // console.log('[NLP] State After:', JSON.stringify(conversationState));
        // console.log(`[NLP] Final Intent: ${finalIntent}, Final Score: ${finalScore.toFixed(2)}`);

        return {
            locale: result.locale || 'en',
            utterance: result.utterance || cleanMessage,
            intent: finalIntent,
            score: finalScore,
            answer: finalAnswer, // The final selected answer (could be contextual)
            sentiment: result.sentiment,
        };

    } catch (error) {
        console.error("[NLP] Error processing message:", error);
        resetConversationState(); // Reset state on error
        return { /* ... error response ... */ };
    }
}

// --- Export functions ---
module.exports = {
    initializeNlp,
    processMessage,
    resetConversationState // Export reset if needed externally
};

// --- Reminder ---
// Make sure to add 'model.nlp' to your .gitignore file!