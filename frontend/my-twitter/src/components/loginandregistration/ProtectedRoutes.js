import React from 'react'
import { useNavigate ,Navigate} from 'react-router-dom'

const ProtectedRoutes = ({children}) => {

 const navigate=useNavigate();
 
 const userInLocalStorage=JSON.parse(localStorage.getItem('auth'));
 console.log(userInLocalStorage?.userDetails?.email);

 if(!userInLocalStorage?.userDetails?.email){
    return <Navigate to ='/login' />
 }
  return children
 
}

export default ProtectedRoutes
