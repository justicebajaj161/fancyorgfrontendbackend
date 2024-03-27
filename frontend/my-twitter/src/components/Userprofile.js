import React, { useContext } from 'react'
import { uploadProfilePicture, gettingProfileData ,deleteProfilePicture,gettingAllMyTweets,deleteTweetaxios,reTweetAxios,likeTheTweetAxios,unLikeTheTweetAxios, updatedatauseraxios} from '../service/api';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { SidebarContext } from './SidebarContext';
import moment from 'moment';
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { LoadingContext } from './LoadingContext';


const defaultValue ={
  name:"",



}

const Userprofile = () => {

  const [file, setFile] = useState('');
  const [filename, setFileName] = useState('')
  const [profileimg, setProfileimg] = useState('')
  const [profilename, setProfilename] = useState('')
  const [profileusername, setProfileusername] = useState('')
  const [profileimgid,setProfileimgid]=useState('')
  const [allTweets,setAllTweets] = useState('')
  const [opentweets,setOpentweets] = useState(false);
  const [followers,setFollowers]=useState('')
  const [followings,setFollowings]=useState('')
  const [joiningdate,setJoiningDate]=useState('')
  const [updateuser , setupdateUser]= useState(defaultValue);
  const [birthday,setBirthday]=useState(new Date())
 const [dob,setDob]=useState('')
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [error, setError] = useState(null);

  const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);
  const {loading,setLoading}=useContext(LoadingContext)



  const user = JSON.parse(localStorage.getItem('auth'))
  const id = user.userid;

  const chooseProfilePic = (e) => {
    console.log(e.target.files[0])
    setFile(e.target.files[0])
    setFileName(e.target.files[0].name)
  }


  const changeName=(e)=>{
   setupdateUser({...updateuser,[e.target.name]:e.target.value})
   console.log(updateuser)

  }
  const dateofbirth=(e)=>{
    const newDob=moment(e).format("MMM Do YY")
    setBirthday(newDob)
    
  }
  
console.log(birthday)

  // console.log(file)
  // console.log(filename)

  useEffect(() => {
    allProfileData()
    getAllTweets()
  }, [])


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
const navigate = useNavigate()
const openCommentBox=(e)=>{
  navigate(`/tweetreplies/${e}`)
    
}
const openProfile=async(e)=>{
  if (e===id) {
       navigate('/userprofile')
  } else {
     navigate(`/user/${e}`)
  }
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



const uploadProfilePic = async (e) => {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem('auth'));
  const id = user.userid;
  console.log('this is the id of user', id);

  const formData = new FormData();
  formData.append('file', file);

  try {
    console.log(formData);
    if (file) {
      setLoading(true); // Set loading state to true
      const response = await uploadProfilePicture(id, formData);
      setLoading(false); // Set loading state to false
      console.log('submitted');
      toast.success(response.data.message);
    }
  } catch (error) {
    setLoading(false); // Set loading state to false in case of error
    toast.error('Error occurred during upload');
  }

  allProfileData();
  getAllTweets();
};


  
    const deleteProfilePictureNow=async(e)=>{
      e.preventDefault();
      const user = JSON.parse(localStorage.getItem('auth'))
      const id = user.userid;
      console.log(id)
        try {
          setLoading(true);
          const response=await deleteProfilePicture(id);
          setLoading(false);
          console.log('reahced front del')
          toast.success(response.data.message)
        } catch (error) {
          console.log('heelo here error')
        }
        allProfileData();
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
  



  const allProfileData = async () => {
    const user = JSON.parse(localStorage.getItem('auth'))
    const id = user.userid;
    setLoading(true);
    const { data } = await gettingProfileData(id)
    setLoading(false);
   setProfileimg(data.userdata.profilepicture)
    setProfilename(data.userdata.name)
    setProfileusername(data.userdata.username)
    setFollowers(data.userdata.followers)
    setFollowings(data.userdata.following)
    setJoiningDate(moment(data.userdata.createdAt).format("MMM Do YY"))
    setDob(data.userdata.birthday)
    
  }

  const getAllTweets=async()=>{
    const user = JSON.parse(localStorage.getItem('auth'))
    const id = user.userid;
    setLoading(true);
    const {data}=await gettingAllMyTweets(id);
    setLoading(false);
    setAllTweets(data.tweetDatas)
    }

    const deleteTweet=async(e)=>{
      let confirm = window.confirm('Do you really want to delete this tweet?');
      if(!confirm){
       return;
     }
      try {
        setLoading(true);
        const response=await deleteTweetaxios(e)
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



    const submitUpdate=async(e)=>{
      e.preventDefault();
      const formData = new FormData();
      formData.append('updateuser', JSON.stringify(updateuser));
      formData.append('birthday', JSON.stringify(birthday));
      if (updateuser||birthday) {
        setLoading(true);
        const response=await updatedatauseraxios(formData);
        const {data} = await updatedatauseraxios(formData);
        localStorage.setItem('auth',JSON.stringify(data));
        setLoading(false);
        toast.success(response.data.message)
      } else {
        toast.error('Please Provide Some Input')
      }
      allProfileData();
    }
  // console.log('value of link is',profiledata)
  //  console.log('prfoleimg id',profileimgid)


 //location
 useEffect(() => {
  // Get the current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      error => {
        setError(error.message);
      }
    );
  } else {
    setError('Geolocation is not supported by your browser.');
  }
}, []);

