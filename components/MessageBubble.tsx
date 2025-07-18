import React from "react";
import { Bot, User } from "lucide-react";

export type MessageBubbleProps = {
  role: "user" | "assistant";
  content: React.ReactNode;
};

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  return (
    <div
      className={`flex ${
        role === "user" ? "justify-end" : "justify-start"
      } animate-fade-in`}
    >
      <div
        className={`flex items-start gap-3 max-w-xs lg:max-w-md ${
          role === "user" ? "flex-row-reverse" : ""
        }`}
      >
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            role === "user"
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
              : "bg-gradient-to-r from-gray-600 to-gray-700 text-white"
          }`}
        >
          {role === "user" ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </div>
        <div
          className={`p-4 rounded-2xl shadow-sm ${
            role === "user"
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
              : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
          }`}
        >
          <span className="text-sm leading-relaxed">{content}</span>
        </div>
      </div>
    </div>
  );
}
