import axios from "axios";

export const getMessages = async (conversationId) =>
{
    try{
        const {data} = await axios.get(`${process.env.CHAT_SERVICE}/get-messages/${conversationId}`);
        console.log("getMessages data", data);
        return data.messages;

    } catch(err)
    {
        console.log("getMessages error", err);
        return [];
    }
}