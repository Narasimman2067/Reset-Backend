import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import signUpRoute from './routes/signUpRoute.js';
import loginRoute from './routes/loginRoutes.js';
import ResetRoutes from './routes/passwordReset.js';






dotenv.config();


const app = express();

app.use(express.json());

app.use(cors());

app.use("/signUp", signUpRoute);
app.use("/logIn", loginRoute);
app.use("/", ResetRoutes);


const PORT = process.env.PORT;

// database connection

mongoose.connect(process.env.DATABASE);
try {
  if (mongoose.connect) {
    console.log("mongoose connected succesfully");
  } else {
    console.log("mongooose is not connected");
  }
} catch (error) {
  console.log("mongoose disconnected", error);
}

app.get("/",(req,res)=>{
  res.send({message:"Welcome and Reset your Password"})
});







app.listen(PORT, () => {
  console.log(`${PORT} is connected succesfully`);
});
