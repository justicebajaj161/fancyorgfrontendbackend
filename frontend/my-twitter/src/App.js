import './App.css';
import Sidebar from "./components/Sidebar";
import Feeds from "./components/Feeds";
import Containerlg from "./components/Containerlg";
import Userprofile from "./components/Userprofile";
import Otherprofiles from "./components/Otherprofiles";
import TweetReplies from './components/TweetReplies';
import Searchprofiles from './components/Searchprofiles';
import Login from "./components/loginandregistration/Login";
import Register from "./components/loginandregistration/Register";
import React, { useContext } from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link,NavLink } from 'react-router-dom';
import ProtectedRoutes from './components/loginandregistration/ProtectedRoutes';
import { SidebarProvider } from './components/SidebarContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  { LoadingContext, LoadingProvider} from './components/LoadingContext';
import { BallTriangle } from "react-loader-spinner";



// import PreToken from './components/loginandregistration/PreToken';




function App() {
  const {loading, setLoading} = useContext(LoadingContext);
  return (
    <>
   
      <SidebarProvider>
      <BrowserRouter>
        
        <Containerlg>
        {loading ? (
              <div className="loading-overlay">
                <BallTriangle
                  color="#00BFFF"
                  height={100}
                  width={100}
                />
              </div>
            ) : (
              <ToastContainer />
            )}
          {/* <Sidebar /> */}
          <Routes>

            {/*Another way is using Outlet*/}
            
            <Route path="/login" element={<Login />} />
            {/* <Route path="/confirm/:token" element={<PreToken />} /> */}
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoutes><Sidebar /></ProtectedRoutes>}>
              <Route index element={<ProtectedRoutes><Feeds /></ProtectedRoutes>} />
              <Route path="/userprofile" element={<ProtectedRoutes><Userprofile /></ProtectedRoutes>} />
              <Route path="/searchprofile" element={<ProtectedRoutes><Searchprofiles /></ProtectedRoutes>} />
              <Route path="/user/:id" element={<ProtectedRoutes><Otherprofiles /></ProtectedRoutes>} />
              <Route path="/tweetreplies/:id" element={<ProtectedRoutes><TweetReplies /></ProtectedRoutes>} />
            </Route>
         

          </Routes>
        </Containerlg>
      </BrowserRouter>
      </SidebarProvider>
     
      {/* <Containerlg>
    <Sidebar/>
    <Feeds/>
    </Containerlg>  */}

    </>
  );
}

export default App;
