import Order from "../models/orders"
import Product from "../models/products"


//Create Order
export const createorder= async (req,res)=>{
   try {
        req.body.user= req.auth._id;
        req.body.paidAt= Date.now();
        console.log(req.body)
        
        const ordersave= new Order(req.body)
        await ordersave.save()
        res.json({
            message:true,
            ordersave:ordersave,
        })
    
   } catch (error) {
       res.json("NO ORDER CREATED")
    
   }
}

// get Single Order
export const getsingleorder= async (req,res)=>{
    try {
        const singleorder = await Order.findById(req.params.getsingleorder)
        return res.json(singleorder)     
    } catch (error) {
        return res.json("Not get single Order")
        
    }
}
 

//get logged in user  Orders

export const loggedinuserorders = async (req,res)=>{
    console.log(req.auth._id)

    try {
        const loggedinuserorders = await Order.find({user:req.auth._id})
        return res.json(loggedinuserorders)     
    } catch (error) {
        return res.json("Not get loggedinuserorders")
        
    }
}

//get all Orders -- Admin

export const allOrders = async (req,res)=>{

    try {
        const allorders = await Order.find({})
        let totalAmount = 0;

        allorders.forEach((order) => {
          totalAmount += order.totalprice;
        });
        return res.json({
            totalAmount,
            allorders
        })     
    } catch (error) {
        return res.json("Not get allorders")
        
    }
}

// update Order Status -- Admin

export const updateorderstatus = async (req,res)=>{

    try {
        const changeorderstatus = await Order.findById(req.params.updateorderstatus)

        if(changeorderstatus.orderstatus==='Delivered'){
            return res.json("Already Delivered")

        }

        if(req.body.status==='Shipped'){ 
            changeorderstatus.orderitems.forEach(async (oneitem)=>{
                console.log(oneitem.product)
                const productquantychanged=await Product.findById(oneitem.product)
                console.log('Okkkkkkkkkkkkkkk,',productquantychanged)
                productquantychanged.stock-=oneitem.quantity
                await productquantychanged.save({ validateBeforeSave: false }); 
            })
        }
        if (req.body.status === "Delivered") { 
            changeorderstatus.deliveredAt = Date.now();
          }
        changeorderstatus.orderstatus=req.body.status

        await changeorderstatus.save()

        res.status(200).json({
            success: true,
          });
 
        
    } catch (error) {
        return res.json("Not update changeorderstatus")
        
    }
}

// delete Order -- Admin 
export const deleteOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.deleteorder);
  
    if (!order) {
      return res.json("Order not found with this Id");
    }
  
    await order.remove(); 
  
    res.status(200).json({
      success: true,
    });
  };