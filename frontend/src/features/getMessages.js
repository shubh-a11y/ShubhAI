
import api from '../../utils/axios'

async function getMessages(id) {
    try
    {
        const {data} = await api.get(`/api/chat/get-messages/${id}`);
        console.log("getMessages data", data);
        return data;
    }
    catch(err)
    {
        console.log(err);
        return [];
    }
}

export default getMessages
