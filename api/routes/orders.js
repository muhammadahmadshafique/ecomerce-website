import express from "express"
const router= express.Router()

import {createorder,getsingleorder,loggedinuserorders,allOrders,updateorderstatus,deleteOrder} from "../controllers/orders"


//Middle wares

import { requireSignin,isAdmin} from "../middlewares";

router.post("/createorder",requireSignin,createorder);
router.get("/loggedinuserorders",requireSignin,loggedinuserorders);
router.get("/allOrders",requireSignin,isAdmin,allOrders);
router.delete("/deleteorder/:deleteorder",requireSignin,isAdmin,deleteOrder);

router.post("/updateorderstatus/:updateorderstatus",requireSignin,isAdmin,updateorderstatus);

router.get("/getsingleorder/:getsingleorder",requireSignin,getsingleorder);


module.exports=router;



