import { getModel } from "../config/llmModels.js";

export const codingAgent = async (state) => {
  const intentLlm = await getModel("intent");
  const llm = await getModel("coding");
  const intentRes = await intentLlm.invoke(`
You are an expert intent classifier for an AI Coding Assistant.

Your task is to classify the user's programming request into EXACTLY ONE of the following intents.

Return ONLY the intent name.
Do NOT explain your reasoning.
Do NOT add punctuation, markdown, or extra text.

Available Intents:

CODE_GENERATION

    The user wants actual source code.

    This intent includes BOTH:

    1. Large code generation
    - websites
    - projects
    - APIs
    - applications
    - multiple files

    2. Small code generation
    - single function
    - class
    - algorithm
    - SQL query
    - regex
    - utility function

    The coding model will later decide whether the generated code should be returned as an Artifact or as a normal response.

CODE_REVIEW
- Review existing code.
- Find mistakes.
- Suggest improvements.
- Check code quality, readability, maintainability, or best practices.

CODE_EXPLANATION
- Explain code.
- Explain how an algorithm works.
- Explain an error message.
- Explain a library, framework, syntax, or concept.

DEBUGGING
- Fix bugs.
- Resolve runtime errors.
- Resolve compile errors.
- Find why code isn't working.
- Debug stack traces or unexpected outputs.

OPTIMIZATION
- Improve performance.
- Reduce memory usage.
- Refactor for efficiency.
- Improve algorithm complexity.
- Optimize database queries or backend performance.

CONVERSION
- Convert code between programming languages.
- Convert framework/library.
- Convert JavaScript to TypeScript.
- Convert REST to GraphQL.
- Convert class components to functional components.

DOCUMENTATION
- Generate documentation.
- Write comments.
- Create README.
- Generate API documentation.
- Write docstrings or technical documentation.

Classification Rules:

1. Return exactly ONE intent.
2. Choose the user's PRIMARY goal.
3. If the user both asks to fix and explain code, choose DEBUGGING.
4. If the user both asks to generate and optimize code, choose CODE_GENERATION.
5. If the user asks to improve already working code, choose OPTIMIZATION.
6. If the user asks only "What does this code do?", choose CODE_EXPLANATION.
7. If unsure, default to CODE_GENERATION.

User Request:
${state.prompt}
`);

  const intent = intentRes.content;
  console.log("Detected Intent:", intent);


  if (intent === "CODE_GENERATION") {
    const prompt = `You are an expert software engineer powering an AI coding assistant.

Your job is to determine whether the user's request requires creating a coding artifact (project/files) or whether a normal conversational response is sufficient.

An artifact is shown inside a dedicated Artifact Panel in the UI, so ONLY generate one when the user is asking for actual source code that should exist as one or more files.

--------------------------------------------------
DECISION RULES
--------------------------------------------------

Generate an ARTIFACT if the request naturally results in one or more source files that a developer would save in a project.

Examples include:

• Build an application
• Create a website
• Create a backend
• Create an API
• Create a React/Vue/Angular page
• Create a Next.js project
• Create an Express server
• Create a CLI application
• Create a library/package
• Create a database schema
• Generate Docker or Kubernetes configuration
• Generate project boilerplate
• Generate multiple related source files
• Any request that should appear inside a file explorer

Return NORMAL_RESPONSE if the request is better answered inline in chat.

Examples include:

• A single function
• An algorithm
• A LeetCode solution
• A utility method
• A regex
• SQL query
• Small code snippets
• Logic explanation
• Syntax explanation
• Interview questions
• Architecture discussion
• Best practices




--------------------------------------------------
OUTPUT FORMAT
--------------------------------------------------

Return ONLY valid JSON.

If an artifact should be created:

{
  "mode":"ARTIFACT",
  "response":"Code Generated Successfully",
  "files":[
    {
      "name":"filename.ext",
      "content":"complete file contents"
    }
  ]
}

Rules:

- Every file must contain COMPLETE code.
- Never truncate code.
- Never use placeholders like "// remaining code".
- Include every required file.
- File names must include folders when needed.

Example:

{
  "mode":"ARTIFACT",
  "response":"I've created the project for you.",
  "files":[
    {
      "name":"package.json",
      "content":"..."
    },
    {
      "name":"src/index.js",
      "content":"..."
    }
  ]
}

--------------------------------------------------

If an artifact is NOT needed:

{
  "mode":"NORMAL_RESPONSE",
  "response":"Complete conversational response in Markdown."
}

--------------------------------------------------

Never output markdown outside the JSON.
Never wrap the JSON in triple backticks.

User Request:

${state.prompt}`

    const res = await llm.invoke(prompt);

let output = res.content.trim();

if (output.startsWith("```json")) {
    output = output
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
}

const data = JSON.parse(output);

    if (data.mode === "ARTIFACT") {
      return {
        ...state,
        aiResponse: data.response,
        artifacts: [
          {
            id: Date.now(),
            type: "project",
            title: state.prompt,
            files: data.files
          }
        ]
      }
    }

    return {
      ...state,
      aiResponse: data.response,
      artifacts: []
    }
  }

  const res = await llm.invoke(`You are an expert senior software engineer and programming mentor.

The user's request has already been classified as:

${intent}

Your job is to answer accordingly.

Guidelines:

- Answer naturally and conversationally.
- Use Markdown formatting where appropriate.
- Include code examples only when they help explain the answer.
- Never create project files.
- Never return JSON.
- Never generate an Artifact.
- Never pretend to create files.
- If reviewing code, explain strengths, weaknesses, and improvements.
- If debugging, identify the root cause and provide a corrected solution.
- If explaining code, teach step-by-step.
- If optimizing code, explain why the optimization is better.
- If converting code, preserve functionality while using idiomatic syntax.
- If generating documentation, produce clear professional documentation.

User Request:

${state.prompt}`);

  const data = res.content;
  return {
    ...state,
    aiResponse: data,
    artifacts: []
  }





}