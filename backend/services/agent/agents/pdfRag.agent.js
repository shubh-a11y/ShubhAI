import fs from 'fs';
import {PDFParse} from "pdf-parse"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore } from '../config/vectorDb';
import { getModel } from '../config/llmModels.js';
import { deductCredits } from '../utils/deductCredits.js';

export const pdfRag = async (state) =>
{
    try{
        const buffer = fs.readFileSync(state.file.path);
        const pdf = new PDFParse({
            data: buffer
        })

        const result = pdf.getText();
        const text = result.text;

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200
        });

        const docs = await splitter.createDocuments([text]);

        const collectionName = `pdf-${Date.now()}`;

        const store = await vectorStore(docs,collectionName);

        const relevantDocs = await store.similaritySearch(state.prompt,5);

        const context = relevantDocs.map(d => d.pageContent).join("/n/n");

        const llm = await getModel(pdfRag);

        const messages = [
            new SystemMessage(`
        You are CortexAI PDF Assistant.

        Rules:

        - Answer ONLY from the uploaded PDF.
        - Never make up information.
        - If the answer is not present in the PDF, reply:

        "I couldn't find this information in the uploaded PDF."

        - Use Markdown formatting.
    `),

    new HumanMessage(`
Context: ${context}

Question: ${state.prompt}`)

        ]

        const response = await llm.invoke(messages);
        await deductCredits(state.userId, "pdf");

        return {
            ...state,
            aiResponse:response.content
        }


    }
    catch(err)
    {
        console.log("PDF RAG error:", err);        
        return {
            ...state,
            aiResponse: "An error occurred while processing the PDF. Please ensure the file is a valid PDF and try again."
        }
    }
    finally
    {
        // Clean up the uploaded file
        if(state.file && state.file.path && fs.existsSync(state.file.path))
        {   
            fs.unlinkSync(state.file.path);

        } 
    }
}