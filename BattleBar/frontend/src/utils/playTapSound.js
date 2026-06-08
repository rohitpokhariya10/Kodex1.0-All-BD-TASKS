// Store AudioContext globally so we do not create a new audio engine on every tap.
// It will be created only once and reused for future tap sounds.
let audioContext = null;

export const playTapSound = (team = "blue") => {
  // Web Audio API works only in the browser.
  // If this code ever runs on server-side, window will not exist.
  if (typeof window === "undefined") return;

  // Get the browser's AudioContext.
  // webkitAudioContext is added as a fallback for older Safari browsers.
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  // Create AudioContext only once.
  // This is like starting the browser's sound engine.
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  // Get the current time of the audio engine.
  // We use this for accurate sound start/stop timing.
  const now = audioContext.currentTime;

  // Oscillator creates the actual sound wave.
  // Think of it as the sound generator.
  const oscillator = audioContext.createOscillator();

  // GainNode controls the volume of the sound.
  // Think of it as the volume controller.
  const gainNode = audioContext.createGain();

  // Different sound feel for both teams.
  // Higher frequency = sharper / thinner sound.
  // Lower frequency = deeper / heavier sound.
  const baseFrequency = team === "blue" ? 1000 : 500;

  // Square wave gives a retro arcade/game-like sound.
  oscillator.type = "square";

  // Start the sound at the selected base frequency.
  oscillator.frequency.setValueAtTime(baseFrequency, now);

  // Quickly reduce the frequency within 0.06 seconds.
  // This creates a short "tap/pop" sound instead of a plain beep.
  oscillator.frequency.exponentialRampToValueAtTime(
    baseFrequency * 0.55,
    now + 0.06,
  );

  // Set initial volume.
  // Keep it low so the tap sound does not feel too loud.
  gainNode.gain.setValueAtTime(0.09, now);

  // Quickly reduce volume close to zero.
  // This makes the sound short, clean, and smooth.
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  // Connect sound generator to volume controller.
  oscillator.connect(gainNode);

  // Connect volume controller to speaker/headphones.
  gainNode.connect(audioContext.destination);

  // Start playing the sound immediately.
  oscillator.start(now);

  // Stop the sound after 0.06 seconds.
  // This keeps the sound very short like a tap effect.
  oscillator.stop(now + 0.06);
};