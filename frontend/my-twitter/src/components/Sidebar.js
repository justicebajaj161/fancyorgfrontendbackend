import React, { useContext, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import "../styles.css"
import { NavLink ,useNavigate} from 'react-router-dom'
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { gettingProfileData } from '../service/api';
import { SidebarContext } from './SidebarContext';



const Sidebar = () => {
  const [profileimg, setProfileimg] = useState('')
  const [profilename, setProfilename] = useState('')
  const [profileusername, setProfileusername] = useState('')
  const { isSidebarOpen,setIsSidebarOpen } = useContext(SidebarContext);



  const allProfileData = async () => {
    const user = JSON.parse(localStorage.getItem('auth'))
    const id = user.userid;
    const { data } = await gettingProfileData(id)
   setProfileimg(data.userdata.profilepicture)
    setProfilename(data.userdata.name)
    setProfileusername(data.userdata.username)
  }
  allProfileData()
  useEffect(() => {
    allProfileData()
  }, [])

  const navigate=useNavigate();
  const logOut=()=>{
    localStorage.removeItem('auth')
    navigate('/login')
    toast.success('Logged Out Successfully')
  }
  const opensideitem=()=>{
    {setIsSidebarOpen(!isSidebarOpen)}
   
    
  }
  return (
  <>
  
      {/* Sidebar content */}
  
  <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
 
    <i className="fa-regular fa-message" />
    <NavLink  to="/" onClick={()=>opensideitem()} activeClassName="active" className="link"><div className="sidebarOption ">
      <span className="material-symbols-outlined">
       
        home
      </span>
      <h2>Home</h2>
    </div></NavLink>
    <NavLink to="userprofile" onClick={()=>opensideitem()} activeClassName="active" className="link"><div className="sidebarOption">
      <span className="material-symbols-outlined">
        person
      </span>
      <h2>Profile</h2>
    </div></NavLink>
    <NavLink to='searchprofile' onClick={()=>opensideitem()} activeClassName="active" className="link"><div className="sidebarOption">
    <span class="material-symbols-outlined">
      search
       </span>
      <h2>Search</h2>
    </div></NavLink>
    <span activeClassName="" className="link" onClick={()=>logOut()}><div className="sidebarOption">
      <span className="material-symbols-outlined" >
        logout
      </span>
      <h2>logout</h2>
    </div></span>
  
     {/* <div className='sidebarsearchboxdiv'><input className='sidebarsearchBox' style={{paddingLeft:"0.5rem"}} placeholder='Search...'/><span className='sidebarsearchIcon'><i class="fa-solid fa-magnifying-glass"/></span></div> */}


    <div className="sidebarOption2 justify-content-center gap-2 last-sidebar-item">
      <div className="user-profile-img-container">
        <div  className='user-profile-img-container-sidebar'><img src={profileimg} alt='bla'/></div>
      </div>
      <div className="name-n-username-container">
        <h4>{profilename}</h4>
        <div className="username-container">
          <span>{profileusername}</span>
        </div>
      </div>
    </div>
  </div>
 
 
<Outlet/>
</>

  )
}

export default Sidebar
