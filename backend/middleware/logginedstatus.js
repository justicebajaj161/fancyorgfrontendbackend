import jwt from 'jsonwebtoken'


const logginedstatus=async(req,res,next)=>{
   
    const authHeader=req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.json({error:"No token found "})
    }
    const token = authHeader.split(' ')[1]
    

    try {
     const payload= jwt.verify(token,process.env.JWTCODE)
     req.user={userid: payload.userid}
     console.log('Loggedin middleware verified')
     next()
    } catch (error) {
        console.log('Loggedin middleware verified failed')
        return res.json({error:"No token found "})
    }
}

export default logginedstatus