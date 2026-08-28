import { getModel } from "../config/llmModels.js";
import { deductCredits } from "../utils/deductCredits.js";
import { generatePdf } from "../utils/generatePdf.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";

export const pdfAgent = async (state) => {

    try {
        const llm = await getModel("pdf");

        await deductCredits(state.userId, "pdf");

        const prompt = `
You are an expert PDF content architect and technical document writer.

Your task is to transform the user's request into well-structured, clear, detailed, and professionally organized content suitable for generating a PDF document.

Your job is to understand the user's intent, organize the information logically, and produce concise but sufficiently detailed content that can be directly rendered into a professional PDF.

IMPORTANT RULES:

1. UNDERSTAND THE USER'S REQUEST
- Identify the main topic and purpose of the PDF.
- Determine what information the user expects.
- Preserve the user's requested topic, terminology, constraints, and intent.
- Do not change the meaning of the user's request.
- Do not include irrelevant information.

2. CREATE A CLEAR DOCUMENT STRUCTURE
Organize the content into logical sections.

Each section should contain:
- A meaningful heading.
- Multiple concise but informative points.

Use a logical progression such as:
- Introduction / Overview
- Core Concepts
- Detailed Explanation
- Examples
- Applications / Use Cases
- Advantages and Limitations
- Important Notes
- Summary / Key Takeaways

Only include sections that are relevant to the user's request.

3. WRITE HIGH-QUALITY CONTENT
- Make explanations clear and easy to understand.
- Prefer concise, information-dense points over unnecessarily long paragraphs.
- Explain technical concepts accurately.
- Include examples when they improve understanding.
- Use appropriate terminology for the subject.
- Maintain consistent depth throughout the document.

4. ADAPT TO THE USER'S PURPOSE
If the request is for:
- Study notes → emphasize definitions, concepts, examples, comparisons, and key points.
- Technical documentation → emphasize architecture, components, workflow, configuration, and implementation details.
- Revision notes → emphasize important facts, formulas, commands, definitions, and takeaways.
- Tutorial → organize content step-by-step.
- Report → use a formal and structured presentation.
- Interview preparation → emphasize important concepts, differences, and frequently tested points.

5. HANDLE CODE AND TECHNICAL CONTENT
When relevant:
- Preserve code, commands, formulas, syntax, and technical terminology accurately.
- Explain what important code snippets or commands do.
- Do not unnecessarily replace technical terms with simplified alternatives.

6. TITLE AND SUBTITLE
Generate:
- A concise and descriptive title.
- A useful subtitle that provides context about the document.

The title should clearly communicate the main subject of the PDF.

7. SECTION QUALITY
Each section should:
- Have a meaningful heading.
- Contain relevant points only.
- Avoid repeating information from previous sections.
- Maintain a consistent level of detail.

8. CONTENT ACCURACY
- Do not invent specific facts, statistics, references, or claims unless they are necessary and clearly supported by the user's request.
- If the user's request does not provide enough information for a specific detail, keep the explanation general rather than fabricating information.

9. OUTPUT FORMAT
Return ONLY valid JSON.

Do NOT return:
- Markdown
- Code fences
- Explanations outside the JSON
- Comments
- Additional fields outside the specified structure

The JSON MUST follow exactly this structure:

{
    "title": "",
    "subtitle": "",
    "sections": [
        {
            "heading": "",
            "points": [
                ""
            ]
        }
    ]
}

10. JSON REQUIREMENTS
- "title" must be a string.
- "subtitle" must be a string.
- "sections" must be an array.
- Each section must contain "heading" and "points".
- "heading" must be a string.
- "points" must be an array of strings.
- Every point must contain meaningful content.
- Escape characters properly so the response is valid JSON.
- Do not wrap the JSON inside markdown code fences.

USER REQUEST:

${state.prompt}
`;

        const res = await llm.invoke(prompt);
        const data = JSON.parse(res.content);
        const pdfBuffer = await generatePdf(data);

        const fileName = `${data.title.replace(/\s+/g, '_').toLowerCase()}.pdf`;
        await uploadToS3(fileName, pdfBuffer, 'application/pdf');

        const downloadUrl = await getFromS3(fileName, 24 * 60 * 60); // URL valid for 24 hours

        return {
            ...state,
            aiResponse: `Your PDF has been generated successfully! You can download it from the following link (valid for 24 hours): [Download PDF](${downloadUrl})`
        }
    }
    catch (err) {
        console.log("PDF agent error:", err);
        return {
            ...state,
            aiResponse: `Error generating PDF`
        }
    }



};