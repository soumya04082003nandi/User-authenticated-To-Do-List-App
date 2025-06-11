const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser");


//databases
const userModels = require("../models/user");
const taskModels = require("../models/task");

//env file
const dotenv = require("dotenv")
dotenv.config();


//landing page
const handleRenderLandingPage = (req, res) => {
    res.render("home");
}

//login page
const handleRenderLogingPage = (req, res) => {
    res.render("login")
}

//register page
const handleRenderRegisterPage = async (req, res) => {
    res.render("register")
}

//dashboard page
const handleRenderDashboardPage = async (req, res) => {
    res.render("dashboard");
}

//user creation || registration
const handleUserRegistration = async (req, res) => {

    try {
        const { name, email, password, confirmPassword } = req.body
        if (password != confirmPassword) {
            res.render("register", { password: "missmatched" })
        }
        // Check if user already exists
        const checkUser = await userModels.findOne({ email });
        if (checkUser) {
            return res.status(400).render("register", { user: 1 });
        } else {

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create and save new user
            const newUser = new userModels({
                name,
                email,
                password: hashedPassword,

            });

            //saving the new user
            await newUser.save();

            //setting the cookie
            const token = jwt.sign({ email: newUser.email, userid: newUser._id }, process.env.SECRET_KEY)
            res.cookie("token", token);
            res.redirect("/dashboard")
        }



    } catch (error) {
        return res.status(500).send("Server error during registration");

    }

}




module.exports = {
    handleRenderLandingPage,
    handleRenderRegisterPage,
    handleRenderLogingPage,
    handleRenderDashboardPage,
    handleUserRegistration
}