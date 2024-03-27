import React, { useContext } from 'react'
import "../styles.css";
import {deleteTweetaxios,likeTheTweetAxios,unLikeTheTweetAxios,gettingTweetOfGivenTweetId,postReplyAxios,gettingRepliesOfTweetId} from '../service/api';
import { useState,useEffect} from 'react';
import { useNavigate ,useParams} from 'react-router-dom'
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SidebarContext } from './SidebarContext';
import moment from 'moment';
import { LoadingContext } from './LoadingContext';


const defaultValue ={
  contentReply:""

}

const TweetReplies = () => {
  
  const [tweetsoftweetid,setTweetsoftweetid] = useState('');
  const [tweetreplyvalue,setTweetreplyvalue] = useState(defaultValue);
  const [repliessoftweetid,setRepliesoftweetid] = useState('');
  const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);
  const {loading,setLoading}=useContext(LoadingContext)

 const replyContent=(e)=>{
   setTweetreplyvalue({...tweetreplyvalue,[e.target.name]:e.target.value})
  }
  const {id} =useParams()

  const user = JSON.parse(localStorage.getItem('auth'))
  const myid = user.userid;
console.log(myid)
  useEffect(()=>{
    getTweetsByTweetId()
    getTweetReplies()
  },[])
  const getTweetsByTweetId=async()=>{
    setLoading(true);
    const {data}=await gettingTweetOfGivenTweetId(id);
    setLoading(false);
    setTweetsoftweetid(data.tweetDatasOfTweetId)
    }


  const navigate = useNavigate()
  const openCommentBox=(e)=>{
    navigate(`/tweetreplies/${e}`)
      
  }
  const openProfile=async(e)=>{
    if (e===myid) {
         navigate('/userprofile')
    } else {
       navigate(`/user/${e}`)
    }
 }

  const deleteTweet=async(e)=>{
    let confirm = window.confirm('Do you really want to delete this tweet?');
    if(!confirm){
     return;
   }
    try {
      setLoading(true);
      const response=await deleteTweetaxios(e)
      navigate(`/`)
      setLoading(false);
      toast.success(response.data.message)
    } catch (error) {
      console.log(error)
      }
      getTweetsByTweetId()
      getTweetReplies()
   }
   const like=async(e)=>{
    try {
      setLoading(true);
      const response=await likeTheTweetAxios(e);
      setLoading(false);
      toast.success(response.data.message)
    } catch (error) {
      toast.error('failed something went wrong')
    }
    getTweetsByTweetId()
    getTweetReplies()
  }


  const unLike=async(e)=>{
    try {
      setLoading(true);
      const response=await unLikeTheTweetAxios(e)
      setLoading(false);
      toast.success(response.data.message)
    } catch (error) {
      toast.error('failed something went wrong')
    }
    getTweetsByTweetId()
    getTweetReplies()
  }

  const postReply=async(e)=>{
    e.preventDefault();
    try {
      console.log(tweetreplyvalue)
      setLoading(true);
      const response=await postReplyAxios(id,tweetreplyvalue)
      setLoading(false);
      toast.success(response.data.message)
    } catch (error) {
      toast.error('Reply Failed')
    }
    getTweetsByTweetId()
    getTweetReplies()
  }

  const getTweetReplies=async()=>{
    setLoading(true);
    const {data}=await gettingRepliesOfTweetId(id);
    setLoading(false);
    setRepliesoftweetid(data.repliesOfTweetId)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
 
console.log(repliessoftweetid)
 

  return (
    <>
    <div className="feed ">
    <div className='toggle-bar d-flex'>
  <i className="fa-solid fa-bars" onClick={toggleSidebar}/>
  </div>
      <h3>Tweet</h3>
    <div className="single-feed">
    {/* ! four flex items */}
    {/* ! user-profile picture, username, date aur last me delete icon */}
    {tweetsoftweetid.isAReTweet===true? <div className="retweet-icon-container retweeted-tweet">
      <i className="fa-solid fa-retweet gap-icons" />
      <span>retweeted by {tweetsoftweetid.reTweetedBy.username}</span>
    </div>:''}
 

    <div className="tweet-header d-flex ">
     
      <div className="user-profile-img-container-feeds">
        <img src={tweetsoftweetid?.userid?.profilepicture} className="user-profile-img-container-img-feeds" onClick={(e)=>openProfile(tweetsoftweetid.userid._id)} alt />
      </div>
     
      <div className="username-container">
        <span className="username">{tweetsoftweetid?.userid?.username} </span>
      </div>
      <div className="date-container">
        <span className="date">
        - {moment(tweetsoftweetid.createdAt).format("MMM Do YY -h:mm")}
        </span>
      </div>
      <div className="delete-icon-container">
     
      {tweetsoftweetid?.userid?._id===myid ? (<i className="fa-solid fa-trash-can"   onClick={()=>deleteTweet(tweetsoftweetid?._id)}/>):('')}
      </div>
    </div>


    <div className="single-tweet-text">
      <span className='wrap-it'>{tweetsoftweetid?.tweetText}</span>
    </div>
    {tweetsoftweetid?.tweetMedia?<div className="single-tweet-img-container">
      <img src={tweetsoftweetid?.tweetMedia} alt />
    </div>:''}

    <div className="tweet-operations  d-flex gap-4">
      <div className="like-icon-container">
        <a href="#" style={{textDecoration: 'none', color: '#f55050', fontWeight: 500}}>{tweetsoftweetid?.likes?.includes(myid)?<i className="fa-solid fa-heart gap-icons" style={{color: "#ff0000",}} onClick={(e)=>unLike(tweetsoftweetid?._id)} />:<i className="fa-regular fa-heart gap-icons" onClick={(e)=>like(tweetsoftweetid?._id)}/>}
        
          <span>{tweetsoftweetid?.likes?.length}</span></a>
      </div>
      <div className="comment-icon-container">
      {/* data-bs-toggle="modal" data-bs-target="#exampleModal2paused" */}
        <a data-bs-toggle="modal" data-bs-target="#exampleModal2" style={{textDecoration: 'none', color: '#50b7f5', fontWeight: 500}}><i className="fa-regular fa-comment gap-icons"   />
          <span>{tweetsoftweetid?.replies?.length}</span></a>
      </div>
    </div>

    
  </div>


  <div className='comment-box'><div className='comment-heading'><center><h4>Comments</h4></center></div> 



    
    {repliessoftweetid && repliessoftweetid.map((singlereply)=>{
     return <><hr className="comment-line" />
     <div className='Tweet-replies'>
      <div className='profile-replies d-flex'>
       <div className='profile-replies-photo'>
        <img src={singlereply?.userid?.profilepicture} className='profile-replies-photo-bg'/>
       </div>
       <div className='profile-replies-username'>
        <span>{singlereply?.userid?.username}</span>
       </div>
       <div className="replies-date-container">
        <span>
        - {moment(singlereply.createdAt).format("MMM Do YY -h:mm")}
        </span>
      </div>
      <div className="delete-icon-container">
     {singlereply?.userid?._id===myid ? (<i className="fa-solid fa-trash-can replydelete"   onClick={()=>deleteTweet(singlereply?._id)}/>):('')}
      </div>

      </div>
      <div className='allreplies'>
        <h6 className='allrepliescomments'>{singlereply?.tweetText}</h6>
       </div>

       <div className="tweet-operations  d-flex gap-4">
       <div className="like-icon-container">
        <a style={{textDecoration: 'none', color: '#f55050', fontWeight: 500}}>{singlereply?.likes?.includes(myid)?<i className="fa-solid fa-heart gap-icons" style={{color: "#ff0000",}} onClick={(e)=>unLike(singlereply?._id)} />:<i className="fa-regular fa-heart gap-icons" onClick={(e)=>like(singlereply?._id)}/>}
        <span>{singlereply?.likes?.length}</span></a>
      </div>
      <div className="comment-icon-container">
      {/* data-bs-toggle="modal" data-bs-target="#exampleModal2paused" */}
        <a href=""  style={{textDecoration: 'none', color: '#50b7f5', fontWeight: 500}}><i className="fa-regular fa-comment gap-icons" onClick={()=>openCommentBox(singlereply?._id)} />
          <span>{singlereply?.replies?.length}</span></a>
      </div>
    
    </div>



  </div></>})}



    </div>



 {/*Model2 for replying to tweet*/}
 <div className="modal fade" id="exampleModal2" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-title fs-5" id="exampleModalLabel">Tweet your reply</h1>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
        </div>
        <div className="modal-body">
          <textarea className="new-tweet"  cols="50" rows="4" placeholder="Add your reply" name='contentReply' onChange={(e)=>replyContent(e)} />
        </div>
        <div className="upload-image-div">
          <i className="fa-regular fa-image" />
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" className="btn btn-primary tweet-btn-2" data-bs-dismiss="modal" onClick={(e)=>postReply(e)}>Reply</button>
        </div>
      </div>
    </div>
  </div>



  </div>
    </>
  )
}

export default TweetReplies
