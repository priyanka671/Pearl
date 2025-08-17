import { createContext, useState } from "react";
import runChat from "../config/pearl";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  // Format AI response → supports markdown-like text
  const formatResponse = (text) => {
    if (!text) return "";

    let formatted = text
      // bold **text**
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      // italic *text*
      .replace(/\*(.*?)\*/g, "<i>$1</i>")
      // line breaks
      .replace(/\n/g, "<br/>");

    return formatted;
  };

  const onSent = async (customPrompt) => {
    try {
      setResultData("");
      setLoading(true);
      setShowResult(true);

      const finalPrompt = customPrompt || input;
      setRecentPrompt(finalPrompt);

      // Keep history
      setPrevPrompts((prev) => [...prev, finalPrompt]);

      // Call Gemini API
      const response = await runChat(finalPrompt);

      // Format response
      const formattedResponse = formatResponse(response);
      setResultData(formattedResponse);
    } catch (err) {
      console.error("❌ Error in onSent:", err.message);
      setResultData("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;