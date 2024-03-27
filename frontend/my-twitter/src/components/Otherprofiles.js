import React, { useContext, useEffect, useState } from 'react'
import { Link,NavLink, useNavigate, useParams } from 'react-router-dom'
import { gettingUserProfileDataAxios,
  gettingAllTweetsOfUser,likeTheTweetAxios,
  unLikeTheTweetAxios,reTweetAxios ,
  followPersonAxios} from '../service/api'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SidebarContext } from './SidebarContext';
import moment from 'moment';
import { LoadingContext } from './LoadingContext';


const Otherprofiles = () => {
  const [profileimg, setProfileimg] = useState('')
  const [profilename, setProfilename] = useState('')
  const [profileusername, setProfileusername] = useState('')
  const [allTweets,setAllTweets] = useState('')
  const [followers,setFollowers]=useState('')
  const [followings,setFollowings]=useState('')
  const [joiningdate,setJoiningDate]=useState('')
  const [dob,setDob]=useState('')


  const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);
  const {loading,setLoading}=useContext(LoadingContext)


  const navigate = useNavigate()
  const openCommentBox=(e)=>{
    navigate(`/tweetreplies/${e}`)
      
  }
  const fetchSingleUser=async()=>{
    setLoading(true);
    const { data } = await gettingUserProfileDataAxios(id)
    setLoading(false);
    setProfileimg(data.userdata.profilepicture)
     setProfilename(data.userdata.name)
     setProfileusername(data.userdata.username)
     setFollowers(data.userdata.followers)
     setFollowings(data.userdata.following)
     setJoiningDate(moment(data.userdata.createdAt).format("MMM Do YY"))
     setDob(data.userdata.birthday)
   }


  const openProfile=async(e)=>{
    if (e===id) {
         navigate('/userprofile')
    } else {
       navigate(`/user/${e}`)
    }
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

  const {id} =useParams()

  const user = JSON.parse(localStorage.getItem('auth'))
  const myid = user.userid;


  const followPerson=async(e)=>{
    e.preventDefault()
    try {
      setLoading(true);
      const response=await followPersonAxios(id,myid)
      setLoading(false);
      console.log('moved')
      console.log('response:', response); 
      fetchSingleUser()
      toast.success(response.data.message)
      
    } catch (error) {
      console.log('error in browser',error)
    }
  
    fetchSingleUser()
  }

  // const unfollowPerson=(e)=>{
  //   try {
  //     const response=unfollowPersonAxios(id,myid)
  //     toast.success(response.data.message)
  //   } catch (error) {
  //     console.log('error in browser',error)
  //   }
  //   fetchSingleUser()
    
  // }
 

  useEffect(()=>{
    fetchSingleUser()
    getAllTweets()
  },[])


  const getAllTweets=async()=>{
    console.log(id)
    setLoading(true);
    const {data}=await gettingAllTweetsOfUser(id);
    setLoading(false);
    setAllTweets(data.tweetDatas)
    }

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };  


console.log(allTweets)

  return (
    <>
      
  <div className="profile">
  <div className='toggle-bar d-flex'>
  <i className="fa-solid fa-bars" onClick={toggleSidebar}/>
  </div>
  
    <div className="feed-header d-flex justify-content-between align-items-center">
      <h2>Profile</h2>
    </div>
    <div className="profile-details border border-white">
      <div className="profile-followbtn d-flex justify-content-between align-items-center">
        <div className="profile-information">
        <center><div className="profile-information-img ">
                {/* <div className="profile-information-img-img-bg"> */}
                <img src={profileimg} alt className="profile-information-img-img-bg" />
                {/* </div> */}
              </div></center>
          <div className="profile-name">
            <h2 style={{width: '110%'}}>{profilename}</h2>
            <span>{profileusername}</span>
          </div>
          <div className="profile-username">
          </div>
        </div>
        <button type="button" className="btn btn-dark profile-follow-andu-nfollow-btn" onClick={(e)=>followPerson(e)}>
        {!followers.includes(myid)?<span>Follow</span>:<span>unFollow</span>}
        </button>
      </div>
      <div className="other-details">
        <div className="birthday-location d-flex">
          <div className="birthday">
            <i className="fa-solid fa-cake-candles gap-icons" />
            <span>Dob:</span><span id="dob">{dob}</span>
          </div>
          {/* <div className="location">
            <i className="fa-solid fa-location-dot gap-icons" />
            <span>Location:</span><span id="location">Haryana,India</span>
          </div> */}
        </div>
        <div className="joining-date">
          <i className="fa-regular fa-calendar gap-icons" />
          <span>Joined:</span><span id="joining">{joiningdate}</span>
        </div>
      </div>
      <div className="followersandfollowing d-flex">
        <div className="following">
          <span style={{marginRight: '0.3rem'}} id="Following">{followings.length}</span><span>Following</span>
        </div>
        <div className="followers">
          <span style={{marginRight: '0.3rem'}} id="Followers">{followers.length}</span><span>Followers</span>
        </div>
      </div>
      <div className="headingoftweetsprofiloe"><center><h4>Tweets and Replies</h4></center></div>
      {/*singletweety*/}
      {allTweets && allTweets.map((singletweet)=>{
     return  <>{ singletweet.isAreply===false? <div className="single-feed">
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
      
     </div>
     <div className="single-tweet-text">
       <span className='wrap-it'>{singletweet.tweetText}</span>
     </div>
     {singletweet.tweetMedia?<div className="single-tweet-img-container">
       <img src={singletweet.tweetMedia} alt />
     </div>:''}
     <div className="tweet-operations  d-flex gap-4">
       <div className="like-icon-container">
         <a style={{textDecoration: 'none', color: '#f55050', fontWeight: 500}}>{singletweet.likes.includes(myid)?<i className="fa-solid fa-heart gap-icons" style={{color: "#ff0000",}} onClick={(e)=>unLike(singletweet._id)} />:<i className="fa-regular fa-heart gap-icons" onClick={(e)=>like(singletweet._id)}/>}
         
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
   
   </div>:''}
   
  
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
      {/*singletweety*/}
      
      {/*singletweety*/}
    </div>
  </div>
  {/*model2*/}
  <div className="modal fade" id="exampleModal2" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-title fs-5" id="exampleModalLabel">Tweet your reply</h1>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
        </div>
        <div className="modal-body">
          <textarea className="new-tweet" name id cols={60} rows={5} placeholder="Add your reply"  />
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



    </>
  )
}

export default Otherprofiles
