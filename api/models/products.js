import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = Schema;
const productSchema = new Schema(
  {
    name:{
        type:String,
        required:[true,"Please Enter the Name"],
        trim:true,
    },
    description:{
        type:{},
        required:[true,"Please Enter the Description"]
    },
    price:{
        type:Number,
        required:[true,"Please Enter the Price"],
        maxLength:[4,"Price Should be less than 4 digits"]
    },
    category:{
        type:{},
        required:[true,"Please Enter the Category"]
    },
    stock:{
        type:Number,
        required:[true,"Please Enter the Stock"],
        maxLength:[4,"Stock Should be less than 4 digits"],
        default:1,
    },

    images:{
        type:{},
    },

    rating:{
        type:Number,
        default:5,
    },
    numberofreviews:{
        type:Number,
        default:0,
    },
    
    user: {
        type:ObjectId,
        ref:"Userecomerce",
        required: true,
    },
   
    reviews:[
        {   
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            name:{
                type:{},
                required:[true,"Please Enter the Name"]
            },
            rating:{
                type:{},
                required:[true,"Please Enter the Rating"],
            },
            comment:{
                type:{},
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }
    
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
