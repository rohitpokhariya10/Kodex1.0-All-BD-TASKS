import { useState } from "react";
import { Send, X } from "lucide-react";

const quickMessages = ["GG", "Nice!", "Comeback!", "Blue OP", "Red OP", "Fire!" , "Rohit On Top!!"];
const PANEL_WIDTH = 240;
const PANEL_HEIGHT = 250;
const BUTTON_SIZE = 48;
const EDGE_GAP = 12;
const PANEL_GAP = 10;

const getPanelPosition = (anchorPosition = { x: EDGE_GAP, y: EDGE_GAP }) => {
  if (typeof window === "undefined") {
    return {
      left: `${EDGE_GAP}px`,
      top: `${EDGE_GAP + BUTTON_SIZE + PANEL_GAP}px`,
      width: `${PANEL_WIDTH}px`,
      maxWidth: `calc(100vw - ${EDGE_GAP * 2}px)`,
    };
  }

  const maxLeft = window.innerWidth - PANEL_WIDTH - EDGE_GAP;
  const maxTop = window.innerHeight - PANEL_HEIGHT - EDGE_GAP;
  let left = anchorPosition.x;
  let top = anchorPosition.y + BUTTON_SIZE + PANEL_GAP;

  if (top + PANEL_HEIGHT > window.innerHeight - EDGE_GAP) {
    top = anchorPosition.y - PANEL_HEIGHT - PANEL_GAP;
  }

  left = Math.min(Math.max(EDGE_GAP, left), Math.max(EDGE_GAP, maxLeft));
  top = Math.min(Math.max(EDGE_GAP, top), Math.max(EDGE_GAP, maxTop));

  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${PANEL_WIDTH}px`,
    maxWidth: `calc(100vw - ${EDGE_GAP * 2}px)`,
  };
};

const chatThemes = {
  blue: {
    panel: "border-cyan-300/25 bg-slate-950/90 shadow-cyan-950/40",
    title: "text-cyan-100",
    button:
      "border-cyan-200/25 bg-cyan-400/10 text-cyan-50 hover:bg-cyan-400/20",
    dot: "bg-cyan-300",
  },
  red: {
    panel: "border-red-300/25 bg-slate-950/90 shadow-red-950/40",
    title: "text-red-100",
    button: "border-red-200/25 bg-red-400/10 text-red-50 hover:bg-red-400/20",
    dot: "bg-red-300",
  },
  neutral: {
    panel: "border-white/15 bg-slate-950/90 shadow-black/40",
    title: "text-white",
    button: "border-white/15 bg-white/10 text-white hover:bg-white/15",
    dot: "bg-cyan-300",
  },
};

const ChatDrawer = ({
  isOpen,
  onClose,
  messages = [],
  onSendMessage,
  tone = "neutral",
  anchorPosition,
}) => {
  const [customMessage, setCustomMessage] = useState("");

  if (!isOpen) return null;

  const theme = chatThemes[tone] || chatThemes.neutral;
  const recentMessages = messages.slice(-4);
  const panelPosition = getPanelPosition(anchorPosition);

  const handleQuickMessage = (message) => {
    onSendMessage(message);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const message = customMessage.trim();

    if (!message) return;

    onSendMessage(message);
    setCustomMessage("");
  };

  return (
    <div className="fixed z-[60]" style={panelPosition}>
      <div
        className={`rounded-2xl border p-2.5 text-white shadow-2xl backdrop-blur-xl ${theme.panel}`}
      >
        {/* Header */}
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2
                className={`font-['Orbitron',ui-sans-serif] text-[11px] font-black uppercase tracking-[0.16em] ${theme.title}`}
              >
                Reactions
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/10 text-white transition hover:bg-white/15 active:scale-95"
            aria-label="Close chat"
          >
            <X size={14} />
          </button>
        </div>

        {/* Quick message buttons */}
        <div className="grid grid-cols-2 gap-1.5">
          {quickMessages.map((message) => (
            <button
              key={message}
              type="button"
              onClick={() => handleQuickMessage(message)}
              className={`truncate rounded-xl border px-2.5 py-1.5 font-['Rajdhani',ui-sans-serif] text-[10px] font-black uppercase tracking-[0.08em] transition hover:brightness-110 active:scale-95 ${theme.button}`}
            >
              {message}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-2 flex gap-1.5">
          <input
            value={customMessage}
            onChange={(event) => setCustomMessage(event.target.value)}
            maxLength={80}
            placeholder="Type..."
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 font-['Rajdhani',ui-sans-serif] text-[11px] font-semibold text-white outline-none placeholder:text-white/30 focus:border-white/25 focus:bg-white/10"
          />
          <button
            type="submit"
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl border transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${theme.button}`}
            disabled={!customMessage.trim()}
            aria-label="Send chat message"
          >
            <Send size={13} />
          </button>
        </form>

        {/* Recent messages - small preview only */}
        <div className="mt-2 max-h-20 space-y-1.5 overflow-y-auto pr-1">
          {recentMessages.length === 0 ? (
            <p className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-center font-['Rajdhani',ui-sans-serif] text-[11px] font-semibold text-white/40">
              No battle messages yet
            </p>
          ) : (
            recentMessages.map((message) => (
              <div
                key={message.id || `${message.createdAt}-${message.text}`}
                className={`rounded-xl border px-2.5 py-1.5 ${
                  message.team === "blue"
                    ? "border-cyan-300/20 bg-cyan-500/10"
                    : message.team === "red"
                      ? "border-red-300/20 bg-red-500/10"
                      : "border-white/10 bg-white/5"
                }`}
              >
                <p className="font-['Rajdhani',ui-sans-serif] text-[9px] font-black uppercase tracking-[0.12em] text-white/35">
                  {message.username || "Player"} - {message.team || "neutral"}
                </p>

                <p className="font-['Rajdhani',ui-sans-serif] text-[11px] font-bold text-white/90">
                  {message.text}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatDrawer;
