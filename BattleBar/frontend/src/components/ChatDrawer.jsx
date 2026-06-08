import { X } from "lucide-react";

const quickMessages = ["GG", "Nice!", "Comeback!", "Blue OP", "Red OP", "Fire!"];
const PANEL_WIDTH = 300;
const PANEL_HEIGHT = 270;
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
  if (!isOpen) return null;

  const theme = chatThemes[tone] || chatThemes.neutral;
  const recentMessages = messages.slice(-4);
  const panelPosition = getPanelPosition(anchorPosition);

  const handleQuickMessage = (message) => {
    onSendMessage(message);
  };

  return (
    <div className="fixed z-[60]" style={panelPosition}>
      <div
        className={`rounded-3xl border p-3 text-white shadow-2xl backdrop-blur-xl ${theme.panel}`}
      >
        {/* Header */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${theme.dot}`} />

              <h2
                className={`font-['Orbitron',ui-sans-serif] text-sm font-black uppercase tracking-[0.18em] ${theme.title}`}
              >
                Quick Chat
              </h2>
            </div>

            <p className="mt-0.5 font-['Rajdhani',ui-sans-serif] text-[11px] font-semibold text-white/45">
              Send fast battle reactions
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/10 text-white transition hover:bg-white/15 active:scale-95"
            aria-label="Close chat"
          >
            <X size={16} />
          </button>
        </div>

        {/* Quick message buttons */}
        <div className="grid grid-cols-2 gap-2">
          {quickMessages.map((message) => (
            <button
              key={message}
              type="button"
              onClick={() => handleQuickMessage(message)}
              className={`rounded-2xl border px-3 py-2 font-['Rajdhani',ui-sans-serif] text-[11px] font-black uppercase tracking-[0.09em] transition active:scale-95 ${theme.button}`}
            >
              {message}
            </button>
          ))}
        </div>

        {/* Recent messages - small preview only */}
        <div className="mt-3 max-h-28 space-y-2 overflow-y-auto pr-1">
          {recentMessages.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-center font-['Rajdhani',ui-sans-serif] text-xs font-semibold text-white/40">
              No battle messages yet
            </p>
          ) : (
            recentMessages.map((message) => (
              <div
                key={message.id}
                className={`rounded-2xl border px-3 py-2 ${
                  message.team === "blue"
                    ? "border-cyan-300/20 bg-cyan-500/10"
                    : message.team === "red"
                      ? "border-red-300/20 bg-red-500/10"
                      : "border-white/10 bg-white/5"
                }`}
              >
                <p className="font-['Rajdhani',ui-sans-serif] text-[10px] font-black uppercase tracking-[0.14em] text-white/35">
                  {message.username || "Player"} - {message.team || "neutral"}
                </p>

                <p className="font-['Rajdhani',ui-sans-serif] text-xs font-bold text-white/90">
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
