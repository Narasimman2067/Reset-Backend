import express from 'express';

import bcrypt from 'bcryptjs';
import Users, { generateAuthToken } from '../models/Users.js';

let loginRoute = express.Router();
loginRoute.post("/",async(req,res)=>{
    try {
        const userToLogin = await Users.findOne({gmail:req.body.gmail});
    if(!userToLogin){
        return res.status(400).send("User not found");
    }
    const validPassword =await bcrypt.compare(
        req.body.password,userToLogin.password
    )
    if(!validPassword){
        return res.status(400).send("Invalid password");
    }
    const authToken = await generateAuthToken(userToLogin._id);
    res.status(200).send({authToken:authToken,userName:userToLogin.userName});
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
    
})
export default loginRoute 