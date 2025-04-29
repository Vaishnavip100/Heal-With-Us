const express = require("express");
const { processMessage } = require("../services/nlpSetup");

const router = express.Router();

const NLP_CONFIDENCE_THRESHOLD = 0.6;

const CRISIS_RESPONSE =
  "It sounds like you're going through an incredibly difficult time. Your safety is most important. Please reach out for immediate professional help. You can contact 112 for Emergencies. Help is available 24/7.";

const crisisKeywords = new Set([
  "suicide",
  "kill myself",
  "killing myself",
  "want to die",
  "end my life",
  "self harm",
  "self-harm",
  "cutting",
  "hopeless",
  "can't go on",
  "no reason to live",
  "overdose",
  "goodbye cruel world",
  "hang myself",
]);

const DEFAULT_FALLBACK_RESPONSE =
  "I'm having a little trouble understanding. Could you try rephrasing that?";
const ERROR_FALLBACK_RESPONSE =
  "I encountered an unexpected issue while processing your message. Please try again shortly.";

const DISCLAIMER_MESSAGE = `Hello! I'm a supportive chatbot designed to offer a listening ear and helpful resources. Please remember, I am **not** a replacement for professional mental health diagnosis, treatment, or crisis intervention. My responses are based on programmed patterns. If you are in crisis or feel unsafe, please contact a crisis hotline (like 988 in the US/Canada) or a mental health professional immediately. How can I help you today?`;


/**
 * Checks if a message contains crisis-related keywords.
 * @param {string} lowerCaseMessage - The user message in lowercase.
 * @returns {boolean} - True if a crisis keyword is detected, false otherwise.
 */
const checkForCrisisKeywords = (lowerCaseMessage) => {
  for (const keyword of crisisKeywords) {
    if (lowerCaseMessage.includes(keyword)) {
      return true;
    }
  }
  return false;
};

router.post("/message", async (req, res) => {
  const userMessage = req.body.message;

  // --- 1. Input Validation ---
  if (
    !userMessage ||
    typeof userMessage !== "string" ||
    userMessage.trim().length === 0
  ) {
    console.warn("[Chat Route] Received empty or invalid message.");
    return res
      .status(400)
      .json({ error: "Message cannot be empty or invalid." });
  }

  const sanitizedMessage = userMessage.trim();
  const lowerCaseMessage = sanitizedMessage.toLowerCase();
  console.log(`[Chat Route] Received message: "${sanitizedMessage}"`);

  // --- 2. Immediate Crisis Check ---
  if (checkForCrisisKeywords(lowerCaseMessage)) {
    console.warn(
      `[Chat Route] CRITICAL: Potential crisis keyword detected in message: "${sanitizedMessage}". Sending crisis response.`
    );
    return res.status(200).json({ reply: CRISIS_RESPONSE, isCrisis: true });
  }

  // --- 3. Process with NLP ---
  let botReply = DEFAULT_FALLBACK_RESPONSE;
  let intent = "None";
  let score = 0;

  try {
    console.log(
      `[Chat Route] Processing message with NLP: "${lowerCaseMessage}"`
    );
    const nlpResult = await processMessage(lowerCaseMessage);

    if (!nlpResult) {
      console.error(
        "[Chat Route] NLP service returned an empty or invalid result."
      );
      throw new Error("NLP service failed to return a valid result.");
    }

    intent = nlpResult.intent || "None"; // Default to 'None' if intent is missing
    score = nlpResult.score || 0; // Default to 0 if score is missing
    const nlpAnswer = nlpResult.answer; // Get the answer provided by NLP (could be for specific intent or 'None')

    console.log(
      `[Chat Route] NLP Result: Intent=${intent}, Score=${score.toFixed(
        2
      )}, Answer Provided: ${!!nlpAnswer}`
    );

    // Scenario A: High confidence for a specific intent AND an answer exists for it
    if (intent !== "None" && nlpAnswer && score >= NLP_CONFIDENCE_THRESHOLD) {
      botReply = nlpAnswer;
      console.log(
        `[Chat Route] Using specific answer for Intent='${intent}' (Confidence: ${score.toFixed(
          2
        )})`
      );
    }
    // Scenario B: Intent is 'None' OR confidence is low, BUT the NLP provided a specific answer
    // (This could be a curated "I don't know" response from the NLP model for 'None' intent, or just the best guess answer even if confidence is low)
    else if (
      nlpAnswer &&
      (intent === "None" || score < NLP_CONFIDENCE_THRESHOLD)
    ) {
      botReply = nlpAnswer; // Use the answer provided by NLP, even if for 'None' or low confidence
      if (intent === "None") {
        console.log(
          `[Chat Route] Using NLP's answer designated for Intent='None'.`
        );
      } else {
        console.log(
          `[Chat Route] Using NLP's provided answer as fallback (Low Confidence: ${score.toFixed(
            2
          )} for Intent='${intent}')`
        );
      }
    }
    // Scenario C: No suitable answer from NLP (no answer provided, or failed conditions above)
    else {
      console.log(
        `[Chat Route] NLP result not suitable (Intent='${intent}', Score=${score.toFixed(
          2
        )}, No Answer Provided=${!nlpAnswer}). Using default fallback.`
      );
      // botReply remains DEFAULT_FALLBACK_RESPONSE
    }
  } catch (error) {
    console.error(
      "[Chat Route] Error during NLP processing:",
      error.message || error
    );
    botReply = ERROR_FALLBACK_RESPONSE;
  }

  // --- 4. Send Response ---
  console.log(`[Chat Route] Sending reply: "${botReply.substring(0, 100)}..."`);
  res.status(200).json({ reply: botReply, isCrisis: false });
});

router.get("/start", (req, res) => {
  console.log("[Chat Route] Sending initial disclaimer message.");
  res.status(200).json({ reply: DISCLAIMER_MESSAGE, isCrisis: false });
});

module.exports = router;