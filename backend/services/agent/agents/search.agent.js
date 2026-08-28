import { searchTool } from "../config/tavily.js";
import { deductCredits } from "../utils/deductCredits.js";

export const searchAgent = async (state) =>
{
    try{
        const results = await searchTool.invoke({
            query: state.prompt
        })

        await deductCredits(state.userId, "search");
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