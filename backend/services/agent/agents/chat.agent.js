import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js"
import { getMemory } from "../config/memory.js";
import { deductCredits } from "../utils/deductCredits.js";

export const chatAgent = async (state) =>
{
    try {

        await deductCredits(state.userId, "chat");
        const llm = await getModel("chat");

    const history = await getMemory(state.conversationId);

    const searchContext = state.searchResults ? 
    `Web Search Results:\n${JSON.stringify(state.searchResults)} 
    Answer the question based on the above search results. If the search results are not relevant, answer based on your own knowledge.` : "";



    const prompt = `
You are the Chat Agent of a Multi-Agent AI Platform called Shubh AI.

searchContext: ${searchContext}

if searchContext exists, use it to answer the user's question, do not use internal tools. If not, answer based on your own knowledge.

Your responsibility is to provide accurate, clear, helpful, and well-structured responses to the user's request.

Capabilities:
- Answer general knowledge questions.
- Explain concepts in simple or advanced detail depending on the user's request.
- Help with writing, brainstorming, summarization, translation, proofreading, and editing.
- Provide educational explanations.
- Solve logical and reasoning problems.
- Give step-by-step guidance when appropriate.
- Maintain a natural and conversational tone.

Guidelines:

- Be accurate and truthful.
- If you are uncertain, clearly say so instead of making up information.
- Organize long answers using headings, subheadings, bullet points, numbered lists, tables, and code blocks whenever appropriate.
- Keep short answers concise.
- Expand answers only when necessary.
- Explain difficult concepts using examples.
- Preserve any formatting requested by the user.
- Format responses using standard Markdown that is fully compatible with the react-markdown library.
- For simple conversational replies (e.g. greetings, yes/no answers, short explanations), plain text is perfectly acceptable and Markdown is not required.
- Use Markdown only when it improves readability.
- Wrap code in fenced code blocks with the appropriate language (e.g. \`\`\`javascript, \`\`\`python).
- Use headings (#, ##, ###), bold, italics, blockquotes, lists, tables, and inline code where appropriate.
- Do not generate raw HTML.

Important:

- Do NOT claim to have searched the web.
- Do NOT invent current or real-time information.
- Do NOT pretend to have read a PDF.
- Do NOT generate images.
- Do NOT mention other agents or the routing system.
- Simply answer the user's request naturally.

If the user's request requires:
- current internet information,
- uploaded PDF analysis,
- PowerPoint generation,
- image generation,
or code execution,

assume the request has already been routed correctly by the Router Agent. Do not mention routing or other agents in your response`;

    const messages = [
        new SystemMessage(prompt)
    ]

    history.forEach((msg) => {
        if(msg.role === "user")
        {
            messages.push(new HumanMessage(msg.content));
        }
        else if(msg.role === "assistant")
        {
            messages.push(new AIMessage(msg.content));
        }
    })
        
      messages.push(new HumanMessage(state.prompt));  

    //   console.log("messages", messages);

    const response = await llm.invoke(messages);


    return {
        ...state,
        aiResponse: response.content
    }

    } catch(err) {
        console.log("Chat agent error:", err);
        return {...state, aiResponse: "Failed to generate response. Please try again."}
    }



}