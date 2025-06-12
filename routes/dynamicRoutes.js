const express=require("express");
const router=express.Router();

//controllers
const {handleRenderLandingPage,
        handleRenderRegisterPage,
        handleRenderLogingPage,
        handleRenderDashboardPage,
        handleUserRegistration,
        handleUserLogin,
        handleUserLogOut,
        handleTodoCreation,
        handleDeleteTodo,
        handleMarkAsCompeleteTodo

    }=require("../controllers/dynamicController")

// middleware
const {isLogedin}=require("../middleware/auth")



//rendering landing page
router.get("/",handleRenderLandingPage);

//rendering login page
router.get("/login",handleRenderLogingPage);

//rendering register page
router.get("/register",handleRenderRegisterPage);

//rendering dashboard page
router.get("/dashboard",isLogedin,handleRenderDashboardPage)



//user registration || user creation
router.post("/register",handleUserRegistration);

//User login
router.post("/login",handleUserLogin)


//todo creation
router.post("/creattodo",isLogedin,handleTodoCreation)

//todo mark as compelete
router.get("/markcompleted/:id", isLogedin,handleMarkAsCompeleteTodo)



//todo deletion
router.get("/delete/:id",isLogedin,handleDeleteTodo);





//LOgout user
router.get("/logout",handleUserLogOut)

module.exports=router;
