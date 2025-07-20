const playSound = (path: string) => {
  const audio = new Audio(path);
  audio.play();
};

// Specific named exports for clarity
export const playSelectClick = () => playSound("/sounds/select-click.wav");
export const playLightSwitch = () => playSound("/sounds/light-switch.mp3");
export const playBeep = () => playSound("/sounds/beep.mp3");
export const playBell = () => playSound("/sounds/bell.mp3");
export const playSuccess = () => playSound("/sounds/success.mp3");
export const playCardFlip = () => playSound("/sounds/card-flip.mp3");
export const playError = () => playSound("/sounds/error.mp3");
