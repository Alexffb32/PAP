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
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

    setMessages((prev) => [...prev, userMessage]);
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

        if (botResponse) {
          const botMessage = {
            text: botResponse,
            sender: "bot",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };

          setMessages((prev) => [...prev, botMessage]);
        } else {
          throw new Error("Resposta vazia do modelo.");
        }
      } catch (error) {
        console.error("Erro ao consultar o bot:", error);
        setMessages((prev) => [
          ...prev,
          {
            text: "Olá eu sou o Chatbot da Layout, em que posso ajudar ?",
            sender: "bot",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        fontFamily: "Arial, sans-serif",
        background: "#0f0f11",
        color: "#fff",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "300px",
          borderRight: "1px solid #333",
          padding: "1rem",
          background: "#1a1a1d",
          display: "flex",
          flexDirection: "column",
          borderTopLeftRadius: "16px",
          borderBottomLeftRadius: "16px",
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
                width: "150px", // Aumentei o tamanho aqui
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
          style={{
            width: "90%",
            margin: "0 auto 1rem auto",
            padding: "0.6rem 1rem",
            borderRadius: "16px",
            border: "1px solid #444",
            background: "#0f0f11",
            color: "#ccc",
            fontSize: "0.9rem",
            outline: "none",
          }}
        />

        <div style={{ flex: 1, overflowY: "auto" }}>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => {
                setSelectedChat(conv);
                setMessages([]);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.6rem",
                borderRadius: "12px",
                marginBottom: "0.5rem",
                background: selectedChat.id === conv.id ? "#8c52ff" : "transparent",
                color: selectedChat.id === conv.id ? "#fff" : "#ccc",
                cursor: "pointer",
                transition: "0.3s",
              }}
            >
              <img
                src={conv.avatar}
                alt={conv.name}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginRight: "0.75rem",
                }}
              />
              <div style={{ flex: 1 }}>
                <strong>{conv.name}</strong>
                <div style={{ fontSize: "0.85rem", color: "#aaa" }}>
                  {conv.lastMessage}
                </div>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#777" }}>{conv.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#0f0f11",
          borderTopRightRadius: "16px",
          borderBottomRightRadius: "16px",
        }}
      >
        <div
          style={{
            padding: "1rem",
            borderBottom: "1px solid #333",
            background: "#191921",
            borderTopRightRadius: "16px",
          }}
        >
          <strong style={{ fontSize: "1.1rem", color: "#8ecfff" }}>
            {selectedChat.name}
          </strong>
        </div>

        <div style={{ flex: 1, padding: "1rem", overflowY: "auto" }}>
          {messages.map((msg, index) => (
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
                      ? "#8c52ff"
                      : msg.sender === "bot"
                      ? "#65c9ff"
                      : "#2e2e38",
                  color: "#fff",
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
                    color: "#ccc",
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

        <div
          style={{
            display: "flex",
            padding: "1rem",
            borderTop: "1px solid #333",
            background: "#191921",
            borderBottomRightRadius: "16px",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Escreve uma mensagem... "
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              borderRadius: "20px",
              border: "1px solid #444",
              background: "#1f1f25",
              color: "#eee",
              outline: "none",
              fontSize: "1rem",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              marginLeft: "0.5rem",
              padding: "0.75rem 1.2rem",
              borderRadius: "20px",
              background: "#8ecfff",
              color: "#0f0f11",
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
      </div>
    </div>
  );
}
