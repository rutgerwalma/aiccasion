import React from "react";
import { Send } from "lucide-react";

type ChatInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  loading?: boolean;
  placeholder?: string;
};

export default function ChatInput({
  value,
  onChange,
  onSend,
  loading,
  placeholder,
}: ChatInputProps) {
  return (
    <div className="flex gap-3 items-end">
      <div className="flex-1">
        <input
          value={value}
          onChange={onChange}
          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder={placeholder || "Typ hier je bericht..."}
          disabled={loading}
        />
      </div>
      <button
        onClick={onSend}
        disabled={loading}
        className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}
