import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export const apiUrl = "http://localhost:8088/api";
export const createStore = (docs) => MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings());
