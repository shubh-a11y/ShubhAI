import { searchTool } from "../config/tavily.js";

export const searchAgent = async (state) =>
{
    try{
        const results = await searchTool.invoke({
            query: state.prompt
        })
        console.log("Search results:", results);
        return {...state, searchResults: results,
            images: results.images}
    }
    catch(err)
    {
        console.log("Search agent error:", err);
        return {...state, searchResults: [], images: []}
    }
}