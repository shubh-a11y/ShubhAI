
import api from "../../utils/axios"

export const getConversations =  async () =>
{
    try{
        const data = await api.get("/api/chat/get-conversations")   
        return data;
    }
    catch(error){
        console.log("Error getting conversations:", error)
        return [];
    }
}