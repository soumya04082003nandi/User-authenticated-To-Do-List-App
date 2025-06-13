const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser");


//databases
const userModels = require("../models/user");
const todoModels = require("../models/todo");

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
    const user = await userModels.findOne({ email: req.user.email });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // ✅ Today's Todo (due today + not completed)
    const todayTodo = await todoModels.find({
        userId: user._id,
        completed: false,
        dueDate: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    });

    // ✅ Upcoming Todo (due after today + not completed)
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const upcomingTodo = await todoModels.find({
        userId: user._id,
        completed: false,
        dueDate: {
            $gte: tomorrow
        }
    });

    // ✅ Completed Todo
    const completedTodo = await todoModels.find({
        userId: user._id,
        completed: true
    });



    res.render("dashboard", {
        user,
        todayTodo,
        upcomingTodo,
        completedTodo,
    });
};

//render edit page
const handleRenderEditPage = async (req, res) => {
    const user = await userModels.findOne({ email: req.user.email });
    const updatetodo = await todoModels.findById(req.params.id);

    res.render("edittodo", { user, updatetodo })
}

//user creation || registration
const handleUserRegistration = async (req, res) => {

    try {
        const { name, email, password, confirmPassword } = req.body
        if (password != confirmPassword) {
            res.render("register", { password: "missmatched" })
        }else{
            // Check if user already exists
        const checkUser = await userModels.findOne({ email });
        if (checkUser) {
            return res.status(400).render("register", { user: "present" });
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



        }
        
    } catch (error) {
        return res.status(500).send("Server error during registration");

    }

}

//Login feature
const handleUserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const checkUser = await userModels.findOne({ email });
        if (!checkUser) {
            return res.render("login", { error: 1 })

        } else {
            bcrypt.compare(password, checkUser.password, (err, result) => {
                if (result) {
                    const token = jwt.sign({ email: checkUser.email, userid: checkUser._id }, process.env.SECRET_KEY)
                    res.cookie("token", token);
                    res.status(200).redirect("/dashboard")
                }
                else {
                    return res.render("login", { error: 1 })
                }

            })
        }
    } catch (error) {
        res.send("something went wrong");
        setTimeout((req, res) => {
            res.redirect("/login");
        }, 5000);
    }

}

//Todo creation
const handleTodoCreation = async (req, res) => {
    const user = await userModels.findOne({ email: req.user.email });
    const { title, description, dueDate, priority } = req.body;
    if (!title) {

        return res.render("dashboard", { message: "Can't creat empty todo !!", user });
    } else {
        const newTodo = new todoModels({
            userId: user._id,
            title,
            description,
            dueDate,
            priority
        })


        await newTodo.save();

        res.redirect("/dashboard");
    }
}


//todo deletion
const handleDeleteTodo = async (req, res) => {
    try {
        await todoModels.findByIdAndDelete(req.params.id);
        res.redirect("/dashboard");
    } catch (error) {
        console.error("Error deleting todo:", error);
        res.status(500).send("Something went wrong");
    }
}

//todo marked as compeleted
const handleMarkAsCompeleteTodo = async (req, res) => {
    try {
        await todoModels.findByIdAndUpdate(req.params.id, { completed: true , completedAt:new Date()});
        res.redirect("/dashboard");
    } catch (err) {
        console.error("Error marking completed:", err);
        res.status(500).send("Error updating task");
    }
}

//edit feature updating the existing todo
const handleUpdateTodo = async (req, res) => {
  try {
    const user = await userModels.findOne({ email: req.user.email });

    const { title, description, dueDate, priority } = req.body;

    if (!title) {
      return res.render("dashboard", { message: "Can't create empty todo !!", user });
    }

    await todoModels.findOneAndUpdate(
      { _id: req.params.id, userId: user._id }, // filter
      { $set: { title, description, dueDate, priority } }, // update
      { new: true, runValidators: true } // options
    );

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).send("Server error");
  }
};



//logout user
const handleUserLogOut = (req, res) => {
    res.cookie("token", "");
    res.redirect("/");
}

module.exports = {
    handleRenderLandingPage,
    handleRenderRegisterPage,
    handleRenderLogingPage,
    handleRenderDashboardPage,
    handleRenderEditPage,
    handleUserRegistration,
    handleUserLogin,
    handleUserLogOut,
    handleTodoCreation,
    handleUpdateTodo,
    handleDeleteTodo,
    handleMarkAsCompeleteTodo,

}