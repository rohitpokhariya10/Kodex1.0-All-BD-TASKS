import VerticalBattleBar from './VerticalBattleBar'

const SideControls = ({barValue}) => {
  return (
    <aside className="absolute right-2 top-1/2 z-30 flex -translate-y-1/2 flex-col items-center gap-2 sm:right-4">
      <p className="rounded-full border border-white/10 bg-black/35 px-2 py-1 font-['Rajdhani',ui-sans-serif] text-[8px] font-bold uppercase leading-none tracking-[0.14em] text-white/70 shadow-xl shadow-black/20 backdrop-blur-xl sm:text-[9px]">
        Battle Meter
      </p>
      <VerticalBattleBar barValue={barValue}/>
    </aside>
  )
}

export default SideControls
