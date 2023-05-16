import express from 'express';

import bcrypt from 'bcrypt';
import Users, { generateAuthToken } from '../models/Users.js';

const signUpRoute = express.Router();
signUpRoute.post("/",async(req,res)=>{
    try {
        let newUser = await Users.findOne({gmail:req.body.gmail});
        if(newUser){
           return res.status(400).send({message:"User already exists"})
        }
        let salt = await bcrypt.genSalt(10);
        let userPassword = req.body.password.toString();
        let hashedPassword = await bcrypt.hash(userPassword,salt)
        newUser = await new User({
            userName:req.body.userName,
            gmail:req.body.gmail,
            password:hashedPassword
        }).save();
        let AuthToken = generateAuthToken(newUser._id);
        res.status(200).send({authToken:AuthToken,userName:newUser.userName});
    } catch (error) {
        console.log(error);
        res.status(500).send()
    }
})
export default signUpRoute;