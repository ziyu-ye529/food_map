import { useState } from "react";
import { X, MessageSquare, Send, UserCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import holeData from "@/data/mock/hole.json";
import userData from "@/data/mock/user.json";
import { cn } from "@/lib/utils";

interface TreeHoleProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TreeHole({ isOpen, onClose }: TreeHoleProps) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState(holeData);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newMessage = {
      id: `post_${Date.now()}`,
      author: userData.name,
      school: userData.school,
      major: userData.major,
      content: inputValue,
      timestamp: new Date().toISOString(),
      replies: []
    };
    
    setMessages([newMessage, ...messages]);
    setInputValue("");
  };

  if (!isOpen) return null;

  return (
    <div className="tree-hole-overlay">
      <div className="tree-hole-modal">
        <div className="tree-hole-header">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-orange-500" />
            <h2 className="text-lg font-bold">{t("filter.hole")}</h2>
          </div>
          <button onClick={onClose} className="tree-hole-close">
            <X size={20} />
          </button>
        </div>

        <div className="tree-hole-content">
          {messages.map((msg) => (
            <div key={msg.id} className="tree-hole-post">
              <div className="flex items-start gap-3">
                <UserCircle className="text-gray-400 mt-1" size={32} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">{msg.author}</span>
                    <span className="text-xs text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">
                      {msg.school} · {msg.major}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{msg.content}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-gray-400">
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                    <button className="text-xs text-orange-500 font-medium hover:underline">
                      {t("filter.reply")}
                    </button>
                  </div>

                  {msg.replies.length > 0 && (
                    <div className="tree-hole-replies mt-3 pl-4 border-l-2 border-gray-100 flex flex-col gap-3">
                      {msg.replies.map((reply, idx) => (
                        <div key={idx} className="tree-hole-reply">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-xs">{reply.author}</span>
                            <span className="text-[10px] text-gray-400">
                              {reply.school} · {reply.major}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="tree-hole-footer">
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t("ai.placeholder")}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                inputValue.trim() ? "bg-orange-500 text-white" : "text-gray-300"
              )}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
