import mongoose from "mongoose";


const TweetSchema = new mongoose.Schema(
    {userid: { type: mongoose.Types.ObjectId, require: true, ref: "User" },
     tweetText :{
      type:String,
     },
     tweetMedia :{ type:String},
     tweetMediaPublicId:{type:String},
     likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
     reTweeted:  [{ type: mongoose.Types.ObjectId, ref: "User" }],
     isAReTweet:{type:Boolean},
     reTweetedBy:{ type: mongoose.Types.ObjectId, ref: "User" },
     isAreply:{type:Boolean,default:false,require:true},
     replies: [{ type: mongoose.Types.ObjectId, ref: 'Tweet' }],
     parentTweet: { type: mongoose.Types.ObjectId, ref: 'Tweet' },
    },
    {timestamps:true}
  )
  
  const Tweet = mongoose.model('Tweet',TweetSchema)
  
  export default Tweet