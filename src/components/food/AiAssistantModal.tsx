import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRestaurantStore } from "@/stores/restaurantStore";
import { Sparkles, X, User, Mic, Check, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "ai" | "user";
  text: string;
  action?: "pending" | "accepted" | "rejected";
}

interface AiAssistantModalProps {
  onClose: () => void;
}

export default function AiAssistantModal({ onClose }: AiAssistantModalProps) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "ai", text: t("ai.greeting") }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  
  const toggleSelected = useRestaurantStore((s) => s.toggleSelected);
  const restaurants = useRestaurantStore((s) => s.restaurants);
  const targetRestaurant = restaurants[2];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping || isListening) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", text: userText }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, { 
        id: (Date.now() + 1).toString(),
        role: "ai", 
        text: t("ai.recommendation", { name: targetRestaurant?.name || "餐厅3" }),
        action: "pending"
      }]);
      setIsTyping(false);
    }, 2000);
  };

  const handleAction = (msgId: string, action: "accepted" | "rejected") => {
    setMessages((prev) => prev.map((msg) => 
      msg.id === msgId ? { ...msg, action } : msg
    ));

    if (action === "accepted") {
      // 1. Show "Accepted" state for a brief moment
      setTimeout(() => {
        // 2. Clear all search and filter conditions
        useRestaurantStore.getState().clearAllFilters();
        useRestaurantStore.getState().setSearch("");
        
        // 3. Close the AI Modal completely
        onClose();
        
        // 4. Wait for the modal exit animation to clear, then trigger the map selection
        setTimeout(() => {
          if (targetRestaurant) {
            const isAlreadySelected = useRestaurantStore.getState().selectedIds.includes(targetRestaurant.id);
            if (!isAlreadySelected) {
              toggleSelected(targetRestaurant.id);
            }
          }
        }, 300); // 300ms after close
      }, 600); // 600ms after clicking Agree
    } else {
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        role: "ai",
        text: t("ai.followup")
      }]);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      setInput("cafe");
      // Optional: auto-submit after voice finish
      // setTimeout(() => handleSubmit(), 100);
    } else {
      setIsListening(true);
      setInput("");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="ai-modal-overlay" onClick={onClose}>
      <div className="ai-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ai-modal__header">
          <div className="ai-modal__title">
            <Sparkles size={16} className="text-orange-500" />
            <span>{t("ai.title")}</span>
          </div>
          <button className="ai-modal__close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        
        <div className="ai-modal__chat" ref={chatRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={cn("ai-msg", `ai-msg--${msg.role}`)}>
              {msg.role === "ai" && <Sparkles size={14} className="ai-msg__icon" />}
              {msg.role === "user" && <User size={14} className="ai-msg__icon" />}
              
              <div className="ai-msg__content">
                <div className="ai-msg__bubble">{msg.text}</div>
                
                {msg.action === "pending" && (
                  <div className="ai-msg__actions">
                    <button 
                      className="ai-btn ai-btn--reject" 
                      onClick={() => handleAction(msg.id, "rejected")}
                    >
                      <XCircle size={14} /> {t("ai.reject")}
                    </button>
                    <button 
                      className="ai-btn ai-btn--agree" 
                      onClick={() => handleAction(msg.id, "accepted")}
                    >
                      <Check size={14} /> {t("ai.agree")}
                    </button>
                  </div>
                )}
                {msg.action === "accepted" && (
                  <div className="ai-msg__status ai-msg__status--accepted">{t("ai.accepted")}</div>
                )}
                {msg.action === "rejected" && (
                  <div className="ai-msg__status ai-msg__status--rejected">{t("ai.rejected")}</div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="ai-msg ai-msg--ai">
              <Sparkles size={14} className="ai-msg__icon" />
              <div className="ai-msg__content">
                <div className="ai-msg__bubble ai-msg__bubble--typing">
                  <span className="dot"></span><span className="dot"></span><span className="dot"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="ai-modal__input-area">
          <div className="ai-modal__input-wrap">
            <input
              type="text"
              className="ai-modal__input"
              autoFocus
              placeholder={isListening ? t("ai.listening") : t("ai.placeholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping || isListening}
            />
            <button
              type="button"
              className={cn("ai-modal__mic", isListening && "ai-modal__mic--listening")}
              onClick={toggleListening}
              disabled={isTyping}
              title="Voice Input"
            >
              <Mic size={16} />
              {isListening && <span className="ai-modal__mic-pulse"></span>}
            </button>
          </div>
          <button 
            type="submit" 
            className="ai-modal__send" 
            disabled={!input.trim() || isTyping || isListening}
          >
            {t("ai.send")}
          </button>
        </form>
      </div>
    </div>
  );
}
