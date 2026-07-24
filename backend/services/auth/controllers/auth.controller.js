import { app } from "../config/firebase.js";
import {getAuth} from "firebase-admin/auth";
import User from "../model/user.model.js"
import redis from "../../../shared/redis.js";


export  const login = async (req,res) =>
{
    try{
        const {token} = req.body
        const decoded =  await getAuth(app).verifyIdToken(token);

        let user = await User.findOne({firebaseUid:decoded.uid})

        if(!user)
        {
            user = await User.create({
                name:decoded.name,
                firebaseUid:decoded.uid,
                email:decoded.email,
                avatar:decoded.picture
            })
        }
        const sessionId = crypto.randomUUID();

        await redis.set(`session-${sessionId}`,JSON.stringify({
            userId:user._id,
            firebaseUid:user.firebaseUid,
            email:user.email,
            avatar:user.avatar
        }),"EX",60*60*24*7) // 7 days

        res.cookie("session",sessionId,
        {
            httpOnly:true, // only accessible by server
            secure:false, //only send cookie over https
            sameSite:"strict", // for cross-site requests
            maxAge:1000*60*60*24*7 // 7 days
        })
        res.status(200).json({message:"Login successful",user})
    }
    catch(err)
    {
        return res.status(500).json({message:"Internal server error", err})
    }
}


export const logout = async (req,res) =>
{
    try{
        const sessionId = req.cookies?.session;
        await redis.del(`session-${sessionId}`);
        res.clearCookie("session");
        res.status(200).json({message:"Logout successful"})

    }
    catch(err)
    {
        return res.status(500).json({message:"logout error", err})
    }
}