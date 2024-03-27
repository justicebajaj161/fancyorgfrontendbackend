import express from 'express'
import {tweetOfUser,getAllTweets,deleteThisTweet,getMyTweets,getUserTweets,reTweeting,LikeTheTweet,UnLikeTheTweet,getTweetByTweetId,postTweetReply,getRepliesofTweetId} from '../controllers/tweet-controller.js';
import logginedstatus from '../middleware/logginedstatus.js';


const TweetRouter=express.Router();

TweetRouter.post('/postTweet',logginedstatus,tweetOfUser);
TweetRouter.get('/feeds',logginedstatus,getAllTweets);
TweetRouter.delete('/deletetweet/:tweetid',logginedstatus,deleteThisTweet);
TweetRouter.get('/userprofile/tweets/:id',logginedstatus,getMyTweets);
TweetRouter.get('/user/usertweets/:id',logginedstatus,getUserTweets);
TweetRouter.post('/feeds/retweety/:id',logginedstatus,reTweeting);
TweetRouter.post('/feeds/tweetlike/:id',logginedstatus,LikeTheTweet);
TweetRouter.post('/feeds/tweetunlike/:id',logginedstatus,UnLikeTheTweet);
TweetRouter.get('/tweetreplies/:id',logginedstatus,getTweetByTweetId);
TweetRouter.post('/tweetreplies/reply/:id',logginedstatus,postTweetReply);
TweetRouter.get('/tweetreplies/replies/:id',logginedstatus,getRepliesofTweetId);






export default TweetRouter;