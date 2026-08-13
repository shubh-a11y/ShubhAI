
import dotenv from "dotenv"
import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatOpenRouter } from "@langchain/openrouter";


dotenv.config()

const groq = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
    apiKey: process.env.GROQ_API_KEY

})


const model = new ChatOpenRouter({
  model: "deepseek/deepseek-chat",
  temperature: 0,
  maxTokens: 2500,
  apiKey: process.env.OPENROUTER_API_KEY

});


const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0,
    maxRetries: 2,
    apiKey: process.env.GOOGLE_API_KEY
    
})

export const getModel = async (agent) =>
{
    if(agent == "chat")
    {
        return groq;
    }
    else if(agent == "search")
    {
        return groq;
    }
    else if(agent == "coding")
    {
        return gemini;
    }
    else if(agent == "ppt")
    {
        return groq;
    }
    else if(agent == "pdf")
    {
        return groq;
    }
    else if(agent == "image")
    {
        return gemini;
    }
    else
    {
        return groq;
    }
}