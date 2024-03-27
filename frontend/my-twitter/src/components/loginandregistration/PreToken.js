import axios from 'axios';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
const URL='https://fancyorg.onrender.com'
// const URL=`http://localhost:8000`;
const PreToken = () => {
const {token}=useParams();
const sendTokenToBackendToVerify=async()=>{
    const {data}=await axios.post(`${URL}/api/auth/verifyToken/${token}`)
}
useEffect(()=>{
  sendTokenToBackendToVerify()
},[])
  return (
    <div>
      {token}
    </div>
  )
}
export default PreToken
