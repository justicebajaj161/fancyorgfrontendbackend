import User from "../schema/user-schema.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv';
import nodemailer from 'nodemailer'

dotenv.config();
const apiNodemaileruser=process.env.NODEMAILER_USER;
const apiNodemailerpass=process.env.NODEMAILER_PASS;




const sendEmail=async(email,userWithHashedPassword)=>{
  console.log(email)
  var transporter =  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: apiNodemaileruser,
      pass: apiNodemailerpass
    }
  });
  
  var mailOptions = {
    from: apiNodemaileruser,
    to: email,
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };
  
  transporter.sendMail(mailOptions, async function(error, info){
    if (error) {
      console.log(error);
    } else {
      
      const newUser=await new User({...userWithHashedPassword}).save();
      console.log(newUser);
      res.json({message:'User Added Successfully',newUser:userWithHashedPassword})
      console.log('Email sent: ' + info.response);
     
    }
  });
}
export default sendEmail