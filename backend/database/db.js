import mongoose from "mongoose";

const Connecton = async(username,password)=>{
 const URL=`mongodb+srv://${username}:${password}@cluster0.ehgzpzl.mongodb.net/?retryWrites=true&w=majority`;
try {
    await mongoose.connect(URL);
    console.log('database successfully connected ');
} catch (error) {
    console.log(`error while connecting with the database`,error);
}
}
export default Connecton;