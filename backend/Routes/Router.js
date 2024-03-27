import express from "express";
import {registeruser, loginperson ,VerifyToken} from "../controllers/user-controller.js";
import { uploadProfilePicture,getProfileData,deleteProfilePictureFormCloud,getUserProfileData, getAllTheUsers,followUser, updatetheuser} from "../controllers/userprofile-controller.js";
import logginedstatus from "../middleware/logginedstatus.js";


const Router= express.Router();


Router.post('/register', registeruser)

Router.post('/login', loginperson)

Router.get('/confirm/:token',VerifyToken)

Router.post('/userprofile/:id',logginedstatus,uploadProfilePicture)
Router.delete('/userprofile/deleteprofilepic/:id',logginedstatus,deleteProfilePictureFormCloud)
Router.get('/userprofile/profiledata/:id',logginedstatus,getProfileData)
Router.get('/user/userprofiledata/:id',logginedstatus,getUserProfileData)
Router.get('/search/users',logginedstatus,getAllTheUsers)
Router.post('/users/follow/:id/:myid',followUser)

Router.post('/updateuser',logginedstatus,updatetheuser)
// Router.post('/users/unfollow/:id/:myid',unfollowUser)
// Router.get('/verifyToken/:token',confirmToken)




export default Router;