import axios from 'axios'



// const URL=`https://fancyorg.onrender.com`;
const URL=`https://fancyorg.onrender.com`;
// const URL=`http://localhost:8000`;

const authorizationHeaders=()=>{
  const user = JSON.parse(localStorage.getItem('auth'))
  const token = user?.user;

  const finalHeader = {
      headers: { Authorization: `Bearer ${token}` }
  }

  return finalHeader;
}



const authorizationHeadersWithUploadFiles=()=>{
  const user = JSON.parse(localStorage.getItem('auth'))
  const token = user?.user;

  const finalHeaderUploader = {
    headers: { Authorization: `Bearer ${token}`, "Content-Type":'multipart/form-data' }
  }
  return finalHeaderUploader

}



const registerUser=async(information)=>{

 try {
   return await axios.post(`${URL}/api/auth/register`,information)
   
   
 } catch (error) {
    console.log('error while calling the user api',error)
 }
}


const loginUser=async(userLogin)=>{
  try {
    return await axios.post(`${URL}/api/auth/login`,userLogin)
 
    } catch (error) {
    console.log('error while making api',error)
}
 }


 const createTweet=async(tweetdata)=>{
     const finalHeader=authorizationHeaders();
     try {
      console.log(tweetdata)
      return await axios.post(`${URL}/api/auth/tweet/postTweet`,tweetdata,finalHeader)
     } catch (error) {
      console.log(error)
     }
     
}






const uploadProfilePicture = async (id, formData, additionalParameter) => {
  const finalHeader = authorizationHeaders();
  try {
    console.log(formData);
    return await axios.post(`${URL}/api/auth/userprofile/${id}`, formData, {
      ...finalHeader,
      ...additionalParameter,
    });
  } catch (error) {
    console.log('error from api', error);
  }
};

const deleteProfilePicture=async(id)=>{
  const finalHeader=authorizationHeaders();
  try {
    console.log('yeah id reahced',id)
    return await axios.delete(`${URL}/api/auth/userprofile/deleteprofilepic/${id}`,finalHeader)
  } catch (error) {
    console.log('error from api',error)
  }
}


const gettingProfileData=async(id)=>{
  const finalHeader=authorizationHeaders();
     try {
     return await axios.get(`${URL}/api/auth/userprofile/profiledata/${id}`,finalHeader)
     } catch (error) {
      console.log('problem in api get',error)
     }
}

const gettingAllTweets=async()=>{
  const finalHeader=authorizationHeaders();
  try {
    return await axios.get(`${URL}/api/auth/tweet/feeds`,finalHeader)
  } catch (error) {
    console.log('problem in api get',error)
  }
}


const deleteTweetaxios=async(id)=>{
  const finalHeader=authorizationHeaders();
  try {
    console.log('yeah id reahced',id)
    return await axios.delete(`${URL}/api/auth/tweet/deletetweet/${id}`,finalHeader)
  } catch (error) {
    console.log('error from api',error)
  }
}


const gettingUserProfileDataAxios=async(id)=>{
  const finalHeader=authorizationHeaders();
     try {
     return await axios.get(`${URL}/api/auth/user/userprofiledata/${id}`,finalHeader)
     } catch (error) {
      console.log('problem in api get',error)
     }
}

const gettingAllMyTweets=async(id)=>{
  const finalHeader=authorizationHeaders();
  try {
    console.log(id)
    return await axios.get(`${URL}/api/auth/tweet/userprofile/tweets/${id}`,finalHeader)
  } catch (error) {
    console.log('problem in api get',error)
  }
}

 const gettingAllTweetsOfUser=async(id)=>{
  const finalHeader=authorizationHeaders();
  try {
    console.log(id)
    return await axios.get(`${URL}/api/auth/tweet/user/usertweets/${id}`,finalHeader)
  } catch (error) {
    console.log('problem in api get',error)
  }
 }

 const gettingTweetOfGivenTweetId=async(id)=>{
  const finalHeader=authorizationHeaders();
  try {
    return await axios.get(`${URL}/api/auth/tweet/tweetreplies/${id}`,finalHeader)
  } catch (error) {
    console.log('problem in api get',error)
  }
 }

 const reTweetAxios=async(id)=>{
  const finalHeader=authorizationHeaders();
  try {
    console.log(id)
    return await axios.post(`${URL}/api/auth/tweet/feeds/retweety/${id}`,null,finalHeader)
  } catch (error) {
    console.log('problem in api get',error)
  }
 }

 const likeTheTweetAxios=async(tweetid)=>{
  const finalHeader=authorizationHeaders();
  try {
    console.log('like id ',tweetid)
    return await axios.post(`${URL}/api/auth/tweet/feeds/tweetlike/${tweetid}`,null,finalHeader)
  } catch (error) {
    console.log('problem in api get',error)
  }
 }

 const unLikeTheTweetAxios=async(tweetid)=>{
  const finalHeader=authorizationHeaders();
  try {
    console.log("unlike id",tweetid)
    return await axios.post(`${URL}/api/auth/tweet/feeds/tweetunlike/${tweetid}`,null,finalHeader)
  } catch (error) {
    console.log('problem in api get',error)
  }
 }

 const postReplyAxios=async(parentid,reply)=>{
  const finalHeader=authorizationHeaders();
  try {
   console.log(reply)
   console.log(parentid)
   return await axios.post(`${URL}/api/auth/tweet/tweetreplies/reply/${parentid}`,reply,finalHeader)
  } catch (error) {
   console.log(error)
  }
  
}


const  gettingRepliesOfTweetId=async(id)=>{
  const finalHeader=authorizationHeaders();
  try {
    console.log(id)
    return await axios.get(`${URL}/api/auth/tweet/tweetreplies/replies/${id}`,finalHeader)
  } catch (error) {
    console.log('problem in api get',error)
  }
}


const getAllUsersAxios=async()=>{
  const finalHeader=authorizationHeaders();
  try {
    return await axios.get(`${URL}/api/auth/search/users`,finalHeader)
  } catch (error) {
    console.log('problem in api get',error)
  }
}

const followPersonAxios=async(id,myid)=>{
  const finalHeader=authorizationHeaders();
  try {
    console.log(id)
    return await axios.post(`${URL}/api/auth/users/follow/${id}/${myid}`,finalHeader)
  } catch (error) {
    console.log('problem in api get',error)
  }
}


const updatedatauseraxios=async(data)=>{
  const finalHeader=authorizationHeaders();
  try {
  
   return await axios.post(`${URL}/api/auth/updateuser`,data,finalHeader)
  } catch (error) {
   console.log(error)
  }
  
}

// const unfollowPersonAxios=async(id,myid)=>{
//   const finalHeader=authorizationHeaders();
//   try {
//     return await axios.post(`${URL}/api/auth/users/unfollow/${id}/${myid}`,finalHeader)
//   } catch (error) {
//     console.log('problem in api get',error)
//   }
// }


export  { registerUser,
         loginUser,
         createTweet,
         uploadProfilePicture,
         gettingProfileData,
         gettingAllTweets,
         deleteProfilePicture,
         deleteTweetaxios,
         gettingUserProfileDataAxios,
         gettingAllMyTweets,
         gettingAllTweetsOfUser,
         gettingTweetOfGivenTweetId,
         reTweetAxios,
         likeTheTweetAxios,
         unLikeTheTweetAxios,
         postReplyAxios,
         gettingRepliesOfTweetId,
         getAllUsersAxios,
         followPersonAxios,
         updatedatauseraxios
        
};