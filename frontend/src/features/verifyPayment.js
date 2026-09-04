import api from "../../utils/axios";
import getCurrentUser from "./getCurrentUser.js";

export const verifyPayment = async (payload) => {
    try {
        const { data } = await api.post("/api/billing/verify", payload);
        console.log("Payment verified:", data);
        const updatedUser = await getCurrentUser(); // Refresh user data after payment verification
        
        return {
            ...data,
            user: updatedUser
        };
    } catch (error) {
        console.error(
            "Error verifying payment:",
            error.response?.data || error.message
        );
        throw error;
    }
};