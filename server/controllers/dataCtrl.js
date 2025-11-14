// datactrl.js
import User from "../models/userModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import { generateResponse } from "../config/gemini.js"; // Fixed import
import moment from "moment";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error in getCurrentUser:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateAssistant = async (req, res) => {
    try {
        const { assistantName, imageUrl } = req.body;
        let assistantImage;
        
        if (req.file) {
            assistantImage = await uploadOnCloudinary(req.file.path);
        } else {
            assistantImage = imageUrl;
        }

        const user = await User.findByIdAndUpdate(
            req.userId, 
            { assistantImage, assistantName },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error on update Assistant:', error);
        return res.status(500).json({ message: "Error updating assistant" });
    }
};

export const askToAssistant = async (req, res) => {
    try {
        const { command } = req.body; // Get command from request body
        
        if (!command) {
            return res.status(400).json({ response: "Command is required" });
        }

        // User.history.push(command)
        // User.save()

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ response: "User not found" });
        }

        const username = user.name;
        const assistantName = user.assistantName || "JARVIS";

        // Get response from Gemini
        const geminiResponseText = await generateResponse(command, assistantName, username);

        // Parse JSON response
        let geminiResponse;
        try {
            // Try to parse the entire response as JSON first
            geminiResponse = JSON.parse(geminiResponseText);
        } catch (parseError) {
            // If that fails, try to extract JSON from the response
            const jsonMatch = geminiResponseText.match(/{[\s\S]*}/);
            if (!jsonMatch) {
                return res.status(400).json({ response: "Sorry, I cannot understand your request" });
            }
            try {
                geminiResponse = JSON.parse(jsonMatch[0]);
            } catch (secondParseError) {
                return res.status(400).json({ response: "Sorry, I cannot understand your request" });
            }
        }

        // Handle different response types based on Gemini's classification
        const type = geminiResponse.type || 'general';
        const userInput = command;

        switch (type) {
            case 'get-date':
                return res.json({
                    type,
                    userInput,
                    response: `Current date is ${moment().format("DD-MM-YYYY")}`,
                    mood: geminiResponse.mood || "informative",
                    next_step: geminiResponse.next_step || ""
                });

            case 'get-time':
                return res.json({
                    type,
                    userInput,
                    response: `Current time is ${moment().format("hh:mm A")}`,
                    mood: geminiResponse.mood || "informative",
                    next_step: geminiResponse.next_step || ""
                });

            case 'get-day':
                return res.json({
                    type,
                    userInput,
                    response: `Today is ${moment().format("dddd")}`,
                    mood: geminiResponse.mood || "informative",
                    next_step: geminiResponse.next_step || ""
                });

            case 'get-month':
                return res.json({
                    type,
                    userInput,
                    response: `Current month is ${moment().format("MMMM")}`,
                    mood: geminiResponse.mood || "informative",
                    next_step: geminiResponse.next_step || ""
                });

            case 'google-search':
            case 'youtube-search':
            case 'youtube-play':
            case 'general':
            case 'instagram-open':
            case 'calculator-open':
            case 'facebook-open':
            case 'weather-show':
            case 'emotional-guidance':
            case 'information':
            case 'app-opening':
            case 'task-guidance':
            case 'general-conversation':
                return res.json({
                    type,
                    userInput,
                    response: geminiResponse.response || "I'm here to help!",
                    mood: geminiResponse.mood || "helpful",
                    next_step: geminiResponse.next_step || ""
                });

            default:
                return res.json({
                    type: 'general',
                    userInput,
                    response: geminiResponse.response || "I'm here to help you with whatever you need!",
                    mood: geminiResponse.mood || "helpful",
                    next_step: geminiResponse.next_step || ""
                });
        }

    } catch (error) {
        console.error("Error in askToAssistant:", error);
        return res.status(500).json({ 
            response: "Sorry, I'm experiencing technical difficulties. Please try again." 
        });
    }
};