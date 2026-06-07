import ResetOnlyHud from './components/ResetOnlyHud'
import SideControls from './components/SideControls'
import TeamZone from './components/TeamZone'
import WinnerOverlay from './components/WinnerOverlay'

const game = {
  timer: '00:45',
  blue: {
    name: 'Blue Team',
    percent: 52,
    score: '1,840',
    status: 'Blue has momentum',
  },
  red: {
    name: 'Red Team',
    percent: 48,
    score: '1,695',
    status: 'Red is pushing back',
  },
}

const showWinnerOverlay = false

const App = () => {
  return (
    <main className="grid h-[100svh] place-items-center overflow-hidden bg-[#080a12] font-['Rajdhani',ui-sans-serif] text-white">
      <section className="relative flex h-full w-full flex-col overflow-hidden bg-[#10131d] shadow-2xl shadow-black sm:h-[min(100svh,920px)] sm:w-[min(100vw,520px)] sm:rounded-[28px] sm:border sm:border-white/10">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,165,233,0.55)_0%,rgba(8,13,28,0.98)_47%,rgba(127,29,29,0.98)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_21%,rgba(125,211,252,0.55),transparent_30%),radial-gradient(circle_at_50%_82%,rgba(248,113,113,0.52),transparent_31%)]" />
        <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-white/80 shadow-[0_0_26px_rgba(255,255,255,0.7)]" />

        <ResetOnlyHud timer={game.timer} />

        <div className="relative z-10 grid min-h-0 flex-1 grid-rows-2">
          <TeamZone team={game.blue} tone="blue" position="top" />
          <TeamZone team={game.red} tone="red" position="bottom" />
        </div>

        <SideControls />

        {showWinnerOverlay && <WinnerOverlay winner="Blue Team" />}
      </section>
    </main>
  )
}

export default App
