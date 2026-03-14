import { useState, useRef } from "react";
import { Search, X, Mic, Sparkles } from "lucide-react";
import { useRestaurantStore } from "@/stores/restaurantStore";
import AiAssistantModal from "./AiAssistantModal";

export default function SearchBar() {
  const searchQuery = useRestaurantStore((s) => s.searchQuery);
  const setSearch = useRestaurantStore((s) => s.setSearch);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock voice input
  const handleVoiceInput = () => {
    if (isListening) {
      // Finish listening -> mock search
      setIsListening(false);
      setSearch("cafe");
      inputRef.current?.focus();
    } else {
      // Start listening
      setIsListening(true);
      setSearch(""); // clear search while listening
    }
  };

  return (
    <>
      <div className="search-bar">
        <Search className="search-bar__icon" size={16} />
        <input
          ref={inputRef}
          className="search-bar__input"
          type="text"
          placeholder={isListening ? "Listening..." : "Search by name or cuisine…"}
          value={searchQuery}
          onChange={(e) => setSearch(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          disabled={isListening}
        />
        
        <div className="search-bar__actions">
          {searchQuery && !isListening && (
            <button
              className="search-bar__btn search-bar__clear"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}

          <div className="search-bar__divider"></div>

          <div className="search-bar__voice-wrap">
            <button 
              className={`search-bar__btn search-bar__voice ${isListening ? "search-bar__voice--listening" : ""}`}
              onClick={handleVoiceInput}
              title="Voice Search (Mock: types 'cafe')"
              aria-label="Voice Search"
            >
              <Mic size={15} />
            </button>
            {isListening && <span className="search-bar__voice-pulse"></span>}
          </div>
          
          <button 
            className="search-bar__btn search-bar__ai"
            onClick={() => {
              useRestaurantStore.getState().clearSelected();
              setIsAiModalOpen(true);
            }}
            title="AI Assistant"
            aria-label="AI Assistant"
          >
            <Sparkles size={15} />
          </button>
        </div>
      </div>

      {isAiModalOpen && <AiAssistantModal onClose={() => setIsAiModalOpen(false)} />}
    </>
  );
}