useEffect(() => {
  // Reverse geocoding
  if (latitude && longitude) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    axios
      .get(url)
      .then(response => {
        const { address } = response.data;
        const state = address.state;
        const country = address.country;
        setLocationData({ state, country });
      })
      .catch(error => {
        setError('Error fetching location data.');
      });
  }
}, [latitude, longitude]);



  
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
          {/*justify-content-between align-items-center for button floating on right end side */}
          <div className="profile-followbtn d-flex justify-content-between align-items-center">
            <div className="profile-information">
              <center><div className="profile-information-img ">
                {/* <div className="profile-information-img-img-bg"> */}
                <img src={profileimg} alt className="profile-information-img-img-bg" />
                {/* </div> */}
              </div></center>
              <div className="profile-name">
                <h5 style={{ width: '100%' }}>{profilename}</h5>
                <span>{profileusername}</span>
              </div>
              <div className="profile-username">
              </div>
            </div>
           
            <button type="button" className="btn btn-dark user-profile-delete"  data-bs-toggle="modal" data-bs-target="#exampleModalForDeletion">
              <span>Delete Pic</span>
            </button>
            <button type="button" className="btn btn-dark user-profile-photo-upload " data-bs-toggle="modal" data-bs-target="#exampleModalForConfirmation">
              <span>Update Profile Photo</span>
            </button>
            <button type="button" className="btn btn-dark user-profile-edit" data-bs-toggle="modal" data-bs-target="#exampleModalForEdit">
              <span>Edit</span>
            </button>
          </div>
          <div className="other-details">
            <div className="birthday-location d-flex">
              <div className="birthday">
                <i className="fa-solid fa-cake-candles gap-icons" />
                <span>Dob:</span><span id="dob">{dob}</span>
              </div>
              <div className="location">
                <i className="fa-solid fa-location-dot gap-icons" />
                <span>Location:</span><span id="location">{locationData ? (
        <span>
         {locationData.state}, {locationData.country}
        </span>
      ) : (
        <span>Loading..</span>
      )} 
      
      </span>
              </div>
            </div>
            <div className="joining-date">
              <i className="fa-regular fa-calendar gap-icons" />
              <span>Joined:</span><span id="joining">{joiningdate}</span>
            </div>
          </div>
          <div className="followersandfollowing d-flex">
            <div className="following">
              <span style={{ marginRight: '0.3rem' }} id="Following">{followings.length}</span><span>Following</span>
            </div>
            <div className="followers">
              <span style={{ marginRight: '0.3rem' }} id="Followers">{followers.length}</span><span>Followers</span>
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
      <button type="button" className="btn btn-danger delete-btn-1"  onClick={(e)=>deleteProfilePictureNow(e)} data-bs-dismiss="modal">Delete</button>
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
              <textarea className="new-tweet" name id cols={60} rows={5} placeholder="Add your reply" />
            </div>
            <div className="upload-image-div">
              <i className="fa-regular fa-image" />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary tweet-btn-2">Reply</button>
            </div>
          </div>
        </div>
      </div>



      {/*model3*/}
      <form method="POST" onSubmit={(e) => uploadProfilePic(e)} enctype="multipart/form-data" action="/upload">
        <div className="modal fade" id="exampleModalForConfirmation" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Upload Your Profile Picture</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              {/* <div className="modal-body">
        <textarea className="new-tweet" name id cols={60} rows={5} placeholder="Add your reply"  />
      </div> */}
              <div className="upload-image-div d-flex">
                {/* <i className="fa-regular fa-image" /> */}

                <input type="file" name="file" accept='image/*' onChange={(e) => chooseProfilePic(e)} />

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary tweet-btn-2" data-bs-dismiss="modal" value="Upload">Upload</button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/*model4*/}
      <div className="modal fade" id="exampleModalForDeletion" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Are You Sure ?</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>


            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-danger delete-btn-1" data-bs-dismiss="modal" onClick={(e)=>deleteProfilePictureNow(e)} >Delete</button>
            </div>
          </div>
        </div>
      </div>

    
       {/*modelforedit*/}
      <div className="modal fade" id="exampleModalForEdit"  aria-labelledby="exampleModalLabel" aria-hidden="true">
<div className="modal-dialog">
  <div className="modal-content">
    <div className="modal-header">
      <h1 className="modal-title fs-5" id="exampleModalLabel">Name:<input type='text' name='name' placeholder='Enter Name' onChange={(e)=>changeName(e)}></input></h1>
      
      
      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
    </div>
    <div className="modal-body">
    <br/>
    <h3>Date of Birth:</h3>
    <Calendar  onChange={(e)=>dateofbirth(e)} value={birthday}/>
            </div>
  

    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
      <button type="button" className="btn btn-danger tweet-btn-2" data-bs-dismiss="modal" onClick={(e)=>submitUpdate(e)}>Update</button>
    </div>
  </div>
</div>
</div>



    </>


  )
}

export default Userprofile
