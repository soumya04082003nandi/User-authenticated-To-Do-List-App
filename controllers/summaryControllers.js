const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

// Models
const todoModels = require("../models/todo");
const summaryModels = require("../models/summary");
const userModels = require("../models/user");

// Render Summary Page
const handleRenderSummaryPage = async (req, res) => {
    res.render("summary", { summary: null, message: null });
};

// Generate Summary using DeepSeek via OpenRouter
const handleGenerateSummary = async (req, res) => {
    try {
        const user = await userModels.findOne({ email: req.user.email });
        const userId = user._id;

        // Define today's UTC time range
        const now = new Date();
        const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
        const endOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

        // Fetch completed todos
        const completedTodos = await todoModels.find({
            userId,
            completed: true,
            completedAt: { $gte: startOfToday, $lte: endOfToday }
        });

        if (completedTodos.length === 0) {
            return res.render("summary", {
                summary: null,
                message: "No completed tasks found today."
            });
        }

        // Prepare the prompt with only titles
        const taskList = completedTodos.map((todo, i) => `${i + 1}. ${todo.title}`).join("\n");
        const prompt = `Summarize the following tasks I completed today:\n${taskList}`;

        // Send request to OpenRouter (DeepSeek model)
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                 model: "deepseek/deepseek-r1-0528:free",
                messages: [
                    { role: "system", content: "You are a helpful assistant that summarizes completed tasks clearly." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 1024
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000" // 🔁 Update if hosted elsewhere
                }
            }
        );
        

        const summaryText = response.data.choices[0].message.content;

        // Save the summary
        await summaryModels.create({
            userId,
            summary: summaryText,
            date: new Date()
        });

        // Render summary page
        res.render("summary", {
            summary: summaryText,
            message: null
        });

    } catch (error) {
        console.error("Error generating summary:", error.response?.data || error.message);
        res.render("summary", {
            summary: null,
            message: "Something went wrong while generating the summary."
        });
    }
};

module.exports = {
    handleRenderSummaryPage,
    handleGenerateSummary
};
