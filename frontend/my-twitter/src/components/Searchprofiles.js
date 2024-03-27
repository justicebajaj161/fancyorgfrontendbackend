import React, { useContext } from 'react'
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { getAllUsersAxios } from '../service/api';
import { SidebarContext } from './SidebarContext';

const Searchprofiles = () => {
    const [allusers,setAllusers] = useState('')
    const [query,setQuery]=useState('')
    const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);


    const user = JSON.parse(localStorage.getItem('auth'))
    const id = user.userid;

    const navigate = useNavigate()
  const openClickedProfile=(e)=>{
    if (id===e) {
      navigate(`/userprofile`)
    } else {
      navigate(`/user/${e}`)  
    }
    
  }

    useEffect(() => {
     getAllUsers()
      }, [])

    const getAllUsers=async()=>{
        const {data}=await getAllUsersAxios();
        setAllusers(data.userDatas)
    }

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

    
    console.log(allusers)

  return (
    <>
    <div className="feed ">
    <div className='toggle-bar d-flex'>
  <i className="fa-solid fa-bars" onClick={toggleSidebar}/>
  </div>
  <div className='sidebarsearchboxdiv'>
        <input className='sidebarsearchBox' placeholder='Search...' onChange={(e)=>setQuery(e.target.value)}/>
    <span className='sidebarsearchIcon'><i class="fa-solid fa-magnifying-glass"/></span></div>
    { allusers && allusers.filter((user)=>user.name.toLowerCase().includes(query.toLowerCase())).map((user)=>(
      
        <>
      { query.length===0?'':
      <>
  <div className='usersearchdetails d-flex' onClick={(e)=>openClickedProfile(user?._id)}>
  <div className='imgofuser'><img src={user?.profilepicture} className='imgofuser-img'/></div>
  <h6 className='nameofuser'>{user?.name}</h6>
  <h6 className=' usernameoftheuser'>{user?.username}</h6>
 
</div>
<hr/>
</>
    } 
</>
    ))}
  


    </div>
    </>
  )
}

export default Searchprofiles
