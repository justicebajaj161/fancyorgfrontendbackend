import Tweet from "../schema/tweet-schema.js";
import User from "../schema/user-schema.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'



const tweetOfUser=async(req,res)=>{
 const tweet=JSON.parse(req.body.tweet);
const contentTweet=tweet.contentTweet
 const data = req.body
 const files=req.files
 console.log('file reacging tweet controller',contentTweet)

if(!files){
   const userDetails=await User.findOne({_id:req.user.userid})
   const tweety = await new Tweet({userid:req.user.userid,tweetText:contentTweet}).save();
    return res.json({message:"Tweet Posted",tweet:tweety.tweetText})
}
const filePath = files.tweetmedia.tempFilePath
   const result = await cloudinary.uploader.upload(filePath, {
      use_filename: true,
      folder: 'tweetmedia'
  });
  // delete temp to remove from your own server
  fs.unlinkSync(filePath);
   const userDetails=await User.findOne({_id:req.user.userid})
    const tweety = await new Tweet({userid:req.user.userid,tweetText:contentTweet,tweetMedia:result.secure_url,tweetMediaPublicId:result.public_id}).save();
    res.json({message:"Tweet Posted",tweet:tweety.tweetText})
 
}

const getAllTweets=async(req,res)=>{
    const tweetDatas=await Tweet.find({}).sort({createdAt:'desc'}).populate({ path: 'userid', select: '-password' }).populate({ path: 'reTweetedBy', select: '-password' })
    
    res.json({message:"Tweet Data",tweetDatas})
}

// const deleteThisTweet=async(req,res)=>{
//       const tweetid=req.params.tweetid
//       console.log(tweetid)
//       const tweetData=await Tweet.findOne({_id:tweetid});
//       if(tweetData.tweetMediaPublicId){
//          const deleteTweetMediaFromCloud = await cloudinary.uploader.destroy(tweetData.tweetMediaPublicId);
//          const tweetDelete=await Tweet.deleteOne({_id:tweetid})
//       res.json({message:"Tweet Deleted"})
//       }else{
//       const tweetDelete=await Tweet.deleteOne({_id:tweetid})
//       return res.json({message:"Tweet Deleted"})}
// }
const deleteThisTweet = async (req, res) => {
  const tweetId = req.params.tweetid;

  try {
    // Find the tweet and its nested replies
    const tweetData = await Tweet.findOne({ _id: tweetId }).populate({
      path: "replies",
      populate: { path: "replies", populate: { path: "replies" } }
    });

    // Recursively delete the nested replies
    const deleteReplies = async (replies) => {
      for (const reply of replies) {
        if (reply.replies.length > 0) {
          await deleteReplies(reply.replies);
        }
        if (reply.tweetMediaPublicId) {
          // Delete the tweet media from Cloudinary
          await cloudinary.uploader.destroy(reply.tweetMediaPublicId);
        }
        await Tweet.deleteOne({ _id: reply._id });
      }
    };

    // Delete the tweet and its nested replies
    await deleteReplies(tweetData.replies);

    if (tweetData.tweetMediaPublicId) {
      // Delete the tweet media from Cloudinary
      await cloudinary.uploader.destroy(tweetData.tweetMediaPublicId);
    }

    await Tweet.deleteOne({ _id: tweetId });

    res.json({ message: "Tweet and nested replies deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error occurred during tweet deletion" });
  }
};



const getMyTweets=async(req,res)=>{
   const myId=req.params.id
   const tweetDatas=await Tweet.find({userid:myId}).sort({createdAt:'desc'}).populate({ path: 'userid', select: '-password' }).populate({ path: 'reTweetedBy', select: '-password' })
    
   res.json({message:"Tweet Data",tweetDatas})
}

const getUserTweets=async(req,res)=>{
   const UsersId=req.params.id
   console.log('my data',UsersId)
   const tweetDatas=await Tweet.find({userid:UsersId}).sort({createdAt:'desc'}).populate({ path: 'userid', select: '-password' }).populate({ path: 'reTweetedBy', select: '-password' })
    
   res.json({message:"Tweet Data",tweetDatas})
}

const getTweetByTweetId=async(req,res)=>{
   const tweetId=req.params.id
   console.log(tweetId)
   const tweetDatasOfTweetId=await Tweet.findById({_id:tweetId}).populate({ path: 'userid', select: '-password' }).populate({ path: 'reTweetedBy', select: '-password' })
    res.json({message:"Tweet Data",tweetDatasOfTweetId})
}


const reTweeting=async(req,res)=>{
   const tweetid=req.params.id
   const userid=req.user.userid
   const reTweet=await Tweet.findByIdAndUpdate({_id:tweetid},{ $push: { reTweeted: userid } })
   const reTweetedTweet=await new Tweet({userid:reTweet.userid._id,tweetText:reTweet.tweetText,tweetMedia:reTweet.tweetMedia,tweetMediaPublicId:reTweet.tweetMediaPublicId,reTweetedBy:userid,isAReTweet:true,reTweeted:reTweet.reTweeted}).save()
  res.json({message:`Retweeted`})
}


const LikeTheTweet = async (req, res) => {
   const tweetId = req.params.id;
   const userId = req.user.userid;
 
   try {
     const tweet = await Tweet.findById(tweetId);
 
     if (tweet.likes.includes(userId)) {
       return res.json({ message: 'Error: User already liked the tweet' });
     } else {
       // Check if the user has already liked the tweet in a concurrent request
       const updatedTweet = await Tweet.findOneAndUpdate(
         { _id: tweetId, likes: { $ne: userId } }, // Check if userId is not present in the likes array
         { $push: { likes: userId } },
         { new: true }
       );
 
       if (!updatedTweet) {
         return res.json({ message: 'Error: User already liked the tweet' });
       }
 
       return res.json({ message: 'Tweet liked successfully' });
     }
   } catch (error) {
     return res.status(500).json({ message: 'Error liking the tweet' });
   }
 };
 

const UnLikeTheTweet=async(req,res)=>{
  const tweetId=req.params.id;
   const userid=req.user.userid
   const pushUnLikes=await Tweet.findByIdAndUpdate({_id:tweetId},{ $pull: { likes:userid} },{new:true})
   return res.json({message:'UnLiked'})
}

const postTweetReply=async(req,res)=>{
 const parentTweetid=req.params.id
 const tweetText=req.body.contentReply
 const userid=req.user.userid
 console.log(parentTweetid)
 console.log(tweetText)
 console.log(userid)


 const newReply = new Tweet({
   userid,
   tweetText,
   parentTweet: parentTweetid,
   isAreply:true
 });

 // Save the new reply
 const savedReply = await newReply.save();


 const parenttweet = await Tweet.findById(parentTweetid);
 parenttweet.replies.push(savedReply._id);
 await parenttweet.save();
 res.json({message:'Reply Successfull'})


}

const getRepliesofTweetId=async(req,res)=>{
 
      const tweetId=req.params.id
      console.log(tweetId)
      const repliesOfTweetId=await Tweet.find({parentTweet:tweetId}).populate({ path: 'userid', select: '-password' })
       res.json({message:"Tweet Data",repliesOfTweetId})
   
}



export  {tweetOfUser,getAllTweets,deleteThisTweet,getMyTweets,getUserTweets,reTweeting,LikeTheTweet,UnLikeTheTweet,getTweetByTweetId,postTweetReply,getRepliesofTweetId}