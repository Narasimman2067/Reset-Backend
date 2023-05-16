import mongoose from "mongoose";
import jwt from 'jsonwebtoken';


let userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    gmail:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    currentOTP:{
        type:String,
    },
})
export const generateAuthToken = (id)=>{
    return jwt.sign({id},process.env.SECRET_KEY)
}

export default mongoose.model("Users", userSchema);

