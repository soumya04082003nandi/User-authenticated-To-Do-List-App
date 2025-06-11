const express =require("express");
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");

//databases
const userModels=require("../models/user");
const taskModels=require("../models/task");


//landing page
const handleRenderLandingPage=(req,res)=>{
    res.render("home");
}

//login page
const handleRenderLogingPage=(req,res)=>{
    res.render("login")
}

//register page
const handleRenderRegisterPage=async(req,res)=>{
    res.render("register")
}

//dashboard page
const handleRenderDashboardPage=async(req,res)=>{
    res.render("dashboard");
}

//user creation || registration
const handleUserRegistration=async(req,res)=>{

}




module.exports={
    handleRenderLandingPage,
    handleRenderRegisterPage,
    handleRenderLogingPage,
    handleRenderDashboardPage
}