import React from 'react'
import "./reg.css"
import { Link } from 'react-router-dom'
import { useState} from 'react'
import {registerUser} from "./../../service/api";
import { useNavigate } from 'react-router-dom'

import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const defaultValue ={
    name:"",
    email:"",
    username:"",
    password:""

}





const Register = () => {


const [user , setUser]= useState(defaultValue);
const [isValidUsername, setIsValidUsername] = useState(true);


const inRegister=(e)=>{
  if (e.target.name === 'username' && !e.target.value.startsWith('@')) {
    setIsValidUsername(false);
} else {
    setIsValidUsername(true);
    setUser({...user,[e.target.name]:e.target.value});
}
    
    // setUser({...user,[e.target.name]:e.target.value});
   
}
console.log(user);
  const navigate = useNavigate()

  const togglePage = ()=>{
    navigate('/login');
  }
  


const addUserDetails=async(e)=>{
    e.preventDefault();
    const mailFormat=/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (user.name && user.email && user.username && user.password){
        if (!mailFormat.test(user.email)) {
           toast.error('Wrong Email Format')
        } else {
            const response= await registerUser(user);
            console.log(response)
            if(response?.status===200){
             
            toast.success(response.data.message)
               navigate('/login')
               
             }
           if(response?.status===401 || response?.status === 404){
             toast.success(response.data.message)
               navigate('/register')
             }
        }
     
     
    }else{
       
        toast.error('Invalid Inputs Please Fill All Fields')
    }
    
}

  return (
    <>
    
    <div className="blockElement">
    <div className="container" id="container">
        <div className="form-container log-in-container">
            <form  className="userForm">
                <h1 className="firstHeading">Register</h1>
                <input onChange={(e)=>inRegister(e)} name="name" placeholder="Full Name" />
                <input onChange={(e)=>inRegister(e)} name="email" placeholder="Enter Working Email Only " />
                <input onChange={(e)=>inRegister(e)} name="username" placeholder="Username" />
                {!isValidUsername && (
                <p style={{ color: 'red',fontSize:'14px' }}>Username must start with '@'</p>
            )}
                <input onChange={(e)=>inRegister(e)} name="password" placeholder="Password" type="password" />
                <button onClick={(e)=>addUserDetails(e)} className="enterButton">Register</button>
                <p className="fany">Already Registered? <span className="anchor" onClick={()=>togglePage()} >Login here</span></p>
            </form>
        </div>
        <div className="overlay-container">
            <div className="overlay">
                <div className="overlay-panel overlay-right">
                    <h2>Join Us</h2>
                    <i className="fa-regular fa-comments"></i>
                </div>
            </div>
        </div>
    </div>
</div>

</>
  )
}

export default Register
