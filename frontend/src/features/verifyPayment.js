
import api from "../../utils/axios";

export const verifyPayment = async (payload) =>
{
    try{
        const {data} = await api.post("/api/billing/verify",payload);
        console.log("Payment verified:", data);
        return data;
    }
    catch(error){
        console.log("Error verifying payment:", error);
        return [];
    }
}