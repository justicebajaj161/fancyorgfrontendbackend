import React, { useContext } from 'react';
import "../styles.css";
import { createTweet , gettingAllTweets,deleteTweetaxios,reTweetAxios,likeTheTweetAxios,unLikeTheTweetAxios} from '../service/api';
import { useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom'
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { SidebarContext } from './SidebarContext';
import moment from 'moment';
import { LoadingContext } from './LoadingContext';

const defaultValue ={
  contentTweet:""

}

const Feeds = () => {
  const [tweet,setTweet] = useState(defaultValue);
  const [tweetmedia,setTweetmedia]=useState('');
  const [allTweets,setAllTweets] = useState('');
  const [opentweets,setOpentweets] = useState(false);
  const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);
  const {loading,setLoading}=useContext(LoadingContext)


 
  const user = JSON.parse(localStorage.getItem('auth'))
  const id = user.userid;


  const creatingTweet  = (e)=>{
    setTweet({...tweet,[e.target.name]:e.target.value})
    }
  const chooseTweetMedia=(e)=>{
    setTweetmedia(e.target.files[0])
  }
  

  useEffect(()=>{
    getAllTweets();
  },[])

  const navigate = useNavigate()
  const openCommentBox=(e)=>{
    navigate(`/tweetreplies/${e}`)
      
  }
  const openCommentBoxTwo=()=>{

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
   getAllTweets();
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
  getAllTweets();
  }

  const postTheTweet=async(e)=>{
    e.preventDefault();
    const formData = new FormData();
    formData.append('tweet', JSON.stringify(tweet));
    formData.append('tweetmedia', tweetmedia);
    if (tweet.contentTweet) {
      setLoading(true);
      const response=await createTweet(formData);
      setLoading(false);
      toast.success(response.data.message)
    } else {
      toast.error('Please Provide Some Input')
    }
    getAllTweets();
     }

     const deleteTweet=async(e)=>{
      let confirm = window.confirm('Do you really want to delete this tweet?');
     if(!confirm){
      return;
    }
      console.log(e)
      try {
        console.log(e)
        setLoading(true);
        const response=await deleteTweetaxios(e)
        setLoading(false);
        toast.success(response.data.message)
      } catch (error) {
        console.log(error)
        }
      getAllTweets();
     }


    
     const openProfile=async(e)=>{
        if (e===id) {
             navigate('/userprofile')
        } else {
           navigate(`/user/${e}`)
        }
     }

     const getAllTweets=async()=>{
      setLoading(true);
        const {data}=await gettingAllTweets();
        setLoading(false);
        setAllTweets(data.tweetDatas)
        }


    const reTweetIt=async(e)=>{
         console.log(e)
         try {
          setLoading(true);
          const response=await reTweetAxios(e)
          setLoading(false);
          toast.success(response.data.message)
        } catch (error) {
          console.log(error)
          }
        getAllTweets();
    }
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
    

    console.log(allTweets)
 
  return (
    <>
<div className="feed ">

      {/* Your component's JSX */}
      <div className='toggle-bar d-flex'>
  <i className="fa-solid fa-bars" onClick={toggleSidebar}/>
  </div>
  
  

  <div className="feed-header d-flex justify-content-between align-items-center">
    <h2>Home</h2>
    {/* Button trigger modal */}
    <button type="button" className="btn btn-primary tweet-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
      Tweet
    </button>
  </div>
  {/* ! single tweet */}
  {allTweets && allTweets.map((singletweet)=>{
     return  <>{singletweet.userid.followers.includes(id)  || singletweet.userid._id === id? <div>{ singletweet.isAreply===false? <div className="single-feed">
     {/* ! four flex items */}
     {/* ! user-profile picture, username, date aur last me delete icon */}
     {singletweet.isAReTweet===true? <div className="retweet-icon-container retweeted-tweet">
       <i className="fa-solid fa-retweet gap-icons" />
       <span>retweeted by {singletweet.reTweetedBy.username}</span>
     </div>:''}
     <div className="tweet-header d-flex ">
       {/* ! profile image container */}
       <div className="user-profile-img-container-feeds">
         <img src={singletweet.userid.profilepicture} className="user-profile-img-container-img-feeds" onClick={(e)=>openProfile(singletweet.userid._id)} alt />
       </div>
       {/* ! username container */}
       <div className="username-container">
         <span className="username">{singletweet.userid.username} </span>
       </div>
       <div className="date-container">
         <span className="date">
         - {moment(singletweet.createdAt).format("MMM Do YY -h:mm")}
         </span>
       </div>
       <div className="delete-icon-container">
       {/* data-bs-toggle="modal" data-bs-target="#exampleModalForDeletion" */}
       {singletweet.userid._id===id ? (<i className="fa-solid fa-trash-can"   onClick={()=>deleteTweet(singletweet._id)}/>):('')}
       </div>
     </div>
     <div className="single-tweet-text">
       <span className='wrap-it'>{singletweet.tweetText}</span>
     </div>
     {singletweet.tweetMedia?<div className="single-tweet-img-container">
       <img src={singletweet.tweetMedia} alt />
     </div>:''}
     <div className="tweet-operations  d-flex gap-4">
       <div className="like-icon-container">
         <a style={{textDecoration: 'none', color: '#f55050', fontWeight: 500}}>{singletweet.likes.includes(id)?<i className="fa-solid fa-heart gap-icons" style={{color: "#ff0000",}} onClick={(e)=>unLike(singletweet._id)} />:<i className="fa-regular fa-heart gap-icons" onClick={(e)=>like(singletweet._id)}/>}
         
           <span>{singletweet.likes.length}</span></a>
       </div>
       <div className="comment-icon-container">
       {/* data-bs-toggle="modal" data-bs-target="#exampleModal2paused" */}
         <a  style={{textDecoration: 'none', color: '#50b7f5', fontWeight: 500}}><i className="fa-regular fa-comment gap-icons" onClick={()=>openCommentBox(singletweet._id)} />
           <span>{singletweet.replies.length}</span></a>
       </div>
       <div className="retweet-icon-container">
         <i className="fa-solid fa-retweet gap-icons" onClick={(e)=>reTweetIt(singletweet._id)}/>
         <span>{singletweet.reTweeted.length}</span>
       </div>
     </div>
     {opentweets===true?<div className='comment-box'><div className='comment-heading'><center><h4>Comments</h4></center></div> 
     <hr className="comment-line" />
     <div className='Tweet-replies'>
       <div className='profile-replies d-flex'>
        <div className='profile-replies-photo'>
         <img src='' className='profile-replies-photo-bg'/>
        </div>
        <div className='profile-replies-username'>
         <span>@rani</span>
        </div>
       </div>
       <div className='allreplies'>
         <h6 className='allrepliescomments'>hrllo lol you are good and noy hallool fkfkf ckfkfkf ckkfkfkk fkfkckd fkfknfkf fkfnfkmfm fkfkfmfkjmf kmffkj</h6>
        </div>
 
        <div className="tweet-operations  d-flex gap-4">
       <div className="like-icon-container">
         <a href="#" style={{textDecoration: 'none', color: '#f55050', fontWeight: 500}}><i className="fa-regular fa-heart gap-icons" />
           <span>5</span></a>
       </div>
     
     </div>
 
 
 
   </div>
     </div>:''}
   </div>:''}</div>:''}
   
  
{/* // modelfortweetdeletion */}
<div className="modal fade" id="exampleModalForDeletion"  aria-labelledby="exampleModalLabel" aria-hidden="true">
<div className="modal-dialog">
  <div className="modal-content">
    <div className="modal-header">
      <h1 className="modal-title fs-5" id="exampleModalLabel">Are You Sure ?</h1>
      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
    </div>


    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
      <button type="button" className="btn btn-danger delete-btn-1" data-bs-dismiss="modal">Delete</button>
    </div>
  </div>
</div>
</div>
</>
})}
</div>

<div>
  {/* Modal */}
  <form method="POST" onSubmit={(e)=>postTheTweet(e)} enctype="multipart/form-data" action="/upload">
  <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-title fs-5" id="exampleModalLabel">New Tweet</h1>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
        </div>
        <div className="modal-body">
          <textarea className="new-tweet" style={{paddingLeft:"0.5rem",paddingTop:'0.5rem'}} type="text" name="contentTweet" cols="50" rows="4" placeholder="What's your tweet" onChange={(e)=>creatingTweet(e)} />
        </div>
        <div className="upload-image-div">
        <input type="file" name="file" onChange={(e)=>chooseTweetMedia(e)} />
          <i className="fa-regular fa-image" />
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="submit" value='upload' className="btn btn-primary tweet-btn-2" data-bs-dismiss="modal" >Tweet</button>
        </div>
      </div>
    </div>
  </div>
  </form>
  {/*Model2 for replying to tweet*/}
  <div className="modal fade" id="exampleModal2" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-title fs-5" id="exampleModalLabel">Tweet your reply</h1>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
        </div>
        <div className="modal-body">
          <textarea className="new-tweet"  cols="50" rows="4" placeholder="Add your reply" />
        </div>
        <div className="upload-image-div">
          <i className="fa-regular fa-image" />
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" className="btn btn-primary tweet-btn-2" data-bs-dismiss="modal"> Reply</button>
        </div>
      </div>
    </div>
  </div>

    {/*Model2 for replying to reply*/}
    <div className="modal fade" id="exampleModal3" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-title fs-5" id="exampleModalLabel">Reply To This Reply</h1>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
        </div>
        <div className="modal-body">
          <textarea className="new-tweet"  cols="50" rows="4" placeholder="Add your reply" />
        </div>
        <div className="upload-image-div">
          <i className="fa-regular fa-image" />
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" className="btn btn-primary tweet-btn-2" data-bs-dismiss="modal">Reply</button>
        </div>
      </div>
    </div>
  </div>









</div>
</>

  )
}

export default Feeds
