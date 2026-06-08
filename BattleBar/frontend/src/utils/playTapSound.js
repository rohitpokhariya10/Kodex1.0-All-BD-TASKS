let audioContext = null;

export const playTapSound = (team = "blue") => {
  if (typeof window === "undefined") return;

  const AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!audioContext) {
    audioContext = new AudioContext();
  }

  const now = audioContext.currentTime;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  // Different sound feel for both teams
  const baseFrequency = team === "blue" ? 520 : 390;

  oscillator.type = "square";

  oscillator.frequency.setValueAtTime(baseFrequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(
    baseFrequency * 0.55,
    now + 0.06
  );

  gainNode.gain.setValueAtTime(0.09, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(now);
  oscillator.stop(now + 0.06);
};