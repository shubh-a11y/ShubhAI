import { getModel } from "../config/llmModels.js";
import { deductCredits } from "../utils/deductCredits.js";
import { generatePpt } from "../utils/generatePpt.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";

export const pptAgent = async (state) => {

    try {
      
        const prompt = `
You are a professional presentation designer and expert content strategist.

Your task is to transform the user's request into a clear, engaging, and well-structured presentation.

Format:

{
  "title": "",
  "subtitle": "",
  "slides": [
    {
      "title": "",
      "points": [
        "",
        "",
        "",
        ""
      ]
    }
  ]
}

Rules:

- Generate exactly 6 content slides.
- Each slide must contain 4-6 concise bullet points.
- Every slide must have a clear and meaningful title.
- Organize the slides in a logical flow.
- Start with fundamental concepts and progressively move toward advanced concepts, examples, applications, or conclusions where appropriate.
- The first slide should introduce the topic.
- The final slide should summarize the most important takeaways or conclusions.
- Keep bullet points concise and presentation-friendly.
- Avoid long paragraphs.
- Each bullet point should communicate one clear idea.
- Avoid repeating the same information across slides.
- Use technically accurate terminology.
- Include examples, applications, comparisons, advantages, limitations, or use cases when relevant to the topic.
- Adapt the depth and terminology to the user's requested topic.
- Prioritize important information over unnecessary details.
- Make the presentation suitable for an academic or professional audience.
- Maintain a consistent level of detail across all slides.
- Do not include speaker notes.
- Do not include explanations outside the presentation content.
- Do not use markdown.
- Do not use code blocks.
- Do not return any text outside the JSON.
- Return ONLY valid JSON.

Content guidelines:

- Title: concise and descriptive.
- Subtitle: briefly explain the scope or purpose of the presentation.
- Slide titles: short, specific, and informative.
- Bullet points: concise, meaningful, and easy to read on a slide.
- Avoid overly technical details unless they are important for understanding the topic.
- If the topic is technical, include important terminology, mechanisms, workflows, or examples where appropriate.
- If the topic involves a process, organize the slides according to the process flow.
- If the topic involves comparison, clearly present the important differences.
- If the topic involves a technology or concept, cover its definition, working, components, applications, benefits, and limitations where relevant.

JSON requirements:

- "title" must be a string.
- "subtitle" must be a string.
- "slides" must be an array containing exactly 6 objects.
- Every slide object must contain "title" and "points".
- "points" must be an array containing 4-6 strings.
- Do not add additional fields.
- Ensure the output is valid JSON that can be parsed directly using JSON.parse().

Topic:

${state.prompt}
`;

        const llm = await getModel("ppt");
        const res = await llm.invoke(prompt);

        await deductCredits(state.userId, "ppt");

        const data = JSON.parse(res.content);
        const ppt = await generatePpt(data);
        const buffer = await ppt.write({
            outputType: "nodebuffer"
        })
        const filename = `presentation-${Date.now()}.pptx`;
        await uploadToS3(filename, buffer, "application/vnd.openxmlformats-officedocument.presentationml.presentation");
        const downloadUrl = await getFromS3(filename, 24 * 60 * 60);

        return {
            ...state,
            aiResponse: `PPT generated successfully. You can download it from the following link: ${downloadUrl}
        
        Link valid for 24 hours.`,
        }
    }
    catch (error) {
        console.log("Error in pptAgent:", error);
        return {
            ...state,
            aiResponse: "An error occurred while generating the PPT. Please try again later.",
        };
    }



};