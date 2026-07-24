import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state";
import { router } from "./router";
import { chatAgent } from "../agents/chat.agent";
import { searchAgent } from "../agents/search.agent";
import { pdfAgent } from "../agents/pdf.agent";
import { imageGenAgent } from "../agents/imageGen.agent";
import { codingAgent } from "../agents/coding.agent";
import { pptAgent } from "../agents/ppt.agent";


const workflow = new StateGraph(agentState);

workflow.addNode("router", router);
workflow.addNode("chat", chatAgent);
workflow.addNode("search", searchAgent);
workflow.addNode("coding", codingAgent);
workflow.addNode("ppt", pptAgent);
workflow.addNode("pdf", pdfAgent);
workflow.addNode("imageGen", imageGenAgent);

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
    else if(state.agent === "imageGen")
    {
        return "imageGen";
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
    imageGen: "imageGen"
})

workflow.addEdge("search", "chat");
workflow.addEdge("chat", "__end__");
workflow.addEdge("coding", "__end__");
workflow.addEdge("ppt", "__end__");
workflow.addEdge("pdf", "__end__");
workflow.addEdge("imageGen", "__end__");
 
export const graph = workflow.compile();