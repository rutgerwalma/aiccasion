import React, { useState, useEffect, useRef } from "react";
import { Bot } from "lucide-react";
import MessageBubble from "./MessageBubble";
import SearchResults, { SearchResult } from "./SearchResults";
import ChatInput from "./ChatInput";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll naar onder bij nieuw bericht
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, searchResults]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setSearchResults(null);

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      const data = await res.json();
      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `⚠️ Fout: ${data.error}` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
        if (data.searchResults) {
          setSearchResults(data.searchResults);
        }
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Er is iets misgegaan." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-6 text-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Chat met AI Adviseur</h3>
            <p className="text-blue-100 text-sm">
              Je persoonlijke occasionzoeker
            </p>
          </div>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <MessageBubble key={i} role={msg.role} content={msg.content} />
          ))}

          {loading && (
            <MessageBubble
              role="assistant"
              content={
                <span className="flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                    <span
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></span>
                  </span>
                  <span className="text-sm text-gray-500">Bezig...</span>
                </span>
              }
            />
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Search Results */}
      {searchResults && <SearchResults results={searchResults} />}
      {/* Input */}
      <div className="p-6 bg-gray-50 border-t border-gray-200 flex-shrink-0">
        <ChatInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onSend={sendMessage}
          loading={loading}
          placeholder="Typ hier je bericht..."
        />
        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
          <span>💡</span>
          Tip: Druk Enter om te versturen
        </p>
      </div>
    </div>
  );
}
