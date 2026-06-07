const VerticalBattleBar = () => {
  return (
    <section className="relative h-40 w-8 rounded-full border border-white/15 bg-black/35 p-1.5 shadow-2xl shadow-black/25 backdrop-blur-xl sm:h-48 sm:w-9">
      <div className="relative h-full overflow-hidden rounded-full bg-slate-950">
        <div className="absolute inset-x-0 top-0 h-[52%] bg-gradient-to-b from-cyan-200 via-sky-400 to-blue-700" />
        <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-red-200 via-red-500 to-rose-800" />
        <div className="absolute left-1/2 top-[52%] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-sm border-2 border-white bg-yellow-300 shadow-[0_0_18px_rgba(250,204,21,0.9)] sm:h-6 sm:w-6" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-black/20" />
      </div>
    </section>
  )
}

export default VerticalBattleBar
