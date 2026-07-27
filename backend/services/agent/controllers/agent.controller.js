import { graph } from "../graph/graph.js";

export const agent = async (req,res) =>
{
    try{
        const {prompt, convesationId} = req.body;

        await axios.post(`${process.env.CHAT_SERVICE}/save-message`,
            {
                conversationId,
                role:"user",
                content:prompt

            }
        )

        const result = await graph.invoke({
            prompt,
            conversationId
        })

        const response = result.aiResponse.split("\n").join(" ");

        return res.status(200).json({response})


    }

    catch(err)
    {
        return res.status(500).json({message:"agent error", err})
    }
}