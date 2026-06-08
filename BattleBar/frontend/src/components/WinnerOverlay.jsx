import { socket } from "../socket"

const WinnerOverlay = ({ winner , onReset , barValue}) => {
 const bluePercent = barValue
  const redPercent = 100 - bluePercent;
  return (
    <div className="absolute inset-0 z-40 grid place-items-center bg-black/72 px-5 backdrop-blur-md">
      <section className="w-full max-w-sm rounded-lg border border-white/15 bg-slate-950/95 p-5 text-center shadow-2xl shadow-black">
        <p className="font-['Orbitron',ui-sans-serif] text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-200">
          Battle complete
        </p>
        <h2 className="mt-3 font-['Orbitron',ui-sans-serif] text-4xl font-black leading-tight tracking-normal text-white">
          {winner} Wins
        </h2>
        <p className="mt-3 font-['Rajdhani',ui-sans-serif] text-base font-semibold leading-snug tracking-normal text-slate-300">
         { `Final balance: Blue ${bluePercent} / Red ${redPercent}`}
        </p>
        <button
         onClick={onReset}
          type="button"
          className="mt-5 min-h-12 w-full rounded-lg bg-white px-4 font-['Rajdhani',ui-sans-serif] text-sm font-bold uppercase tracking-[0.16em] text-slate-950 transition hover:bg-slate-200 active:scale-95"
        >
          Play Again
        </button>
      </section>
    </div>
  )
}

export default WinnerOverlay
