import VerticalBattleBar from './VerticalBattleBar'

const SideControls = () => {
  return (
    <div className="absolute right-2 top-1/2 z-30 flex -translate-y-1/2 flex-col items-center gap-2 sm:right-4">
      <button
        type="button"
        className="grid h-8 w-8 place-items-center rounded-full border border-white/70 bg-white/85 text-slate-400 shadow-xl shadow-black/20 backdrop-blur transition hover:bg-white active:scale-95 sm:h-9 sm:w-9"
        aria-label="Close battle"
      >
        <span className="relative h-4 w-4">
          <span className="absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-slate-400" />
          <span className="absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-slate-400" />
        </span>
      </button>
      <VerticalBattleBar />
    </div>
  )
}

export default SideControls
