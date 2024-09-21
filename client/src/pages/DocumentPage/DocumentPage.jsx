import { useState } from "react";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { Configuration, OpenAIApi } from "openai";
import { createStore } from "../../config/config.js";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAIApi(
  new Configuration({
    apiKey: API_KEY,
  })
);

function DocumentPage() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfContent, setPdfContent] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const loadAndProcessPDF = async () => {
    if (!pdfFile) {
      alert("Please upload a PDF first.");
      return;
    }

    setIsLoading(true);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const loader = new PDFLoader(arrayBuffer);

      const pdfDocs = await loader.loadAndSplit(
        new CharacterTextSplitter({
          separator: ". ",
          chunkSize: 2500,
          chunkOverlap: 200,
        })
      );

      setPdfContent(pdfDocs);

      const store = await createStore([...pdfDocs]);
      setPdfContent(store);
      alert("PDF processed and stored successfully!");
    } catch (error) {
      console.error("Error processing the PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const queryPDF = async () => {
    if (!pdfContent || !question) {
      alert("Please upload a PDF and type a question.");
      return;
    }

    setIsLoading(true);

    try {
      const results = await pdfContent.similaritySearch(question, 2);

      const response = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "assistant",
            content:
              "You are a helpful AI assistant, answer any questions to the best of your ability.",
          },
          {
            role: "user",
            content: `Answer the following question using the provided context. If you cannot answer the question with the context, don't lie and make up stuff. Just say you need more context.
              Question: ${question}
  
              Context: ${results.map((r) => r.pageContent).join("\n")}`,
          },
        ],
      });

      setAnswer(response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error querying the PDF content:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <h1>PDF Q&A</h1>

      <input type="file" accept=".pdf" onChange={handleFileUpload} />
      <button onClick={loadAndProcessPDF} disabled={!pdfFile || isLoading}>
        {isLoading ? "Processing PDF..." : "Process PDF"}
      </button>

      <div>
        <h3>Ask a Question:</h3>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question here"
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <button onClick={queryPDF} disabled={!pdfContent || isLoading}>
          {isLoading ? "Getting Answer..." : "Ask"}
        </button>
      </div>

      {answer && (
        <div>
          <h3>Answer:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default DocumentPage;
