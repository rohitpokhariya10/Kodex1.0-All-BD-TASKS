const ResetOnlyHud = ({ onReset , timer}) => {
  return (
    <header className="pointer-events-none absolute right-3 top-3 z-30 flex items-center gap-3 sm:right-5 sm:top-5 sm:gap-4">
      <div className="pointer-events-auto rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-center shadow-2xl shadow-black/25 backdrop-blur-xl">
        <p className="font-['Rajdhani',ui-sans-serif] text-[9px] font-bold uppercase leading-none tracking-[0.2em] text-white/55">
          Time
        </p>
        <p className="font-['Orbitron',ui-sans-serif] text-base font-black leading-none text-white sm:text-lg">
          {timer}
        </p>
      </div>
      <button
       onClick={onReset}
        type="button"
        className="pointer-events-auto min-h-11 rounded-lg border border-white/25 bg-white/15 px-5 py-3 font-['Rajdhani',ui-sans-serif] text-xs font-bold uppercase leading-none tracking-[0.16em] text-white shadow-2xl shadow-black/25 backdrop-blur-xl transition hover:bg-white/22 active:scale-95 sm:min-h-12 sm:px-6 sm:py-3.5 sm:text-sm"
        aria-label="Reset match"
      >
        Reset
      </button>
    </header>
  )
}

export default ResetOnlyHud
