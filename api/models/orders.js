import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = Schema;
const orderSchema = new Schema(
  {

    shippinginfo:{
        address:{
            type:String,
            required:true,  
        },
        phoneNo:{
            type:{},
            required:true,  
        },
        city:{
            type:String,
            required:true,  
        },
        state:{
            type:{},
            required:true,  
        },
        country:{
            type:String,
            required:true,  
        },
        pinCode:{
            type:{},
            required:true,
        }
    },

    orderitems:[
        {
            name:{
                type:String,
                required:true,  
            },
            price:{
                type:{},
                required:true,  
            },
            image:{
                type:String,
            },
            quantity:{
                type:{},
                required:true,
                default:1,  
            },
            product: {
                type:ObjectId,
                ref:"Product",
                required: true,
            },
            stock:{
                type:{},
            }

        }
    ],

    paymentinfo:{
       id:{
        type:String,
        default:12,  
       },
       status:{
        type:String,
        default:'Success',  
       },    
    },

    paidAt:{
        type:Date,
        required:true,
    },
    itemsprice:{
        type:{},
        required:true,  
    },
    taxprice:{
        type:{},
        required:true,  
    },
    shippingprice:{
        type:{},
        required:true,  
    },
    totalprice:{
        type:{},
        required:true,  
    },
    orderstatus:{
        type:String,
        default: "Processing",
    },
    deliveredAt:Date,
    createdAt:{
        type:Date,
        required:true,
        default: Date.now,
    },

    user: {
        type:ObjectId,
        ref:"Userecomerce",
        required: true,
    },   
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
