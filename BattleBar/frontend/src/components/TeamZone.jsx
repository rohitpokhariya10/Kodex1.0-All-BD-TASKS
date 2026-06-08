import { playTapSound } from "../utils/playTapSound";

const teamThemes = {
  blue: {
    glow: "bg-cyan-300/35",
    button:
      "from-cyan-200 via-sky-400 to-blue-600 shadow-cyan-950/60 ring-cyan-100/70",
    inner: "from-white/45 to-cyan-200/10",
    text: "text-cyan-50",
    badge: "bg-cyan-950/35 text-cyan-50 ring-cyan-100/25",
  },
  red: {
    glow: "bg-red-300/35",
    button:
      "from-red-200 via-red-500 to-rose-700 shadow-red-950/70 ring-red-100/70",
    inner: "from-white/42 to-red-200/10",
    text: "text-red-50",
    badge: "bg-red-950/40 text-red-50 ring-red-100/25",
  },
};

const TeamZone = ({
  team,
  tone,
  position,
  onTap,
  bluePercent = 0,
  redPercent = 0,
}) => {

  const handleTapClick = () => {
  playTapSound(tone);
  onTap();
};
  const isTop = position === "top";
  const theme = teamThemes[tone];

  const power = tone === "blue" ? bluePercent : redPercent;

  return (
    <section
      className={`relative min-h-0 overflow-hidden px-5 pr-16 sm:px-8 sm:pr-20 ${
        isTop ? "pb-5 pt-16 sm:pt-20" : "pb-8 pt-5 sm:pb-10"
      }`}
    >
      {/* Glow background */}
      <div
        className={`pointer-events-none absolute left-1/2 h-52 w-52 -translate-x-1/2 rounded-full blur-3xl ${theme.glow} ${
          isTop ? "top-10" : "bottom-10"
        }`}
      />

      <div
        className={`relative z-10 flex h-full min-h-[210px] flex-col items-center justify-center gap-5 sm:min-h-[235px] sm:gap-6 ${
          isTop ? "" : "flex-col-reverse"
        }`}
      >
        {/* Team name */}
        <div className="grid place-items-center gap-1 text-center">
          <p
            className={`font-['Rajdhani',ui-sans-serif] text-[13px] font-bold uppercase leading-none tracking-[0.2em] sm:text-base ${theme.text}`}
          >
            {team.name}
          </p>
        </div>

        {/* Tap button */}
        <button
          onClick={handleTapClick}
          type="button"
          className={`group relative grid aspect-square w-[min(42vw,174px)] touch-manipulation select-none place-items-center rounded-full bg-gradient-to-br ${theme.button} p-3 shadow-2xl ring-[6px] transition duration-200 hover:brightness-110 active:scale-95 sm:w-[180px] sm:ring-7`}
          aria-label={`${team.name} tap button`}
        >
          <span className="absolute inset-3 rounded-full border border-white/45 bg-gradient-to-br opacity-90" />
          <span
            className={`absolute inset-6 rounded-full bg-gradient-to-b ${theme.inner} opacity-80`}
          />

          <span className="relative font-['Orbitron',ui-sans-serif] text-[clamp(2rem,8vw,3.6rem)] font-black leading-none tracking-normal text-white drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)]">
            TAP
          </span>
        </button>

        {/* Power badge */}
        <div
          className={`rounded-full px-3.5 py-1.5 font-['Rajdhani',ui-sans-serif] text-[11px] font-bold uppercase leading-none tracking-[0.16em] shadow-lg ring-1 backdrop-blur-md sm:px-4 sm:py-2 sm:text-xs ${theme.badge}`}
        >
          {power}% power
        </div>
      </div>
    </section>
  );
};

export default TeamZone;
