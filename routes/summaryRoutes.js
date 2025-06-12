const express=require("express");
const router=express.Router();

const {handleRenderSummaryPage,
    handleGenerateSummary,

} = require("../controllers/summaryControllers")

//middleware
const {isLogedin}=require("../middleware/auth")



//rendering the summary page
router.get("/",isLogedin,handleRenderSummaryPage);

//generating summary
router.get("/generate-summary",isLogedin,handleGenerateSummary)




module.exports=router;