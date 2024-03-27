import mongoose from "mongoose";

const UserTokenSchema = new mongoose.Schema({
   userid: { type: mongoose.Types.ObjectId, require: true, ref: "User" },
   emailToken: { type: String, require: true },
   },
   {timestamps:true}
   )

UserTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 360});

const Token = mongoose.model('Token', UserTokenSchema)

export default Token;