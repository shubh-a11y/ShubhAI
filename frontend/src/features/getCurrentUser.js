import api from "../../utils/axios"

const getCurrentUser = async (req, res) => {
    try{
        const {data} = await api.get("/api/me");
        return data;
    }
    catch(err)
    {
        console.log("getCurrentUser frontend error", err);
        return null;
    }
}

export default getCurrentUser;
