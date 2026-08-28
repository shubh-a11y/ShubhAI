
import axios from "axios";

export const deductCredits = async (userId, agent) =>
{
    try
    {
        const {data} = await axios.post(`${process.env.AUTH_SERVICE}/deduct-credits`, { userId, agent });
        console.log(`Credits deducted for user ${userId} for agent ${agent}:`, data);
        return data;
    }
    catch(err)
    {
        console.error("Error deducting credits for user:", err);
    }
}