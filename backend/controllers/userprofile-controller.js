import { v2 as cloudinary } from 'cloudinary';
import User from "../schema/user-schema.js";
import fs from 'fs';
import jwt from 'jsonwebtoken'


const uploadProfilePicture = async (req, res) => {

    if (!req.files) {
        return res.json({ message: 'file not recieved' });
    } else {

        const filePath = req.files.file.tempFilePath
        const userIdOfUploader = req.params.id
        try {
            const userdata = await User.findOne({ _id: userIdOfUploader });
            if (userdata.profilepicture === '0' || userdata.profilepictureid === '0') {
                const result = await cloudinary.uploader.upload(filePath, {
                    use_filename: true,
                    folder: 'fancyprofilepictures'
                });
                // delete temp to remove from your own server
                fs.unlinkSync(filePath);
                const userprofilepic = await User.updateOne({ _id: userIdOfUploader }, { $set: { profilepicture: result.secure_url, profilepictureid: result.public_id } });
                return res.json({ message: "Profile Picture Uploaded", image: { src: result.secure_url }, profileimageid: result.public_id })
               } else {
                const deletePreviousProfilePicCloud = await cloudinary.uploader.destroy(userdata.profilepictureid);
                const result = await cloudinary.uploader.upload(filePath, {
                    use_filename: true,
                    folder: 'fancyprofilepictures'
                });
                // delete temp to remove from your own server
                fs.unlinkSync(filePath);
                const previoususerprofilepic = await User.updateOne({ _id: userIdOfUploader }, { $set: {  profilepicture: result.secure_url, profilepictureid: result.public_id } });
                return res.json({ message: "Profile Picture Uploaded", image: { src: result.secure_url }, profileimageid: result.public_id })
                }
             } catch (error) {
            console.log('error in cloudinary')
            res.json({ message: "profile picture uploadeding cloud error" })
            }
          }
      }


const deleteProfilePictureFormCloud=async(req,res)=>{
    const userIdOfUser = req.params.id
    const userdata = await User.findOne({ _id: userIdOfUser });
    const deletePreviousProfilePicCloud = await cloudinary.uploader.destroy(userdata.profilepictureid);
    const userprofilepic = await User.updateOne({ _id: userIdOfUser }, { $set: { profilepicture:'0', profilepictureid:'0'} });
      return res.json({message:'Profile Image Deleted'})
}


const getProfileData = async (req, res) => {
    const userIdOfLogginedUser = req.params.id

    try {

        const dataofloggineduser = await User.findOne({ _id: userIdOfLogginedUser }).select('-password')

        return res.json({ message: "userdata", userdata: dataofloggineduser })
    } catch (error) {
        console.log('error in get controller', error)
    }

}


const getUserProfileData=async(req,res)=>{
    const userIdOfUser = req.params.id
    try {

        const dataofuser = await User.findOne({ _id: userIdOfUser }).select('-password')

        return res.json({ message: "userdata", userdata: dataofuser})
    } catch (error) {
        console.log('error in get controller', error)
    }
    
}


const getAllTheUsers=async(req,res)=>{
    const userDatas=await User.find({}).select("-password");
    
    res.json({message:"Tweet Data",userDatas})
  }


  const followUser = async (req, res) => {
    const userToBeFollowedId = req.params.id;
    const userid = req.params.myid;
  
    try {
      const followed = await User.findById(userToBeFollowedId);
      if(followed.verified===false){
   
         return res.json({ message:'User is not verified' });
  
      }else{
       
        if (!followed.followers.includes(userid)) {
          const userDetailsOfUserToBeFollowed = await User.findByIdAndUpdate(
            userToBeFollowedId,
            { $push: { followers: userid } },
            { new: true }
          );
          const userDetailsWhoWantsToFollow = await User.findByIdAndUpdate(
            userid,
            { $push: { following: userToBeFollowedId } },
            { new: true }
          );
         
        } else {
          const userDetailsOfUserToBeunFollowed = await User.findByIdAndUpdate(
            userToBeFollowedId,
            { $pull: { followers: userid } },
            { new: true }
          );
          const userDetailsWhoWantsTounFollow = await User.findByIdAndUpdate(
            userid,
            { $pull: { following: userToBeFollowedId } },
            { new: true }
          );
          
        }
        return res.json({ message: followed.followers.includes(userid) ? 'Unfollowed successfully' : 'Followed successfully' });
      }
     
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

const updatetheuser=async(req,res)=>{
  const newname=JSON.parse(req.body.updateuser);
  console.log(newname.name)
  const dateofbirthupdate=JSON.parse(req.body.birthday);
  console.log(dateofbirthupdate)
  const userid=req.user.userid;
  console.log(userid)
  const userfind=await User.findByIdAndUpdate({_id:userid},{ $set: { name:newname.name,birthday:dateofbirthupdate} },{ new: true })

  const token = jwt.sign(
    { userid:userfind._id,
      name: userfind.name,
      email: userfind.email
    }, process.env.JWTCODE, { expiresIn: "7d" }
  )
   return res.json({message:'Update successful', user: token, logined: true, userDetails: { email: userfind.email, name: userfind.name },userid:userfind._id})
}
 
    


// const unfollowUser=async(req,res)=>{
//     const userToBeunFollowedId=req.params.id;
//     const userid=req.params.myid;
//     console.log(userToBeunFollowedId)
//     console.log(userid)
//     const userDetailsOfUserToBeunFollowed=await User.findByIdAndUpdate({_id:userToBeunFollowedId},{ $pull: { followers:userid} },{ new: true })
//     const userDetailsWhoWantsTounFollow=await User.findByIdAndUpdate({_id:userid},{$pull:{following:userToBeunFollowedId}},{new:true})
//     res.json({message:"Tweet Data"})
    
// }


export { uploadProfilePicture, getProfileData ,deleteProfilePictureFormCloud,getUserProfileData,getAllTheUsers,followUser,updatetheuser};