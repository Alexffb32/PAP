import React, { useState } from "react";
import { motion } from "framer-motion";

const conversations = [
  {
    id: 1,
    name: "Layout Agency",
    lastMessage: "Dá Plat às Tuas Ideias",
    time: "01:09 PM",
    avatar:
      "https://framerusercontent.com/images/e2r6YWCRdDQOI0kxhn56kvbk.png?scale-down-to=512",
  },
  {
    id: 2,
    name: "Luis Neves",
    lastMessage: "Founder & CEO",
    time: "07:05 AM",
    avatar: "https://framerusercontent.com/images/4hzmIJAwNz5hEOoaPjjKzd07A.png",
  },
  {
    id: 3,
    name: "Alexandre Bento",
    lastMessage: "Founder & COO",
    time: "11:10 AM",
    avatar: "https://framerusercontent.com/images/0ntVphilujzeWikXi40Tgjl7fY.png",
  },
];

export default function Home() {
  const [selectedChat, setSelectedChat] = useState(conversations[0]);
  const [chatMessages, setChatMessages] = useState({});
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getCurrentMessages = () => chatMessages[selectedChat.id] || [];

  const addMessageToChat = (chatId, message) => {
    setChatMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), message],
    }));
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = {
      text: input,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    addMessageToChat(selectedChat.id, userMessage);
    setInput("");

    if (selectedChat.id === 1) {
      setIsLoading(true);

      try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer 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",
            "HTTP-Referer": "https://www.layoutagency.pt",
            "X-Title": "Layout Chat",
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-search-preview",
            messages: [{ role: "user", content: input }],
          }),
        });

        const data = await res.json();
        const botResponse = data?.choices?.[0]?.message?.content;

        const botMessage = {
          text: botResponse || "Olá eu sou o Chatbot da Layout, em que posso ajudar ?",
          sender: "bot",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        addMessageToChat(selectedChat.id, botMessage);
      } catch (error) {
        console.error("Erro ao consultar o bot:", error);
        addMessageToChat(selectedChat.id, {
          text: "Olá eu sou o Chatbot da Layout, em que posso ajudar ?",
          sender: "bot",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <style>
        {`
          @keyframes neonUser {
            0% {
              box-shadow: 0 0 3px #b294e880, 0 0 6px #5e7ff880;
            }
            50% {
              box-shadow: 0 0 6px #5e7ff880, 0 0 9px #b294e880;
            }
            100% {
              box-shadow: 0 0 3px #b294e880, 0 0 6px #5e7ff880;
            }
          }

          @keyframes neonButton {
            0% {
              box-shadow: 0 0 5px #c68effaa, 0 0 10px #a17beaaa;
            }
            50% {
              box-shadow: 0 0 10px #a17bea, 0 0 20px #c68eff;
            }
            100% {
              box-shadow: 0 0 5px #c68effaa, 0 0 10px #a17beaaa;
            }
          }

          .neon-hover:hover {
            animation: neonButton 1.5s ease-in-out infinite;
          }
        `}
      </style>

      <div
        style={{
          display: "flex",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "#0c001d",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
          padding: "1rem",
          gap: "1rem",
          boxSizing: "border-box",
        }}
      >
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            width: "300px",
            background: "#161616",
            padding: "1rem",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 0 8px rgba(94, 127, 248, 0.1)",
          }}
        >
          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <a
              href="https://www.layoutagency.pt"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://framerusercontent.com/images/fvxSWl1IgJ3E26DL4akdOYPbqA.png?scale-down-to=512"
                alt="Layout Agency Logo"
                style={{
                  width: "150px",
                  borderRadius: "12px",
                  objectFit: "contain",
                  transition: "transform 0.2s",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            </a>
          </div>

          <input
            type="text"
            placeholder="🔍 Procurar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "90%",
              marginBottom: "1rem",
              padding: "0.6rem 1rem",
              borderRadius: "16px",
              border: "none",
              background: "#0D0D0D",
              color: "#7A7A7A",
              fontSize: "0.9rem",
              outline: "none",
              boxShadow: inputFocused
                ? "0 0 6px 1.5px #b294e880, 4px 0 8px 2px #5e7ff880"
                : "0 0 3px 1px #b294e880, 4px 0 6px 1.5px #5e7ff880",
              transition: "box-shadow 0.5s ease-in-out",
              animation: inputFocused ? "neonUser 3s ease-in-out infinite" : "none",
            }}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
          />

          <div style={{ flex: 1, overflowY: "auto" }}>
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => {
                const isSelected = selectedChat.id === conv.id;
                return (
                  <motion.div
                    key={conv.id}
                    onClick={() => setSelectedChat(conv)}
                    whileHover={{ scale: 1.03 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "0.75rem 1rem",
                      borderRadius: "24px",
                      marginBottom: "0.75rem",
                      border: isSelected
                        ? "2px solid #5e7ff8"
                        : "1px solid #2e2e2e",
                      background: isSelected ? "#1d1d2a" : "#121212",
                      color: isSelected ? "#ffffff" : "#ffffff",
                      cursor: "pointer",
                      transition: "all 0.3s ease-in-out",
                      animation: isSelected ? "neonUser 2s ease-in-out infinite" : "none",
                    }}
                  >
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: "0.9rem",
                        border: "1px solid #333",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <strong>{conv.name}</strong>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: isSelected ? "#bbb" : "#aaa",
                        }}
                      >
                        {conv.lastMessage}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: isSelected ? "#aaa" : "#777",
                      }}
                    >
                      {conv.time}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div
                style={{
                  color: "#777",
                  textAlign: "center",
                  marginTop: "2rem",
                  fontSize: "0.9rem",
                }}
              >
                Nenhuma conversa encontrada.
              </div>
            )}
          </div>
        </motion.div>

        {/* Chat Area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            flex: 1,
            background: "#0D0D0D",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 0 8px rgba(94, 127, 248, 0.1)",
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              padding: "1rem",
              background: "#161616",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <img
                src={selectedChat.avatar}
                alt={selectedChat.name}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1px solid #333",
                }}
              />
              <strong style={{ fontSize: "1.1rem" }}>{selectedChat.name}</strong>
            </div>
          </div>

          {/* Chat Messages */}
          <div style={{ flex: 1, padding: "1rem", overflowY: "auto" }}>
            {getCurrentMessages().map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: "flex",
                  justifyContent: msg.sender === "me" ? "flex-end" : "flex-start",
                  marginBottom: "0.5rem",
                }}
              >
                <div
                  style={{
                    background:
                      msg.sender === "me"
                        ? "#a17bea"
                        : msg.sender === "bot"
                        ? "#5e7ff8"
                        : "#2e2e38",
                    color: "#0D0D0D",
                    padding: "0.75rem 1rem",
                    borderRadius: "20px",
                    maxWidth: "70%",
                    fontSize: "1rem",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.text}
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "#0D0D0D",
                      textAlign: "right",
                      marginTop: "0.3rem",
                    }}
                  >
                    {msg.time}
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 1 }}
                style={{ color: "#aaa", fontSize: "0.9rem", marginTop: "0.5rem" }}
              >
                Layout Agency está a escrever...
              </motion.div>
            )}
          </div>

          {/* Chat Input */}
          <div
            style={{
              display: "flex",
              padding: "1rem",
              background: "#0D0D0D",
              borderBottomLeftRadius: "16px",
              borderBottomRightRadius: "16px",
              gap: "0.5rem",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Escreve uma mensagem..."
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                borderRadius: "20px",
                border: "none",
                background: "#262626",
                color: "#7A7A7A",
                outline: "none",
                fontSize: "1rem",
                boxShadow: inputFocused
                  ? "0 0 6px 1.5px #b294e880, 4px 0 8px 2px #5e7ff880"
                  : "0 0 3px 1px #b294e880, 4px 0 6px 1.5px #5e7ff880",
                transition: "box-shadow 0.5s ease-in-out",
                animation: inputFocused ? "neonUser 3s ease-in-out infinite" : "none",
              }}
            />
            <button
              onClick={sendMessage}
              className="neon-hover"
              style={{
                padding: "0.75rem 1.2rem",
                borderRadius: "20px",
                background: "#5e7ff8",
                color: "#ffffff",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "1rem",
                transition: "0.3s",
              }}
            >
              Enviar
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
