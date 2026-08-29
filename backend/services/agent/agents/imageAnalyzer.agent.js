import { getModel } from "../config/llmModels.js"
import fs from "fs"


export const imageAnalyzer = async (state) =>
{
    try
    {
        const llm = await getModel("imageAnalyzer");

        const imageBuffer = await fs.readFile(state.file.path);
        const base64image = imageBuffer.toString("base64");

        const prompt = `You are CortexAI Image Analyzer Agent.

Rules:

- Analyze only the uploaded image.
- Answer the user's question accurately.
- If text exists in the image, extract it.
- If charts or tables exist, explain them.
- If something is unclear, say so.
- Use Markdown when helpful.
- Do not hallucinate.`;

        const messages = [
            new SystemMessage(prompt),
            new HumanMessage(
                {
                    content: [
                        {
                            type: "text",
                            text: state.prompt || "Analyze the uploaded image and provide insights."
                        },
                        {
                            type: "image_url",
                            "image_url": `data:${state.file.mimetype};base64,${base64image}`
                            
                        }
                    ]
                
                }
            )
        ]

        const response = await llm.invoke(messages);

        return {
            ...state,
            aiResponse: response.content
        }
    }   
    catch(err)
    {
        return {
            ...state,
            aiResponse: "Failed to analyze the image. Please try again."
        }
    } 
    finally
    {
        // Clean up the uploaded file
        if (state.file && state.file.path) {
            fs.unlink(state.file.path, (err) => {
                if (err) {
                    console.error("Error deleting uploaded file:", err);
                }
            });
        }
    }
}