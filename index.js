const express=require("express");
const app=express();
const path=require("path")
const allRoutes=require("./routes/dynamicRoutes")
const {conectDB}=require("./config/db")


//Enviornment variable 
const dotenv=require("dotenv");
dotenv.config();

//Database connection
conectDB()



//middlewares
app.set("view engine", "ejs");
app.set("views",path.resolve("./views"));

//USES
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));





//routes

app.use("/",allRoutes);















app.listen(process.env.PORT,()=>{
    try {
        
        console.log("server started at" , process.env.PORT);
        
    } catch (error) {
        console.log("error",error)
    }
    
})