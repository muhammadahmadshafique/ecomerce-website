import express from "express"
const router= express.Router()

import {createproducts,getallproducts,getoneproduct,deleteoneproduct,updateoneproduct,reviewcreateandupdate,allreviewsofproduct,deleteReview,allAdminnnproduct} from "../controllers/products"


//Middle wares

import { requireSignin,isAdmin} from "../middlewares";

router.get("/allreviewsofproduct",requireSignin,isAdmin,allreviewsofproduct);
router.get("/Adminnnproductall",requireSignin,isAdmin,allAdminnnproduct);

router.delete("/deleteReview",requireSignin,isAdmin,deleteReview);

router.post("/createproducts",requireSignin,isAdmin,createproducts);
// router.get("/getallproducts",requireSignin, isAdmin,getallproducts);
router.get("/getallproducts",getallproducts);
router.get("/:getoneproduct",getoneproduct);
router.delete("/:deleteoneproduct",requireSignin,isAdmin,deleteoneproduct);
router.put("/:updateoneproduct",requireSignin,isAdmin,updateoneproduct);

router.post("/reviewcreateandupdate",requireSignin,reviewcreateandupdate);   


module.exports=router;



