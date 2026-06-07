const WinnerOverlay = ({ winner }) => {
  return (
    <div className="absolute inset-0 z-40 grid place-items-center bg-black/72 px-5 backdrop-blur-md">
      <section className="w-full max-w-sm rounded-lg border border-white/15 bg-slate-950/95 p-5 text-center shadow-2xl shadow-black">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">
          Battle complete
        </p>
        <h2 className="mt-3 text-4xl font-black leading-none tracking-normal text-white">
          {winner} Wins
        </h2>
        <p className="mt-3 text-sm font-semibold text-slate-300">
          Final balance: Blue 52% / Red 48%
        </p>
        <button
          type="button"
          className="mt-5 min-h-12 w-full rounded-lg bg-white px-4 font-black uppercase tracking-[0.12em] text-slate-950 transition hover:bg-slate-200 active:scale-95"
        >
          Play Again
        </button>
      </section>
    </div>
  )
}

export default WinnerOverlay
