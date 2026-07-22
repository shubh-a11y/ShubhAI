import redis from "../../shared/redis.js";


const protect = async (req, res, next) => {
    try{
        const sessionId = req.cookies?.session;
        if(!sessionId)
        {
            return res.status(401).json({message:"Unauthorized"}) 
        }
        const session = await redis.get(`session-${sessionId}`);

        if(!session)
        {
            return res.status(401).json({message:"Session expired"})
        }

        req.user = JSON.parse(session);
        next();

    }
    catch(err){
        return res.status(500).json({message:"protect error", err})

    }
}

export default protect;