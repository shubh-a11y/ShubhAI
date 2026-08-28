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

        await redis.set(`user-session-${user._id}`,sessionId ,"EX",60*60*24*7) // 7 days

        await redis.set(`session-${sessionId}`,JSON.stringify({
            userId:user._id,
            firebaseUid:user.firebaseUid,
            email:user.email,
            avatar:user.avatar,
            plan: user.plan,
            credits: user.credits,
            totalCredits: user.totalCredits,
            planExpiresAt: user.planExpiresAt
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
        console.log("🔥 Logout controller reached");
        const sessionId = req.cookies?.session;
        await redis.del(`session-${sessionId}`);
        res.clearCookie("session");
        res.status(200).json({message:"Logout successful"})

    }
    catch (err) {
    console.error(err);

    return res.status(500).json({
        message: "logout error",
        error: err.message,
        stack: err.stack
    });

    }
}

export const updateUserPayment = async (req,res) =>
{
    try{
        const {userId, plan, credits} = req.body;

        const user = await User.findById(userId)

        if(!user)
        {
            return res.status(404).json({message:"User not found"});
        }

        user.plan = plan;
        user.credits += credits;
        user.totalCredits += credits;
        user.planExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days from now
        await user.save();

        const sessionId = await redis.get(`user-session-${userId}`);

        if(!sessionId)
        {
            return res.status(401).json({message:"Unauthorized"});
        }

        await redis.set(`session-${sessionId}`, JSON.stringify({
            userId: user._id,
            firebaseUid: user.firebaseUid,
            email: user.email,
            avatar: user.avatar,
            plan: user.plan,
            credits: user.credits,
            totalCredits: user.totalCredits,
            planExpiresAt: user.planExpiresAt
        }), "EX", 60 * 60 * 24 * 7); // 7 days

        res.status(200).json({ message: "Payment details updated successfully", user });
    }
    catch(err)
    {
        return res.status(500).json({message:"Update User Payment error", err})
    }
}