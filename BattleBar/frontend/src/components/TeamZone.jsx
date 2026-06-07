const teamThemes = {
  blue: {
    glow: 'bg-cyan-300/35',
    button:
      'from-cyan-200 via-sky-400 to-blue-600 shadow-cyan-950/60 ring-cyan-100/70',
    inner: 'from-white/45 to-cyan-200/10',
    text: 'text-cyan-50',
    badge: 'bg-cyan-950/35 text-cyan-50 ring-cyan-100/25',
  },
  red: {
    glow: 'bg-red-300/35',
    button:
      'from-red-200 via-red-500 to-rose-700 shadow-red-950/70 ring-red-100/70',
    inner: 'from-white/42 to-red-200/10',
    text: 'text-red-50',
    badge: 'bg-red-950/40 text-red-50 ring-red-100/25',
  },
}

const TeamZone = ({ team, tone, position }) => {
  const isTop = position === 'top'
  const theme = teamThemes[tone]

  return (
    <section className={`relative min-h-0 px-4 pr-12 sm:px-8 sm:pr-16 ${isTop ? 'pb-2 pt-14 sm:pt-16' : 'pb-5 pt-3 sm:pb-7'}`}>
      <div className={`absolute left-1/2 h-52 w-52 -translate-x-1/2 rounded-full blur-3xl ${theme.glow} ${isTop ? 'top-8' : 'bottom-8'}`} />

      <div className={`relative flex h-full min-h-[205px] flex-col items-center justify-center gap-3 sm:min-h-[220px] sm:gap-3 ${isTop ? '' : 'flex-col-reverse'}`}>
        <div className="grid place-items-center gap-1 text-center">
          <p className={`text-xs font-black uppercase tracking-[0.18em] sm:text-base ${theme.text}`}>
            {team.name}
          </p>
          <p className="text-[11px] font-bold text-white/70 sm:text-sm">
            {team.status}
          </p>
        </div>

        <button
          type="button"
          className={`group relative grid aspect-square w-[min(44vw,178px)] touch-manipulation select-none place-items-center rounded-full bg-gradient-to-br ${theme.button} p-3 shadow-2xl ring-[6px] transition duration-200 hover:brightness-110 active:scale-95 sm:w-[180px] sm:ring-7`}
          aria-label={`${team.name} tap button`}
        >
          <span className="absolute inset-3 rounded-full border border-white/45 bg-gradient-to-br opacity-90" />
          <span className={`absolute inset-6 rounded-full bg-gradient-to-b ${theme.inner} opacity-80`} />
          <span className="relative font-['Orbitron',ui-sans-serif] text-[clamp(2rem,8vw,3.6rem)] font-black leading-none tracking-normal text-white drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)]">
            TAP
          </span>
        </button>

        <div className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] shadow-lg ring-1 backdrop-blur-md sm:px-4 sm:py-2 sm:text-xs ${theme.badge}`}>
          {team.percent}% power
        </div>
      </div>
    </section>
  )
}

export default TeamZone
