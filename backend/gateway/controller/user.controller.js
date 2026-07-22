
const getCurrentUser = async (req,res) =>
{
    try{
        return res.status(200).json({user:req.user})
    }
    catch(err){
        return res.status(500).json({message:"getCurrentUser error", err})
    }

}

export default getCurrentUser;