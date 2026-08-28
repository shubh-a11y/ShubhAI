// backend\services\agent\agents\image.agent.js

import axios from "axios";
import { getModel } from "../config/llmModels.js"
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { deductCredits } from "../utils/deductCredits.js";

export const imageAgent = async (state) => {

    try{
        const llm = await getModel("image");
        await deductCredits(state.userId, "image");
        
    const res = await llm.invoke(`
You are an expert AI image prompt engineer.

Your task is to transform the user's image request into a highly detailed, precise, and production-ready prompt for an AI image generation model.

Your goal is to preserve the user's original intent while adding useful visual details that improve the quality, realism, composition, and coherence of the generated image.

Follow these rules:

1. UNDERSTAND THE USER'S INTENT
- Identify the main subject, environment, action, mood, and purpose.
- Preserve all important details explicitly requested by the user.
- Never change the user's intended subject, style, setting, or meaning.
- Do not add major elements that contradict the user's request.

2. ENRICH THE VISUAL DESCRIPTION
When appropriate, specify:
- Subject appearance and characteristics
- Environment and background
- Pose, gesture, and body position
- Facial expression and emotion
- Clothing, objects, and accessories
- Materials and textures
- Atmospheric conditions
- Time of day
- Lighting direction and quality
- Shadows and highlights
- Depth and spatial relationships

3. COMPOSITION
Describe an appropriate professional composition, such as:
- Camera angle
- Perspective
- Framing
- Subject placement
- Foreground, midground, and background
- Rule of thirds or centered composition when appropriate
- Visual balance
- Negative space when useful

4. CAMERA AND PHOTOGRAPHY
For photorealistic or photographic requests, specify appropriate details such as:
- Camera perspective
- Lens type or focal length
- Depth of field
- Focus point
- Natural bokeh
- Exposure
- Cinematic lighting
- Professional photography quality

Do not unnecessarily add camera specifications to illustrations, logos, icons, diagrams, or other non-photographic images.

5. ART STYLE
If the user specifies a style, preserve it accurately.
If no style is specified, choose a visually appropriate style based on the request.

Examples:
- Photorealistic
- Cinematic
- Digital art
- 3D render
- Anime
- Watercolor
- Oil painting
- Concept art
- Minimalist
- Editorial illustration
- Product photography
- Architectural visualization

6. LIGHTING AND COLOR
Add appropriate:
- Lighting setup
- Light direction
- Contrast
- Highlights and shadows
- Color palette
- Atmosphere
- Tonal balance

The lighting and colors should support the user's intended mood.

7. TEXT AND TYPOGRAPHY
If the user requests text inside the image:
- Preserve the exact wording.
- Clearly specify where the text should appear.
- Specify typography, hierarchy, alignment, and visual treatment when appropriate.
- Do not alter, paraphrase, or misspell the requested text.

8. TECHNICAL QUALITY
Where appropriate, optimize for:
- High detail
- Sharp subject definition
- Clean edges
- Realistic materials and textures
- Natural proportions
- Coherent perspective
- Consistent lighting
- Professional visual quality
- High-resolution output

9. AVOID COMMON GENERATION PROBLEMS
When relevant, explicitly encourage:
- Anatomically correct subjects
- Natural proportions
- Correct perspective
- Consistent shadows
- Physically plausible lighting
- Clean composition
- No unnecessary objects
- No visual clutter
- No distorted or duplicated elements

10. USER CONSTRAINTS
Treat explicit user constraints as mandatory.
Examples:
- Specific aspect ratio
- Specific colors
- Specific number of objects or people
- Specific background
- Specific pose
- Specific camera angle
- Specific style
- Specific text
- Transparent background
- Minimalist design

11. DO NOT OVER-ENGINEER
Do not add unnecessary details merely to make the prompt longer.
Every added detail should improve the visual result.
Keep the final prompt coherent rather than turning it into a random collection of keywords.

12. OUTPUT FORMAT
Return ONLY the final image-generation prompt.
Do not include:
- Explanations
- Analysis
- Headings
- Markdown
- Quotes around the prompt
- "Here is your prompt"
- Negative prompts unless they are naturally useful for preventing an obvious problem

The final prompt should read like a professional creative brief that an image generation model can directly execute.

USER REQUEST:
${state.prompt}
`);

    const prompt = res.content.trim();
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

    const imageRes = await axios.get(imageUrl, { responseType: "arraybuffer" });

    console.log("Is data a Buffer/ArrayBuffer?", Buffer.isBuffer(imageRes.data) || imageRes.data instanceof ArrayBuffer);
    console.log("Image Data Size (in bytes):", imageRes.data.byteLength || imageRes.data.length);
    console.log("Raw Bytes (Buffer):", Buffer.from(imageRes.data));

    const buffer = Buffer.from(imageRes.data)
    const filename = `${Date.now()}.png`;

    await uploadToS3(filename, buffer,'image/png');
    const downloadUrl = await getFromS3(filename,24*60*60);

    return {
        ...state,
        aiResponse: `![Generated Image](${downloadUrl}) This image will be available for 24 hours. Please download it if you want to keep it.`,
    }


    }
    catch(err)
    {
        console.log("Image agent error:", err);
        return {
        ...state,
        aiResponse: `Error generating image`
    }

    }
    


} 