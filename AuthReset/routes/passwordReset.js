import express from 'express';

import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import Users from '../models/Users.js';


let ResetRoutes = express.Router();


ResetRoutes.put("/forget",async(req,res)=>{
    try {
        let userAvail = await Users.findOne({gmail:req.body.gmail});
        if(!userAvail){
            return res.status(400).send("User not found!")
        }
        let verificationCode = await generateVerificationCode(6);
    
        await Users.findOneAndUpdate({gmail:req.body.gmail},{$set:{currentOTP:verificationCode}});
    
        let transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.usermail,
                pass:process.env.userpass,
            }
        })
    
        let mailOptions={
            from:process.env.usermail,
            to:req.body.gmail,
            subject: "User verification",
            html:`<h1>${verificationCode}</h1>`
    
        };
        await transporter.sendMail(mailOptions,function(err,info){
            if(err){
                console.log(err,"transport-Send")
                res.json({message:"error"})
            }
            else{
                console.log('Email sent: ' + info.response);
                res.json({
                    message: "Email sent"
                })
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send()
    }
})
ResetRoutes.post("/verification",async(req,res)=>{
    try {
        let user = await Users.findOne({gmail:req.body.gmail});
        if(user.currentOTP == req.body.verificationCode){
           return res.status(201).json({message:"Success",user:user})
        }
        else{
            res.status(400).send({message:"OTP doesn't match"})
        }
    } catch (error) {
        console.log(error);
      
    }
})
ResetRoutes.put("/updatePassword",async(req,res)=>{
    try {
        let salt =await bcrypt.genSalt(10);
        let userPassword = req.body.password.toString();
        let hashedPassword = await bcrypt.hash(userPassword,salt);
        let user = await Users.findOneAndUpdate({gmail:req.body.gmail},{$set:{password:hashedPassword}});
        res.status(200).send("Password Updated",user);
    } catch (error) {
        console.log(error);
      
    }
})
function generateVerificationCode(num) {
    let randomString = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 1; i <= num; i++) {
        randomString += characters.charAt(
            Math.floor(Math.random() * (charactersLength + i)) // just for randomly obtaining
        );
    }
    
    return randomString
    
}
export default ResetRoutes;