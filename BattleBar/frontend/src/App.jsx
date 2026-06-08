import { useEffect, useState } from "react";
import ResetOnlyHud from "./components/ResetOnlyHud";
import SideControls from "./components/SideControls";
import TeamZone from "./components/TeamZone";
import WinnerOverlay from "./components/WinnerOverlay";
import { socket } from "./socket";
import DraggableChatButton from "./components/DraggableChatButton";
import ChatDrawer from "./components/ChatDrawer";

const game = {
  timer: "00:60",
  blue: {
    name: "Blue Team",
    // percent: 52,
    score: "1,840",
    // status: 'Blue has momentum',
  },
  red: {
    name: "Red Team",
    // percent: 48,
    score: "1,695",
    // status: 'Red is pushing back',
  },
};

const App = () => {
  //
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatAnchorPosition, setChatAnchorPosition] = useState({ x: 12, y: 12 });
  const [messages, setMessages] = useState([]);
  const [activeChatTeam, setActiveChatTeam] = useState("blue");

  //
  const [gameState, setGameState] = useState({
    barValue: 50,
    winner: null,
  });
  console.log("gamestate-->", gameState);
  const showWinnerOverlay = gameState.winner != null;
  //console.log("showWinnerOverlay-->" , showWinnerOverlay)

  useEffect(() => {
    //console.log("useEffect mounted");
    //ye event backend se aya hoga and message bhi

    //     chatHistory = old messages receive from backend
    socket.on("chatHistory", (oldmessage) => {
      setMessages(oldmessage);
    });
    // newChatMessage = new message receive
    socket.on("newChatMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    socket.on("gameState", (data) => {
      // console.log("GameState Data ----> ", data);
      setGameState(data); //backend se jo data arha hai vo bhi same yhi object hai overwrite ho jatega state variable me
    });

    return () => {
      socket.off("gameState");
      socket.off("chatHistory");
      socket.off("newChatMessage");
    };
  }, []);

  const sendChatMessage = (text) => {
    const messageText = text.trim();

    if (!messageText) return;

    socket.emit("sendChatMessage", {
      text: messageText,
      team: activeChatTeam,
      username: "Player",
    });
  };

  const handleOpenChat = (position) => {
    setChatAnchorPosition(position);
    setIsChatOpen(true);
  };

  const handleBlueTap = () => {
    setActiveChatTeam("blue");
    socket.emit("teamClick", "blue");
    console.log("blue");
  };
  const handleRedTap = () => {
    setActiveChatTeam("red");
    socket.emit("teamClick", "red");
    console.log("red");
  };
  const handleReset = () => {
    socket.emit("resetGame");
  };
  const bluePercent = gameState.barValue;
  console.log("bluePercent-->", bluePercent);
  const redPercent = 100 - bluePercent;
  console.log("redPercent-->", redPercent);

  return (
    <main className="grid h-[100svh] place-items-center overflow-hidden bg-[#080a12] font-['Rajdhani',ui-sans-serif] text-white">
      <section className="relative flex h-full w-full flex-col overflow-hidden bg-[#10131d] shadow-2xl shadow-black sm:h-[min(100svh,920px)] sm:w-[min(100vw,520px)] sm:rounded-[28px] sm:border sm:border-white/10">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,165,233,0.55)_0%,rgba(8,13,28,0.98)_47%,rgba(127,29,29,0.98)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_21%,rgba(125,211,252,0.55),transparent_30%),radial-gradient(circle_at_50%_82%,rgba(248,113,113,0.52),transparent_31%)]" />
        <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-white/80 shadow-[0_0_26px_rgba(255,255,255,0.7)]" />

        <DraggableChatButton onOpen={handleOpenChat} />
        <ChatDrawer
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          anchorPosition={chatAnchorPosition}
          messages={messages}
          onSendMessage={sendChatMessage}
          tone={activeChatTeam}
        />

        <ResetOnlyHud onReset={handleReset} timer={gameState.timeLeft} />

        <div className="relative z-10 grid min-h-0 flex-1 grid-rows-2">
          <TeamZone
            team={game.blue}
            tone="blue"
            position="top"
            onTap={handleBlueTap}
            bluePercent={bluePercent}
            redPercent={redPercent}
          />
          <TeamZone
            team={game.red}
            tone="red"
            position="bottom"
            onTap={handleRedTap}
            bluePercent={bluePercent}
            redPercent={redPercent}
          />
        </div>

        <SideControls barValue={gameState.barValue} />

        {showWinnerOverlay && (
          <WinnerOverlay
            winner={gameState.winner}
            onReset={handleReset}
            barValue={gameState.barValue}
          />
        )}
      </section>
    </main>
  );
};

export default App;
