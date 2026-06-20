import { useState, useEffect, useRef } from "react";
import { getRoastChatResponse } from "../api/roast";
import { FiSend, FiX, FiRefreshCw } from "react-icons/fi";
import "./RoastChatWidget.css";

export default function RoastChatWidget({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch initial roast if opened and list is empty
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      fetchInitialRoast();
    }
  }, [isOpen, messages.length]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const fetchInitialRoast = async () => {
    setIsLoading(true);
    try {
      const data = await getRoastChatResponse([]);
      if (data && data.reply) {
        setMessages([{ role: "assistant", text: data.reply }]);
      } else {
        setMessages([
          {
            role: "assistant",
            text: "Failed to connect to the Roast Master. Maybe your purchases are too boring for me to judge? Advice: Try logging some tradeoffs first or check your server configuration."
          }
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages([
        {
          role: "assistant",
          text: "I couldn't contact the roast master. Advice: Make sure your backend server is running and database is connected!"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", text: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const data = await getRoastChatResponse(updatedMessages);
      if (data && data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: "Something went wrong while roasting you. Advice: Try reloading the chat, or probably ran out of limit as we're using free tier of gemini :)." }
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Connection error. Advice: Check your internet connection or server logs." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the roast chat?")) {
      setMessages([]);
    }
  };

  // Helper function to render text and Advice separated
  const renderMessageContent = (text) => {
    const adviceIndex = text.indexOf("Advice:");
    if (adviceIndex === -1) {
      return <span>{text}</span>;
    }

    const mainText = text.substring(0, adviceIndex).trim();
    const adviceText = text.substring(adviceIndex).trim();

    return (
      <>
        <span>{mainText}</span>
        <span className="roast-advice">{adviceText}</span>
      </>
    );
  };

  return (
    <div className={`roast-widget ${isOpen ? "open" : ""}`}>
      {/* HEADER */}
      <div className="roast-header">
        <div className="roast-header-title">
          <span style={{ fontSize: "20px" }}>🔥</span>
          <h3>Roast Master AI</h3>
        </div>
        <div className="roast-header-actions">
          {messages.length > 0 && (
            <button className="roast-action-btn" onClick={handleReset} title="Reset Chat">
              <FiRefreshCw size={14} />
            </button>
          )}
          <button className="roast-action-btn close-btn" onClick={onClose} title="Close Chat">
            <FiX size={18} />
          </button>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="roast-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`roast-msg-bubble ${msg.role}`}>
            {renderMessageContent(msg.text)}
          </div>
        ))}
        {isLoading && (
          <div className="roast-msg-bubble bot">
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <form onSubmit={handleSend} className="roast-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Defend your purchases..."
          className="roast-input"
          disabled={isLoading}
        />
        <button type="submit" className="roast-send-btn" disabled={isLoading || !input.trim()}>
          <FiSend size={16} />
        </button>
      </form>
    </div>
  );
}
