import { getModel } from "../config/llmModels.js"

export const router = async (state) => {
    const llm = await getModel("router")

    if(state?.file && state.file.mimetype === "application/pdf")
    {
      return {
        ...state,
        agent: "pdfRag"
      }
    }

    if(state?.file && state.file?.mimetype?.startsWith("image/"))
    {
      return {
        ...state,
        agent: "imageAnalyzer"
      }
    }

    if(state.agent && state.agent !== "auto")
      {
        return {...state,
        agent: state.agent
        }
      }

    const prompt = `
You are the Router Agent of a Multi-Agent AI Platform.

Your only responsibility is to analyze the user's request and determine which specialized agent should handle it.

Available agents:

1. chat
- General conversation
- Greetings
- Questions and answers
- Explanations
- Brainstorming
- Writing
- Summarization
- Translation
- Any request that does not clearly belong to another specialized agent

2. search
- Current events
- Web search
- Internet lookup
- Latest information
- News
- Facts that require searching online
- Anything requiring external web information

3. coding
- Programming
- Debugging
- Code generation
- Code explanation
- Algorithms
- Data structures
- Software engineering
- Technical implementation

4. pdf
- Reading PDF documents
- Summarizing PDFs
- Extracting information from PDFs
- Answering questions about uploaded PDFs
- Comparing PDF documents

5. ppt
- Creating presentations
- Generating PowerPoint slides
- Slide outlines
- Presentation content
- Speaker notes

6. image
- Image generation
- Creating illustrations
- Logos
- Posters
- Art
- Diagrams
- Wallpapers
- Visual content generation

Rules:

- Read the user's request carefully.
- Choose exactly ONE agent.
- Return ONLY one of these words:

chat
search
coding
pdf
ppt
image

Do not explain your decision.

Do not output JSON.

Do not output markdown.

Do not output punctuation.

Do not output anything except one valid routing word.

User Request:
${state.prompt} `;

  const response = await llm.invoke(prompt);
  // console.log(response);

  return {
    ...state,
    agent: response.content.trim()
  }



}