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
    try {
        const user = await userModels.findOne({ email: req.user.email });
        const allSummary = await summaryModels.find({ userId: user._id }).sort({ date: -1 });

        res.render("summary", {
            summary: null,
            message: null,
            history: allSummary
        });
    } catch (err) {
        console.error("Error rendering summary page:", err);
        res.render("summary", {
            summary: null,
            message: "Failed to load summary page.",
            history: []
        });
    }
};

// Generate Summary using DeepSeek via OpenRouter
const handleGenerateSummary = async (req, res) => {
    try {
        const user = await userModels.findOne({ email: req.user.email });
        const userId = user._id;

        const now = new Date();
        const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
        const endOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

        // Get today's completed tasks
        const completedTodos = await todoModels.find({
            userId,
            completed: true,
            completedAt: { $gte: startOfToday, $lte: endOfToday }
        });

        const allSummary = await summaryModels.find({ userId }).sort({ date: -1 });

        if (completedTodos.length === 0) {
            return res.render("summary", {
                summary: null,
                message: "No completed tasks found today.",
                history: allSummary
            });
        }

        const taskList = completedTodos.map((todo, i) => `${i + 1}. ${todo.title}`).join("\n");
        const prompt = `Summarize the following tasks I completed today:\n${taskList}`;

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
                    "HTTP-Referer": "http://localhost:3000"
                }
            }
        );

        const summaryText = response.data.choices[0].message.content;

        // Check for existing summary and update if found
        const existingSummary = await summaryModels.findOneAndUpdate(
            { userId, date: { $gte: startOfToday, $lte: endOfToday } },
            { summary: summaryText },
            { new: true }
        );

        if (!existingSummary) {
            await summaryModels.create({
                userId,
                summary: summaryText,
                date: new Date()
            });
        }

        const updatedSummary = await summaryModels.find({ userId }).sort({ date: -1 });

        res.render("summary", {
            summary: summaryText,
            message: null,
            history: updatedSummary
        });

    } catch (error) {
        console.error("Error generating summary:", error.response?.data || error.message);
        res.render("summary", {
            summary: null,
            message: "Something went wrong while generating the summary.",
            history: []
        });
    }
};

module.exports = {
    handleRenderSummaryPage,
    handleGenerateSummary
};
