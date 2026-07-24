import Conversation from "../models/conversation.model";
import Message from "../models/message.model";


export const createConversation = async (req, res) => {

    try{
       const userId = req.headers["x-user-id"]
       console.log("userId", userId)

       if(!userId)
        {
            return res.status(401).json({message:"Unauthorized, no user id"})
        }
       

       const conversation = await Conversation.create({
          userId: userId
       })

       return res.status(200).json({conversation})

    } catch(err){
        return res.status(500).json({message:"createConversation error", err})
    }
}


export const getConversations = async (req, res) => {

    try{
       const userId = req.headers["x-user-id"]
       console.log("userId", userId)

       if(!userId)
        {
            return res.status(401).json({message:"Unauthorized, no user id"})
        }
       

       const conversations = await Conversation.find({
          userId: userId
       }).sort({updatedAt:-1});

       return res.status(200).json({conversation})

    } catch(err){
        return res.status(500).json({message:"getConversation error", err})
    }
}

export const updateConversation = async (req, res) => {

    try{

        const {id, title} = req.body;

         if(!id || !title)
        {
            return res.status(400).json({message:"Missing required fields"})
        }

       const conversation = Conversation.findByIdAndUpdate(id, {title}, {new:true});

       return res.status(200).json({conversation})

    } catch(err){
        return res.status(500).json({message:"updateConversation error", err})
    }
}




export const saveMessage = async (req,res) => {
    try{

        const {conversationId, role,content} = req.body;

        if(!conversationId || !role || !content)
        {
            return res.status(400).json({message:"Missing required fields"})
        }

        const message = await Message.create({
            conversationId,
            role,
            content
        })

        return res.status(200).json({message})

    } catch(err){
        return res.status(500).json({message:"saveMessage error", err})
    }
}

export const getMessages = async (req,res) => {
    try{


        const messages = await Message.find({
            conversationId:req.params.conversationId
        }).sort({createdAt:-1});

        return res.status(200).json({messages})

    } catch(err){
        return res.status(500).json({message:"getMessages error", err})
    }
}