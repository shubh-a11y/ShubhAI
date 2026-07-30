import React from 'react'
import api from '../../utils/axios';

async function sendMessage(payload) 
{
    try{

        const {data} = await api.post("/api/agent/chat",payload);
        return data;

    } catch(err)
    {
        console.log("message error", err);
        return null;
    }
}

export default sendMessage