import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { router } from "./router.js";
import { chatAgent } from "../agents/chat.agent.js";
import { searchAgent } from "../agents/search.agent.js";
import { pdfAgent } from "../agents/pdf.agent.js";
import { imageAgent } from "../agents/image.agent.js";
import { codingAgent } from "../agents/coding.agent.js";
import { pptAgent } from "../agents/ppt.agent.js";
import { pdfRag } from "../agents/pdfRag.agent.js";
import { imageAnalyzer } from "../agents/imageAnalyzer.agent.js";


const workflow = new StateGraph(agentState);

workflow.addNode("router", router);
workflow.addNode("chat", chatAgent);
workflow.addNode("search", searchAgent);
workflow.addNode("coding", codingAgent);
workflow.addNode("ppt", pptAgent);
workflow.addNode("pdf", pdfAgent);
workflow.addNode("image", imageAgent);
workflow.addNode("pdfRag", pdfRag);
workflow.addNode("imageAnalyzer", imageAnalyzer);

workflow.addEdge("__start__","router");
workflow.addConditionalEdges("router", (state) => {

    if(state.agent === "chat")
    {
        return "chat";
    }
    else if(state.agent === "search")
    {
        return "search";
    }
    else if(state.agent === "coding")
    {
        return "coding";
    }
    else if(state.agent === "ppt")
    {
        return "ppt";
    }
    else if(state.agent === "pdf")
    {
        return "pdf";
    }
    else if(state.agent === "image")
    {
        return "image";
    }
    else if(state.agent === "pdfRag")
    {
        return "pdfRag";
    }
    else if(state.agent === "imageAnalyzer")
    {
        return "imageAnalyzer";
    }
    else
    {
        return "chat";
    }

},{
    chat: "chat",
    search: "search",
    coding: "coding",
    ppt: "ppt",
    pdf: "pdf",
    image: "image",
    pdfRag: "pdfRag",
    imageAnalyzer: "imageAnalyzer"
})

workflow.addEdge("search", "chat");
workflow.addEdge("chat", "__end__");
workflow.addEdge("coding", "__end__");
workflow.addEdge("ppt", "__end__");
workflow.addEdge("pdf", "__end__");
workflow.addEdge("image", "__end__");
workflow.addEdge("pdfRag", "__end__");
workflow.addEdge("imageAnalyzer", "__end__");
 
export const graph = workflow.compile();