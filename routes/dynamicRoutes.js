const express=require("express");
const router=express.Router();

//controllers
const {handleRenderLandingPage,
        handleRenderRegisterPage,
        handleRenderLogingPage,
        handleRenderDashboardPage,
        handleUserRegistration

    }=require("../controllers/dynamicController")




//rendering landing page
router.get("/",handleRenderLandingPage);

//rendering login page
router.get("/login",handleRenderLogingPage);

//rendering register page
router.get("/register",handleRenderRegisterPage);

//rendering dashboard page
router.get("/dashboard",handleRenderDashboardPage)



//user registration || user creation
router.post("/register",handleUserRegistration);


module.exports=router;
