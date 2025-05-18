// components/shared/GeminiChatWidget.js
"use client";

import { useState, useRef, useEffect } from "react"; 

export default function GeminiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null); 

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newUserMessage = { role: "user", parts: [{ text: message }] };

    const currentChatWithNewMessage = [...chatHistory, newUserMessage]; 

    setChatHistory(currentChatWithNewMessage); 
    setMessage("");
    setIsLoading(true);
    setError(null);

    try {
      // Prepare history for the API.
      // Send all messages *except* the very last one (which is the current user's new message,
      // as that's passed separately in the 'message' field to the API)
      const apiHistoryPayload = currentChatWithNewMessage.slice(0, -1).map(msg => ({ // ✅ USE IT HERE
        role: msg.role,
        parts: msg.parts.map(part => (typeof part.text === 'string' ? { text: part.text } : { text: String(part) })) // Ensure part.text
      }));

      const res = await fetch("/api/gemini-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            message: newUserMessage.parts[0].text, 
            history: apiHistoryPayload             
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("Frontend received error from API:", errData);
        // Update chat history with the error message from the model's perspective
        setChatHistory(prev => [...prev, { role: "model", parts: [{ text: `Error: ${errData.error || errData.message || "API Error"}`}] }]);
        throw new Error(errData.error || errData.message || "Failed to fetch response from API");
      }

      const data = await res.json();
      setChatHistory(prev => [...prev, { role: "model", parts: [{ text: data.reply }] }]);

    } catch (err) {
      console.error("Chat widget error:", err.message); 
      setError(err.message); 
    } finally {
      setIsLoading(false);
    }
  };


  const chatWidgetStyle = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1000,
  };

  const chatBoxStyle = {
    width: "350px",
    height: "500px",
    border: "1px solid #ccc",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
    overflow: "hidden",
  };

  const chatHeaderStyle = {
    padding: '10px 15px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  };

  const messagesContainerStyle = {
    flexGrow: 1,
    overflowY: "auto",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  };

  const messageBubbleStyle = (role) => ({
    maxWidth: "75%",
    padding: "10px 15px",
    borderRadius: "18px",
    wordBreak: "break-word",
    alignSelf: role === "user" ? "flex-end" : "flex-start",
    backgroundColor: role === "user" ? "#007bff" : "#e9ecef",
    color: role === "user" ? "white" : "black",
    fontSize: "0.9rem",
    lineHeight: "1.4",
  });

  const formStyle = {
    display: "flex",
    padding: "10px 15px",
    borderTop: "1px solid #eee",
    backgroundColor: '#f7f7f7',
  };

  const inputStyle = {
    flexGrow: 1,
    padding: "10px",
    marginRight: "10px",
    border: '1px solid #ddd',
    borderRadius: '20px',
    outline: 'none',
  };

  const buttonStyle = {
    padding: '10px 20px',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  };

  const toggleButtonStyle = {
    ...chatWidgetStyle, 
    padding: '12px 25px',
    cursor: 'pointer',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1rem',
    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    transition: 'transform 0.2s ease, background-color 0.2s ease',
  };


  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        style={toggleButtonStyle}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
      >
        Chat with AI
      </button>
    );
  }

  return (
    <div style={chatWidgetStyle}>
      <div style={chatBoxStyle}>
        <div style={chatHeaderStyle}>
          <strong>Anicodes AI Assistant</strong>
          <button
            onClick={toggleChat}
            style={{background: 'none', border: 'none', fontSize: '1.5em', cursor: 'pointer', color: '#777'}}
            onMouseOver={(e) => e.currentTarget.style.color = '#333'}
            onMouseOut={(e) => e.currentTarget.style.color = '#777'}
          >
            ×
          </button>
        </div>
        <div style={messagesContainerStyle}> {/* No ref needed here directly if child has ref */}
          {chatHistory.map((msg, index) => (
            <div key={index} style={messageBubbleStyle(msg.role)}>
              {/* Ensure msg.parts is an array and part.text exists */}
              {Array.isArray(msg.parts) ? msg.parts.map(part => part.text || '').join("") : ''}
            </div>
          ))}
          {isLoading && (
            <div style={{ ...messageBubbleStyle('model'), backgroundColor: '#f0f0f0', alignSelf: 'flex-start' }}>
              Thinking...
            </div>
          )}
          {/* This div is for the auto-scroll to target */}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask anything..."
            style={inputStyle}
            disabled={isLoading}
            onKeyPress={(e) => { if (e.key === 'Enter' && !isLoading) handleSubmit(e); }} // Optional: Submit on Enter
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{...buttonStyle, background: isLoading ? '#ccc' : '#007bff'}}
            onMouseOver={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#0056b3')}
            onMouseOut={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#007bff')}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
