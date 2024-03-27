import React from 'react'
import "./reg.css";
import { Link } from 'react-router-dom'
import { useState } from 'react'
import {loginUser} from "./../../service/api";
import { useNavigate } from 'react-router-dom'
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultValue ={
    username:"",
    password:""

}

const Login = () => {

    const [user , setUser]= useState(defaultValue);

const inlogin=(e)=>{
    
    setUser({...user,[e.target.name]:e.target.value});
}
const navigate = useNavigate()

const togglePage = ()=>{
  navigate('/register');
}
const addUserDetails=async(e)=>{
    e.preventDefault();
    if ( user.username && user.password){
         const response=await loginUser(user);
          const {data} = await loginUser(user);
    // .then(res=>alert(res.data.message));
     if (data?.user && data.logined===true) {
        if(response?.status===200){
           
            localStorage.setItem('auth',JSON.stringify(data));
            toast.success(data.message)
            navigate('/')
              }
             if(response?.status===401 || response?.status === 404){
              toast.error('error 401 or 404')
                navigate('/login')
              }
          
           
           
     } else {
        toast.error(data.message)
     }

      
        
    }else{
        toast.error('Invalid Inputs Please Fill All Fields')
    }
}


    return (
        <div className="blockElement">
            <div className="container" id="container">
                <div className="form-container log-in-container">
                    <form action="#" className="userForm">
                        <h1 className="firstHeading">Log in</h1>
                        <input type="username" onChange={(e)=>inlogin(e)} name="username" placeholder="Username" />
                        <input type="password" onChange={(e)=>inlogin(e)} name="password" placeholder="Password" />
                        <button onClick={(e)=>addUserDetails(e)} className="enterButton">Login</button>
                        <p className="fancy">Don't have an account? <span className="anchor" onClick={()=>togglePage()}>Register here</span></p>
                    </form>
                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-right">
                            <h2>Welcome Back</h2>
                            <i className="fa-regular fa-message"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
