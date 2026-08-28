import api from "../../utils/axios";

export const verifyPayment = async (payload) => {
    try {
        const { data } = await api.post("/api/billing/verify", payload);
        console.log("Payment verified:", data);
        return data;
    } catch (error) {
        console.error(
            "Error verifying payment:",
            error.response?.data || error.message
        );
        throw error;
    }
};